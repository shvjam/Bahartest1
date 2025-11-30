using BarbariBahar.API.Enums;

namespace BarbariBahar.API.DTOs.Ticket
{
    public class CreateTicketRequest
    {
        public string Subject { get; set; } = string.Empty;
        public string Message { get; set; } = string.Empty;
        public TicketPriority Priority { get; set; } = TicketPriority.MEDIUM;
        public Guid? OrderId { get; set; }
    }

    public class SendTicketMessageRequest
    {
        public Guid TicketId { get; set; }
        public string Message { get; set; } = string.Empty;
    }

    public class UpdateTicketStatusRequest
    {
        public TicketStatus Status { get; set; }
    }

    public class AssignTicketRequest
    {
        public Guid AdminId { get; set; }
    }

    public class TicketResponse
    {
        public Guid Id { get; set; }
        public Guid UserId { get; set; }
        public string Subject { get; set; } = string.Empty;
        public TicketPriority Priority { get; set; }
        public TicketStatus Status { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public DateTime? ClosedAt { get; set; }
        public Guid? AssignedToAdminId { get; set; }
        public string? AssignedToAdminName { get; set; }
        public Guid? OrderId { get; set; }
        public string? OrderNumber { get; set; }
        public int UnreadMessagesCount { get; set; }
        public TicketMessageResponse? LastMessage { get; set; }
    }

    public class TicketDetailResponse
    {
        public Guid Id { get; set; }
        public Guid UserId { get; set; }
        public string UserName { get; set; } = string.Empty;
        public string UserPhone { get; set; } = string.Empty;
        public string Subject { get; set; } = string.Empty;
        public TicketPriority Priority { get; set; }
        public TicketStatus Status { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public DateTime? ClosedAt { get; set; }
        public Guid? AssignedToAdminId { get; set; }
        public string? AssignedToAdminName { get; set; }
        public Guid? OrderId { get; set; }
        public List<TicketMessageResponse> Messages { get; set; } = new();
    }

    public class TicketMessageResponse
    {
        public Guid Id { get; set; }
        public Guid TicketId { get; set; }
        public Guid SenderId { get; set; }
        public string SenderName { get; set; } = string.Empty;
        public string Message { get; set; } = string.Empty;
        public bool IsAdminMessage { get; set; }
        public DateTime CreatedAt { get; set; }
        public bool IsRead { get; set; }
        public DateTime? ReadAt { get; set; }
    }

    public class TicketListQueryParams
    {
        public int PageNumber { get; set; } = 1;
        public int PageSize { get; set; } = 10;
        public TicketStatus? Status { get; set; }
        public TicketPriority? Priority { get; set; }
        public Guid? UserId { get; set; }
        public Guid? AssignedToAdminId { get; set; }
        public string? SearchTerm { get; set; }
        public DateTime? FromDate { get; set; }
        public DateTime? ToDate { get; set; }
    }
}
