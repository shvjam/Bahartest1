/**
 * useOrders Hook - به‌روز شده با useApiCall
 * جلوگیری از infinite loop
 */

import { useCallback, useMemo } from 'react';
import { orderService } from '../../services/api/order.service.real';
import { toast } from 'sonner';
import { usePaginatedApiCall } from './useApiCall';
import type { OrderListItemResponse, PaginationParams } from '../../types/backend.types';

interface UseOrdersOptions {
  initialPage?: number;
  initialPageSize?: number;
  searchTerm?: string;
  autoFetch?: boolean;
}

export const useOrders = (options: UseOrdersOptions = {}) => {
  const {
    initialPage = 1,
    initialPageSize = 20,
    searchTerm = '',
    autoFetch = true,
  } = options;

  // استفاده از usePaginatedApiCall برای جلوگیری از infinite loop
  const {
    data: orders,
    isLoading,
    error,
    page,
    pageSize,
    totalPages,
    totalCount,
    hasNextPage,
    hasPreviousPage,
    goToPage,
    nextPage,
    previousPage,
    refetch,
  } = usePaginatedApiCall(
    (pageNumber, pageSizeParam) =>
      orderService.getMyOrders({
        pageNumber,
        pageSize: pageSizeParam,
        searchTerm,
        sortBy: 'createdAt',
        sortDescending: true,
      }),
    {
      initialPage,
      initialPageSize,
      showErrorToast: true,
    }
  );

  // Actions
  const updateOrderStatus = useCallback(
    async (orderId: string, status: string) => {
      try {
        await orderService.updateOrderStatus(orderId, status);
        toast.success('وضعیت سفارش با موفقیت تغییر کرد');
        await refetch();
      } catch (err: any) {
        toast.error(err.message || 'خطا در تغییر وضعیت');
        throw err;
      }
    },
    [refetch]
  );

  const assignDriver = useCallback(
    async (orderId: string, driverId: string, note?: string) => {
      try {
        await orderService.assignDriver(orderId, driverId, note);
        toast.success('راننده با موفقیت اختصاص داده شد');
        await refetch();
      } catch (err: any) {
        toast.error(err.message || 'خطا در اختصاص راننده');
        throw err;
      }
    },
    [refetch]
  );

  const cancelOrder = useCallback(
    async (orderId: string, reason: string) => {
      try {
        await orderService.cancelOrder(orderId, reason);
        toast.success('سفارش با موفقیت لغو شد');
        await refetch();
      } catch (err: any) {
        toast.error(err.message || 'خطا در لغو سفارش');
        throw err;
      }
    },
    [refetch]
  );

  return {
    orders: orders || [],
    isLoading,
    error: error?.message || null,
    currentPage: page,
    pageSize,
    totalPages,
    totalCount,
    hasNextPage,
    hasPreviousPage,
    goToPage,
    nextPage,
    previousPage,
    refetch,
    updateOrderStatus,
    assignDriver,
    cancelOrder,
  };
};

/**
 * useAllOrders Hook - برای Admin/Driver
 */
export const useAllOrders = (options: UseOrdersOptions = {}) => {
  const {
    initialPage = 1,
    initialPageSize = 20,
    searchTerm = '',
  } = options;

  const {
    data: orders,
    isLoading,
    error,
    page,
    pageSize,
    totalPages,
    totalCount,
    hasNextPage,
    hasPreviousPage,
    goToPage,
    nextPage,
    previousPage,
    refetch,
  } = usePaginatedApiCall(
    (pageNumber, pageSizeParam) =>
      orderService.getAllOrders({
        pageNumber,
        pageSize: pageSizeParam,
        searchTerm,
        sortBy: 'createdAt',
        sortDescending: true,
      }),
    {
      initialPage,
      initialPageSize,
      showErrorToast: true,
    }
  );

  const updateOrderStatus = useCallback(
    async (orderId: string, status: string) => {
      try {
        await orderService.updateOrderStatus(orderId, status);
        toast.success('وضعیت سفارش با موفقیت تغییر کرد');
        await refetch();
      } catch (err: any) {
        toast.error(err.message || 'خطا در تغییر وضعیت');
        throw err;
      }
    },
    [refetch]
  );

  const assignDriver = useCallback(
    async (orderId: string, driverId: string, note?: string) => {
      try {
        await orderService.assignDriver(orderId, driverId, note);
        toast.success('راننده با موفقیت اختصاص داده شد');
        await refetch();
      } catch (err: any) {
        toast.error(err.message || 'خطا در اختصاص راننده');
        throw err;
      }
    },
    [refetch]
  );

  return {
    orders: orders || [],
    isLoading,
    error: error?.message || null,
    currentPage: page,
    pageSize,
    totalPages,
    totalCount,
    hasNextPage,
    hasPreviousPage,
    goToPage,
    nextPage,
    previousPage,
    refetch,
    updateOrderStatus,
    assignDriver,
  };
};
