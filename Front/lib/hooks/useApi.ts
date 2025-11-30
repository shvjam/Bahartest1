import { useState, useCallback } from 'react';
import { toast } from 'sonner';

interface UseApiOptions {
  showSuccessToast?: boolean;
  showErrorToast?: boolean;
  successMessage?: string;
  errorMessage?: string;
}

export function useApi<T, P extends any[] = []>(
  apiFunction: (...args: P) => Promise<T>,
  options: UseApiOptions = {}
) {
  const {
    showSuccessToast = false,
    showErrorToast = true,
    successMessage,
    errorMessage,
  } = options;

  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const execute = useCallback(
    async (...args: P): Promise<T | null> => {
      setLoading(true);
      setError(null);

      try {
        const result = await apiFunction(...args);
        setData(result);

        if (showSuccessToast) {
          toast.success(successMessage || 'عملیات با موفقیت انجام شد');
        }

        return result;
      } catch (err: any) {
        const error = err as Error;
        setError(error);

        if (showErrorToast) {
          const message =
            errorMessage ||
            err.response?.data?.message ||
            err.message ||
            'خطایی رخ داد';
          toast.error(message);
        }

        return null;
      } finally {
        setLoading(false);
      }
    },
    [apiFunction, showSuccessToast, showErrorToast, successMessage, errorMessage]
  );

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
  }, []);

  return { data, loading, error, execute, reset };
}

export function useApiMutation<T, D = any>(
  apiFunction: (data: D) => Promise<T>,
  options: UseApiOptions = {}
) {
  return useApi<T, [D]>(apiFunction, {
    showSuccessToast: true,
    ...options,
  });
}
