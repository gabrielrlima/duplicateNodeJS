import type { SWRConfiguration } from 'swr';
import type { IEmpreendimentoItem } from 'src/types/empreendimento';

import useSWR from 'swr';
import { useMemo } from 'react';

import { fetcher, endpoints } from 'src/lib/axios';
import { useRealEstateContext } from 'src/contexts/real-estate-context';

// ----------------------------------------------------------------------

const swrOptions: SWRConfiguration = {
  revalidateIfStale: false,
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
};

// ----------------------------------------------------------------------

type EmpreendimentosData = {
  empreendimentos: IEmpreendimentoItem[];
};

export function useGetEmpreendimentos() {
  const { currentRealEstate } = useRealEstateContext();
  
  const url = currentRealEstate ? `${endpoints.empreendimento.list}?real_estate_id=${currentRealEstate.id}` : null;

  const { data, isLoading, error, isValidating } = useSWR<EmpreendimentosData>(
    url,
    fetcher,
    swrOptions
  );

  const memoizedValue = useMemo(
    () => ({
      empreendimentos: data?.empreendimentos || [],
      empreendimentosLoading: isLoading,
      empreendimentosError: error,
      empreendimentosValidating: isValidating,
      empreendimentosEmpty: !isLoading && !isValidating && (!data?.empreendimentos || data.empreendimentos.length === 0),
    }),
    [data?.empreendimentos, error, isLoading, isValidating]
  );

  return memoizedValue;
}

// ----------------------------------------------------------------------

type EmpreendimentoData = {
  empreendimento: IEmpreendimentoItem;
};

export function useGetEmpreendimento(empreendimentoId: string) {
  const { currentRealEstate } = useRealEstateContext();
  
  const url = empreendimentoId && currentRealEstate 
    ? `${endpoints.empreendimento.details}/${empreendimentoId}?real_estate_id=${currentRealEstate.id}` 
    : null;

  const { data, isLoading, error, isValidating } = useSWR<EmpreendimentoData>(
    url,
    fetcher,
    swrOptions
  );

  const memoizedValue = useMemo(
    () => ({
      empreendimento: data?.empreendimento,
      empreendimentoLoading: isLoading,
      empreendimentoError: error,
      empreendimentoValidating: isValidating,
    }),
    [data?.empreendimento, error, isLoading, isValidating]
  );

  return memoizedValue;
}

// ----------------------------------------------------------------------

type SearchEmpreendimentosData = {
  results: IEmpreendimentoItem[];
};

export function useSearchEmpreendimentos(searchParams: {
  type?: string;
  status?: string;
  minPrice?: number;
  maxPrice?: number;
  minArea?: number;
  maxArea?: number;
  minUnits?: number;
  maxUnits?: number;
  minFloors?: number;
  maxFloors?: number;
  city?: string;
  state?: string;
  neighborhood?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: string;
}) {
  const { currentRealEstate } = useRealEstateContext();
  
  const queryParams = new URLSearchParams();
  
  if (currentRealEstate) {
    queryParams.append('real_estate_id', currentRealEstate.id);
  }
  
  Object.entries(searchParams).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      queryParams.append(key, value.toString());
    }
  });
  
  const url = currentRealEstate && Object.keys(searchParams).length > 0
    ? `${endpoints.empreendimento.search}?${queryParams.toString()}`
    : null;

  const { data, isLoading, error, isValidating } = useSWR<SearchEmpreendimentosData>(url, fetcher, {
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

// ----------------------------------------------------------------------

type EmpreendimentoStats = {
  totalEmpreendimentos: number;
  availableEmpreendimentos: number;
  soldEmpreendimentos: number;
  reservedEmpreendimentos: number;
  averagePrice: number;
  priceRange: {
    min: number;
    max: number;
  };
  averageArea: number;
  areaRange: {
    min: number;
    max: number;
  };
  averageUnits: number;
  unitsRange: {
    min: number;
    max: number;
  };
  averageFloors: number;
  floorsRange: {
    min: number;
    max: number;
  };
};

export function useGetEmpreendimentoStats() {
  const { currentRealEstate } = useRealEstateContext();
  
  const url = currentRealEstate ? `${endpoints.empreendimento.stats}?real_estate_id=${currentRealEstate.id}` : null;

  const { data, isLoading, error, isValidating } = useSWR<EmpreendimentoStats>(
    url,
    fetcher,
    swrOptions
  );

  const memoizedValue = useMemo(
    () => ({
      empreendimentoStats: data || {
        totalEmpreendimentos: 0,
        availableEmpreendimentos: 0,
        soldEmpreendimentos: 0,
        reservedEmpreendimentos: 0,
        averagePrice: 0,
        priceRange: { min: 0, max: 0 },
        averageArea: 0,
        areaRange: { min: 0, max: 0 },
        averageUnits: 0,
        unitsRange: { min: 0, max: 0 },
        averageFloors: 0,
        floorsRange: { min: 0, max: 0 },
      },
      empreendimentoStatsLoading: isLoading,
      empreendimentoStatsError: error,
      empreendimentoStatsValidating: isValidating,
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}

// ----------------------------------------------------------------------

type EmpreendimentoFiltersData = {
  types: string[];
  statuses: string[];
  locations: string[];
  priceRanges: { min: number; max: number; label: string }[];
  areaRanges: { min: number; max: number; label: string }[];
  unitsRanges: { min: number; max: number; label: string }[];
  floorsRanges: { min: number; max: number; label: string }[];
};

export function useGetEmpreendimentoFilters() {
  const { currentRealEstate } = useRealEstateContext();
  
  const url = currentRealEstate ? `${endpoints.empreendimento.list}?real_estate_id=${currentRealEstate.id}&filters=true` : null;

  const { data, isLoading, error, isValidating } = useSWR<EmpreendimentoFiltersData>(
    url,
    fetcher,
    swrOptions
  );

  const memoizedValue = useMemo(
    () => ({
      filters: data || {
        types: [],
        statuses: [],
        locations: [],
        priceRanges: [],
        areaRanges: [],
        unitsRanges: [],
        floorsRanges: [],
      },
      filtersLoading: isLoading,
      filtersError: error,
      filtersValidating: isValidating,
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}