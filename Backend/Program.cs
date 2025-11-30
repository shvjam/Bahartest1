using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.SignalR;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using System.Text.Json.Serialization;
using System.Diagnostics;
using BarbariBahar.API.Data;
using BarbariBahar.API.Models;
using BarbariBahar.API.Services;
using BarbariBahar.API.Services.Interfaces;
using BarbariBahar.API.Hubs;
using BarbariBahar.API.Middleware;
using AutoMapper;
using Serilog;
using Serilog.Events;

// ============================================
// SERILOG CONFIGURATION (LOGGING)
// ============================================
Log.Logger = new LoggerConfiguration()
    .MinimumLevel.Information()
    .MinimumLevel.Override("Microsoft", LogEventLevel.Warning)
    .MinimumLevel.Override("Microsoft.EntityFrameworkCore", LogEventLevel.Information)
    .Enrich.FromLogContext()
    .Enrich.WithMachineName()
    .Enrich.WithEnvironmentName()
    .WriteTo.Console(outputTemplate: "[{Timestamp:HH:mm:ss} {Level:u3}] {Message:lj}{NewLine}{Exception}")
    .WriteTo.File(
        path: "logs/barbari-bahar-.log",
        rollingInterval: RollingInterval.Day,
        retainedFileCountLimit: 30,
        outputTemplate: "[{Timestamp:yyyy-MM-dd HH:mm:ss.fff zzz} {Level:u3}] {Message:lj}{NewLine}{Exception}"
    )
    .CreateLogger();

