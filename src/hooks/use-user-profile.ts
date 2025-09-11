import useSWR from 'swr';
import { useMemo } from 'react';

import { fetcher, endpoints } from 'src/lib/axios';

// ----------------------------------------------------------------------

// Tipos para os dados do perfil do usuário
export interface UserProfileData {
  id: string;
  name: string;
  email: string;
  organization?: {
    id: string;
    name: string;
    type: string; // real_estate, construction, etc.
    size: string; // 1-10, 10-50, etc.
  };
}

// ----------------------------------------------------------------------

/**
 * Hook para buscar dados do perfil do usuário
 * Usa o endpoint /api/auth/me com nova estrutura simplificada
 */
export const useUserProfile = () => {
  const { data, error, isLoading, mutate } = useSWR(endpoints.auth.me, fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    dedupingInterval: 30000, // 30 seconds deduplication
  });

  return {
    user: data, // Nova estrutura: dados diretamente na raiz
    userLoading: isLoading,
    userError: error,
    userEmpty: !isLoading && !data,
    mutate,
  };
};

// ----------------------------------------------------------------------

/**
 * Hook específico para dados da organização
 * Usa a nova estrutura simplificada do backend
 */
export const useOrganizationData = () => {
  const { user, userLoading, userError } = useUserProfile();

  const organizationData = useMemo(() => {
    if (!user) return null;

    // Nova estrutura simplificada: dados diretamente na raiz
    return {
      // Company Information - usando os novos campos diretos
      phone: user.telefone || '',
      email: user.email || '',
    };
  }, [user]);

  return useMemo(
    () => ({
      organizationData,
      isLoading: userLoading,
      error: userError,
    }),
    [organizationData, userLoading, userError]
  );
};
