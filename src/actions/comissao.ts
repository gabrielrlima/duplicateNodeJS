import type { SWRConfiguration } from 'swr';
import type { IComissaoItem } from 'src/types/comissao';

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

type ComissoesData = {
  success: boolean;
  message: string;
  data: {
    data: IComissaoItem[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
      hasNext: boolean;
      hasPrev: boolean;
    };
  };
  timestamp: string;
};

export function useGetComissoes(realEstateId: string) {
  const queryParams = new URLSearchParams();
  
  queryParams.append('real_estate_id', realEstateId);

  const url = realEstateId ? `${endpoints.comissao.list}?${queryParams.toString()}` : null;

  const { data, isLoading, error, isValidating, mutate } = useSWR<ComissoesData>(
    url,
    fetcher,
    swrOptions
  );

  const memoizedValue = useMemo(
    () => ({
      comissoes: data?.data?.data || [],
      pagination: data?.data?.pagination || {
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0,
        hasNext: false,
        hasPrev: false,
      },
      comissoesLoading: isLoading,
      comissoesError: error,
      comissoesValidating: isValidating,
      comissoesEmpty: !isLoading && !isValidating && !data?.data?.data?.length,
      comissoesMutate: mutate,
    }),
    [data, error, isLoading, isValidating, mutate]
  );

  return memoizedValue;
}

// ----------------------------------------------------------------------

type ComissaoData = {
  success: boolean;
  message: string;
  data: IComissaoItem;
  timestamp: string;
};

export function useGetComissao(comissaoId: string) {
  const url = comissaoId ? `${endpoints.comissao.details}/${comissaoId}` : null;

  const { data, isLoading, error, isValidating } = useSWR<ComissaoData>(
    url,
    fetcher,
    swrOptions
  );

  const memoizedValue = useMemo(
    () => ({
      comissao: data?.data || null,
      comissaoLoading: isLoading,
      comissaoError: error,
      comissaoValidating: isValidating,
    }),
    [data?.data, error, isLoading, isValidating]
  );

  return memoizedValue;
}

// ----------------------------------------------------------------------

type ComissoesTotaisData = {
  success: boolean;
  message: string;
  data: Array<{
    id: string;
    nome: string;
    tipoProduto: string;
    percentualTotal: number;
  }>;
  timestamp: string;
};

export function useGetComissoesTotais(realEstateId: string) {
  const url = realEstateId ? `${endpoints.comissao.totais}?real_estate_id=${realEstateId}` : null;

  const { data, isLoading, error, isValidating } = useSWR<ComissoesTotaisData>(
    url,
    fetcher,
    swrOptions
  );

  const memoizedValue = useMemo(
    () => ({
      comissoesTotais: data?.data || [],
      comissoesTotaisLoading: isLoading,
      comissoesTotaisError: error,
      comissoesTotaisValidating: isValidating,
      comissoesTotaisEmpty: !isLoading && !isValidating && !data?.data?.length,
    }),
    [data?.data, error, isLoading, isValidating]
  );

  return memoizedValue;
}

// ----------------------------------------------------------------------

type SearchComissoesData = {
  success: boolean;
  message: string;
  data: {
    data: IComissaoItem[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
      hasNext: boolean;
      hasPrev: boolean;
    };
  };
  timestamp: string;
};

export function useSearchComissoes(realEstateId: string, searchQuery: string) {
  const queryParams = new URLSearchParams();
  
  queryParams.append('real_estate_id', realEstateId);
  queryParams.append('search', searchQuery);

  const url = realEstateId && searchQuery ? `${endpoints.comissao.search}?${queryParams.toString()}` : null;

  const { data, isLoading, error, isValidating } = useSWR<SearchComissoesData>(
    url,
    fetcher,
    swrOptions
  );

  const memoizedValue = useMemo(
    () => ({
      searchResults: data?.data?.data || [],
      searchPagination: data?.data?.pagination || {
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0,
        hasNext: false,
        hasPrev: false,
      },
      searchLoading: isLoading,
      searchError: error,
      searchValidating: isValidating,
      searchEmpty: !isLoading && !isValidating && !data?.data?.data?.length,
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}