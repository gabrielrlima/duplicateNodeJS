import axios from 'src/lib/axios';

import { SANCTUM_TOKEN_KEY } from './constant';

// ----------------------------------------------------------------------

// Função para decodificar JWT token
export function jwtDecode(token: string) {
  try {
    if (!token) return null;

    // JWT tem 3 partes separadas por ponto: header.payload.signature
    const parts = token.split('.');
    if (parts.length !== 3) {
      throw new Error('Token JWT inválido!');
    }

    // Decodificar o payload (segunda parte)
    const payload = JSON.parse(atob(parts[1]));
    
    return {
      ...payload,
      valid: true,
    };
  } catch (error) {
    console.error('Erro ao decodificar JWT:', error);
    return null;
  }
}

// ----------------------------------------------------------------------

export function isValidToken(accessToken: string) {
  if (!accessToken) {
    return false;
  }

  try {
    // Para tokens JWT, verificamos se pode ser decodificado e se não expirou
    const tokenData = jwtDecode(accessToken);
    
    if (!tokenData) {
      return false;
    }

    // Verificar se o token não expirou
    const currentTime = Math.floor(Date.now() / 1000);
    if (tokenData.exp && tokenData.exp < currentTime) {
      console.log('Token JWT expirado');
      return false;
    }

    return true;
  } catch (error) {
    console.error('Erro durante validação do token JWT:', error);
    return false;
  }
}

// ----------------------------------------------------------------------

export async function setSession(accessToken: string | null) {
  try {
    if (accessToken) {
      sessionStorage.setItem(SANCTUM_TOKEN_KEY, accessToken);
      axios.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
    } else {
      sessionStorage.removeItem(SANCTUM_TOKEN_KEY);
      delete axios.defaults.headers.common.Authorization;
    }
  } catch (error) {
    console.error('Erro durante definição da sessão:', error);
    throw error;
  }
}
