using AutoMapper;
using BarbariBahar.API.Models;
using BarbariBahar.API.DTOs.Auth;
using BarbariBahar.API.DTOs.User;
using BarbariBahar.API.DTOs.Order;
using BarbariBahar.API.DTOs.Driver;
using BarbariBahar.API.DTOs.Common;

namespace BarbariBahar.API.Mappings
{
    /// <summary>
    /// پروفایل Mapping برای AutoMapper
    /// </summary>
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            // ============================================
            // USER MAPPINGS
            // ============================================

            CreateMap<User, UserDto>()
                .ForMember(dest => dest.Role, opt => opt.MapFrom(src => src.Role.ToString()));

            CreateMap<User, UserResponse>()
                .ForMember(dest => dest.Role, opt => opt.MapFrom(src => src.Role.ToString()))
                .ForMember(dest => dest.TotalOrders, opt => opt.Ignore())
                .ForMember(dest => dest.CompletedOrders, opt => opt.Ignore());

            CreateMap<User, UserListItemResponse>()
                .ForMember(dest => dest.Role, opt => opt.MapFrom(src => src.Role.ToString()));

            CreateMap<UpdateProfileRequest, User>()
                .ForAllMembers(opts => opts.Condition((src, dest, srcMember) => srcMember != null));

            // ============================================
            // ADDRESS MAPPINGS
            // ============================================

            CreateMap<Address, AddressResponse>();
            CreateMap<CreateAddressRequest, Address>();
            CreateMap<UpdateAddressRequest, Address>();

            // ============================================
            // ORDER MAPPINGS
            // ============================================

            CreateMap<Order, OrderResponse>()
                .ForMember(dest => dest.Status, opt => opt.MapFrom(src => src.Status.ToString()))
                .ForMember(dest => dest.ServiceType, opt => opt.MapFrom(src => src.ServiceCategory!.ServiceType.ToString()))
                .ForMember(dest => dest.OriginAddress, opt => opt.MapFrom(src => 
                    src.Addresses!.FirstOrDefault(a => a.Type == Enums.OrderAddressType.ORIGIN)))
                .ForMember(dest => dest.DestinationAddress, opt => opt.MapFrom(src => 
                    src.Addresses!.FirstOrDefault(a => a.Type == Enums.OrderAddressType.DESTINATION)))
                .ForMember(dest => dest.UserName, opt => opt.MapFrom(src => src.User!.FullName))
                .ForMember(dest => dest.UserPhone, opt => opt.MapFrom(src => src.User!.PhoneNumber))
                .ForMember(dest => dest.Driver, opt => opt.MapFrom(src => src.Driver));

            CreateMap<Order, OrderListItemResponse>()
                .ForMember(dest => dest.Status, opt => opt.MapFrom(src => src.Status.ToString()))
                .ForMember(dest => dest.ServiceType, opt => opt.MapFrom(src => src.ServiceCategory!.ServiceType.ToString()))
                .ForMember(dest => dest.UserName, opt => opt.MapFrom(src => src.User!.FullName))
                .ForMember(dest => dest.UserPhone, opt => opt.MapFrom(src => src.User!.PhoneNumber))
                .ForMember(dest => dest.DriverName, opt => opt.MapFrom(src => src.Driver != null ? src.Driver.User.FullName : null))
                .ForMember(dest => dest.IsPaid, opt => opt.MapFrom(src => 
                    src.Payment != null && src.Payment.PaymentStatus == Enums.PaymentStatus.COMPLETED));

            CreateMap<OrderAddress, OrderAddressResponse>();

            CreateMap<OrderAddressDto, OrderAddress>()
                .ForMember(dest => dest.Id, opt => opt.Ignore())
                .ForMember(dest => dest.OrderId, opt => opt.Ignore())
                .ForMember(dest => dest.Order, opt => opt.Ignore())
                .ForMember(dest => dest.Type, opt => opt.Ignore());

            CreateMap<LocationDetails, LocationDetailsResponse>()
                .ForMember(dest => dest.OriginFloorType, opt => opt.MapFrom(src => src.OriginFloorType.ToString()))
                .ForMember(dest => dest.DestinationFloorType, opt => opt.MapFrom(src => src.DestinationFloorType.ToString()));

            CreateMap<LocationDetailsDto, LocationDetails>()
                .ForMember(dest => dest.Id, opt => opt.Ignore())
                .ForMember(dest => dest.OrderId, opt => opt.Ignore())
                .ForMember(dest => dest.Order, opt => opt.Ignore());

            CreateMap<OrderItem, OrderItemResponse>()
                .ForMember(dest => dest.ItemName, opt => opt.MapFrom(src => src.CatalogItem!.Name))
                .ForMember(dest => dest.CategoryName, opt => opt.MapFrom(src => src.CatalogItem!.Category!.Name));

