import type { ReactNode } from 'react';
import type { RealEstate } from 'src/hooks/use-real-estate';

import { useState, useEffect, useContext, createContext } from 'react';

import { useRealEstate } from 'src/hooks/use-real-estate';

import { useAuthContext } from 'src/auth/hooks';

// ----------------------------------------------------------------------

type RealEstateContextType = {
  currentRealEstate: RealEstate | null;
  realEstates: RealEstate[];
  setCurrentRealEstate: (realEstate: RealEstate | null) => void;
  loading: boolean;
  switchingRealEstate: boolean;
  error: string | null;
  refreshRealEstates: () => Promise<void>;
  switchRealEstate: (realEstate: RealEstate) => Promise<void>;
};

const RealEstateContext = createContext<RealEstateContextType | undefined>(undefined);

// ----------------------------------------------------------------------

type RealEstateProviderProps = {
  children: ReactNode;
};

export function RealEstateProvider({ children }: RealEstateProviderProps) {
  const {
    realEstates,
    currentRealEstate,
    setCurrentRealEstate,
    fetchRealEstates,
    loading,
    error,
  } = useRealEstate();

  const { authenticated, loading: authLoading } = useAuthContext();
  const [isInitialized, setIsInitialized] = useState(false);
  const [switchingRealEstate, setSwitchingRealEstate] = useState(false);

  // Carregar imobiliárias apenas quando o usuário estiver autenticado
  useEffect(() => {
    const initializeRealEstates = async () => {
      if (!isInitialized && authenticated && !authLoading) {
        await fetchRealEstates();
        setIsInitialized(true);
      } else if (!authenticated && !authLoading) {
        // Reset quando o usuário desloga
        setIsInitialized(false);
      }
    };

    initializeRealEstates();
  }, [isInitialized, authenticated, authLoading, fetchRealEstates]);

  // Selecionar primeira imobiliária se não houver nenhuma selecionada
  useEffect(() => {
    if (realEstates.length > 0 && !currentRealEstate && isInitialized) {
      setCurrentRealEstate(realEstates[0]);
    }
  }, [realEstates, currentRealEstate, setCurrentRealEstate, isInitialized]);

  const refreshRealEstates = async () => {
    await fetchRealEstates();
  };

  const switchRealEstate = async (realEstate: RealEstate) => {
    setSwitchingRealEstate(true);
    
    try {
      // Definir a nova imobiliária como atual
      setCurrentRealEstate(realEstate);
      
      // Aguardar um breve momento para mostrar o loading
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Recarregar a página completamente
      window.location.reload();
    } catch (err) {
      console.error('Erro ao trocar imobiliária:', err);
      setSwitchingRealEstate(false);
    }
  };

  const contextValue: RealEstateContextType = {
    currentRealEstate,
    realEstates,
    setCurrentRealEstate,
    loading,
    switchingRealEstate,
    error,
    refreshRealEstates,
    switchRealEstate,
  };

  return (
    <RealEstateContext.Provider value={contextValue}>
      {children}
    </RealEstateContext.Provider>
  );
}

// ----------------------------------------------------------------------

export function useRealEstateContext(): RealEstateContextType {
  const context = useContext(RealEstateContext);
  
  if (context === undefined) {
    throw new Error('useRealEstateContext must be used within a RealEstateProvider');
  }
  
  return context;
}