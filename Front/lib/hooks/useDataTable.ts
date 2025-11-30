import { useState, useMemo } from 'react';

interface UseDataTableProps<T> {
  data: T[];
  initialPageSize?: number;
  searchFields?: (keyof T)[];
}

interface UseDataTableReturn<T> {
  currentData: T[];
  currentPage: number;
  totalPages: number;
  pageSize: number;
  searchQuery: string;
  sortField: keyof T | null;
  sortDirection: 'asc' | 'desc';
  setCurrentPage: (page: number) => void;
  setPageSize: (size: number) => void;
  setSearchQuery: (query: string) => void;
  setSortField: (field: keyof T | null) => void;
  setSortDirection: (direction: 'asc' | 'desc') => void;
  handleSort: (field: keyof T) => void;
  resetFilters: () => void;
}

export function useDataTable<T extends Record<string, any>>({
  data,
  initialPageSize = 10,
  searchFields = [],
}: UseDataTableProps<T>): UseDataTableReturn<T> {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState<keyof T | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // Filter data based on search query
  const filteredData = useMemo(() => {
    if (!searchQuery || searchFields.length === 0) return data;

    return data.filter((item) =>
      searchFields.some((field) => {
        const value = item[field];
        if (value === null || value === undefined) return false;
        return String(value).toLowerCase().includes(searchQuery.toLowerCase());
      })
    );
  }, [data, searchQuery, searchFields]);

  // Sort data
  const sortedData = useMemo(() => {
    if (!sortField) return filteredData;

    return [...filteredData].sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];

      if (aValue === bValue) return 0;

      const comparison = aValue < bValue ? -1 : 1;
      return sortDirection === 'asc' ? comparison : -comparison;
    });
  }, [filteredData, sortField, sortDirection]);

  // Paginate data
  const currentData = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return sortedData.slice(startIndex, endIndex);
  }, [sortedData, currentPage, pageSize]);

  const totalPages = Math.ceil(sortedData.length / pageSize);

  // Handle sort toggle
  const handleSort = (field: keyof T) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Reset all filters
  const resetFilters = () => {
    setSearchQuery('');
    setSortField(null);
    setSortDirection('asc');
    setCurrentPage(1);
  };

  // Reset to page 1 when search or page size changes
  useMemo(() => {
    setCurrentPage(1);
  }, [searchQuery, pageSize]);

  return {
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
    setSortField,
    setSortDirection,
    handleSort,
    resetFilters,
  };
}
