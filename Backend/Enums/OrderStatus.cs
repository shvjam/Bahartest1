namespace BarbariBahar.API.Enums
{
    public enum OrderStatus
    {
        DRAFT = 0,
        PENDING = 1,
        PENDING_PAYMENT = 1, // Alias
        PendingPayment = 1, // Pascal case
        REVIEWING = 2,
        CONFIRMED = 3,
        DRIVER_ASSIGNED = 4,
        DRIVER_EN_ROUTE_TO_ORIGIN = 5,
        DRIVER_ARRIVED = 5,
        PACKING_IN_PROGRESS = 6,
        LOADING_IN_PROGRESS = 7,
        IN_PROGRESS = 7,
        IN_TRANSIT = 8,
        ARRIVED_AT_DESTINATION = 9,
        COMPLETED = 10,
        CANCELLED = 11
    }
}