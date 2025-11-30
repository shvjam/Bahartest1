import { ReactNode } from 'react';
import { LucideIcon } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  children?: ReactNode;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
  children,
}: EmptyStateProps) {
  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center py-16 px-4">
        {Icon && (
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
            <Icon className="w-8 h-8 text-muted-foreground" />
          </div>
        )}
        <h3 className="text-lg mb-2">{title}</h3>
        {description && (
          <p className="text-muted-foreground text-center max-w-md mb-6">{description}</p>
        )}
        {actionLabel && onAction && (
          <Button onClick={onAction}>{actionLabel}</Button>
        )}
        {children}
      </CardContent>
    </Card>
  );
}
