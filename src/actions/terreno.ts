import type { SWRConfiguration } from 'swr';
import type { ITerrenoItem } from 'src/types/terreno';

import useSWR, { mutate } from 'swr';
import { useMemo } from 'react';

import { fetcher, endpoints } from 'src/lib/axios';
import axiosInstance from 'src/lib/axios';
import { useRealEstateContext } from 'src/contexts/real-estate-context';

// ----------------------------------------------------------------------

const swrOptions: SWRConfiguration = {
  revalidateIfStale: true,
  revalidateOnFocus: false,
  revalidateOnReconnect: true,
  dedupingInterval: 2000, // Evita requisições duplicadas por 2 segundos
};

// ----------------------------------------------------------------------

type TerrenosData = {
  data: {
    terrenos: ITerrenoItem[];
  };
};

export function useGetTerrenos() {
  const { currentRealEstate } = useRealEstateContext();
  
  const url = currentRealEstate ? `${endpoints.terreno.list}?real_estate_id=${currentRealEstate.id}` : null;

  const { data, isLoading, error, isValidating } = useSWR<TerrenosData>(
    url,
    fetcher,
    swrOptions
  );

  const memoizedValue = useMemo(
    () => ({
      terrenos: data?.data?.terrenos || [],
      terrenosLoading: isLoading,
      terrenosError: error,
      terrenosValidating: isValidating,
      terrenosEmpty: !isLoading && !isValidating && (!data?.data?.terrenos || data.data.terrenos.length === 0),
    }),
    [data?.data?.terrenos, error, isLoading, isValidating]
  );

  return memoizedValue;
}

// ----------------------------------------------------------------------

export async function updateTerrenoStatus(terrenoId: string, newStatus: string) {
  try {
    const response = await axiosInstance.put(`${endpoints.terreno.update}/${terrenoId}`, {
      status: newStatus
    });

    if (response.data.success) {
      console.log('🔄 updateTerrenoStatus - Sucesso! Iniciando invalidação do cache...');
      console.log('📋 Dados do terreno:', { terrenoId, newStatus });
      
      // Invalidate cache to refresh data - more comprehensive pattern matching
      console.log('🗂️ Invalidando cache com padrões...');
      const invalidatedKeys: string[] = [];
      mutate((key) => {
        if (typeof key === 'string') {
          const shouldInvalidate = key.includes('/api/terreno/list') || 
                 key.includes('/api/terreno/stats') ||
                 key.startsWith('/api/terreno') ||
                 (key.includes('/api/terreno') && key.includes('real_estate_id'));
          if (shouldInvalidate) {
            invalidatedKeys.push(key);
            console.log('🔑 Invalidando chave:', key);
          }
          return shouldInvalidate;
        }
        return false;
      });
      console.log('📊 Total de chaves invalidadas:', invalidatedKeys.length);
      
      // Also invalidate specific terreno details cache
      const detailsKey = `${endpoints.terreno.details}/${terrenoId}`;
      console.log('🔍 Invalidando cache de detalhes:', detailsKey);
      mutate(detailsKey);
      
      // Force revalidation of all SWR caches with explicit revalidation
      console.log('🔄 Forçando revalidação global...');
      mutate(() => true);
      
      // Force revalidation with explicit options
      console.log('🔄 Forçando revalidação com opções específicas...');
      mutate((key) => {
        if (typeof key === 'string') {
          return key.includes('/api/terreno');
        }
        return false;
      }, undefined, { revalidate: true });
      
      console.log('✅ Invalidação do cache concluída!');
      return response.data;
    }
    
    throw new Error(response.data.message || 'Erro ao atualizar status');
  } catch (error) {
    console.error('Erro ao atualizar status do terreno:', error);
    throw error;
  }
}

// ----------------------------------------------------------------------

