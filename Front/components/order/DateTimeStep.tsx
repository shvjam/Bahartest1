import { useState } from 'react';
import { Card, CardContent } from '../ui/card';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import { Calendar } from '../ui/calendar';
import { TIME_SLOTS } from '../../constants';
import { Calendar as CalendarIcon, Clock, ArrowRight } from 'lucide-react';
import DatePicker from 'react-multi-date-picker';
import persian from 'react-date-object/calendars/persian';
import persian_fa from 'react-date-object/locales/persian_fa';
import 'react-multi-date-picker/styles/layouts/mobile.css';

interface DateTimeStepProps {
  preferredDateTime?: Date;
  onUpdate: (dateTime: Date) => void;
  onBack?: () => void;
  showBackButton?: boolean;
}

export const DateTimeStep = ({ preferredDateTime, onUpdate, onBack, showBackButton = false }: DateTimeStepProps) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    preferredDateTime || new Date()
  );
  const [selectedTime, setSelectedTime] = useState<string>(
    preferredDateTime
      ? `${preferredDateTime.getHours().toString().padStart(2, '0')}:${preferredDateTime
          .getMinutes()
          .toString()
          .padStart(2, '0')}`
      : '10:00'
  );

  const handleDateSelect = (date: any) => {
    if (!date) return;
    
    // تبدیل تاریخ شمسی به میلادی
    const gregorianDate = date.toDate();
    setSelectedDate(gregorianDate);
    
    if (gregorianDate && selectedTime) {
      const [hours, minutes] = selectedTime.split(':');
      const dateTime = new Date(gregorianDate);
      dateTime.setHours(parseInt(hours), parseInt(minutes));
      onUpdate(dateTime);
    }
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
    if (selectedDate) {
      const [hours, minutes] = time.split(':');
      const dateTime = new Date(selectedDate);
      dateTime.setHours(parseInt(hours), parseInt(minutes));
      onUpdate(dateTime);
    }
  };

  // محاسبه حداقل تاریخ (امروز)
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return (
    <div className="space-y-6 text-right">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <h2 className="mb-2">چه زمانی مناسب شماست؟</h2>
          <p className="text-muted-foreground">تاریخ و ساعت مورد نظر خود را انتخاب کنید</p>
        </div>
        {showBackButton && onBack && (
          <Button variant="ghost" onClick={onBack} className="mr-4">
            <ArrowRight className="w-4 h-4 ml-2" />
            بازگشت
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Calendar */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-4 flex-row-reverse">
              <CalendarIcon className="w-5 h-5 text-primary" />
              <Label>انتخاب تاریخ</Label>
            </div>
            <div className="flex justify-center w-full" dir="ltr">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => {
                  if (date) {
                    setSelectedDate(date);
                    if (selectedTime) {
                      const [hours, minutes] = selectedTime.split(':');
                      const dateTime = new Date(date);
                      dateTime.setHours(parseInt(hours), parseInt(minutes));
                      onUpdate(dateTime);
                    }
                  }
                }}
                disabled={(date) => date < today}
                initialFocus
                className="rounded-md border w-full"
              />
            </div>
          </CardContent>
        </Card>

        {/* Time Slots */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-4 flex-row-reverse">
              <Clock className="w-5 h-5 text-primary" />
              <Label>انتخاب ساعت</Label>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {TIME_SLOTS.map((time) => {
                const hour = parseInt(time.split(':')[0]);
                const isDaytime = hour >= 6 && hour < 18;
                const timeEmoji = isDaytime ? '☀️' : '🌙';
                
                return (
                  <Button
                    key={time}
                    type="button"
                    variant={selectedTime === time ? 'default' : 'outline'}
                    onClick={() => handleTimeSelect(time)}
                    className="h-12"
                  >
                    <span className="ml-2">{timeEmoji}</span>
                    {time}
                  </Button>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {selectedDate && selectedTime && (
        <Card className="bg-accent border-primary">
          <CardContent className="p-4">
            <div className="flex items-center justify-end" dir="rtl">
              <div className="text-right">
                <p className="text-sm text-muted-foreground">زمان انتخاب شده:</p>
                <p className="font-medium mt-1">
                  {new Intl.DateTimeFormat('fa-IR', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  }).format(selectedDate)}{' '}
                  - ساعت {selectedTime}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="p-4 bg-accent rounded-lg">
        <p className="text-sm">
          💡 تیم ما تا ۳۰ دقیقه قبل از زمان انتخابی با شما تماس خواهد گرفت و در صورت
          نیاز، زمان را هماهنگ می‌کند.
        </p>
      </div>
    </div>
  );
};
