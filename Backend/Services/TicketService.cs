using Microsoft.EntityFrameworkCore;
using BarbariBahar.API.Data;
using BarbariBahar.API.Models;
using BarbariBahar.API.DTOs.Ticket;
using BarbariBahar.API.Models.ApiResponses;
using BarbariBahar.API.Services.Interfaces;
using BarbariBahar.API.Enums;
using BarbariBahar.API.Helpers;
using BarbariBahar.API.Extensions;

namespace BarbariBahar.API.Services
{
    public class TicketService : ITicketService
    {
        private readonly AppDbContext _context;
        private readonly ILogger<TicketService> _logger;

        public TicketService(AppDbContext context, ILogger<TicketService> logger)
        {
            _context = context;
            _logger = logger;
        }

        public async Task<PaginatedResponse<TicketResponse>> GetTicketsAsync(TicketListQueryParams queryParams)
        {
            var query = _context.Tickets
                .Include(t => t.User)
                .Include(t => t.AssignedToAdmin)
                .Include(t => t.Messages)
                .AsQueryable();

            if (queryParams.UserId.HasValue)
            {
                query = query.Where(t => t.UserId == queryParams.UserId.Value);
            }

            if (queryParams.Status.HasValue)
            {
                query = query.Where(t => t.Status == queryParams.Status.Value);
            }

            if (queryParams.Priority.HasValue)
            {
                query = query.Where(t => t.Priority == queryParams.Priority.Value);
            }

            if (queryParams.AssignedToAdminId.HasValue)
            {
                query = query.Where(t => t.AssignedToAdminId == queryParams.AssignedToAdminId.Value);
            }

            if (!string.IsNullOrWhiteSpace(queryParams.SearchTerm))
            {
                query = query.Where(t => t.Subject.Contains(queryParams.SearchTerm));
            }

            if (queryParams.FromDate.HasValue)
            {
                query = query.Where(t => t.CreatedAt >= queryParams.FromDate.Value);
            }

            if (queryParams.ToDate.HasValue)
            {
                query = query.Where(t => t.CreatedAt <= queryParams.ToDate.Value);
            }

            query = query.OrderByDescending(t => t.CreatedAt);

            var paginatedTickets = await query.ToPaginatedResponseAsync(
                queryParams.PageNumber,
                queryParams.PageSize
            );

            return new PaginatedResponse<TicketResponse>
            {
                Items = paginatedTickets.Items.Select(MapToTicketResponse).ToList(),
                TotalCount = paginatedTickets.TotalCount,
                PageNumber = paginatedTickets.PageNumber,
                PageSize = paginatedTickets.PageSize,
                TotalPages = paginatedTickets.TotalPages,
                HasNextPage = paginatedTickets.HasNextPage,
                HasPreviousPage = paginatedTickets.HasPreviousPage
            };
        }

        public async Task<TicketDetailResponse?> GetTicketByIdAsync(Guid ticketId)
        {
            var ticket = await _context.Tickets
                .Include(t => t.User)
                .Include(t => t.AssignedToAdmin)
                .Include(t => t.Messages)
                    .ThenInclude(m => m.Sender)
                .FirstOrDefaultAsync(t => t.Id == ticketId);

            if (ticket == null) return null;

            return new TicketDetailResponse
            {
                Id = ticket.Id,
                UserId = ticket.UserId,
                UserName = ticket.User.FullName ?? ticket.User.PhoneNumber,
                UserPhone = ticket.User.PhoneNumber,
                Subject = ticket.Subject,
                Priority = ticket.Priority,
                Status = ticket.Status,
                CreatedAt = ticket.CreatedAt,
                UpdatedAt = ticket.UpdatedAt,
                ClosedAt = ticket.ClosedAt,
                AssignedToAdminId = ticket.AssignedToAdminId,
                AssignedToAdminName = ticket.AssignedToAdmin?.FullName,
                OrderId = ticket.OrderId,
                Messages = ticket.Messages
                    .OrderBy(m => m.CreatedAt)
                    .Select(m => new TicketMessageResponse
                    {
                        Id = m.Id,
                        TicketId = m.TicketId,
                        SenderId = m.SenderId,
                        SenderName = m.Sender.FullName ?? m.Sender.PhoneNumber,
                        Message = m.Message,
                        IsAdminMessage = m.IsAdminMessage,
                        CreatedAt = m.CreatedAt,
                        IsRead = m.IsRead,
                        ReadAt = m.ReadAt
                    })
                    .ToList()
            };
        }

        public async Task<TicketResponse> CreateTicketAsync(Guid userId, CreateTicketRequest request)
        {
            var ticket = new Ticket
            {
                UserId = userId,
                Subject = request.Subject,
                Priority = request.Priority,
                OrderId = request.OrderId,
                Status = TicketStatus.OPEN,
                CreatedAt = DateTime.UtcNow
            };

            _context.Tickets.Add(ticket);

            var firstMessage = new TicketMessage
            {
                TicketId = ticket.Id,
                SenderId = userId,
                Message = request.Message,
                IsAdminMessage = false,
                CreatedAt = DateTime.UtcNow
            };

            _context.TicketMessages.Add(firstMessage);

            await _context.SaveChangesAsync();

            var createdTicket = await _context.Tickets
                .Include(t => t.User)
                .Include(t => t.Messages)
                .FirstAsync(t => t.Id == ticket.Id);

            return MapToTicketResponse(createdTicket);
        }

