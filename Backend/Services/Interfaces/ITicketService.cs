using BarbariBahar.API.DTOs.Ticket;
using BarbariBahar.API.Models.ApiResponses;

namespace BarbariBahar.API.Services.Interfaces
{
    public interface ITicketService
    {
        Task<PaginatedResponse<TicketResponse>> GetTicketsAsync(TicketListQueryParams queryParams);
        Task<TicketDetailResponse?> GetTicketByIdAsync(Guid ticketId);
        Task<TicketResponse> CreateTicketAsync(Guid userId, CreateTicketRequest request);
        Task<TicketMessageResponse> SendMessageAsync(Guid userId, SendTicketMessageRequest request);
        Task<bool> UpdateTicketStatusAsync(Guid ticketId, UpdateTicketStatusRequest request);
        Task<bool> AssignTicketAsync(Guid ticketId, AssignTicketRequest request);
        Task<bool> MarkMessagesAsReadAsync(Guid ticketId, Guid userId);
        Task<int> GetUnreadTicketsCountAsync(Guid userId);
    }
}