            CreateMap<OrderItemDto, OrderItem>()
                .ForMember(dest => dest.Id, opt => opt.Ignore())
                .ForMember(dest => dest.OrderId, opt => opt.Ignore())
                .ForMember(dest => dest.Order, opt => opt.Ignore())
                .ForMember(dest => dest.CatalogItem, opt => opt.Ignore())
                .ForMember(dest => dest.UnitPrice, opt => opt.Ignore())
                .ForMember(dest => dest.TotalPrice, opt => opt.Ignore());

            CreateMap<PackingService, PackingServiceResponse>();

            CreateMap<PackingServiceItem, PackingItemResponse>()
                .ForMember(dest => dest.ProductName, opt => opt.MapFrom(src => src.PackingProduct!.Name));

            // ============================================
            // DRIVER MAPPINGS
            // ============================================

            CreateMap<Driver, DriverResponse>()
                .ForMember(dest => dest.FullName, opt => opt.MapFrom(src => src.User.FullName))
                .ForMember(dest => dest.PhoneNumber, opt => opt.MapFrom(src => src.User.PhoneNumber))
                .ForMember(dest => dest.VehicleType, opt => opt.MapFrom(src => src.VehicleType.ToString()))
                .ForMember(dest => dest.Status, opt => opt.MapFrom(src => src.Status.ToString()));

            CreateMap<Driver, DriverListItemResponse>()
                .ForMember(dest => dest.FullName, opt => opt.MapFrom(src => src.User.FullName))
                .ForMember(dest => dest.PhoneNumber, opt => opt.MapFrom(src => src.User.PhoneNumber))
                .ForMember(dest => dest.VehicleType, opt => opt.MapFrom(src => src.VehicleType.ToString()))
                .ForMember(dest => dest.Status, opt => opt.MapFrom(src => src.Status.ToString()));

            CreateMap<Driver, AvailableDriverResponse>()
                .ForMember(dest => dest.FullName, opt => opt.MapFrom(src => src.User.FullName))
                .ForMember(dest => dest.PhoneNumber, opt => opt.MapFrom(src => src.User.PhoneNumber))
                .ForMember(dest => dest.VehicleType, opt => opt.MapFrom(src => src.VehicleType.ToString()))
                .ForMember(dest => dest.DistanceFromOrigin, opt => opt.Ignore());

            CreateMap<Driver, DriverInfoResponse>()
                .ForMember(dest => dest.Name, opt => opt.MapFrom(src => src.User.FullName ?? "راننده"))
                .ForMember(dest => dest.PhoneNumber, opt => opt.MapFrom(src => src.User.PhoneNumber))
                .ForMember(dest => dest.VehicleType, opt => opt.MapFrom(src => src.VehicleType.ToString()))
                .ForMember(dest => dest.AvatarUrl, opt => opt.MapFrom(src => src.User.AvatarUrl));

            CreateMap<Order, DriverOrderResponse>()
                .ForMember(dest => dest.Status, opt => opt.MapFrom(src => src.Status.ToString()))
                .ForMember(dest => dest.ServiceType, opt => opt.MapFrom(src => src.ServiceCategory!.ServiceType.ToString()))
                .ForMember(dest => dest.OriginAddress, opt => opt.MapFrom(src =>
                    src.Addresses!.FirstOrDefault(a => a.Type == Enums.OrderAddressType.ORIGIN)!.AddressLine))
                .ForMember(dest => dest.DestinationAddress, opt => opt.MapFrom(src =>
                    src.Addresses!.FirstOrDefault(a => a.Type == Enums.OrderAddressType.DESTINATION)!.AddressLine))
                .ForMember(dest => dest.CustomerName, opt => opt.MapFrom(src => src.User!.FullName ?? "مشتری"))
                .ForMember(dest => dest.CustomerPhone, opt => opt.MapFrom(src => src.User!.PhoneNumber));

            CreateMap<RegisterDriverRequest, User>()
                .ForMember(dest => dest.Id, opt => opt.Ignore())
                .ForMember(dest => dest.Role, opt => opt.MapFrom(src => Enums.UserRole.DRIVER))
                .ForMember(dest => dest.IsActive, opt => opt.MapFrom(src => true))
                .ForMember(dest => dest.CreatedAt, opt => opt.MapFrom(src => DateTime.UtcNow));

