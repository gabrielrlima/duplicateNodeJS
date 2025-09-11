import { useState, useEffect, useCallback } from 'react';

import axiosInstance, { endpoints } from 'src/lib/axios';

// Tipos para as imobiliárias
export interface RealEstate {
  id: string;
  name: string;
  cnpj: string;
  tradeName?: string;
  description?: string;
  email?: string;
  phone: string;
  website?: string;
  address: {
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  contacts?: {
    name: string;
    role: string;
    email?: string;
    phone?: string;
  }[];
  businessHours?: {
    monday?: { open: string; close: string; };
    tuesday?: { open: string; close: string; };
    wednesday?: { open: string; close: string; };
    thursday?: { open: string; close: string; };
    friday?: { open: string; close: string; };
    saturday?: { open: string; close: string; };
    sunday?: { open: string; close: string; };
  };
  logo?: string;
  documents?: {
    type: string;
    url: string;
    uploadedAt: Date;
  }[];
  socialMedia?: {
    facebook?: string;
    instagram?: string;
    linkedin?: string;
    twitter?: string;
  };
  isActive: boolean;
  isVerified: boolean;
  foundedAt?: Date;
  employeeCount?: number;
  specialties?: string[];
  serviceAreas?: string[];
  ownerId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateRealEstateData {
  name: string;
  cnpj: string;
  tradeName?: string;
  description?: string;
  email?: string;
  phone?: string;
  website?: string;
  address?: {
    street?: string;
    number?: string;
    complement?: string;
    neighborhood?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  };
  contacts?: {
    name: string;
    role: string;
    email?: string;
    phone?: string;
  }[];
  specialties?: string[];
  serviceAreas?: string[];
  logo?: File;
}

interface UseRealEstateReturn {
  realEstates: RealEstate[];
  currentRealEstate: RealEstate | null;
  loading: boolean;
  error: string | null;
  fetchRealEstates: () => Promise<void>;
  createRealEstate: (data: CreateRealEstateData) => Promise<RealEstate>;
  updateRealEstate: (id: string, data: Partial<CreateRealEstateData>) => Promise<RealEstate>;
  deleteRealEstate: (id: string) => Promise<void>;
  setCurrentRealEstate: (realEstate: RealEstate | null) => void;
  getCurrentRealEstateFromStorage: () => RealEstate | null;
}

const CURRENT_REAL_ESTATE_KEY = 'currentRealEstate';

export function useRealEstate(): UseRealEstateReturn {
  const [realEstates, setRealEstates] = useState<RealEstate[]>([]);
  const [currentRealEstate, setCurrentRealEstateState] = useState<RealEstate | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Função para buscar imobiliárias do usuário
  const fetchRealEstates = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Verificar se o usuário está autenticado antes de fazer a chamada
      const token = sessionStorage.getItem('sanctum_access_token');
      if (!token) {
        setRealEstates([]);
        setCurrentRealEstateState(null);
        return;
      }
      
      const response = await axiosInstance.get(endpoints.realEstate.list);
      
      if (response.data.success) {
        const fetchedRealEstates = response.data.data.realEstates;
        setRealEstates(fetchedRealEstates);
        
        // Se não há imobiliária atual selecionada, selecionar a primeira
        setCurrentRealEstateState(prev => {
          if (!prev && fetchedRealEstates.length > 0) {
            const stored = getCurrentRealEstateFromStorage();
            const realEstateToSet = stored && fetchedRealEstates.find((re: RealEstate) => re.id === stored.id) 
              ? stored 
              : fetchedRealEstates[0];
            return realEstateToSet;
          }
          return prev;
        });
      }
    } catch (err: any) {
      // Não logar 401 como erro para usuários não autenticados
      if (err.response?.status !== 401) {
        console.error('Erro ao buscar imobiliárias:', err);
        setError(err.response?.data?.message || 'Erro ao buscar imobiliárias');
      } else {
        // Limpar dados quando não autenticado
        setRealEstates([]);
        setCurrentRealEstateState(null);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  // Função para criar nova imobiliária
  const createRealEstate = useCallback(async (data: CreateRealEstateData): Promise<RealEstate> => {
    try {
      setLoading(true);
      setError(null);
      
      const formData = new FormData();
      
      // Adicionar apenas os campos obrigatórios: name, cnpj e logo
      formData.append('name', data.name);
      formData.append('cnpj', data.cnpj);
      
      // Adicionar logo se houver
      if (data.logo) {
        formData.append('logo', data.logo);
      }
      
      // Campos opcionais
      if (data.tradeName) formData.append('tradeName', data.tradeName);
      if (data.email) formData.append('email', data.email);
      if (data.phone) formData.append('phone', data.phone);
      if (data.website) formData.append('website', data.website);
      if (data.description) formData.append('description', data.description);
      if (data.address) formData.append('address', JSON.stringify(data.address));
      if (data.contacts) formData.append('contacts', JSON.stringify(data.contacts));
      if (data.specialties) formData.append('specialties', JSON.stringify(data.specialties));
      if (data.serviceAreas) formData.append('serviceAreas', JSON.stringify(data.serviceAreas));
      
      const response = await axiosInstance.post(endpoints.realEstate.create, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      if (response.data.success) {
        const newRealEstate = response.data.data.realEstate;
        
        // Atualizar a lista de imobiliárias
        setRealEstates(prev => [newRealEstate, ...prev]);
        
        // Sempre definir a nova imobiliária como atual
        setCurrentRealEstateState(newRealEstate);
        localStorage.setItem(CURRENT_REAL_ESTATE_KEY, JSON.stringify(newRealEstate));
        
        return newRealEstate;
      }
      
      throw new Error('Erro ao criar imobiliária');
    } catch (err: any) {
      console.error('Erro ao criar imobiliária:', err);
      const errorMessage = err.response?.data?.message || 'Erro ao criar imobiliária';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  // Função para atualizar imobiliária
  const updateRealEstate = useCallback(async (id: string, data: Partial<CreateRealEstateData>): Promise<RealEstate> => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axiosInstance.put(`${endpoints.realEstate.update}/${id}`, data);
      
      if (response.data.success) {
        const updatedRealEstate = response.data.data.realEstate;
        
        setRealEstates(prev => 
          prev.map(re => re.id === id ? updatedRealEstate : re)
        );
        
        // Se a imobiliária atualizada é a atual, atualizar também
        if (currentRealEstate?.id === id) {
          setCurrentRealEstateState(updatedRealEstate);
          localStorage.setItem(CURRENT_REAL_ESTATE_KEY, JSON.stringify(updatedRealEstate));
        }
        
        return updatedRealEstate;
      }
      
      throw new Error('Erro ao atualizar imobiliária');
    } catch (err: any) {
      console.error('Erro ao atualizar imobiliária:', err);
      const errorMessage = err.response?.data?.message || 'Erro ao atualizar imobiliária';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [currentRealEstate]);

  // Função para deletar imobiliária
  const deleteRealEstate = useCallback(async (id: string): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axiosInstance.delete(`${endpoints.realEstate.delete}/${id}`);
      
      if (response.data.success) {
        const updatedRealEstates = realEstates.filter(re => re.id !== id);
        setRealEstates(updatedRealEstates);
        
        // Se a imobiliária deletada era a atual
        if (currentRealEstate?.id === id) {
          // Se ainda há imobiliárias disponíveis, selecionar a primeira
          if (updatedRealEstates.length > 0) {
            const firstRealEstate = updatedRealEstates[0];
            setCurrentRealEstateState(firstRealEstate);
            localStorage.setItem(CURRENT_REAL_ESTATE_KEY, JSON.stringify(firstRealEstate));
          } else {
            // Se não há mais imobiliárias, limpar seleção
            setCurrentRealEstateState(null);
            localStorage.removeItem(CURRENT_REAL_ESTATE_KEY);
          }
        }
      }
    } catch (err: any) {
      console.error('Erro ao deletar imobiliária:', err);
      const errorMessage = err.response?.data?.message || 'Erro ao deletar imobiliária';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [currentRealEstate, realEstates]);

  // Função para definir imobiliária atual
  const setCurrentRealEstate = useCallback((realEstate: RealEstate | null) => {
    setCurrentRealEstateState(realEstate);
    
    if (realEstate) {
      localStorage.setItem(CURRENT_REAL_ESTATE_KEY, JSON.stringify(realEstate));
    } else {
      localStorage.removeItem(CURRENT_REAL_ESTATE_KEY);
    }
  }, []);

  // Função para recuperar imobiliária atual do localStorage
  const getCurrentRealEstateFromStorage = useCallback((): RealEstate | null => {
    try {
      const stored = localStorage.getItem(CURRENT_REAL_ESTATE_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch (err) {
      console.error('Erro ao recuperar imobiliária atual do localStorage:', err);
      return null;
    }
  }, []);

  // Carregar imobiliárias ao montar o componente
  useEffect(() => {
    fetchRealEstates();
  }, [fetchRealEstates]);

  // Carregar imobiliária atual do localStorage ao montar
  useEffect(() => {
    const stored = getCurrentRealEstateFromStorage();
    if (stored) {
      setCurrentRealEstateState(stored);
    }
  }, [getCurrentRealEstateFromStorage]);

  return {
    realEstates,
    currentRealEstate,
    loading,
    error,
    fetchRealEstates,
    createRealEstate,
    updateRealEstate,
    deleteRealEstate,
    setCurrentRealEstate,
    getCurrentRealEstateFromStorage,
  };
}