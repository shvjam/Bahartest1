using Microsoft.EntityFrameworkCore;
using BarbariBahar.API.Models;

namespace BarbariBahar.API.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        // DbSets
        public DbSet<User> Users { get; set; }
        public DbSet<Driver> Drivers { get; set; }
        public DbSet<Address> Addresses { get; set; }
        public DbSet<ServiceCategory> ServiceCategories { get; set; }
        public DbSet<CatalogCategory> CatalogCategories { get; set; }
        public DbSet<CatalogItem> CatalogItems { get; set; }
        public DbSet<PackingProduct> PackingProducts { get; set; }
        public DbSet<Order> Orders { get; set; }
        public DbSet<OrderAddress> OrderAddresses { get; set; }
        public DbSet<OrderItem> OrderItems { get; set; }
        public DbSet<PackingService> PackingServices { get; set; }
        public DbSet<PackingServiceItem> PackingServiceItems { get; set; }
        public DbSet<OrderPackingProduct> OrderPackingProducts { get; set; }
        public DbSet<LocationDetails> LocationDetails { get; set; }
        public DbSet<DriverAssignment> DriverAssignments { get; set; }
        public DbSet<Payment> Payments { get; set; }
        public DbSet<LocationUpdate> LocationUpdates { get; set; }
        public DbSet<PricingConfig> PricingConfigs { get; set; }
        public DbSet<DiscountCode> DiscountCodes { get; set; }
        public DbSet<Notification> Notifications { get; set; }
        public DbSet<RefreshToken> RefreshTokens { get; set; }
        public DbSet<Ticket> Tickets { get; set; }
        public DbSet<TicketMessage> TicketMessages { get; set; }
        public DbSet<OrderStop> OrderStops { get; set; }
        public DbSet<OrderRating> OrderRatings { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // ============================================
            // USER RELATIONSHIPS
            // ============================================

            // User - Driver (One to One)
            modelBuilder.Entity<User>()
                .HasOne(u => u.DriverProfile)
                .WithOne(d => d.User)
                .HasForeignKey<Driver>(d => d.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            // User - Addresses (One to Many)
            modelBuilder.Entity<User>()
                .HasMany(u => u.Addresses)
                .WithOne(a => a.User)
                .HasForeignKey(a => a.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            // User - Orders (One to Many)
            modelBuilder.Entity<User>()
                .HasMany(u => u.Orders)
                .WithOne(o => o.Customer)
                .HasForeignKey(o => o.CustomerId)
                .OnDelete(DeleteBehavior.SetNull);

            // User - Notifications (One to Many)
            modelBuilder.Entity<User>()
                .HasMany(u => u.Notifications)
                .WithOne(n => n.User)
                .HasForeignKey(n => n.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            // User - Tickets (One to Many)
            modelBuilder.Entity<User>()
                .HasMany<Ticket>()
                .WithOne(t => t.User)
                .HasForeignKey(t => t.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            // ============================================
            // SERVICE CATEGORY RELATIONSHIPS
            // ============================================

            // ServiceCategory - Orders (One to Many)
            modelBuilder.Entity<ServiceCategory>()
                .HasMany(sc => sc.Orders)
                .WithOne(o => o.ServiceCategory)
                .HasForeignKey(o => o.ServiceCategoryId)
                .OnDelete(DeleteBehavior.Restrict);

            // ============================================
            // CATALOG RELATIONSHIPS
            // ============================================

            // CatalogCategory - CatalogItems (One to Many)
            modelBuilder.Entity<CatalogCategory>()
                .HasMany(cc => cc.Items)
                .WithOne(ci => ci.Category)
                .HasForeignKey(ci => ci.CategoryId)
                .OnDelete(DeleteBehavior.Cascade);

            // ============================================
            // ORDER RELATIONSHIPS
            // ============================================

            // Order - OrderAddresses (One to Many)
            modelBuilder.Entity<Order>()
                .HasMany(o => o.Addresses)
                .WithOne(oa => oa.Order)
                .HasForeignKey(oa => oa.OrderId)
                .OnDelete(DeleteBehavior.Cascade);

            // OrderAddress - Address (Many to One)
            modelBuilder.Entity<OrderAddress>()
                .HasOne(oa => oa.Address)
                .WithMany()
                .HasForeignKey(oa => oa.AddressId)
                .OnDelete(DeleteBehavior.Restrict);

            // Order - OrderItems (One to Many)
            modelBuilder.Entity<Order>()
                .HasMany(o => o.Items)
                .WithOne(oi => oi.Order)
                .HasForeignKey(oi => oi.OrderId)
                .OnDelete(DeleteBehavior.Cascade);

            // OrderItem - CatalogItem (Many to One)
            modelBuilder.Entity<OrderItem>()
                .HasOne(oi => oi.CatalogItem)
                .WithMany()
                .HasForeignKey(oi => oi.CatalogItemId)
                .OnDelete(DeleteBehavior.Restrict);

            // Order - PackingService (One to One)
            modelBuilder.Entity<Order>()
                .HasOne(o => o.PackingService)
                .WithOne(ps => ps.Order)
                .HasForeignKey<PackingService>(ps => ps.OrderId)
                .OnDelete(DeleteBehavior.Cascade);

            // PackingService - PackingServiceItems (One to Many)
            modelBuilder.Entity<PackingService>()
                .HasMany(ps => ps.Items)
                .WithOne(psi => psi.PackingService)
                .HasForeignKey(psi => psi.PackingServiceId)
                .OnDelete(DeleteBehavior.Cascade);

            // PackingService - OrderPackingProducts (One to Many)
            modelBuilder.Entity<PackingService>()
                .HasMany(ps => ps.Products)
                .WithOne(opp => opp.PackingService)
                .HasForeignKey(opp => opp.PackingServiceId)
                .OnDelete(DeleteBehavior.Cascade);

            // OrderPackingProduct - PackingProduct (Many to One)
            modelBuilder.Entity<OrderPackingProduct>()
                .HasOne(opp => opp.PackingProduct)
                .WithMany()
                .HasForeignKey(opp => opp.PackingProductId)
                .OnDelete(DeleteBehavior.Restrict);

            // Order - LocationDetails (One to One)
            modelBuilder.Entity<Order>()
                .HasOne(o => o.LocationDetails)
                .WithOne(ld => ld.Order)
                .HasForeignKey<LocationDetails>(ld => ld.OrderId)
                .OnDelete(DeleteBehavior.Cascade);

            // Order - DriverAssignment (One to One)
            modelBuilder.Entity<Order>()
                .HasOne(o => o.DriverAssignment)
                .WithOne()
                .HasForeignKey<DriverAssignment>(da => da.OrderId)
                .OnDelete(DeleteBehavior.NoAction);

            // Order - Payment (One to One)
            modelBuilder.Entity<Order>()
                .HasOne(o => o.Payment)
                .WithOne(p => p.Order)
                .HasForeignKey<Payment>(p => p.OrderId)
                .OnDelete(DeleteBehavior.Cascade);

            // Order - Ticket (Many to One)
            modelBuilder.Entity<Ticket>()
                .HasOne(t => t.Order)
                .WithMany()
                .HasForeignKey(t => t.OrderId)
                .OnDelete(DeleteBehavior.SetNull);

            // Order - TicketMessages (One to Many)
            modelBuilder.Entity<Ticket>()
                .HasMany(t => t.Messages)
                .WithOne(tm => tm.Ticket)
                .HasForeignKey(tm => tm.TicketId)
                .OnDelete(DeleteBehavior.Cascade);

            // TicketMessage - Sender (Many to One)
            modelBuilder.Entity<TicketMessage>()
                .HasOne(tm => tm.Sender)
                .WithMany()
                .HasForeignKey(tm => tm.SenderId)
                .OnDelete(DeleteBehavior.Restrict);

            // Order - OrderStops (One to Many)
            modelBuilder.Entity<Order>()
                .HasMany(o => o.Stops)
                .WithOne(os => os.Order)
                .HasForeignKey(os => os.OrderId)
                .OnDelete(DeleteBehavior.Cascade);

            // Order - OrderRatings (One to Many)
            modelBuilder.Entity<Order>()
                .HasMany(o => o.Ratings)
                .WithOne(or => or.Order)
                .HasForeignKey(or => or.OrderId)
                .OnDelete(DeleteBehavior.Cascade);

            // ============================================
            // DRIVER RELATIONSHIPS
            // ============================================

            // تنظیمات دقیق فیلدهای درایور (برای اطمینان از ساختار صحیح دیتابیس)
            modelBuilder.Entity<Driver>(entity =>
            {
                // جلوگیری از ایجاد کلیدهای فرعی اشتباه و تنظیم دقیق
                entity.Property(d => d.TotalEarnings).HasColumnType("decimal(18,2)");
                entity.Property(d => d.Rating).HasColumnType("decimal(3,2)");
                entity.Property(d => d.CurrentLatitude).HasColumnType("decimal(10,8)");
                entity.Property(d => d.CurrentLongitude).HasColumnType("decimal(11,8)");
            });

            // Driver - DriverAssignments (One to Many)
            modelBuilder.Entity<Driver>()
                .HasMany(d => d.Assignments)
                .WithOne(da => da.Driver)
                .HasForeignKey(da => da.DriverId)
                .OnDelete(DeleteBehavior.NoAction);

            // Driver - LocationUpdates (One to Many)
            modelBuilder.Entity<Driver>()
                .HasMany(d => d.LocationUpdates)
                .WithOne(lu => lu.Driver)
                .HasForeignKey(lu => lu.DriverId)
                .OnDelete(DeleteBehavior.Cascade);

            // ============================================
            // INDEXES
            // ============================================

            // User
            modelBuilder.Entity<User>()
                .HasIndex(u => u.PhoneNumber)
                .IsUnique();

            modelBuilder.Entity<User>()
                .HasIndex(u => u.Role);

            // Order
            modelBuilder.Entity<Order>()
                .HasIndex(o => o.Status);

            modelBuilder.Entity<Order>()
                .HasIndex(o => o.CustomerPhone);

            modelBuilder.Entity<Order>()
                .HasIndex(o => o.CreatedAt);

            modelBuilder.Entity<Order>()
                .HasIndex(o => o.PreferredDateTime);

            // DriverAssignment
            modelBuilder.Entity<DriverAssignment>()
                .HasIndex(da => da.DriverId);

            modelBuilder.Entity<DriverAssignment>()
                .HasIndex(da => da.OrderId)
                .IsUnique();

            // DiscountCode
            modelBuilder.Entity<DiscountCode>()
                .HasIndex(dc => dc.Code)
                .IsUnique();

            // ServiceCategory
            modelBuilder.Entity<ServiceCategory>()
                .HasIndex(sc => sc.Slug)
                .IsUnique();

            // CatalogCategory
            modelBuilder.Entity<CatalogCategory>()
                .HasIndex(cc => cc.Slug)
                .IsUnique();

            // LocationUpdate
            modelBuilder.Entity<LocationUpdate>()
                .HasIndex(lu => lu.DriverId);

            modelBuilder.Entity<LocationUpdate>()
                .HasIndex(lu => lu.Timestamp);

            // Notification
            modelBuilder.Entity<Notification>()
                .HasIndex(n => n.UserId);

            modelBuilder.Entity<Notification>()
                .HasIndex(n => n.IsRead);

            // Ticket
            modelBuilder.Entity<Ticket>()
                .HasIndex(t => t.UserId);

            modelBuilder.Entity<Ticket>()
                .HasIndex(t => t.Status);

            modelBuilder.Entity<Ticket>()
                .HasIndex(t => t.CreatedAt);

            // TicketMessage
            modelBuilder.Entity<TicketMessage>()
                .HasIndex(tm => tm.TicketId);

            modelBuilder.Entity<TicketMessage>()
                .HasIndex(tm => tm.IsRead);
        }
    }
}