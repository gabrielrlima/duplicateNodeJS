import type { SWRConfiguration } from 'swr';
import type { IPropertyItem } from 'src/types/property';

import { useMemo } from 'react';
import useSWR, { mutate } from 'swr';

import axiosInstance, { fetcher, endpoints } from 'src/lib/axios';
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
  data: IPropertyItem[];
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
      properties: data?.data || [],
      propertiesLoading: isLoading,
      propertiesError: error,
      propertiesValidating: isValidating,
      propertiesEmpty: !isLoading && !isValidating && (!data?.data || data.data.length === 0),
    }),
    [data?.data, error, isLoading, isValidating]
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
    console.log('🔄 updateProperty - Dados recebidos:', propertyData);
    console.log('🔍 ANÁLISE DETALHADA DOS DADOS RECEBIDOS:');
    console.log('   - propertyId:', propertyId, typeof propertyId);
    console.log('   - propertyData keys:', Object.keys(propertyData));
    console.log('   - propertyData.type:', propertyData.type, typeof propertyData.type);
    console.log('   - propertyData.title:', propertyData.title, typeof propertyData.title);
    console.log('   - propertyData.address:', propertyData.address, typeof propertyData.address);
    
    // Verificar campos problemáticos específicos
    const problematicFields = ['area', 'builtArea', 'value', 'bedrooms', 'bathrooms', 'parkingSpaces'];
    problematicFields.forEach(field => {
      const value = propertyData[field];
      const converted = Number(value);
      console.log(`   - ${field}: original=${value} (${typeof value}) → converted=${converted} (isNaN: ${isNaN(converted)})`);
    });
    
    // Mapear dados do frontend para o formato esperado pelo backend
    let mappedData: any = {
      name: propertyData.title || propertyData.name || '',
      title: propertyData.title || '',
      description: propertyData.description || '',
      type: propertyData.type || 'imovel',
      status: propertyData.status || 'available',
      area: Number(propertyData.area) || Number(propertyData.builtArea) || 0,
      builtArea: Number(propertyData.builtArea) || 0,
      value: Number(propertyData.value) || 0,
      bedrooms: Number(propertyData.bedrooms) || 0,
      bathrooms: Number(propertyData.bathrooms) || 0,
      parkingSpaces: Number(propertyData.parkingSpaces) || 0,
      elevator: Boolean(propertyData.elevator),
      furnished: Boolean(propertyData.furnished),
      hasBalcony: Boolean(propertyData.hasBalcony),
      acceptsFinancing: Boolean(propertyData.acceptsFinancing),
      acceptsExchange: Boolean(propertyData.acceptsExchange),
      exclusiveProperty: Boolean(propertyData.exclusiveProperty),
      highlightProperty: Boolean(propertyData.highlightProperty),
      // Mapear endereço se fornecido como string simples
      address: propertyData.address ? (
        typeof propertyData.address === 'string' ? {
          street: propertyData.address || '',
        number: '',
        complement: '',
        neighborhood: '',
        city: '',
        state: '',
        zipCode: '',
        country: 'Brasil'
      } : propertyData.address
    ) : {
      street: '',
      number: '',
      complement: '',
      neighborhood: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'Brasil'
    }
    };
    
    console.log('🔍 ANÁLISE DOS DADOS MAPEADOS (BASE):');
    Object.entries(mappedData).forEach(([key, value]) => {
      console.log(`   - ${key}: ${value} (${typeof value}) ${value === null ? '[NULL]' : ''} ${value === undefined ? '[UNDEFINED]' : ''} ${typeof value === 'number' && isNaN(value as number) ? '[NaN]' : ''}`);
    });
    
    // Adicionar campos específicos baseados no tipo
    if (propertyData.type === 'empreendimento') {
      console.log('🏢 Mapeando campos específicos de empreendimento');
      console.log('   - construtora:', propertyData.construtora, typeof propertyData.construtora);
      console.log('   - previsaoEntrega:', propertyData.previsaoEntrega, typeof propertyData.previsaoEntrega);
      console.log('   - unidadesDisponiveis:', propertyData.unidadesDisponiveis, typeof propertyData.unidadesDisponiveis, '→', Number(propertyData.unidadesDisponiveis), 'isNaN:', isNaN(Number(propertyData.unidadesDisponiveis)));
      console.log('   - availableUnits:', propertyData.availableUnits, typeof propertyData.availableUnits);
      console.log('   - plantas:', propertyData.plantas, Array.isArray(propertyData.plantas), 'length:', Array.isArray(propertyData.plantas) ? propertyData.plantas.length : 'N/A');
      
      // CORREÇÃO: Mapear campos no formato correto do ProductController
      mappedData = {
        ...mappedData,
        // Campos específicos de empreendimento
        construtora: propertyData.construtora || '',
        previsaoEntrega: propertyData.previsaoEntrega || undefined,
        unidadesDisponiveis: Number(propertyData.unidadesDisponiveis) || Number(propertyData.availableUnits) || 0,
        availableUnits: Number(propertyData.availableUnits) || Number(propertyData.unidadesDisponiveis) || 0,
        plantas: Array.isArray(propertyData.plantas) ? propertyData.plantas : [],
        // Garantir que o tipo está correto
        type: 'empreendimento'
      };
    } else if (propertyData.type === 'terreno') {
      console.log('🏞️ Mapeando campos específicos de terreno');
      console.log('   - frente:', propertyData.frente, typeof propertyData.frente, '→', Number(propertyData.frente));
      console.log('   - tipoSolo:', propertyData.tipoSolo, typeof propertyData.tipoSolo);
      console.log('   - zoneamento:', propertyData.zoneamento, typeof propertyData.zoneamento);
      
      mappedData = {
        ...mappedData,
        frontage: Number(propertyData.frente) || 0,
        topography: propertyData.tipoSolo || 'flat',
        zoning: propertyData.zoneamento || 'residential'
      };
    }
    
    console.log('🔄 updateProperty - Dados mapeados FINAIS:', mappedData);
    
    // VALIDAÇÃO FINAL ANTES DO ENVIO
    console.log('🚨 VALIDAÇÃO FINAL ANTES DO ENVIO:');
    const finalValidation = {
      hasUndefined: Object.entries(mappedData).filter(([k, v]) => v === undefined),
      hasNull: Object.entries(mappedData).filter(([k, v]) => v === null),
      hasNaN: Object.entries(mappedData).filter(([k, v]) => typeof v === 'number' && isNaN(v)),
      hasEmptyStrings: Object.entries(mappedData).filter(([k, v]) => typeof v === 'string' && v === ''),
      addressValidation: {
        isObject: typeof mappedData.address === 'object',
        hasRequiredFields: mappedData.address && typeof mappedData.address === 'object' ? 
          ['street', 'city', 'state'].every(field => field in mappedData.address) : false
      }
    };
    
    console.log('   - Campos undefined:', finalValidation.hasUndefined);
    console.log('   - Campos null:', finalValidation.hasNull);
    console.log('   - Campos NaN:', finalValidation.hasNaN);
    console.log('   - Strings vazias:', finalValidation.hasEmptyStrings);
    console.log('   - Validação endereço:', finalValidation.addressValidation);
    
    // Verificar se há problemas críticos
    const criticalIssues = [
      ...finalValidation.hasUndefined.map(([k]) => `${k} é undefined`),
      ...finalValidation.hasNull.map(([k]) => `${k} é null`),
      ...finalValidation.hasNaN.map(([k]) => `${k} é NaN`)
    ];
    
    if (criticalIssues.length > 0) {
      console.error('🚨 PROBLEMAS CRÍTICOS DETECTADOS:', criticalIssues);
    }

    console.log('📤 ENVIANDO PARA API:');
    console.log('   - URL:', `${endpoints.property.update}/${propertyId}`);
    console.log('   - Method: PUT');
    console.log('   - Headers: Content-Type: application/json');
    console.log('   - Body (stringified):', JSON.stringify(mappedData, null, 2));
    console.log('   - Body size:', JSON.stringify(mappedData).length, 'characters');
    
    const response = await axiosInstance.put(`${endpoints.property.update}/${propertyId}`, mappedData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    console.log('📥 RESPOSTA DA API:');
    console.log('   - Status:', response.status);
    console.log('   - StatusText:', response.statusText);
    console.log('   - Headers:', response.headers);
    console.log('   - Data:', response.data);

    if (response.data.success) {
      console.log('✅ updateProperty - Produto atualizado com sucesso!');
      console.log('📋 Dados atualizados:', response.data.data);
      
      // Invalidate cache to refresh data
      console.log('🗂️ Invalidando cache...');
      const invalidatedKeys: string[] = [];
      mutate((key) => {
        if (typeof key === 'string') {
          const shouldInvalidate = key.includes('/api/products') || 
                 key.includes('/api/property') ||
                 key.includes('real_estate_id');
          if (shouldInvalidate) {
            invalidatedKeys.push(key);
          }
          return shouldInvalidate;
        }
        return false;
      });
      
      // Also invalidate specific property details cache
      const detailsKey = `${endpoints.property.details}/${propertyId}`;
      mutate(detailsKey);
      
      console.log('✅ Cache invalidado! Total de chaves:', invalidatedKeys.length);
      return response.data;
    }
    
    throw new Error(response.data.message || 'Erro ao atualizar produto');
  } catch (error) {
    console.error('❌ ERRO DETALHADO AO ATUALIZAR PRODUTO:');
    console.error('   - propertyId:', propertyId);
    console.error('   - error.name:', error.name);
    console.error('   - error.message:', error.message);
    console.error('   - error.stack:', error.stack);
    
    if (error.response) {
      console.error('   - response.status:', error.response.status);
      console.error('   - response.statusText:', error.response.statusText);
      console.error('   - response.headers:', error.response.headers);
      console.error('   - response.data:', error.response.data);
      console.error('   - response.config.url:', error.response.config?.url);
      console.error('   - response.config.method:', error.response.config?.method);
      console.error('   - response.config.data:', error.response.config?.data);
    } else if (error.request) {
      console.error('   - request:', error.request);
    }
    
    console.error('   - propertyData enviado:', propertyData);
    console.error('   - timestamp:', new Date().toISOString());
    
    // Melhor tratamento de erro baseado no status
    if (error.response?.status === 400) {
      const errorDetails = error.response.data;
      console.error('🚨 ERRO 400 - ANÁLISE DETALHADA:');
      console.error('   - message:', errorDetails?.message);
      console.error('   - errors:', errorDetails?.errors);
      console.error('   - details:', errorDetails?.details);
      console.error('   - validation:', errorDetails?.validation);
      
      throw new Error(`Dados inválidos: ${errorDetails?.message || 'Verifique os campos obrigatórios'}`);
    } else if (error.response?.status === 404) {
      throw new Error('Produto não encontrado');
    } else if (error.response?.status === 401) {
      throw new Error('Não autorizado. Faça login novamente.');
    } else {
      throw new Error(error.response?.data?.message || error.message || 'Erro ao atualizar produto');
    }
  }
}

