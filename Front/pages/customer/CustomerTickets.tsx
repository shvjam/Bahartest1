import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { 
  Button 
} from '../../components/ui/button';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Separator } from '../../components/ui/separator';
import { ScrollArea } from '../../components/ui/scroll-area';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../../components/ui/dialog';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';
import {
  Calendar,
  Loader2,
  MessageSquare,
  Plus,
  Send,
  X,
} from 'lucide-react';
import { ticketService, TicketStatus, TicketPriority, Ticket, TicketDetail } from '../../services/api/ticket.service';
import { useAuth } from '../../contexts/AuthContext';

export const CustomerTickets = () => {
  const { user } = useAuth();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<TicketDetail | null>(null);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSendingMessage, setIsSendingMessage] = useState(false);
  const [isCreatingTicket, setIsCreatingTicket] = useState(false);

  // New Ticket Form
  const [newTicketSubject, setNewTicketSubject] = useState('');
  const [newTicketPriority, setNewTicketPriority] = useState<TicketPriority>(TicketPriority.MEDIUM);
  const [newTicketMessage, setNewTicketMessage] = useState('');

  // New Message
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    loadTickets();
  }, []);

  const loadTickets = async () => {
    setIsLoading(true);
    try {
      const response = await ticketService.getTickets({ pageNumber: 1, pageSize: 100 });
      setTickets(response.items || []);
    } catch (error) {
      toast.error('خطا در بارگذاری تیکت‌ها');
    } finally {
      setIsLoading(false);
    }
  };

  const loadTicketDetail = async (ticketId: string) => {
    try {
      const detail = await ticketService.getTicketById(ticketId);
      setSelectedTicket(detail);
    } catch (error) {
      toast.error('خطا در بارگذاری جزئیات تیکت');
    }
  };

  const handleTicketClick = (ticket: Ticket) => {
    loadTicketDetail(ticket.id);
  };

  const getStatusLabel = (status: TicketStatus): string => {
    const labels = {
      [TicketStatus.OPEN]: 'باز',
      [TicketStatus.IN_PROGRESS]: 'در حال بررسی',
      [TicketStatus.WAITING_FOR_CUSTOMER]: 'در انتظار پاسخ',
      [TicketStatus.RESOLVED]: 'حل شده',
      [TicketStatus.CLOSED]: 'بسته شده',
    };
    return labels[status];
  };

  const getStatusColor = (status: TicketStatus): string => {
    const colors = {
      [TicketStatus.OPEN]: 'border-blue-500 text-blue-600',
      [TicketStatus.IN_PROGRESS]: 'border-yellow-500 text-yellow-600',
      [TicketStatus.WAITING_FOR_CUSTOMER]: 'border-purple-500 text-purple-600',
      [TicketStatus.RESOLVED]: 'border-green-500 text-green-600',
      [TicketStatus.CLOSED]: 'border-gray-500 text-gray-600',
    };
    return colors[status];
  };

  const getPriorityLabel = (priority: TicketPriority): string => {
    const labels = {
      [TicketPriority.LOW]: 'کم',
      [TicketPriority.MEDIUM]: 'متوسط',
      [TicketPriority.HIGH]: 'بالا',
      [TicketPriority.URGENT]: 'فوری',
    };
    return labels[priority];
  };

  const getPriorityColor = (priority: TicketPriority): string => {
    const colors = {
      [TicketPriority.LOW]: 'border-gray-500 text-gray-600',
      [TicketPriority.MEDIUM]: 'border-blue-500 text-blue-600',
      [TicketPriority.HIGH]: 'border-orange-500 text-orange-600',
      [TicketPriority.URGENT]: 'border-red-500 text-red-600',
    };
    return colors[priority];
  };

  const handleCreateTicket = async () => {
    if (!newTicketSubject.trim() || !newTicketMessage.trim()) {
      toast.error('لطفاً عنوان و پیام را وارد کنید');
      return;
    }

    setIsCreatingTicket(true);
    try {
      await ticketService.createTicket({
        subject: newTicketSubject,
        message: newTicketMessage,
        priority: newTicketPriority,
      });

      toast.success('تیکت شما با موفقیت ثبت شد');
      setCreateDialogOpen(false);
      setNewTicketSubject('');
      setNewTicketMessage('');
      setNewTicketPriority(TicketPriority.MEDIUM);
      loadTickets();
    } catch (error) {
      toast.error('خطا در ثبت تیکت');
    } finally {
      setIsCreatingTicket(false);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedTicket) return;

    setIsSendingMessage(true);
    try {
      const message = await ticketService.sendMessage({
        ticketId: selectedTicket.id,
        message: newMessage,
      });

      setSelectedTicket({
        ...selectedTicket,
        messages: [...selectedTicket.messages, message],
      });

      setNewMessage('');
      toast.success('پیام شما ارسال شد');
      loadTickets();
    } catch (error) {
      toast.error('خطا در ارسال پیام');
    } finally {
      setIsSendingMessage(false);
    }
  };

  return (
    <div className="space-y-6" dir="rtl">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="mb-2">تیکت‌ها و پشتیبانی</h1>
          <p className="text-muted-foreground">ارتباط با تیم پشتیبانی و پیگیری درخواست‌های خود</p>
        </div>
        <Button onClick={() => setCreateDialogOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          تیکت جدید
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Tickets List */}
        <div className="lg:col-span-1 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">لیست تیکت‌ها</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {isLoading ? (
                <div className="flex items-center justify-center h-[200px]">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : tickets.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-[200px] text-center p-4">
                  <MessageSquare className="h-12 w-12 text-muted-foreground mb-3" />
                  <p className="text-muted-foreground">شما هنوز تیکتی ندارید</p>
                  <Button
                    onClick={() => setCreateDialogOpen(true)}
                    variant="link"
                    className="mt-2"
                  >
                    ایجاد اولین تیکت
                  </Button>
                </div>
              ) : (
                <ScrollArea className="h-[600px]">
                  <div className="space-y-2 p-4">
                    {tickets.map((ticket) => (
                      <Card
                        key={ticket.id}
                        className={`cursor-pointer transition-colors hover:bg-muted/50 ${
                          selectedTicket?.id === ticket.id ? 'border-primary' : ''
                        }`}
                        onClick={() => handleTicketClick(ticket)}
                      >
                        <CardContent className="p-4 space-y-3">
                          <div className="flex items-start justify-between gap-2">
                            <div className="space-y-1 flex-1 min-w-0">
                              <p className="font-medium line-clamp-1">{ticket.subject}</p>
                              {ticket.unreadMessagesCount > 0 && (
                                <Badge variant="destructive" className="text-xs">
                                  {ticket.unreadMessagesCount} پیام جدید
                                </Badge>
                              )}
                            </div>
                            <Badge className={getStatusColor(ticket.status)} variant="outline">
                              {getStatusLabel(ticket.status)}
                            </Badge>
                          </div>
                          <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              <span>
                                {new Date(ticket.createdAt).toLocaleDateString('fa-IR', {
                                  month: 'short',
                                  day: 'numeric',
                                })}
                              </span>
                            </div>
                            <Badge className={getPriorityColor(ticket.priority)} variant="outline">
                              {getPriorityLabel(ticket.priority)}
                            </Badge>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </ScrollArea>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Ticket Detail */}
        <div className="lg:col-span-2">
          {selectedTicket ? (
            <Card className="h-[680px] flex flex-col">
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-2 flex-1">
                    <CardTitle>{selectedTicket.subject}</CardTitle>
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge className={getStatusColor(selectedTicket.status)} variant="outline">
                        {getStatusLabel(selectedTicket.status)}
                      </Badge>
                      <Badge className={getPriorityColor(selectedTicket.priority)} variant="outline">
                        اولویت: {getPriorityLabel(selectedTicket.priority)}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {new Date(selectedTicket.createdAt).toLocaleDateString('fa-IR')}
                      </span>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setSelectedTicket(null)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>

              <Separator />

              <CardContent className="flex-1 flex flex-col p-0">
                <ScrollArea className="flex-1 p-6">
                  <div className="space-y-4">
                    {selectedTicket.messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.isAdminMessage ? 'justify-start' : 'justify-end'}`}
                      >
                        <div
                          className={`max-w-[80%] rounded-lg p-4 space-y-2 ${
                            message.isAdminMessage
                              ? 'bg-muted'
                              : 'bg-primary text-primary-foreground'
                          }`}
                        >
                          <div className="flex items-center justify-between gap-4">
                            <span className="text-xs opacity-80">{message.senderName}</span>
                            <span className="text-xs opacity-60">
                              {new Date(message.createdAt).toLocaleTimeString('fa-IR', {
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </span>
                          </div>
                          <p className="text-sm whitespace-pre-wrap">{message.message}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>

                <Separator />

                <div className="p-4">
                  <div className="flex gap-2">
                    <Textarea
                      placeholder="پیام خود را بنویسید..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }}
                      className="min-h-[80px] resize-none"
                    />
                    <Button
                      onClick={handleSendMessage}
                      disabled={!newMessage.trim() || isSendingMessage}
                      className="gap-2"
                    >
                      {isSendingMessage ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Send className="h-4 w-4" />
                      )}
                      ارسال
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="h-[680px] flex items-center justify-center">
              <div className="text-center space-y-4">
                <MessageSquare className="h-16 w-16 text-muted-foreground mx-auto" />
                <div>
                  <p className="text-lg mb-2">تیکتی انتخاب نشده</p>
                  <p className="text-sm text-muted-foreground">
                    برای مشاهده جزئیات، یک تیکت را انتخاب کنید
                  </p>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>

      {/* Create Ticket Dialog */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent className="sm:max-w-[500px]" dir="rtl">
          <DialogHeader>
            <DialogTitle>تیکت جدید</DialogTitle>
            <DialogDescription>درخواست پشتیبانی خود را ثبت کنید</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="subject">عنوان</Label>
              <Input
                id="subject"
                placeholder="موضوع درخواست خود را وارد کنید"
                value={newTicketSubject}
                onChange={(e) => setNewTicketSubject(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="priority">اولویت</Label>
              <Select
                value={newTicketPriority}
                onValueChange={(value) => setNewTicketPriority(value as TicketPriority)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={TicketPriority.LOW}>کم</SelectItem>
                  <SelectItem value={TicketPriority.MEDIUM}>متوسط</SelectItem>
                  <SelectItem value={TicketPriority.HIGH}>بالا</SelectItem>
                  <SelectItem value={TicketPriority.URGENT}>فوری</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">پیام</Label>
              <Textarea
                id="message"
                placeholder="توضیحات خود را وارد کنید"
                value={newTicketMessage}
                onChange={(e) => setNewTicketMessage(e.target.value)}
                className="min-h-[120px] resize-none"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>
              لغو
            </Button>
            <Button onClick={handleCreateTicket} disabled={isCreatingTicket}>
              {isCreatingTicket ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin ml-2" />
                  در حال ثبت...
                </>
              ) : (
                'ثبت تیکت'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};