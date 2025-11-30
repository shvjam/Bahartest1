namespace BarbariBahar.API.Services.Interfaces
{
    public interface IPricingService
    {
        Task<PriceBreakdown> CalculatePriceAsync(PriceCalculationDto dto);
        Task<(bool IsValid, decimal Discount, string? Message)> ValidateDiscountCodeAsync(string code, decimal orderAmount);
        Task<PricingConfig?> GetActivePricingConfigAsync();
        Task<int> CalculateEstimatedDurationAsync(PriceCalculationDto dto);
    }

    public class PriceCalculationDto
    {
        public VehicleType VehicleType { get; set; }
        public bool RequiresWorkers { get; set; }
        public int WorkerCount { get; set; }
        public decimal? Distance { get; set; }
        public List<FloorInfoDto>? Floors { get; set; }
        public List<int>? WalkingDistances { get; set; }
        public int? StopsCount { get; set; }
        public bool RequiresPacking { get; set; }
        public int? PackingDuration { get; set; }
        public string? DiscountCode { get; set; }
    }

    public class FloorInfoDto
    {
        public int FloorNumber { get; set; }
        public bool HasElevator { get; set; }
    }

    public class PriceBreakdown
    {
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
        public int EstimatedDuration { get; set; }
        public DiscountInfo? DiscountInfo { get; set; }
    }

    public class DiscountInfo
    {
        public string Code { get; set; } = string.Empty;
        public string Type { get; set; } = string.Empty;
        public decimal Value { get; set; }
        public decimal DiscountAmount { get; set; }
        public bool IsValid { get; set; }
        public string? Message { get; set; }
    }
}
