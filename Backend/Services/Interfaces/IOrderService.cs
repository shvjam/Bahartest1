namespace BarbariBahar.API.Services.Interfaces
{
    public interface IOrderService
    {
        Task<(bool Success, Order? Order, string? Message)> CreateOrderAsync(CreateOrderDto dto);
        Task<(bool Success, string? Message)> UpdateOrderStatusAsync(Guid orderId, OrderStatus newStatus, string? reason = null);
        Task<(bool Success, string? Message)> AssignDriverAsync(Guid orderId, Guid driverId);
        Task<(bool Success, string? Message)> CancelOrderAsync(Guid orderId, string reason);
        Task<Order?> GetOrderByIdAsync(Guid orderId);
        Task<Order?> GetOrderByNumberAsync(string orderNumber);
        Task<List<Order>> GetUserOrdersAsync(Guid userId);
        Task<List<Order>> GetDriverOrdersAsync(Guid driverId);
        Task<List<Order>> GetPendingOrdersAsync();
        Task<string> GenerateOrderNumberAsync();
        Task<bool> CanCancelOrderAsync(Guid orderId);
    }

    public class CreateOrderDto
    {
        public Guid UserId { get; set; }
        public Guid ServiceId { get; set; }
        public VehicleType VehicleType { get; set; }
        public bool RequiresPacking { get; set; }
        public bool RequiresWorkers { get; set; }
        public int WorkerCount { get; set; }
        public int? EstimatedDuration { get; set; }
        public decimal? Distance { get; set; }
        public DateTime ScheduledDate { get; set; }
        public string? ScheduledTime { get; set; }
        public decimal BasePrice { get; set; }
        public decimal VehiclePrice { get; set; }
        public decimal WorkerPrice { get; set; }
        public decimal DistancePrice { get; set; }
        public decimal FloorPrice { get; set; }
        public decimal WalkingDistancePrice { get; set; }
        public decimal StopsPrice { get; set; }
        public decimal PackingPrice { get; set; }
        public decimal Subtotal { get; set; }
        public decimal Discount { get; set; }
        public decimal TotalPrice { get; set; }
        public string? DiscountCode { get; set; }
        public PaymentMethod? PaymentMethod { get; set; }
        public string? SpecialInstructions { get; set; }
        public List<CreateOrderAddressDto>? Addresses { get; set; }
        public List<CreateOrderItemDto>? Items { get; set; }
        public List<OrderStopDto>? Stops { get; set; }
        public List<OrderPackingDto>? PackingProducts { get; set; }
    }

    public class CreateOrderAddressDto
    {
        public OrderAddressType Type { get; set; }
        public string AddressLine { get; set; } = string.Empty;
        public string? City { get; set; }
        public string? District { get; set; }
        public string? PostalCode { get; set; }
        public decimal? Latitude { get; set; }
        public decimal? Longitude { get; set; }
        public int? Floor { get; set; }
        public bool HasElevator { get; set; }
        public int? WalkingDistance { get; set; }
        public string? ContactName { get; set; }
        public string? ContactPhone { get; set; }
        public string? Notes { get; set; }
    }

    public class CreateOrderItemDto
    {
        public Guid CatalogItemId { get; set; }
        public int Quantity { get; set; }
        public string? Notes { get; set; }
    }

    public class OrderStopDto
    {
        public string Address { get; set; } = string.Empty;
        public decimal? Latitude { get; set; }
        public decimal? Longitude { get; set; }
        public string? Notes { get; set; }
    }

    public class OrderPackingDto
    {
        public Guid PackingProductId { get; set; }
        public int Quantity { get; set; }
        public decimal Price { get; set; }
    }
}