// ----------------------------------------------------------------------

type PropertyData = {
  success: boolean;
  message: string;
  data: IPropertyItem;
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

  // Debug logs
  console.log('🔍 useGetProperty Debug:', {
    propertyId,
    currentRealEstate: currentRealEstate?.id,
    url,
    isLoading,
    error: error?.message,
    rawData: data,
    extractedProperty: data?.data
  });

  const memoizedValue = useMemo(
    () => ({
      property: data?.data,
      propertyLoading: isLoading,
      propertyError: error,
      propertyValidating: isValidating,
    }),
    [data?.data, error, isLoading, isValidating]
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

// Função para mapear dados do frontend para o formato do backend
function mapFrontendToBackend(frontendData: any) {
  console.log('🔄 Mapeando dados do frontend:', frontendData);
  
  // Mapeamento de tipos do frontend para backend
  const typeMapping: Record<string, string> = {
    'imovel': 'imovel',
    'terreno': 'terreno',
    'empreendimento': 'empreendimento',
    'apartamento': 'imovel',
    'casa': 'imovel',
    'comercial': 'imovel'
  };
  
  const backendData: any = {
    name: frontendData.titulo || frontendData.name || 'Produto sem título',
    title: frontendData.titulo || frontendData.title || '',
    description: frontendData.descricao || frontendData.description || 'Propriedade criada via sistema',
    type: typeMapping[frontendData.tipo] || frontendData.type || 'imovel',
    status: 'available',
    area: Number(frontendData.area || frontendData.areaConstruida || 1),
    builtArea: Number(frontendData.areaConstruida || frontendData.area || 0),
    value: Number(frontendData.preco || frontendData.value || 0),
    bedrooms: Number(frontendData.quartos || frontendData.bedrooms || 0),
    bathrooms: Number(frontendData.banheiros || frontendData.bathrooms || 0),
    parkingSpaces: Number(frontendData.garagem || frontendData.parkingSpaces || 0),
    elevator: false,
    furnished: false,
    hasBalcony: false,
    acceptsFinancing: true,
    acceptsExchange: false,
    exclusiveProperty: false,
    highlightProperty: false,
    address: {
      street: frontendData.rua || frontendData.localizacao || '',
      number: frontendData.numero || '',
      complement: frontendData.complemento || '',
      neighborhood: frontendData.bairro || '',
      city: frontendData.cidade || '',
      state: frontendData.estado || '',
      zipCode: frontendData.cep || '',
      country: 'Brasil'
    },
    realEstateId: frontendData.realEstateId || ''
  };
  
  // Adicionar campos específicos baseados no tipo
  if (frontendData.tipo === 'empreendimento') {
    console.log('🏢 Adicionando campos específicos de empreendimento');
    backendData.construtora = frontendData.construtora || '';
    backendData.previsaoEntrega = frontendData.previsaoEntrega || undefined;
    backendData.unidadesDisponiveis = Number(frontendData.unidadesDisponiveis) || 0;
    backendData.plantas = Array.isArray(frontendData.plantas) ? frontendData.plantas : [];
  } else if (frontendData.tipo === 'terreno') {
    console.log('🏞️ Adicionando campos específicos de terreno');
    backendData.frente = Number(frontendData.frente) || 0;
    backendData.tipoSolo = frontendData.tipoSolo || 'plano';
    backendData.zoneamento = frontendData.zoneamento || '';
  }
  
  console.log('✅ Dados mapeados para backend:', backendData);
  return backendData;
}

export async function createProperty(propertyData: any) {
  try {
    console.log('🚀 Dados recebidos para criação:', propertyData);
    
    // Verificar se realEstateId está presente
    if (!propertyData.realEstateId) {
      throw new Error('ID da imobiliária é obrigatório para criar uma propriedade');
    }
    
    // Mapear dados do frontend para o formato do backend
    const mappedData = mapFrontendToBackend(propertyData);
    
    // Validar dados mapeados
    if (!mappedData.realEstateId) {
      throw new Error('Erro no mapeamento: ID da imobiliária não foi definido');
    }
    
    // Enviar como JSON em vez de FormData para evitar problemas de parsing
    console.log('📤 Enviando dados mapeados para API...');
    const response = await axiosInstance.post(endpoints.property.create, mappedData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });



    if (response.data.success) {
      console.log('✅ createProperty - Sucesso! Iniciando invalidação do cache...');
      console.log('📋 Dados do imóvel criado:', response.data.data);
      
      // Invalidate cache to refresh data - mais agressivo
      console.log('🗂️ Invalidando cache com padrões...');
      const invalidatedKeys: string[] = [];
      
      // Invalidar todas as chaves relacionadas a produtos/properties
      mutate((key) => {
        if (typeof key === 'string') {
          const shouldInvalidate = key.includes('/api/products') || 
                 key.includes('/api/property') ||
                 key.includes('real_estate_id');
          if (shouldInvalidate) {
            invalidatedKeys.push(key);
            console.log('🔑 Invalidando chave:', key);
          }
          return shouldInvalidate;
        }
        return false;
      });
      
      // Forçar revalidação específica da lista de produtos
      const realEstateId = mappedData.realEstateId;
      const specificListKey = `${endpoints.property.list}?real_estate_id=${realEstateId}`;
      console.log('🔄 Forçando revalidação específica:', specificListKey);
      mutate(specificListKey, undefined, { revalidate: true });
      
      // Invalidar cache global como fallback
      mutate(() => true, undefined, { revalidate: true });
      
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
