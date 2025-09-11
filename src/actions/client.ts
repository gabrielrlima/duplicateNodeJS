import type { SWRConfiguration } from 'swr';
import type { IClientItem } from 'src/types/client';

import useSWR from 'swr';
import { useMemo } from 'react';

import { fetcher, endpoints } from 'src/lib/axios';

// ----------------------------------------------------------------------

const swrOptions: SWRConfiguration = {
  revalidateIfStale: false,
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
};

// ----------------------------------------------------------------------

type ClientsData = {
  clients: IClientItem[];
};

export function useGetClients() {
  const url = endpoints.client.list;

  const { data, isLoading, error, isValidating } = useSWR<ClientsData>(url, fetcher, swrOptions);

  const memoizedValue = useMemo(
    () => ({
      clients: data?.clients || [],
      clientsLoading: isLoading,
      clientsError: error,
      clientsValidating: isValidating,
      clientsEmpty: !isLoading && !isValidating && !data?.clients.length,
    }),
    [data?.clients, error, isLoading, isValidating]
  );

  return memoizedValue;
}

// ----------------------------------------------------------------------

type ClientData = {
  client: IClientItem;
};

export function useGetClient(clientId: string) {
  const url = clientId ? [endpoints.client.details, { params: { clientId } }] : '';

  const { data, isLoading, error, isValidating } = useSWR<ClientData>(url, fetcher, swrOptions);

  const memoizedValue = useMemo(
    () => ({
      client: data?.client,
      clientLoading: isLoading,
      clientError: error,
      clientValidating: isValidating,
    }),
    [data?.client, error, isLoading, isValidating]
  );

  return memoizedValue;
}

// ----------------------------------------------------------------------

type SearchResultsData = {
  results: IClientItem[];
};

export function useSearchClients(query: string) {
  const url = query ? [endpoints.client.search, { params: { query } }] : '';

  const { data, isLoading, error, isValidating } = useSWR<SearchResultsData>(url, fetcher, {
    ...swrOptions,
    keepPreviousData: true,
  });

  const memoizedValue = useMemo(
    () => ({
      searchResults: data?.results || [],
      searchLoading: isLoading,
      searchError: error,
      searchValidating: isValidating,
      searchEmpty: !isLoading && !isValidating && !data?.results.length,
    }),
    [data?.results, error, isLoading, isValidating]
  );

  return memoizedValue;
}
