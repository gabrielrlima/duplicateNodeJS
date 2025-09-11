import type { ICorretor } from 'src/types/corretor';

import { useState, useEffect, useCallback } from 'react';

import axiosInstance, { endpoints } from 'src/lib/axios';

// ----------------------------------------------------------------------
// TIPOS
// ----------------------------------------------------------------------

export interface UseCorretoresReturn {
  corretores: ICorretor[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
  createCorretor: (data: Partial<ICorretor>) => Promise<ICorretor>;
  updateCorretor: (id: string, data: Partial<ICorretor>) => Promise<ICorretor>;
  deleteCorretor: (id: string) => Promise<void>;
}

// ----------------------------------------------------------------------
// HOOK PARA GERENCIAR CORRETORES
// ----------------------------------------------------------------------

export function useCorretores(): UseCorretoresReturn {
  const [corretores, setCorretores] = useState<ICorretor[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Função para buscar corretores
  const fetchCorretores = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Usar um ID de imobiliária padrão para teste (deve vir do contexto do usuário)
      const realEstateId = '68b1df705757655b21fc5210';
      
      const response = await axiosInstance.get(`${endpoints.corretor.list}?real_estate_id=${realEstateId}`);
      
      if (response.data.success) {
        const fetchedCorretores = response.data.data.data || [];
        setCorretores(fetchedCorretores);
      } else {
        setCorretores([]);
      }
    } catch (err: any) {
      // Não logar 401 como erro para usuários não autenticados
      if (err.response?.status !== 401) {
        console.error('Erro ao buscar corretores:', err);
        setError(err.response?.data?.message || 'Erro ao buscar corretores');
      } else {
        // Limpar dados quando não autenticado
        setCorretores([]);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  // Função para criar novo corretor
  const createCorretor = useCallback(async (data: Partial<ICorretor>): Promise<ICorretor> => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axiosInstance.post(endpoints.corretor.create, data);
      
      if (response.data.success) {
        const newCorretor = response.data.data.corretor || response.data.data;
        
        // Atualizar a lista de corretores
        setCorretores(prev => [newCorretor, ...prev]);
        
        return newCorretor;
      }
      
      throw new Error('Erro ao criar corretor');
    } catch (err: any) {
      console.error('Erro ao criar corretor:', err);
      const errorMessage = err.response?.data?.message || 'Erro ao criar corretor';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  // Função para atualizar corretor
  const updateCorretor = useCallback(async (id: string, data: Partial<ICorretor>): Promise<ICorretor> => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axiosInstance.put(`${endpoints.corretor.update}/${id}`, data);
      
      if (response.data.success) {
        const updatedCorretor = response.data.data.corretor || response.data.data;
        
        // Atualizar a lista de corretores
        setCorretores(prev => 
          prev.map(corretor => 
            corretor.id === id ? updatedCorretor : corretor
          )
        );
        
        return updatedCorretor;
      }
      
      throw new Error('Erro ao atualizar corretor');
    } catch (err: any) {
      console.error('Erro ao atualizar corretor:', err);
      const errorMessage = err.response?.data?.message || 'Erro ao atualizar corretor';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  // Função para deletar corretor
  const deleteCorretor = useCallback(async (id: string): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axiosInstance.delete(`${endpoints.corretor.delete}/${id}`);
      
      if (response.data.success) {
        // Remover da lista de corretores
        setCorretores(prev => prev.filter(corretor => corretor.id !== id));
      }
    } catch (err: any) {
      console.error('Erro ao deletar corretor:', err);
      const errorMessage = err.response?.data?.message || 'Erro ao deletar corretor';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  // Carregar corretores ao montar o componente
  useEffect(() => {
    fetchCorretores();
  }, [fetchCorretores]);

  return {
    corretores,
    loading,
    error,
    refetch: fetchCorretores,
    createCorretor,
    updateCorretor,
    deleteCorretor,
  };
}

// ----------------------------------------------------------------------
// HOOK PARA BUSCAR UM CORRETOR ESPECÍFICO
// ----------------------------------------------------------------------

export function useCorretor(id: string) {
  const [corretor, setCorretor] = useState<ICorretor | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCorretor = useCallback(async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const response = await axiosInstance.get(`${endpoints.corretor.details}/${id}`);
      
      if (response.data.success) {
        const fetchedCorretor = response.data.data.corretor || response.data.data;
        setCorretor(fetchedCorretor);
      } else {
        setCorretor(null);
      }
    } catch (err: any) {
      console.error('Erro ao buscar corretor:', err);
      setError(err.response?.data?.message || 'Erro ao buscar corretor');
      setCorretor(null);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchCorretor();
  }, [fetchCorretor]);

  return {
    corretor,
    loading,
    error,
    refetch: fetchCorretor,
  };
}