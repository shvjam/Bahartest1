import { ReactNode } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { LucideIcon } from 'lucide-react';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon?: LucideIcon;
  description?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  footer?: ReactNode;
  onClick?: () => void;
}

export function StatsCard({
  title,
  value,
  icon: Icon,
  description,
  trend,
  footer,
  onClick,
}: StatsCardProps) {
  return (
    <Card 
      className={`hover:shadow-lg transition-shadow ${onClick ? 'cursor-pointer' : ''}`}
      onClick={onClick}
    >
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm">{title}</CardTitle>
        {Icon && <Icon className="w-5 h-5 text-muted-foreground" />}
      </CardHeader>
      <CardContent>
        <div className="mb-1">{value}</div>
        {(description || trend) && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            {trend && (
              <div className={`flex items-center gap-1 ${trend.isPositive ? 'text-green-500' : 'text-red-500'}`}>
                {trend.isPositive ? (
                  <TrendingUp className="w-3 h-3" />
                ) : (
                  <TrendingDown className="w-3 h-3" />
                )}
                <span>{Math.abs(trend.value)}%</span>
              </div>
            )}
            {description && <span>{description}</span>}
          </div>
        )}
        {footer && <div className="mt-2">{footer}</div>}
      </CardContent>
    </Card>
  );
}
