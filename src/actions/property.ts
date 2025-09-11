import type { SWRConfiguration } from 'swr';
import type { IPropertyItem } from 'src/types/property';

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

type PropertiesData = {
  data: {
    properties: IPropertyItem[];
  };
};

export function useGetProperties() {
  const { currentRealEstate } = useRealEstateContext();
  
  const url = currentRealEstate ? `${endpoints.property.list}?real_estate_id=${currentRealEstate.id}` : null;

  const { data, isLoading, error, isValidating } = useSWR<PropertiesData>(
    url,
    fetcher,
    swrOptions
  );

  const memoizedValue = useMemo(
    () => ({
      properties: data?.data?.properties || [],
      propertiesLoading: isLoading,
      propertiesError: error,
      propertiesValidating: isValidating,
      propertiesEmpty: !isLoading && !isValidating && (!data?.data?.properties || data.data.properties.length === 0),
    }),
    [data?.data?.properties, error, isLoading, isValidating]
  );

  return memoizedValue;
}

// ----------------------------------------------------------------------

export async function updatePropertyStatus(propertyId: string, newStatus: string) {
  try {
    const response = await axiosInstance.put(`${endpoints.property.update}/${propertyId}`, {
      status: newStatus
    });

    if (response.data.success) {
      console.log('🔄 updatePropertyStatus - Sucesso! Iniciando invalidação do cache...');
      console.log('📋 Dados do imóvel:', { propertyId, newStatus });
      
      // Invalidate cache to refresh data - more comprehensive pattern matching
      console.log('🗂️ Invalidando cache com padrões...');
      const invalidatedKeys: string[] = [];
      mutate((key) => {
        if (typeof key === 'string') {
          const shouldInvalidate = key.includes('/api/property/list') || 
                 key.includes('/api/property/stats') ||
                 key.startsWith('/api/property') ||
                 (key.includes('/api/property') && key.includes('real_estate_id'));
          if (shouldInvalidate) {
            invalidatedKeys.push(key);
            console.log('🔑 Invalidando chave:', key);
          }
          return shouldInvalidate;
        }
        return false;
      });
      console.log('📊 Total de chaves invalidadas:', invalidatedKeys.length);
      
      // Also invalidate specific property details cache
      const detailsKey = `${endpoints.property.details}/${propertyId}`;
      console.log('🔍 Invalidando cache de detalhes:', detailsKey);
      mutate(detailsKey);
      
      // Force revalidation of all SWR caches with explicit revalidation
      console.log('🔄 Forçando revalidação global...');
      mutate(() => true);
      
      // Force revalidation with explicit options
      console.log('🔄 Forçando revalidação com opções específicas...');
      mutate((key) => {
        if (typeof key === 'string') {
          return key.includes('/api/property');
        }
        return false;
      }, undefined, { revalidate: true });
      
      console.log('✅ Invalidação do cache concluída!');
      return response.data;
    }
    
    throw new Error(response.data.message || 'Erro ao atualizar status');
  } catch (error) {
    console.error('Erro ao atualizar status do imóvel:', error);
    throw error;
  }
}

// ----------------------------------------------------------------------

