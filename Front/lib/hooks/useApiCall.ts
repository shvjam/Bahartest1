/**
 * Custom Hook برای API Calls
 * جلوگیری از infinite loops و مدیریت state
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { toast } from 'sonner';

interface UseApiCallOptions<T> {
  autoFetch?: boolean; // خودکار fetch شه یا نه
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
  showErrorToast?: boolean;
  showSuccessToast?: boolean;
  successMessage?: string;
}

interface UseApiCallReturn<T> {
  data: T | null;
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
  reset: () => void;
}

/**
 * Hook برای API Call با مدیریت state و جلوگیری از infinite loop
 */
export function useApiCall<T>(
  apiFunction: () => Promise<T>,
  options: UseApiCallOptions<T> = {}
): UseApiCallReturn<T> {
  const {
    autoFetch = true,
    onSuccess,
    onError,
    showErrorToast = true,
    showSuccessToast = false,
    successMessage,
  } = options;

  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  // استفاده از ref برای جلوگیری از infinite loop
  const isMountedRef = useRef(true);
  const hasFetchedRef = useRef(false);

  const fetchData = useCallback(async () => {
    // جلوگیری از fetch مجدد اگر در حال fetch هستیم
    if (isLoading) return;

    try {
      setIsLoading(true);
      setError(null);

      const result = await apiFunction();

      if (isMountedRef.current) {
        setData(result);
        
        if (showSuccessToast && successMessage) {
          toast.success(successMessage);
        }

        onSuccess?.(result);
      }
    } catch (err: any) {
      if (isMountedRef.current) {
        setError(err);

        if (showErrorToast) {
          toast.error(err.message || 'خطایی رخ داد');
        }

        onError?.(err);
      }
    } finally {
      if (isMountedRef.current) {
        setIsLoading(false);
      }
    }
  }, [apiFunction, onSuccess, onError, showErrorToast, showSuccessToast, successMessage]);

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setIsLoading(false);
    hasFetchedRef.current = false;
  }, []);

  useEffect(() => {
    isMountedRef.current = true;

    // فقط یکبار fetch کن
    if (autoFetch && !hasFetchedRef.current) {
      hasFetchedRef.current = true;
      fetchData();
    }

    return () => {
      isMountedRef.current = false;
    };
  }, [autoFetch]); // فقط وابسته به autoFetch

  return {
    data,
    isLoading,
    error,
    refetch: fetchData,
    reset,
  };
}

/**
 * Hook برای API Call با Pagination
 */
interface UsePaginatedApiCallOptions<T> extends Omit<UseApiCallOptions<T>, 'autoFetch'> {
  initialPage?: number;
  initialPageSize?: number;
}

interface UsePaginatedApiCallReturn<T> extends UseApiCallReturn<T> {
  page: number;
  pageSize: number;
  totalPages: number;
  totalCount: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  goToPage: (page: number) => void;
  nextPage: () => void;
  previousPage: () => void;
}

export function usePaginatedApiCall<T>(
  apiFunction: (page: number, pageSize: number) => Promise<{
    items: T;
    totalPages: number;
    totalCount: number;
    pageNumber: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  }>,
  options: UsePaginatedApiCallOptions<T> = {}
): UsePaginatedApiCallReturn<T> {
  const { initialPage = 1, initialPageSize = 10, ...apiOptions } = options;

  const [page, setPage] = useState(initialPage);
  const [pageSize] = useState(initialPageSize);
  const [totalPages, setTotalPages] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [hasPreviousPage, setHasPreviousPage] = useState(false);

  const fetchDataRef = useRef<() => Promise<void>>();

  const wrappedApiFunction = useCallback(async () => {
    const result = await apiFunction(page, pageSize);
    setTotalPages(result.totalPages);
    setTotalCount(result.totalCount);
    setHasNextPage(result.hasNextPage);
    setHasPreviousPage(result.hasPreviousPage);
    return result.items;
  }, [apiFunction, page, pageSize]);

  const apiCall = useApiCall(wrappedApiFunction, {
    ...apiOptions,
    autoFetch: false, // دستی control می‌کنیم
  });

  fetchDataRef.current = apiCall.refetch;

  useEffect(() => {
    fetchDataRef.current?.();
  }, [page, pageSize]);

  const goToPage = useCallback((newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  }, [totalPages]);

  const nextPage = useCallback(() => {
    if (hasNextPage) {
      setPage((prev) => prev + 1);
    }
  }, [hasNextPage]);

  const previousPage = useCallback(() => {
    if (hasPreviousPage) {
      setPage((prev) => Math.max(1, prev - 1));
    }
  }, [hasPreviousPage]);

  return {
    ...apiCall,
    page,
    pageSize,
    totalPages,
    totalCount,
    hasNextPage,
    hasPreviousPage,
    goToPage,
    nextPage,
    previousPage,
  };
}