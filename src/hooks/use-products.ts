import { useState, useEffect } from 'react';

// TODO: Descomentar quando conectar com o backend
// import axios, { endpoints } from 'src/lib/axios';

// ----------------------------------------------------------------------
// TIPOS
// ----------------------------------------------------------------------

export interface ProductItem {
  id: string;
  nome: string;
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

  const fetchProperties = async () => {
    try {
      setLoading(true);
      setError(null);

      // TODO: Conectar com endpoint real do backend
      // const response = await axios.get(endpoints.properties.list);
      // const data = response.data;

      // Por enquanto, retorna array vazio até o backend estar pronto
      const data: ProductItem[] = [];

      setProducts(data);
    } catch (err: any) {
      console.error('Erro ao buscar imóveis:', err);
      setError(err.message || 'Erro ao carregar imóveis');
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
// HOOK PARA BUSCAR TERRENOS
// ----------------------------------------------------------------------

export function useTerrenos(): UseProductsReturn {
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTerrenos = async () => {
    try {
      setLoading(true);
      setError(null);

      // TODO: Conectar com endpoint real do backend
      // const response = await axios.get(endpoints.terrenos.list);
      // const data = response.data.map((terreno: any) => ({
      //   id: terreno.id,
      //   nome: terreno.titulo,
      // }));

      // Por enquanto, retorna array vazio até o backend estar pronto
      const data: ProductItem[] = [];

      setProducts(data);
    } catch (err: any) {
      console.error('Erro ao buscar terrenos:', err);
      setError(err.message || 'Erro ao carregar terrenos');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTerrenos();
  }, []);

  return {
    products,
    loading,
    error,
    refetch: fetchTerrenos,
  };
}

// ----------------------------------------------------------------------
// HOOK PARA BUSCAR EMPREENDIMENTOS
// ----------------------------------------------------------------------

export function useEmpreendimentos(): UseProductsReturn {
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEmpreendimentos = async () => {
    try {
      setLoading(true);
      setError(null);

      // TODO: Conectar com endpoint real do backend
      // const response = await axios.get(endpoints.empreendimentos.list);
      // const data = response.data.map((empreendimento: any) => ({
      //   id: empreendimento.id,
      //   nome: empreendimento.titulo,
      // }));

      // Por enquanto, retorna array vazio até o backend estar pronto
      const data: ProductItem[] = [];

      setProducts(data);
    } catch (err: any) {
      console.error('Erro ao buscar empreendimentos:', err);
      setError(err.message || 'Erro ao carregar empreendimentos');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmpreendimentos();
  }, []);

  return {
    products,
    loading,
    error,
    refetch: fetchEmpreendimentos,
  };
}

// ----------------------------------------------------------------------
// HOOK COMBINADO PARA BUSCAR PRODUTOS POR CATEGORIA
// ----------------------------------------------------------------------

export function useProductsByCategory(categoria: string): UseProductsReturn {
  const propertiesResult = useProperties();
  const terrenosResult = useTerrenos();
  const empreendimentosResult = useEmpreendimentos();

  switch (categoria) {
    case 'imovel':
      return propertiesResult;
    case 'terreno':
      return terrenosResult;
    case 'empreendimento':
      return empreendimentosResult;
    default:
      return {
        products: [],
        loading: false,
        error: null,
        refetch: () => {},
      };
  }
}