export async function updateProperty(propertyId: string, propertyData: any) {
  try {
    // Criar FormData para suportar upload de imagens
    const formData = new FormData();

    // Adicionar campos básicos
    formData.append('name', propertyData.title || '');
    formData.append('title', propertyData.title || '');
    formData.append('description', propertyData.description || '');
    formData.append('area', propertyData.area?.toString() || '0');
    formData.append('value', propertyData.value?.toString() || '0');
    formData.append('status', propertyData.status || 'available');
    formData.append('type', propertyData.type || 'residential');
    formData.append('purpose', propertyData.purpose || 'sale');
    formData.append('acceptsFinancing', propertyData.acceptsFinancing?.toString() || 'false');
    formData.append('realEstateId', propertyData.realEstateId || '');

    // Adicionar endereço
    if (propertyData.address) {
      formData.append('address[street]', propertyData.address.street || '');
      formData.append('address[number]', propertyData.address.number || 'S/N');
      formData.append('address[complement]', propertyData.address.complement || '');
      formData.append('address[neighborhood]', propertyData.address.neighborhood || '');
      formData.append('address[city]', propertyData.address.city || '');
      formData.append('address[state]', propertyData.address.state || '');
      formData.append('address[zipCode]', propertyData.address.zipCode || '');
    }

    // Adicionar proprietário
    if (propertyData.owner) {
      formData.append('owner[name]', propertyData.owner.name || '');
      formData.append('owner[email]', propertyData.owner.email || '');
      formData.append('owner[phone]', propertyData.owner.phone || '');
      formData.append('owner[document]', propertyData.owner.document || '');
    }

    // Adicionar características específicas de imóveis
    if (propertyData.characteristics) {
      formData.append('bedrooms', propertyData.characteristics.bedrooms?.toString() || '0');
      formData.append('suites', propertyData.characteristics.suites?.toString() || '0');
      formData.append('bathrooms', propertyData.characteristics.bathrooms?.toString() || '0');
      formData.append('parkingSpaces', propertyData.characteristics.parkingSpaces?.toString() || '0');
      formData.append('floor', propertyData.characteristics.floor || '');
      formData.append('furnished', propertyData.characteristics.furnished ? 'true' : 'false');
      formData.append('condition', propertyData.characteristics.condition || '');
    }

    // Adicionar valores
    if (propertyData.values) {
      formData.append('salePrice', propertyData.values.salePrice?.toString() || '0');
      formData.append('rentPrice', propertyData.values.rentPrice?.toString() || '0');
      formData.append('condominiumFee', propertyData.values.condominiumFee?.toString() || '0');
      formData.append('iptuValue', propertyData.values.iptuValue?.toString() || '0');
    }

    // Adicionar imagens (apenas novas imagens)
    if (propertyData.imagens && propertyData.imagens.length > 0) {
      propertyData.imagens.forEach((image: File, index: number) => {
        if (image instanceof File) {
          formData.append(`images[${index}]`, image);
        }
      });
    }

    const response = await axiosInstance.put(`${endpoints.property.update}/${propertyId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    if (response.data.success) {
      console.log('🔄 updateProperty - Sucesso! Iniciando invalidação do cache...');
      console.log('📋 Dados do imóvel:', { propertyId, realEstateId: propertyData.realEstateId });
      
      // Invalidate cache to refresh data
      console.log('🗂️ Invalidando cache com padrões...');
      const invalidatedKeys: string[] = [];
      mutate((key) => {
        if (typeof key === 'string') {
          const shouldInvalidate = key.includes('/api/property/list') || 
                 key.includes('/api/property/stats') ||
                 key.startsWith('/api/property') ||
                 (key.includes('/api/property') && key.includes('real_estate_id'));
          if (shouldInvalidate) {
            invalidatedKeys.push(key);
            console.log('🔑 Invalidando chave:', key);
          }
          return shouldInvalidate;
        }
        return false;
      });
      console.log('📊 Total de chaves invalidadas:', invalidatedKeys.length);
      
      // Also invalidate specific property details cache
      const detailsKey = `${endpoints.property.details}/${propertyId}`;
      console.log('🔍 Invalidando cache de detalhes:', detailsKey);
      mutate(detailsKey);
      
      console.log('✅ Invalidação do cache concluída!');
      return response.data;
    }
    
    throw new Error(response.data.message || 'Erro ao atualizar imóvel');
  } catch (error) {
    console.error('Erro ao atualizar imóvel:', error);
    throw error;
  }
}

// ----------------------------------------------------------------------

type PropertyData = {
  data: {
    property: IPropertyItem;
  };
};

export function useGetProperty(propertyId: string) {
  const { currentRealEstate } = useRealEstateContext();
  
  const url = propertyId && currentRealEstate 
    ? `${endpoints.property.details}/${propertyId}?real_estate_id=${currentRealEstate.id}` 
    : null;

  const { data, isLoading, error, isValidating } = useSWR<PropertyData>(
    url,
    fetcher,
    swrOptions
  );

  const memoizedValue = useMemo(
    () => ({
      property: data?.data?.property,
      propertyLoading: isLoading,
      propertyError: error,
      propertyValidating: isValidating,
    }),
    [data?.data?.property, error, isLoading, isValidating]
  );

  return memoizedValue;
}

// ----------------------------------------------------------------------

type SearchResultsData = {
  results: IPropertyItem[];
};

export function useSearchProperties(query: string) {
  const { currentRealEstate } = useRealEstateContext();
  
  const url = query && currentRealEstate 
    ? `${endpoints.property.search}?q=${encodeURIComponent(query)}&real_estate_id=${currentRealEstate.id}` 
    : null;

  const { data, isLoading, error, isValidating } = useSWR<SearchResultsData>(url, fetcher, {
    ...swrOptions,
    keepPreviousData: true,
  });

  const memoizedValue = useMemo(
    () => ({
      searchResults: data?.results || [],
      searchResultsLoading: isLoading,
      searchResultsError: error,
      searchResultsValidating: isValidating,
      searchResultsEmpty: !isLoading && !data?.results.length,
    }),
    [data?.results, error, isLoading, isValidating]
  );

  return memoizedValue;
}

// ----------------------------------------------------------------------

export async function createProperty(propertyData: any) {
  try {
    console.log('🔄 createProperty - Dados recebidos:', propertyData);
    
    // Criar FormData para suportar upload de imagens
    const formData = new FormData();

    // Adicionar campos básicos
    formData.append('name', propertyData.name || propertyData.title || '');
    formData.append('title', propertyData.title || '');
    formData.append('description', propertyData.description || '');
    formData.append('area', propertyData.area?.toString() || '0');
    formData.append('value', propertyData.value?.toString() || '0');
    formData.append('status', propertyData.status || 'available');
    formData.append('type', propertyData.type || 'residential');
    formData.append('purpose', propertyData.purpose || 'sale');
    formData.append('acceptsFinancing', propertyData.acceptsFinancing?.toString() || 'false');
    formData.append('realEstateId', propertyData.realEstateId || '');

    // Adicionar endereço
    if (propertyData.address) {
      formData.append('address[street]', propertyData.address.street || '');
      formData.append('address[number]', propertyData.address.number || 'S/N');
      formData.append('address[complement]', propertyData.address.complement || '');
      formData.append('address[neighborhood]', propertyData.address.neighborhood || '');
      formData.append('address[city]', propertyData.address.city || '');
      formData.append('address[state]', propertyData.address.state || '');
      formData.append('address[zipCode]', propertyData.address.zipCode || '');
    }

    // Adicionar proprietário
    if (propertyData.owner) {
      formData.append('owner[name]', propertyData.owner.name || '');
      formData.append('owner[email]', propertyData.owner.email || '');
      formData.append('owner[phone]', propertyData.owner.phone || '');
      formData.append('owner[document]', propertyData.owner.document || '');
    }

    // Adicionar características específicas de imóveis
    if (propertyData.characteristics) {
      formData.append('bedrooms', propertyData.characteristics.bedrooms?.toString() || '0');
      formData.append('suites', propertyData.characteristics.suites?.toString() || '0');
      formData.append('bathrooms', propertyData.characteristics.bathrooms?.toString() || '0');
      formData.append('parkingSpaces', propertyData.characteristics.parkingSpaces?.toString() || '0');
      formData.append('floor', propertyData.characteristics.floor || '');
      formData.append('furnished', propertyData.characteristics.furnished ? 'true' : 'false');
      formData.append('condition', propertyData.characteristics.condition || '');
      formData.append('constructionYear', propertyData.characteristics.constructionYear || '');
    }

    // Adicionar valores
    if (propertyData.values) {
      formData.append('salePrice', propertyData.values.salePrice?.toString() || '0');
      formData.append('rentPrice', propertyData.values.rentPrice?.toString() || '0');
      formData.append('condominiumFee', propertyData.values.condominiumFee?.toString() || '0');
      formData.append('iptuValue', propertyData.values.iptuValue?.toString() || '0');
      formData.append('acceptsExchange', propertyData.values.acceptsExchange ? 'true' : 'false');
    }

    // Adicionar comodidades
    if (propertyData.amenities) {
      formData.append('amenities', JSON.stringify(propertyData.amenities));
    }

    // Adicionar imagens
    if (propertyData.imagens && propertyData.imagens.length > 0) {
      propertyData.imagens.forEach((image: File, index: number) => {
        if (image instanceof File) {
          formData.append(`images[${index}]`, image);
        }
      });
    }

    console.log('🚀 Enviando dados para API...');
    const response = await axiosInstance.post(endpoints.property.create, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    if (response.data.success) {
      console.log('✅ createProperty - Sucesso! Iniciando invalidação do cache...');
      console.log('📋 Dados do imóvel criado:', response.data.data);
      
      // Invalidate cache to refresh data
      console.log('🗂️ Invalidando cache com padrões...');
      const invalidatedKeys: string[] = [];
      mutate((key) => {
        if (typeof key === 'string') {
          const shouldInvalidate = key.includes('/api/property/list') || 
                 key.includes('/api/property/stats') ||
                 key.startsWith('/api/property') ||
                 (key.includes('/api/property') && key.includes('real_estate_id'));
          if (shouldInvalidate) {
            invalidatedKeys.push(key);
            console.log('🔑 Invalidando chave:', key);
          }
          return shouldInvalidate;
        }
        return false;
      });
      console.log('📊 Total de chaves invalidadas:', invalidatedKeys.length);
      
      console.log('✅ Invalidação do cache concluída!');
       return response.data;
     }
     
     throw new Error(response.data.message || 'Erro ao criar imóvel');
   } catch (error) {
     console.error('❌ Erro ao criar imóvel:', error);
     throw error;
   }
 }

// ----------------------------------------------------------------------

export function useUpdateProperty() {
  const { currentRealEstate } = useRealEstateContext();

  const updateProperty = async (propertyId: string, propertyData: any) => {
    if (!currentRealEstate) {
      throw new Error('Nenhuma imobiliária selecionada');
    }

    const formData = new FormData();
    
    // Adicionar dados básicos
    formData.append('real_estate_id', currentRealEstate.id);
    formData.append('title', propertyData.titulo);
    formData.append('description', propertyData.descricao);
    formData.append('area', propertyData.area.toString());
    formData.append('price', propertyData.preco.toString());
    formData.append('price_per_m2', propertyData.precoM2.toString());
    formData.append('type', propertyData.tipo);
    formData.append('condition', propertyData.condicao);
    formData.append('status', propertyData.status);
    formData.append('negotiable', propertyData.negociavel.toString());
    formData.append('observations', propertyData.observacoes || '');

    // Adicionar localização
    if (propertyData.localizacao) {
      formData.append('address', propertyData.localizacao.endereco || '');
      formData.append('number', propertyData.localizacao.numero || '');
      formData.append('complement', propertyData.localizacao.complemento || '');
      formData.append('neighborhood', propertyData.localizacao.bairro || '');
      formData.append('city', propertyData.localizacao.cidade || '');
      formData.append('state', propertyData.localizacao.estado || '');
      formData.append('zip_code', propertyData.localizacao.cep || '');
    }

    // Adicionar características
    if (propertyData.caracteristicas) {
      formData.append('bedrooms', propertyData.caracteristicas.quartos?.toString() || '0');
      formData.append('bathrooms', propertyData.caracteristicas.banheiros?.toString() || '0');
      formData.append('suites', propertyData.caracteristicas.suites?.toString() || '0');
      formData.append('parking_spaces', propertyData.caracteristicas.vagasGaragem?.toString() || '0');
      formData.append('floor', propertyData.caracteristicas.andar || '');
      formData.append('furnished', propertyData.caracteristicas.mobiliado?.toString() || 'false');
    }

    // Adicionar comodidades
    if (propertyData.comodidades) {
      formData.append('amenities', JSON.stringify(propertyData.comodidades));
    }

    // Adicionar valores adicionais
    if (propertyData.valores) {
      formData.append('condo_fee', propertyData.valores.valorCondominio?.toString() || '0');
      formData.append('iptu_value', propertyData.valores.valorIPTU?.toString() || '0');
      formData.append('accepts_financing', propertyData.valores.aceitaFinanciamento?.toString() || 'false');
      formData.append('accepts_fgts', propertyData.valores.aceitaFGTS?.toString() || 'false');
    }

    // Adicionar proprietário
    if (propertyData.proprietario) {
      formData.append('owner_name', propertyData.proprietario.nome || '');
      formData.append('owner_email', propertyData.proprietario.email || '');
      formData.append('owner_phone', propertyData.proprietario.telefone || '');
      formData.append('owner_document', propertyData.proprietario.documento || '');
    }

    // Adicionar imagens (apenas novas imagens)
    if (propertyData.imagens && propertyData.imagens.length > 0) {
      propertyData.imagens.forEach((image: File, index: number) => {
        if (image instanceof File) {
          formData.append(`images[${index}]`, image);
        }
      });
    }

    const response = await axiosInstance.put(`${endpoints.property.update}/${propertyId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    // Invalidar cache do SWR para atualizar a listagem e detalhes
    const listUrl = `${endpoints.property.list}?real_estate_id=${currentRealEstate.id}`;
    const detailsUrl = `${endpoints.property.details}/${propertyId}?real_estate_id=${currentRealEstate.id}`;
    await mutate(listUrl);
    await mutate(detailsUrl);

    return response.data;
  };

  return { updateProperty };
}

// ----------------------------------------------------------------------

type PropertyStats = {
  totalProperties: number;
  availableProperties: number;
  soldProperties: number;
  averagePrice: number;
  priceRange: {
    min: number;
    max: number;
  };
};

export function useGetPropertyStats() {
  const { currentRealEstate } = useRealEstateContext();
  
  const url = currentRealEstate ? `${endpoints.property.stats}?real_estate_id=${currentRealEstate.id}` : null;

  const { data, isLoading, error, isValidating } = useSWR<PropertyStats>(
    url,
    fetcher,
    swrOptions
  );

  const memoizedValue = useMemo(
    () => ({
      propertyStats: data || {
        totalProperties: 0,
        availableProperties: 0,
        soldProperties: 0,
        averagePrice: 0,
        priceRange: { min: 0, max: 0 },
      },
      propertyStatsLoading: isLoading,
      propertyStatsError: error,
      propertyStatsValidating: isValidating,
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}

// ----------------------------------------------------------------------

type PropertyFiltersData = {
  types: string[];
  locations: string[];
  priceRanges: { min: number; max: number; label: string }[];
  amenities: string[];
};

export function useGetPropertyFilters() {
  const { currentRealEstate } = useRealEstateContext();
  
  const url = currentRealEstate ? `${endpoints.property.filters}?real_estate_id=${currentRealEstate.id}` : null;

  const { data, isLoading, error, isValidating } = useSWR<PropertyFiltersData>(
    url,
    fetcher,
    swrOptions
  );

  const memoizedValue = useMemo(
    () => ({
      filters: data || {
        types: [],
        locations: [],
        priceRanges: [],
        amenities: [],
      },
      filtersLoading: isLoading,
      filtersError: error,
      filtersValidating: isValidating,
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}
