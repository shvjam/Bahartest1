/**
 * useDrivers Hook - به‌روز شده با useApiCall
 * جلوگیری از infinite loop
 */

import { useCallback } from 'react';
import { driverService } from '../../services/api/driver.service.real';
import { toast } from 'sonner';
import { usePaginatedApiCall } from './useApiCall';
import type { DriverResponse } from '../../types/backend.types';

interface UseDriversOptions {
  initialPage?: number;
  initialPageSize?: number;
  searchTerm?: string;
  autoFetch?: boolean;
}

export const useDrivers = (options: UseDriversOptions = {}) => {
  const {
    initialPage = 1,
    initialPageSize = 20,
    searchTerm = '',
    autoFetch = true,
  } = options;

  const {
    data: drivers,
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
      driverService.getAllDrivers({
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

  const verifyDriver = useCallback(
    async (driverId: string) => {
      try {
        await driverService.verifyDriver(driverId);
        toast.success('راننده با موفقیت تایید شد');
        await refetch();
      } catch (err: any) {
        toast.error(err.message || 'خطا در تایید راننده');
        throw err;
      }
    },
    [refetch]
  );

  return {
    drivers: drivers || [],
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
    verifyDriver,
    fetchDrivers: refetch, // برای سازگاری با کد قدیمی
    refreshDrivers: refetch, // برای سازگاری با کد قدیمی
  };
};
