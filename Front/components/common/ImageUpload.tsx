import { useState, useRef, ChangeEvent } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { toast } from 'sonner';

interface ImageUploadProps {
  value?: string;
  onChange: (value: string | undefined) => void;
  label?: string;
  description?: string;
  maxSizeMB?: number;
}

export const ImageUpload = ({
  value,
  onChange,
  label = 'تصویر',
  description = 'فایل JPG، PNG یا WEBP با حداکثر حجم 5 مگابایت',
  maxSizeMB = 5,
}: ImageUploadProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = (file: File) => {
    // Check file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      toast.error('فرمت فایل معتبر نیست. لطفاً JPG، PNG یا WEBP انتخاب کنید.');
      return;
    }

    // Check file size
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      toast.error(`حجم فایل نباید بیشتر از ${maxSizeMB} مگابایت باشد.`);
      return;
    }

    // Read file as base64
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      onChange(result);
      toast.success('تصویر با موفقیت بارگذاری شد');
    };
    reader.onerror = () => {
      toast.error('خطا در بارگذاری تصویر');
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleRemove = () => {
    onChange(undefined);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    toast.success('تصویر حذف شد');
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-2">
      {label && <Label>{label}</Label>}

      {value ? (
        // Preview mode
        <div className="relative group">
          <div className="relative overflow-hidden rounded-lg border bg-muted aspect-square max-w-[200px]">
            <img
              src={value}
              alt="پیش‌نمایش"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <Button
                type="button"
                size="sm"
                variant="secondary"
                onClick={handleClick}
              >
                <Upload className="h-4 w-4 ml-2" />
                تغییر
              </Button>
              <Button
                type="button"
                size="sm"
                variant="destructive"
                onClick={handleRemove}
              >
                <X className="h-4 w-4 ml-2" />
                حذف
              </Button>
            </div>
          </div>
        </div>
      ) : (
        // Upload mode
        <div
          className={`
            relative rounded-lg border-2 border-dashed p-6 transition-colors cursor-pointer
            ${isDragging ? 'border-primary bg-primary/5' : 'border-muted-foreground/25 hover:border-primary/50'}
          `}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={handleClick}
        >
          <div className="flex flex-col items-center justify-center text-center space-y-3">
            <div className="rounded-full bg-primary/10 p-3">
              <ImageIcon className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm">
                <span className="text-primary">کلیک کنید</span> یا تصویر را اینجا بکشید
              </p>
              <p className="text-xs text-muted-foreground mt-1">{description}</p>
            </div>
          </div>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp"
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  );
};
