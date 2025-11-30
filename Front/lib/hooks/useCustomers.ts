/**
 * useCustomers Hook - به‌روز شده با useApiCall
 * جلوگیری از infinite loop
 */

import { userService } from '../../services/api/user.service.real';
import { usePaginatedApiCall } from './useApiCall';
import type { UserResponse } from '../../types/backend.types';

interface UseCustomersOptions {
  initialPage?: number;
  initialPageSize?: number;
  searchTerm?: string;
  autoFetch?: boolean;
}

export const useCustomers = (options: UseCustomersOptions = {}) => {
  const {
    initialPage = 1,
    initialPageSize = 20,
    searchTerm = '',
    autoFetch = true,
  } = options;

  const {
    data: customers,
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
      userService.getAllUsers({
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

  return {
    customers: customers || [],
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
    fetchCustomers: refetch, // برای سازگاری با کد قدیمی
    refreshCustomers: refetch, // برای سازگاری با کد قدیمی
  };
};