export async function updateTerreno(terrenoId: string, terrenoData: any) {
  try {
    // Criar FormData para suportar upload de imagens
    const formData = new FormData();

    // Adicionar campos básicos
    formData.append('name', terrenoData.title || '');
    formData.append('title', terrenoData.title || '');
    formData.append('description', terrenoData.description || '');
    formData.append('totalArea', terrenoData.totalArea?.toString() || '0');
    formData.append('value', terrenoData.value?.toString() || '0');
    formData.append('status', terrenoData.status || 'available');
    formData.append('type', terrenoData.type || 'residential');
    formData.append('acceptsFinancing', terrenoData.acceptsFinancing?.toString() || 'false');
    formData.append('topography', terrenoData.topography || '');
    formData.append('dimensoes', terrenoData.dimensions || '');
    formData.append('accessType', terrenoData.accessType || '');
    formData.append('hasDocumentation', terrenoData.hasDocumentation ? 'true' : 'false');
    formData.append('realEstateId', terrenoData.realEstateId || '');

    // Adicionar endereço
    if (terrenoData.address) {
      formData.append('address[street]', terrenoData.address.street || '');
      formData.append('address[number]', terrenoData.address.number || 'S/N');
      formData.append('address[neighborhood]', terrenoData.address.neighborhood || '');
      formData.append('address[city]', terrenoData.address.city || '');
      formData.append('address[state]', terrenoData.address.state || '');
      formData.append('address[zipCode]', terrenoData.address.zipCode || '');
    }

    // Adicionar proprietário
    if (terrenoData.owner) {
      formData.append('owner[name]', terrenoData.owner.name || '');
      formData.append('owner[email]', terrenoData.owner.email || '');
      formData.append('owner[phone]', terrenoData.owner.phone || '');
      formData.append('owner[document]', terrenoData.owner.document || '');
    }

    // Adicionar imagens (apenas novas imagens)
    if (terrenoData.imagens && terrenoData.imagens.length > 0) {
      terrenoData.imagens.forEach((image: File, index: number) => {
        if (image instanceof File) {
          formData.append(`images[${index}]`, image);
        }
      });
    }

    const response = await axiosInstance.put(`${endpoints.terreno.update}/${terrenoId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    if (response.data.success) {
      console.log('🔄 updateTerreno - Sucesso! Iniciando invalidação do cache...');
      console.log('📋 Dados do terreno:', { terrenoId, realEstateId: terrenoData.realEstateId });
      
      // Invalidate cache to refresh data - more comprehensive pattern matching
      console.log('🗂️ Invalidando cache com padrões...');
      const invalidatedKeys: string[] = [];
      mutate((key) => {
        if (typeof key === 'string') {
          const shouldInvalidate = key.includes('/api/terreno/list') || 
                 key.includes('/api/terreno/stats') ||
                 key.startsWith('/api/terreno') ||
                 (key.includes('/api/terreno') && key.includes('real_estate_id'));
          if (shouldInvalidate) {
            invalidatedKeys.push(key);
            console.log('🔑 Invalidando chave:', key);
          }
          return shouldInvalidate;
        }
        return false;
      });
      console.log('📊 Total de chaves invalidadas:', invalidatedKeys.length);
      
      // Also invalidate specific terreno details cache
      const detailsKey = `${endpoints.terreno.details}/${terrenoId}`;
      console.log('🔍 Invalidando cache de detalhes:', detailsKey);
      mutate(detailsKey);
      
      // Invalidate specific list cache with real estate ID if available
      if (terrenoData.realEstateId) {
        const listKey = `${endpoints.terreno.list}?real_estate_id=${terrenoData.realEstateId}`;
        const statsKey = `${endpoints.terreno.stats}?real_estate_id=${terrenoData.realEstateId}`;
        console.log('📋 Invalidando cache específico da listagem:', listKey);
        console.log('📊 Invalidando cache específico de stats:', statsKey);
        mutate(listKey);
        mutate(statsKey);
      }
      
      // Force revalidation of all SWR caches with explicit revalidation
      console.log('🔄 Forçando revalidação global...');
      mutate(() => true);
      
      // Force revalidation with explicit options
      console.log('🔄 Forçando revalidação com opções específicas...');
      mutate((key) => {
        if (typeof key === 'string') {
          return key.includes('/api/terreno');
        }
        return false;
      }, undefined, { revalidate: true });
      
      // Also force revalidate the specific list URL
      if (terrenoData.realEstateId) {
        const listKey = `${endpoints.terreno.list}?real_estate_id=${terrenoData.realEstateId}`;
        console.log('🔄 Forçando revalidação específica da listagem:', listKey);
        mutate(listKey, undefined, { revalidate: true });
      }
      
      console.log('✅ Invalidação do cache concluída!');
      return response.data;
    }
    
    throw new Error(response.data.message || 'Erro ao atualizar terreno');
  } catch (error) {
    console.error('Erro ao atualizar terreno:', error);
    throw error;
  }
}

// ----------------------------------------------------------------------

export async function createTerreno(terrenoData: any) {
  try {
    console.log('🔄 createTerreno - Dados recebidos:', terrenoData);
    
    // Criar FormData para suportar upload de imagens
    const formData = new FormData();

    // Adicionar campos básicos
    formData.append('name', terrenoData.title || '');
    formData.append('title', terrenoData.title || '');
    formData.append('description', terrenoData.description || '');
    formData.append('totalArea', terrenoData.totalArea?.toString() || '0');
    formData.append('value', terrenoData.value?.toString() || '0');
    formData.append('status', terrenoData.status || 'available');
    formData.append('type', terrenoData.type || 'residential');
    formData.append('acceptsFinancing', terrenoData.acceptsFinancing?.toString() || 'false');
    formData.append('topography', terrenoData.topography || '');
    formData.append('dimensoes', terrenoData.dimensions || '');
    formData.append('accessType', terrenoData.accessType || '');
    formData.append('hasDocumentation', terrenoData.hasDocumentation ? 'true' : 'false');
    formData.append('realEstateId', terrenoData.realEstateId || '');
    
    console.log('📤 createTerreno - FormData construído:', {
      name: terrenoData.title,
      title: terrenoData.title,
      totalArea: terrenoData.totalArea,
      value: terrenoData.value,
      status: terrenoData.status,
      type: terrenoData.type,
      realEstateId: terrenoData.realEstateId
    });

    // Adicionar endereço
    if (terrenoData.address) {
      formData.append('address[street]', terrenoData.address.street || '');
      formData.append('address[number]', terrenoData.address.number || 'S/N');
      formData.append('address[neighborhood]', terrenoData.address.neighborhood || '');
      formData.append('address[city]', terrenoData.address.city || '');
      formData.append('address[state]', terrenoData.address.state || '');
      formData.append('address[zipCode]', terrenoData.address.zipCode || '');
    }

    // Adicionar proprietário
    if (terrenoData.owner) {
      formData.append('owner[name]', terrenoData.owner.name || '');
      formData.append('owner[email]', terrenoData.owner.email || '');
      formData.append('owner[phone]', terrenoData.owner.phone || '');
      formData.append('owner[document]', terrenoData.owner.document || '');
    }

    // Adicionar imagens
    if (terrenoData.imagens && terrenoData.imagens.length > 0) {
      terrenoData.imagens.forEach((image: File, index: number) => {
        if (image instanceof File) {
          formData.append(`images[${index}]`, image);
        }
      });
    }

    const response = await axiosInstance.post(endpoints.terreno.create, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    if (response.data.success) {
      // Invalidate cache to refresh data - more comprehensive pattern matching
      mutate((key) => {
        if (typeof key === 'string') {
          return key.includes('/api/terreno/list') || 
                 key.includes('/api/terreno/stats') ||
                 key.startsWith('/api/terreno') ||
                 (key.includes('/api/terreno') && key.includes('real_estate_id'));
        }
        return false;
      });
        
        // Invalidate specific list cache with real estate ID if available
        if (terrenoData.realEstateId) {
          mutate(`${endpoints.terreno.list}?real_estate_id=${terrenoData.realEstateId}`);
          mutate(`${endpoints.terreno.stats}?real_estate_id=${terrenoData.realEstateId}`);
        }
        
        // Force revalidation of all SWR caches
        mutate(() => true);
      return response.data;
    }
    
    throw new Error(response.data.message || 'Erro ao criar terreno');
  } catch (error) {
    console.error('Erro ao criar terreno:', error);
    throw error;
  }
}

// ----------------------------------------------------------------------

type TerrenoData = {
  terreno: ITerrenoItem;
};

export function useGetTerreno(terrenoId: string) {
  const { currentRealEstate } = useRealEstateContext();
  
  const url = terrenoId && currentRealEstate 
    ? `${endpoints.terreno.details}/${terrenoId}?real_estate_id=${currentRealEstate.id}` 
    : null;

  const { data, isLoading, error, isValidating } = useSWR<TerrenoData>(
    url,
    fetcher,
    swrOptions
  );

  const memoizedValue = useMemo(
    () => ({
      terreno: data?.terreno,
      terrenoLoading: isLoading,
      terrenoError: error,
      terrenoValidating: isValidating,
    }),
    [data?.terreno, error, isLoading, isValidating]
  );

  return memoizedValue;
}

// ----------------------------------------------------------------------

type SearchTerrenosData = {
  results: ITerrenoItem[];
};

export function useSearchTerrenos(searchParams: {
  type?: string;
  status?: string;
  minPrice?: number;
  maxPrice?: number;
  minArea?: number;
  maxArea?: number;
  topography?: string;
  soilType?: string;
  vegetation?: string;
  zoning?: string;
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
    ? `${endpoints.terreno.search}?${queryParams.toString()}`
    : null;

  const { data, isLoading, error, isValidating } = useSWR<SearchTerrenosData>(url, fetcher, {
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

type TerrenoStats = {
  totalTerrenos: number;
  availableTerrenos: number;
  soldTerrenos: number;
  reservedTerrenos: number;
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
};

export function useGetTerrenoStats() {
  const { currentRealEstate } = useRealEstateContext();
  
  const url = currentRealEstate ? `${endpoints.terreno.stats}?real_estate_id=${currentRealEstate.id}` : null;

  const { data, isLoading, error, isValidating } = useSWR<TerrenoStats>(
    url,
    fetcher,
    swrOptions
  );

  const memoizedValue = useMemo(
    () => ({
      terrenoStats: data || {
        totalTerrenos: 0,
        availableTerrenos: 0,
        soldTerrenos: 0,
        reservedTerrenos: 0,
        averagePrice: 0,
        priceRange: { min: 0, max: 0 },
        averageArea: 0,
        areaRange: { min: 0, max: 0 },
      },
      terrenoStatsLoading: isLoading,
      terrenoStatsError: error,
      terrenoStatsValidating: isValidating,
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}

// ----------------------------------------------------------------------

type TerrenoFiltersData = {
  types: string[];
  statuses: string[];
  topographies: string[];
  soilTypes: string[];
  vegetations: string[];
  zonings: string[];
  locations: string[];
  priceRanges: { min: number; max: number; label: string }[];
  areaRanges: { min: number; max: number; label: string }[];
};

export function useGetTerrenoFilters() {
  const { currentRealEstate } = useRealEstateContext();
  
  const url = currentRealEstate ? `${endpoints.terreno.list}?real_estate_id=${currentRealEstate.id}&filters=true` : null;

  const { data, isLoading, error, isValidating } = useSWR<TerrenoFiltersData>(
    url,
    fetcher,
    swrOptions
  );

  const memoizedValue = useMemo(
    () => ({
      filters: data || {
        types: [],
        statuses: [],
        topographies: [],
        soilTypes: [],
        vegetations: [],
        zonings: [],
        locations: [],
        priceRanges: [],
        areaRanges: [],
      },
      filtersLoading: isLoading,
      filtersError: error,
      filtersValidating: isValidating,
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}