            CreateMap<RegisterDriverRequest, Driver>()
                .ForMember(dest => dest.Id, opt => opt.Ignore())
                .ForMember(dest => dest.UserId, opt => opt.Ignore())
                .ForMember(dest => dest.User, opt => opt.Ignore())
                .ForMember(dest => dest.Status, opt => opt.MapFrom(src => Enums.DriverStatus.OFFLINE))
                .ForMember(dest => dest.IsVerified, opt => opt.MapFrom(src => false))
                .ForMember(dest => dest.Rating, opt => opt.MapFrom(src => 5.0m))
                .ForMember(dest => dest.TotalTrips, opt => opt.MapFrom(src => 0))
                .ForMember(dest => dest.CompletedTrips, opt => opt.MapFrom(src => 0))
                .ForMember(dest => dest.CancelledTrips, opt => opt.MapFrom(src => 0));

            // ============================================
            // SERVICE CATEGORY MAPPINGS
            // ============================================

            CreateMap<ServiceCategory, ServiceCategoryResponse>()
                .ForMember(dest => dest.ServiceType, opt => opt.MapFrom(src => src.ServiceType.ToString()));

            CreateMap<CreateServiceCategoryRequest, ServiceCategory>()
                .ForMember(dest => dest.Id, opt => opt.Ignore())
                .ForMember(dest => dest.ServiceType, opt => opt.MapFrom(src => 
                    Enum.Parse<Enums.ServiceType>(src.ServiceType)))
                .ForMember(dest => dest.CreatedAt, opt => opt.MapFrom(src => DateTime.UtcNow));

            // ============================================
            // CATALOG MAPPINGS
            // ============================================

            CreateMap<CatalogCategory, CatalogCategoryResponse>()
                .ForMember(dest => dest.ItemsCount, opt => opt.MapFrom(src => src.Items != null ? src.Items.Count : 0));

            CreateMap<CatalogItem, CatalogItemResponse>()
                .ForMember(dest => dest.CategoryName, opt => opt.MapFrom(src => src.Category!.Name));

            CreateMap<CreateCatalogItemRequest, CatalogItem>()
                .ForMember(dest => dest.Id, opt => opt.Ignore())
                .ForMember(dest => dest.Category, opt => opt.Ignore())
                .ForMember(dest => dest.CreatedAt, opt => opt.MapFrom(src => DateTime.UtcNow));

            // ============================================
            // PACKING PRODUCT MAPPINGS
            // ============================================

            CreateMap<PackingProduct, PackingProductResponse>();

            CreateMap<CreatePackingProductRequest, PackingProduct>()
                .ForMember(dest => dest.Id, opt => opt.Ignore())
                .ForMember(dest => dest.CreatedAt, opt => opt.MapFrom(src => DateTime.UtcNow));

            // ============================================
            // PRICING CONFIG MAPPINGS
            // ============================================

            CreateMap<PricingConfig, PricingConfigResponse>()
                .ForMember(dest => dest.ServiceType, opt => opt.MapFrom(src => src.ServiceType.ToString()));

            CreateMap<UpdatePricingConfigRequest, PricingConfig>()
                .ForMember(dest => dest.ServiceType, opt => opt.Ignore())
                .ForMember(dest => dest.UpdatedAt, opt => opt.MapFrom(src => DateTime.UtcNow));

            // ============================================
            // NOTIFICATION MAPPINGS
            // ============================================

            CreateMap<Notification, NotificationResponse>()
                .ForMember(dest => dest.Type, opt => opt.MapFrom(src => src.Type.ToString()));

            CreateMap<CreateNotificationRequest, Notification>()
                .ForMember(dest => dest.Id, opt => opt.Ignore())
                .ForMember(dest => dest.Type, opt => opt.MapFrom(src => 
                    Enum.Parse<Enums.NotificationType>(src.Type)))
                .ForMember(dest => dest.IsRead, opt => opt.MapFrom(src => false))
                .ForMember(dest => dest.CreatedAt, opt => opt.MapFrom(src => DateTime.UtcNow));

            // ============================================
            // DISCOUNT CODE MAPPINGS
            // ============================================

            CreateMap<DiscountCode, DiscountCodeResponse>()
                .ForMember(dest => dest.DiscountType, opt => opt.MapFrom(src => src.DiscountType.ToString()));

            CreateMap<CreateDiscountCodeRequest, DiscountCode>()
                .ForMember(dest => dest.Id, opt => opt.Ignore())
                .ForMember(dest => dest.DiscountType, opt => opt.MapFrom(src => 
                    src.DiscountType == "PERCENTAGE" ? Enums.DiscountType.PERCENTAGE : Enums.DiscountType.FIXED_AMOUNT))
                .ForMember(dest => dest.UsedCount, opt => opt.MapFrom(src => 0))
                .ForMember(dest => dest.CreatedAt, opt => opt.MapFrom(src => DateTime.UtcNow));
        }
    }
}