try
{
    Log.Information("🚀 Starting Barbari Bahar API...");

    var builder = WebApplication.CreateBuilder(args);

    // استفاده از Serilog
    builder.Host.UseSerilog();

    // ============================================
    // ENVIRONMENT VARIABLES CONFIGURATION
    // ============================================
    var jwtSecretKey = Environment.GetEnvironmentVariable("JWT_SECRET_KEY")
        ?? builder.Configuration["JwtSettings:SecretKey"];

    var dbConnectionString = Environment.GetEnvironmentVariable("DB_CONNECTION_STRING")
        ?? builder.Configuration.GetConnectionString("DefaultConnection");

    var smsAccessKey = Environment.GetEnvironmentVariable("SMS_ACCESS_KEY")
        ?? builder.Configuration["SmsSettings:AccessKey"];

    var zarinpalMerchantId = Environment.GetEnvironmentVariable("ZARINPAL_MERCHANT_ID")
        ?? builder.Configuration["PaymentSettings:MerchantId"];

    var paymentCallbackUrl = Environment.GetEnvironmentVariable("PAYMENT_CALLBACK_URL")
        ?? builder.Configuration["PaymentSettings:CallbackUrl"];

    // Validation
    if (string.IsNullOrEmpty(jwtSecretKey) || jwtSecretKey.Length < 32)
    {
        throw new InvalidOperationException("JWT Secret Key must be at least 32 characters. Set JWT_SECRET_KEY environment variable.");
    }

    if (string.IsNullOrEmpty(dbConnectionString))
    {
        throw new InvalidOperationException("Database connection string is required. Set DB_CONNECTION_STRING environment variable.");
    }

    // Override configuration با Environment Variables
    builder.Configuration["JwtSettings:SecretKey"] = jwtSecretKey;
    builder.Configuration["ConnectionStrings:DefaultConnection"] = dbConnectionString;
    builder.Configuration["SmsSettings:AccessKey"] = smsAccessKey ?? "";
    builder.Configuration["PaymentSettings:MerchantId"] = zarinpalMerchantId ?? "";
    builder.Configuration["PaymentSettings:CallbackUrl"] = paymentCallbackUrl ?? "";

    // ============================================
    // 1. DATABASE CONFIGURATION
    // ============================================
    builder.Services.AddDbContext<AppDbContext>(options =>
    {
        options.UseSqlServer(
            dbConnectionString,
            sqlServerOptions =>
            {
                sqlServerOptions.EnableRetryOnFailure(
                    maxRetryCount: 5,
                    maxRetryDelay: TimeSpan.FromSeconds(30),
                    errorNumbersToAdd: null
                );
                sqlServerOptions.CommandTimeout(60);
            }
        );
    });

    // ============================================
    // 2. CONTROLLERS & JSON CONFIGURATION
    // ============================================
    builder.Services.AddControllers()
        .AddJsonOptions(options =>
        {
            options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
            options.JsonSerializerOptions.DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull;
            options.JsonSerializerOptions.PropertyNamingPolicy = System.Text.Json.JsonNamingPolicy.CamelCase;
            options.JsonSerializerOptions.NumberHandling = JsonNumberHandling.AllowReadingFromString;
        });

    // ============================================
    // 3. CORS CONFIGURATION
    // ============================================
    var allowedOrigins = Environment.GetEnvironmentVariable("ALLOWED_ORIGINS")?.Split(',')
        ?? new[] { "http://localhost:5173", "http://localhost:3000", "http://localhost:4173" };

    builder.Services.AddCors(options =>
    {
        options.AddPolicy("AllowFrontend", policy =>
        {
            policy.WithOrigins(allowedOrigins)
                .AllowAnyHeader()
                .AllowAnyMethod()
                .AllowCredentials();
        });
    });

    // ============================================
    // 4. SIGNALR FOR LIVE TRACKING
    // ============================================
    builder.Services.AddSignalR(options =>
    {
        options.EnableDetailedErrors = builder.Environment.IsDevelopment();
        options.KeepAliveInterval = TimeSpan.FromSeconds(10);
        options.ClientTimeoutInterval = TimeSpan.FromSeconds(30);
    });

    // ============================================
    // 5. SETTINGS CONFIGURATION
    // ============================================
    builder.Services.Configure<JwtSettings>(builder.Configuration.GetSection("JwtSettings"));
    builder.Services.Configure<SmsSettings>(builder.Configuration.GetSection("SmsSettings"));
    builder.Services.Configure<PaymentSettings>(builder.Configuration.GetSection("PaymentSettings"));
    builder.Services.Configure<FileUploadSettings>(builder.Configuration.GetSection("FileUploadSettings"));

    // ============================================
    // 6. DEPENDENCY INJECTION - SERVICES
    // ============================================
    builder.Services.AddHttpContextAccessor();
    builder.Services.AddMemoryCache();
    builder.Services.AddHttpClient();

    // Services
    builder.Services.AddScoped<IJwtService, JwtService>();
    builder.Services.AddScoped<IAuthService, AuthService>();
    builder.Services.AddScoped<IUserService, UserService>();
    builder.Services.AddScoped<IOrderService, OrderService>();
    builder.Services.AddScoped<IDriverService, DriverService>();
    builder.Services.AddScoped<IPricingService, PricingService>();
    builder.Services.AddScoped<INotificationService, NotificationService>();
    builder.Services.AddScoped<ISmsService, SmsService>();
    builder.Services.AddScoped<IPaymentService, PaymentService>();
    builder.Services.AddScoped<IFileUploadService, FileUploadService>();
    builder.Services.AddScoped<ITicketService, TicketService>();

    // Security Services
    builder.Services.AddScoped<IEncryptionService, EncryptionService>();
    builder.Services.AddScoped<IInputSanitizationService, InputSanitizationService>();
    builder.Services.AddScoped<IAuditLogService, AuditLogService>();

    // ============================================
    // 7. JWT AUTHENTICATION
    // ============================================
    builder.Services.AddAuthentication(options =>
    {
        options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
        options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
    })
    .AddJwtBearer(options =>
    {
        options.SaveToken = true;
        options.RequireHttpsMetadata = !builder.Environment.IsDevelopment();
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSecretKey!)),
            ValidateIssuer = true,
            ValidIssuer = builder.Configuration["JwtSettings:Issuer"],
            ValidateAudience = true,
            ValidAudience = builder.Configuration["JwtSettings:Audience"],
            ValidateLifetime = true,
            ClockSkew = TimeSpan.Zero
        };

        // پیکربندی برای SignalR
        options.Events = new JwtBearerEvents
        {
            OnMessageReceived = context =>
            {
                var accessToken = context.Request.Query["access_token"];
                var path = context.HttpContext.Request.Path;

                if (!string.IsNullOrEmpty(accessToken) && path.StartsWithSegments("/hubs"))
                {
                    context.Token = accessToken;
                }

                return Task.CompletedTask;
            },
            OnAuthenticationFailed = context =>
            {
                Log.Warning("Authentication failed: {Message}", context.Exception.Message);
                return Task.CompletedTask;
            }
        };
    });

    builder.Services.AddAuthorization();

    // ============================================
    // 8. SWAGGER / API DOCUMENTATION
    // ============================================
    builder.Services.AddEndpointsApiExplorer();
    builder.Services.AddSwaggerGen(options =>
    {
        options.SwaggerDoc("v1", new Microsoft.OpenApi.Models.OpenApiInfo
        {
            Title = "Barbari Bahar API",
            Version = "v1",
            Description = "API برای سیستم باربری بهار - خدمات اسباب‌کشی و باربری",
            Contact = new Microsoft.OpenApi.Models.OpenApiContact
            {
                Name = "Barbari Bahar",
                Email = "info@barbaribahar.com"
            }
        });

        // پشتیبانی از JWT در Swagger
        options.AddSecurityDefinition("Bearer", new Microsoft.OpenApi.Models.OpenApiSecurityScheme
        {
            Description = "JWT Authorization header using the Bearer scheme. Example: \"Authorization: Bearer {token}\"",
            Name = "Authorization",
            In = Microsoft.OpenApi.Models.ParameterLocation.Header,
            Type = Microsoft.OpenApi.Models.SecuritySchemeType.ApiKey,
            Scheme = "Bearer"
        });

        options.AddSecurityRequirement(new Microsoft.OpenApi.Models.OpenApiSecurityRequirement
        {
            {
                new Microsoft.OpenApi.Models.OpenApiSecurityScheme
                {
                    Reference = new Microsoft.OpenApi.Models.OpenApiReference
                    {
                        Type = Microsoft.OpenApi.Models.ReferenceType.SecurityScheme,
                        Id = "Bearer"
                    }
                },
                Array.Empty<string>()
            }
        });

        options.UseInlineDefinitionsForEnums();
    });

    // ============================================
    // 9. AUTOMAPPER
    // ============================================
    builder.Services.AddAutoMapper(typeof(Program));

    // ============================================
    // BUILD APP
    // ============================================
    var app = builder.Build();

    // ============================================
    // 10. AUTO MIGRATION & SEED DATA
    // ============================================
    using (var scope = app.Services.CreateScope())
    {
        var services = scope.ServiceProvider;
        try
        {
            var context = services.GetRequiredService<AppDbContext>();

            Log.Information("🔄 Applying database migrations...");
            await context.Database.MigrateAsync();
            Log.Information("✅ Migrations applied successfully");

            Log.Information("🌱 Seeding initial data...");
            await DbSeeder.SeedAsync(context);
            Log.Information("✅ Data seeded successfully");
        }
        catch (Exception ex)
        {
            Log.Fatal(ex, "❌ An error occurred during migration or seeding");
            throw;
        }
    }

    // ============================================
    // 11. MIDDLEWARE PIPELINE
    // ============================================

    // Security Headers (اول)
    app.UseSecurityHeaders();

    // Request Validation (برای بررسی ورودی‌ها)
    app.UseRequestValidation();

    // Rate Limiting
    app.UseCustomRateLimiting();

    // Custom Exception Handler
    app.UseCustomExceptionHandler();

    // Request Logging
    app.UseSerilogRequestLogging(options =>
    {
        options.MessageTemplate = "HTTP {RequestMethod} {RequestPath} responded {StatusCode} in {Elapsed:0.0000} ms";
        options.EnrichDiagnosticContext = (diagnosticContext, httpContext) =>
        {
            diagnosticContext.Set("RequestHost", httpContext.Request.Host.Value);
            diagnosticContext.Set("RequestScheme", httpContext.Request.Scheme);
            diagnosticContext.Set("UserAgent", httpContext.Request.Headers["User-Agent"].ToString());
        };
    });

    // Development Environment
    if (app.Environment.IsDevelopment())
    {
        app.UseSwagger();
        app.UseSwaggerUI(options =>
        {
            options.SwaggerEndpoint("/swagger/v1/swagger.json", "Barbari Bahar API V1");
            options.RoutePrefix = "swagger";
        });
    }

    // HTTPS Redirection (فقط در Production)
    if (!app.Environment.IsDevelopment())
    {
        app.UseHttpsRedirection();
    }

    // CORS
    app.UseCors("AllowFrontend");

    // Static Files
    app.UseStaticFiles();

    // Routing
    app.UseRouting();

    // Authentication & Authorization
    app.UseAuthentication();
    app.UseAuthorization();

    // ============================================
    // 12. MAP CONTROLLERS & SIGNALR
    // ============================================
    app.MapControllers();
    app.MapHub<LocationTrackingHub>("/hubs/location-tracking");

    // ============================================
    // 13. HEALTH CHECK ENDPOINTS
    // ============================================
    app.MapGet("/", () => new
    {
        message = "✅ Barbari Bahar API is running!",
        version = "1.0.0",
        environment = app.Environment.EnvironmentName,
        timestamp = DateTime.UtcNow,
        endpoints = new
        {
            swagger = app.Environment.IsDevelopment() ? "/swagger" : null,
            health = "/health",
            api = "/api"
        }
    }).WithTags("Health").AllowAnonymous();

    app.MapGet("/health", async (AppDbContext db) =>
    {
        try
        {
            var canConnect = await db.Database.CanConnectAsync();

            return Results.Ok(new
            {
                status = "Healthy",
                database = canConnect ? "Connected" : "Disconnected",
                timestamp = DateTime.UtcNow,
                uptime = DateTime.UtcNow - Process.GetCurrentProcess().StartTime.ToUniversalTime()
            });
        }
        catch (Exception ex)
        {
            Log.Error(ex, "Health check failed");
            return Results.Problem(
                detail: ex.Message,
                statusCode: 503,
                title: "Service Unhealthy"
            );
        }
    }).WithTags("Health").AllowAnonymous();

    // ============================================
    // 14. RUN APPLICATION
    // ============================================
    var port = Environment.GetEnvironmentVariable("PORT") ?? builder.Configuration.GetValue<string>("Port") ?? "5000";
    app.Urls.Add($"http://0.0.0.0:{port}");

    Log.Information("🚀 Barbari Bahar API Started Successfully");
    Log.Information("📡 Listening on: http://localhost:{Port}", port);

    if (app.Environment.IsDevelopment())
    {
        Log.Information("📚 Swagger UI: http://localhost:{Port}/swagger", port);
    }

    Log.Information("💚 Health Check: http://localhost:{Port}/health", port);
    Log.Information("🌍 Environment: {Environment}", app.Environment.EnvironmentName);

    app.Run();
}
catch (Exception ex)
{
    Log.Fatal(ex, "❌ Application terminated unexpectedly");
}
finally
{
    Log.CloseAndFlush();
}