        public async Task<TicketMessageResponse> SendMessageAsync(Guid userId, SendTicketMessageRequest request)
        {
            var ticket = await _context.Tickets
                .Include(t => t.User)
                .FirstOrDefaultAsync(t => t.Id == request.TicketId);

            if (ticket == null)
            {
                throw new Exception("تیکت یافت نشد");
            }

            var user = await _context.Users.FindAsync(userId);
            if (user == null)
            {
                throw new Exception("کاربر یافت نشد");
            }

            var isAdmin = user.Role == UserRole.ADMIN;

            if (!isAdmin && ticket.UserId != userId)
            {
                throw new Exception("شما مجاز به ارسال پیام در این تیکت نیستید");
            }

            var message = new TicketMessage
            {
                TicketId = request.TicketId,
                SenderId = userId,
                Message = request.Message,
                IsAdminMessage = isAdmin,
                CreatedAt = DateTime.UtcNow,
                IsRead = false
            };

            _context.TicketMessages.Add(message);

            ticket.UpdatedAt = DateTime.UtcNow;

            if (isAdmin && ticket.Status == TicketStatus.OPEN)
            {
                ticket.Status = TicketStatus.IN_PROGRESS;
            }

            await _context.SaveChangesAsync();

            var sender = await _context.Users.FindAsync(userId);

            return new TicketMessageResponse
            {
                Id = message.Id,
                TicketId = message.TicketId,
                SenderId = message.SenderId,
                SenderName = sender?.FullName ?? sender?.PhoneNumber ?? "کاربر",
                Message = message.Message,
                IsAdminMessage = message.IsAdminMessage,
                CreatedAt = message.CreatedAt,
                IsRead = message.IsRead,
                ReadAt = message.ReadAt
            };
        }

        public async Task<bool> UpdateTicketStatusAsync(Guid ticketId, UpdateTicketStatusRequest request)
        {
            var ticket = await _context.Tickets.FindAsync(ticketId);
            if (ticket == null) return false;

            ticket.Status = request.Status;
            ticket.UpdatedAt = DateTime.UtcNow;

            if (request.Status == TicketStatus.CLOSED || request.Status == TicketStatus.RESOLVED)
            {
                ticket.ClosedAt = DateTime.UtcNow;
            }

            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> AssignTicketAsync(Guid ticketId, AssignTicketRequest request)
        {
            var ticket = await _context.Tickets.FindAsync(ticketId);
            if (ticket == null) return false;

            var admin = await _context.Users.FindAsync(request.AdminId);
            if (admin == null || admin.Role != UserRole.ADMIN) return false;

            ticket.AssignedToAdminId = request.AdminId;
            ticket.UpdatedAt = DateTime.UtcNow;

            if (ticket.Status == TicketStatus.OPEN)
            {
                ticket.Status = TicketStatus.IN_PROGRESS;
            }

            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> MarkMessagesAsReadAsync(Guid ticketId, Guid userId)
        {
            var messages = await _context.TicketMessages
                .Where(m => m.TicketId == ticketId && m.SenderId != userId && !m.IsRead)
                .ToListAsync();

            foreach (var message in messages)
            {
                message.IsRead = true;
                message.ReadAt = DateTime.UtcNow;
            }

            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<int> GetUnreadTicketsCountAsync(Guid userId)
        {
            return await _context.TicketMessages
                .Where(m => m.Ticket.UserId == userId && m.SenderId != userId && !m.IsRead)
                .Select(m => m.TicketId)
                .Distinct()
                .CountAsync();
        }

        private TicketResponse MapToTicketResponse(Ticket ticket)
        {
            var lastMessage = ticket.Messages.OrderByDescending(m => m.CreatedAt).FirstOrDefault();
            var unreadCount = ticket.Messages.Count(m => !m.IsRead && m.SenderId != ticket.UserId);

            return new TicketResponse
            {
                Id = ticket.Id,
                UserId = ticket.UserId,
                Subject = ticket.Subject,
                Priority = ticket.Priority,
                Status = ticket.Status,
                CreatedAt = ticket.CreatedAt,
                UpdatedAt = ticket.UpdatedAt,
                ClosedAt = ticket.ClosedAt,
                AssignedToAdminId = ticket.AssignedToAdminId,
                AssignedToAdminName = ticket.AssignedToAdmin?.FullName,
                OrderId = ticket.OrderId,
                UnreadMessagesCount = unreadCount,
                LastMessage = lastMessage != null ? new TicketMessageResponse
                {
                    Id = lastMessage.Id,
                    TicketId = lastMessage.TicketId,
                    SenderId = lastMessage.SenderId,
                    SenderName = lastMessage.Sender?.FullName ?? lastMessage.Sender?.PhoneNumber ?? "کاربر",
                    Message = lastMessage.Message,
                    IsAdminMessage = lastMessage.IsAdminMessage,
                    CreatedAt = lastMessage.CreatedAt,
                    IsRead = lastMessage.IsRead,
                    ReadAt = lastMessage.ReadAt
                } : null
            };
        }
    }
}