import type { IGrupo } from 'src/types/grupo';

import { useState, useEffect, useCallback } from 'react';

import axiosInstance, { endpoints } from 'src/lib/axios';

// ----------------------------------------------------------------------
// TIPOS
// ----------------------------------------------------------------------

export interface UseGruposReturn {
  grupos: IGrupo[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
  createGrupo: (data: Partial<IGrupo>) => Promise<IGrupo>;
  updateGrupo: (id: string, data: Partial<IGrupo>) => Promise<IGrupo>;
  deleteGrupo: (id: string) => Promise<void>;
}

// ----------------------------------------------------------------------
// HOOK PARA GERENCIAR GRUPOS
// ----------------------------------------------------------------------

export function useGrupos(): UseGruposReturn {
  const [grupos, setGrupos] = useState<IGrupo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Função para buscar grupos
  const fetchGrupos = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Usar um ID de imobiliária padrão para teste (deve vir do contexto do usuário)
      const realEstateId = '68b1df705757655b21fc5210';
      
      const response = await axiosInstance.get(`${endpoints.grupo.list}?real_estate_id=${realEstateId}`);
      
      if (response.data.success) {
        const fetchedGrupos = response.data.data.data || [];
        setGrupos(fetchedGrupos);
      } else {
        setGrupos([]);
      }
    } catch (err: any) {
      // Não logar 401 como erro para usuários não autenticados
      if (err.response?.status !== 401) {
        console.error('Erro ao buscar grupos:', err);
        setError(err.response?.data?.message || 'Erro ao carregar grupos');
      }
      setGrupos([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Função para criar grupo
  const createGrupo = useCallback(async (data: Partial<IGrupo>): Promise<IGrupo> => {
    try {
      setError(null);
      const response = await axiosInstance.post(endpoints.grupo.create, data);
      
      if (response.data.success) {
        const newGrupo = response.data.data;
        setGrupos(prev => [...prev, newGrupo]);
        return newGrupo;
      }
      
      throw new Error(response.data.message || 'Erro ao criar grupo');
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Erro ao criar grupo';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, []);

  // Função para atualizar grupo
  const updateGrupo = useCallback(async (id: string, data: Partial<IGrupo>): Promise<IGrupo> => {
    try {
      setError(null);
      const response = await axiosInstance.put(`${endpoints.grupo.update}/${id}`, data);
      
      if (response.data.success) {
        const updatedGrupo = response.data.data;
        setGrupos(prev => prev.map(grupo => grupo.id === id ? updatedGrupo : grupo));
        return updatedGrupo;
      }
      
      throw new Error(response.data.message || 'Erro ao atualizar grupo');
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Erro ao atualizar grupo';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, []);

  // Função para deletar grupo
  const deleteGrupo = useCallback(async (id: string): Promise<void> => {
    try {
      setError(null);
      const response = await axiosInstance.delete(`${endpoints.grupo.delete}/${id}`);
      
      if (response.data.success) {
        setGrupos(prev => prev.filter(grupo => grupo.id !== id));
      } else {
        throw new Error(response.data.message || 'Erro ao deletar grupo');
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Erro ao deletar grupo';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, []);

  // Função para refetch
  const refetch = useCallback(() => {
    fetchGrupos();
  }, [fetchGrupos]);

  // Buscar grupos na inicialização
  useEffect(() => {
    fetchGrupos();
  }, [fetchGrupos]);

  return {
    grupos,
    loading,
    error,
    refetch,
    createGrupo,
    updateGrupo,
    deleteGrupo,
  };
}

// ----------------------------------------------------------------------
// HOOK PARA GERENCIAR UM GRUPO ESPECÍFICO
// ----------------------------------------------------------------------

export function useGrupo(id: string) {
  const [grupo, setGrupo] = useState<IGrupo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchGrupo = useCallback(async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const response = await axiosInstance.get(`${endpoints.grupo.details}/${id}`);
      
      if (response.data.success) {
        setGrupo(response.data.data);
      } else {
        setError(response.data.message || 'Grupo não encontrado');
      }
    } catch (err: any) {
      console.error('Erro ao buscar grupo:', err);
      setError(err.response?.data?.message || 'Erro ao carregar grupo');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchGrupo();
  }, [fetchGrupo]);

  return {
    grupo,
    loading,
    error,
    refetch: fetchGrupo,
  };
}