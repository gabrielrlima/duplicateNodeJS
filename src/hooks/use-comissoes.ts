import type { IComissaoItem } from 'src/types/comissao';

import { useState, useEffect, useCallback } from 'react';

import axiosInstance, { endpoints } from 'src/lib/axios';

// ----------------------------------------------------------------------
// TIPOS
// ----------------------------------------------------------------------

export interface UseComissoesReturn {
  comissoes: IComissaoItem[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
  createComissao: (data: Partial<IComissaoItem>) => Promise<IComissaoItem>;
  updateComissao: (id: string, data: Partial<IComissaoItem>) => Promise<IComissaoItem>;
  deleteComissao: (id: string) => Promise<void>;
}

// ----------------------------------------------------------------------
// HOOK PARA GERENCIAR COMISSÕES
// ----------------------------------------------------------------------

export function useComissoes(): UseComissoesReturn {
  const [comissoes, setComissoes] = useState<IComissaoItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Função para buscar comissões
  const fetchComissoes = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Usar um ID de imobiliária padrão para teste (deve vir do contexto do usuário)
      const realEstateId = '68b1df705757655b21fc5210';
      
      const response = await axiosInstance.get(`${endpoints.comissao.list}?real_estate_id=${realEstateId}`);
      
      if (response.data.success) {
        const fetchedComissoes = response.data.data.data || [];
        setComissoes(fetchedComissoes);
      } else {
        setComissoes([]);
      }
    } catch (err: any) {
      // Não logar 401 como erro para usuários não autenticados
      if (err.response?.status !== 401) {
        console.error('Erro ao buscar comissões:', err);
        setError(err.response?.data?.message || 'Erro ao buscar comissões');
      }
      setComissoes([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Função para criar comissão
  const createComissao = useCallback(async (data: Partial<IComissaoItem>): Promise<IComissaoItem> => {
    try {
      setError(null);
      const response = await axiosInstance.post(endpoints.comissao.create, data);
      
      if (response.data.success) {
        const newComissao = response.data.data;
        setComissoes(prev => [...prev, newComissao]);
        return newComissao;
      }
      throw new Error(response.data.message || 'Erro ao criar comissão');
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Erro ao criar comissão';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, []);

  // Função para atualizar comissão
  const updateComissao = useCallback(async (id: string, data: Partial<IComissaoItem>): Promise<IComissaoItem> => {
    try {
      setError(null);
      const response = await axiosInstance.put(endpoints.comissao.update.replace(':id', id), data);
      
      if (response.data.success) {
        const updatedComissao = response.data.data;
        setComissoes(prev => prev.map(comissao => 
          comissao.id === id ? updatedComissao : comissao
        ));
        return updatedComissao;
      }
      throw new Error(response.data.message || 'Erro ao atualizar comissão');
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Erro ao atualizar comissão';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, []);

  // Função para deletar comissão
  const deleteComissao = useCallback(async (id: string): Promise<void> => {
    try {
      setError(null);
      const response = await axiosInstance.delete(endpoints.comissao.delete.replace(':id', id));
      
      if (response.data.success) {
        setComissoes(prev => prev.filter(comissao => comissao.id !== id));
      } else {
        throw new Error(response.data.message || 'Erro ao deletar comissão');
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Erro ao deletar comissão';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, []);

  // Função para refetch
  const refetch = useCallback(() => {
    fetchComissoes();
  }, [fetchComissoes]);

  // Buscar comissões na montagem do componente
  useEffect(() => {
    fetchComissoes();
  }, [fetchComissoes]);

  return {
    comissoes,
    loading,
    error,
    refetch,
    createComissao,
    updateComissao,
    deleteComissao,
  };
}

// ----------------------------------------------------------------------
// HOOK PARA GERENCIAR UMA COMISSÃO ESPECÍFICA
// ----------------------------------------------------------------------

export function useComissao(id: string) {
  const [comissao, setComissao] = useState<IComissaoItem | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchComissao = useCallback(async () => {
    if (!id) return;

    try {
      setLoading(true);
      setError(null);
      
      const response = await axiosInstance.get(endpoints.comissao.details.replace(':id', id));
      
      if (response.data.success) {
        setComissao(response.data.data);
      } else {
        setComissao(null);
        setError(response.data.message || 'Comissão não encontrada');
      }
    } catch (err: any) {
      console.error('Erro ao buscar comissão:', err);
      setError(err.response?.data?.message || 'Erro ao buscar comissão');
      setComissao(null);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchComissao();
  }, [fetchComissao]);

  return {
    comissao,
    loading,
    error,
    refetch: fetchComissao,
  };
}