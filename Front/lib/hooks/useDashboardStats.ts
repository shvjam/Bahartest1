/**
 * useDashboardStats Hook - به‌روز شده با useApiCall
 * جلوگیری از infinite loop
 */

import { useEffect } from 'react';
import { dashboardService } from '../../services/api/dashboard.service.real';
import { useApiCall } from './useApiCall';
import type { DashboardStatsResponse } from '../../types/backend.types';

interface UseDashboardStatsOptions {
  autoFetch?: boolean;
  refreshInterval?: number; // در milliseconds
}

export const useDashboardStats = (options: UseDashboardStatsOptions = {}) => {
  const { autoFetch = true, refreshInterval } = options;

  const {
    data: stats,
    isLoading,
    error,
    refetch,
  } = useApiCall(
    () => dashboardService.getDashboardStats(),
    {
      autoFetch,
      showErrorToast: true,
    }
  );

  // Auto refresh interval
  useEffect(() => {
    if (refreshInterval && refreshInterval > 0) {
      const intervalId = setInterval(() => {
        refetch();
      }, refreshInterval);

      return () => clearInterval(intervalId);
    }
  }, [refreshInterval, refetch]);

  return {
    stats: stats || null,
    isLoading,
    error: error?.message || null,
    fetchStats: refetch,
    refreshStats: refetch,
  };
};
