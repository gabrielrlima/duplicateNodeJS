import { useState, useEffect } from 'react';

import axios, { endpoints } from 'src/lib/axios';
import { useRealEstateContext } from 'src/contexts/real-estate-context';

// ----------------------------------------------------------------------
// TIPOS
// ----------------------------------------------------------------------

export interface ProductItem {
  id: string;
  nome: string;
  name?: string;
  title?: string;
  titulo?: string;
  type?: string;
  tipo?: string;
  value?: number;
  preco?: number;
  area?: number;
  address?: any;
  city?: string;
  state?: string;
  neighborhood?: string;
}

export interface UseProductsReturn {
  products: ProductItem[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

// ----------------------------------------------------------------------
// HOOK PARA BUSCAR IMÓVEIS
// ----------------------------------------------------------------------

export function useProperties(): UseProductsReturn {
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { currentRealEstate } = useRealEstateContext();

  const fetchProperties = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log('🔍 Buscando produtos...', { currentRealEstate });
      
      // Buscar produtos do backend
      const response = await axios.get(endpoints.property.list, {
        params: currentRealEstate?.id ? { real_estate_id: currentRealEstate.id } : {}
      });
      
      console.log('📦 Resposta da API:', response.data);
      
      const data = response.data?.data || [];
      
      // Mapear dados para o formato esperado
      const mappedData: ProductItem[] = data.map((item: any) => ({
        id: item.id,
        nome: item.name || item.title || item.titulo || 'Produto sem nome',
        name: item.name || item.title || item.titulo,
        title: item.title || item.titulo,
        titulo: item.titulo || item.title,
        type: item.type || item.tipo,
        tipo: item.tipo || item.type,
        value: item.value || item.preco,
        preco: item.preco || item.value,
        area: item.area,
        address: item.address,
        city: item.city,
        state: item.state,
        neighborhood: item.neighborhood
      }));
      
      console.log('✅ Produtos mapeados:', mappedData);
      setProducts(mappedData);
    } catch (err: any) {
      console.error('❌ Erro ao buscar produtos:', err);
      setError(err.response?.data?.message || err.message || 'Erro ao carregar produtos');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  return {
    products,
    loading,
    error,
    refetch: fetchProperties,
  };
}

// ----------------------------------------------------------------------
// HOOK COMBINADO PARA BUSCAR PRODUTOS POR CATEGORIA
// ----------------------------------------------------------------------

export function useProductsByCategory(categoria: string): UseProductsReturn {
  const propertiesResult = useProperties();

  switch (categoria) {
    case 'imovel':
      return propertiesResult;
    default:
      return {
        products: [],
        loading: false,
        error: null,
        refetch: () => {},
      };
  }
}
