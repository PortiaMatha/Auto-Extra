import { useState, useEffect, useCallback, useRef } from 'react';
import { isApiConfigured, ApiError } from '../api/client';

export interface UsePortalDataResult<T> {
  data: T;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function usePortalData<T>(
  fetcher: () => Promise<T>,
  fallback: T,
): UsePortalDataResult<T> {
  const [data, setData]       = useState<T>(fallback);
  const [loading, setLoading] = useState<boolean>(isApiConfigured());
  const [error, setError]     = useState<string | null>(null);

  // Keep a stable ref to the fetcher so the effect doesn't re-run on every render
  const fetcherRef = useRef(fetcher);
  fetcherRef.current = fetcher;

  const load = useCallback(async () => {
    if (!isApiConfigured()) {
      setData(fallback);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const result = await fetcherRef.current();
      setData(result);
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        localStorage.removeItem('ae_auth_token');
        setError('Session expired. Please sign in again.');
      } else {
        setError(err instanceof Error ? err.message : 'Unexpected error');
      }
      // Keep showing the fallback data so the UI remains usable
      setData(fallback);
    } finally {
      setLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => { load(); }, [load]);

  return { data, loading, error, refetch: load };
}
