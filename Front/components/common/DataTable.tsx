import { ReactNode } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Card, CardContent } from '../ui/card';
import { ArrowUpDown, ChevronLeft, ChevronRight, Search, X } from 'lucide-react';
import { useDataTable } from '../../lib/hooks/useDataTable';

export interface Column<T> {
  key: keyof T | 'actions';
  label: string;
  sortable?: boolean;
  render?: (item: T) => ReactNode;
  className?: string;
}

interface DataTableProps<T extends Record<string, any>> {
  data: T[];
  columns: Column<T>[];
  searchPlaceholder?: string;
  searchFields?: (keyof T)[];
  emptyMessage?: string;
  onRowClick?: (item: T) => void;
}

export function DataTable<T extends Record<string, any>>({
  data,
  columns,
  searchPlaceholder = 'جستجو...',
  searchFields = [],
  emptyMessage = 'داده‌ای یافت نشد',
  onRowClick,
}: DataTableProps<T>) {
  const {
    currentData,
    currentPage,
    totalPages,
    pageSize,
    searchQuery,
    sortField,
    sortDirection,
    setCurrentPage,
    setPageSize,
    setSearchQuery,
    handleSort,
    resetFilters,
  } = useDataTable({
    data,
    searchFields,
  });

  return (
    <div className="space-y-4">
      {/* Filters Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full sm:w-96">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder={searchPlaceholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pr-10"
          />
          {searchQuery && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-1 top-1/2 -translate-y-1/2 h-7 w-7"
              onClick={() => setSearchQuery('')}
            >
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>

        {/* Page Size Selector */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">نمایش:</span>
          <Select value={String(pageSize)} onValueChange={(v) => setPageSize(Number(v))}>
            <SelectTrigger className="w-20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">5</SelectItem>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
              <SelectItem value="50">50</SelectItem>
              <SelectItem value="100">100</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  {columns.map((column) => (
                    <TableHead
                      key={String(column.key)}
                      className={`${column.className || ''} ${
                        column.sortable ? 'cursor-pointer select-none' : ''
                      }`}
                      onClick={() => column.sortable && column.key !== 'actions' && handleSort(column.key as keyof T)}
                    >
                      <div className="flex items-center gap-2">
                        <span>{column.label}</span>
                        {column.sortable && column.key !== 'actions' && (
                          <ArrowUpDown
                            className={`w-4 h-4 ${
                              sortField === column.key
                                ? 'text-primary'
                                : 'text-muted-foreground'
                            }`}
                          />
                        )}
                      </div>
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentData.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={columns.length} className="h-32 text-center text-muted-foreground">
                      {emptyMessage}
                    </TableCell>
                  </TableRow>
                ) : (
                  currentData.map((item, index) => (
                    <TableRow
                      key={index}
                      onClick={() => onRowClick && onRowClick(item)}
                      className={onRowClick ? 'cursor-pointer hover:bg-muted/50' : ''}
                    >
                      {columns.map((column) => (
                        <TableCell key={String(column.key)} className={column.className}>
                          {column.render
                            ? column.render(item)
                            : column.key !== 'actions'
                            ? String(item[column.key] ?? '-')
                            : null}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-sm text-muted-foreground">
            صفحه {currentPage} از {totalPages} ({data.length} مورد)
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
            >
              <ChevronRight className="w-4 h-4" />
              قبلی
            </Button>

            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNumber: number;
                
                if (totalPages <= 5) {
                  pageNumber = i + 1;
                } else if (currentPage <= 3) {
                  pageNumber = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNumber = totalPages - 4 + i;
                } else {
                  pageNumber = currentPage - 2 + i;
                }

                return (
                  <Button
                    key={pageNumber}
                    variant={currentPage === pageNumber ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setCurrentPage(pageNumber)}
                    className="w-9"
                  >
                    {pageNumber}
                  </Button>
                );
              })}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
            >
              بعدی
              <ChevronLeft className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
