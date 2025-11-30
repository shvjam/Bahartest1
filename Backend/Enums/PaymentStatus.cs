namespace BarbariBahar.API.Enums
{
    public enum PaymentStatus
    {
        PENDING = 0,
        Pending = 0, // Pascal case alias
        PAID = 1,
        Paid = 1, // Pascal case alias
        COMPLETED = 1, // Alias for PAID
        Completed = 1, // Pascal case alias
        FAILED = 2,
        Failed = 2, // Pascal case alias
        REFUNDED = 3,
        Refunded = 3 // Pascal case alias
    }
}