import type { AxiosRequestConfig } from 'axios';

import axios from 'axios';

import { CONFIG } from 'src/global-config';

// ----------------------------------------------------------------------

const axiosInstance = axios.create({
  baseURL: CONFIG.serverUrl,
  // Cookies desabilitados, CSRF não é necessário
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    'X-Requested-With': 'XMLHttpRequest', // Importante para Laravel identificar como AJAX
  },
});

// Interceptor para requisições
axiosInstance.interceptors.request.use(
  (config) => {
    // Log apenas da URL para debug, sem dados sensíveis
    if (process.env.NODE_ENV === 'development') {
      console.log('Fazendo requisição para:', config.url);
    }
    
    // Adicionar token JWT se disponível
    const token = sessionStorage.getItem('sanctum_access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // IMPORTANTE: Detectar FormData e remover Content-Type para que o browser defina automaticamente
    if (config.data instanceof FormData) {
      // Remover Content-Type para FormData - o browser definirá automaticamente com boundary
      delete config.headers['Content-Type'];
      if (process.env.NODE_ENV === 'development') {
        console.log('🔧 [Axios] FormData detectado - removendo Content-Type para definição automática');
      }
    }
    
    return config;
  },
  (error) => {
    // Log de erro sem expor dados sensíveis
    if (process.env.NODE_ENV === 'development') {
      console.error('Erro na requisição:', error.message);
    }
    return Promise.reject(error);
  }
);

// Flag para evitar loops infinitos de refresh
let isRefreshing = false;
let failedQueue: Array<{ resolve: (value?: any) => void; reject: (reason?: any) => void }> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(token);
    }
  });
  
  failedQueue = [];
};

// Interceptor para respostas
axiosInstance.interceptors.response.use(
  (response) => {
    // Log apenas do status, SEM dados da resposta para proteger informações sensíveis
    if (process.env.NODE_ENV === 'development') {
      console.log('Resposta recebida:', response.status, 'para', response.config.url);
    }
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Log de erro sem expor dados sensíveis do usuário
    if (process.env.NODE_ENV === 'development') {
      console.error('Erro na resposta:', error.response?.status, 'para', error.config?.url);
      if (error.response?.status === 401) {
        console.error('🔑 Erro 401 - Token inválido ou expirado');
        console.error('🔍 Headers da requisição:', error.config?.headers);
      }
      if (error.response?.status === 422) {
        console.error('Detalhes do erro 422:', error.response?.data);
      }
    }

    // IMPORTANTE: Não interceptar erros 401 nas rotas de autenticação
    // Permitir que o componente de login trate o erro normalmente
    const isAuthRoute = originalRequest.url?.includes('/api/auth/login') || 
                       originalRequest.url?.includes('/api/auth/register') ||
                       originalRequest.url?.includes('/api/auth/forgot-password') ||
                       originalRequest.url?.includes('/api/auth/reset-password');

    // Se o erro for 401 (não autorizado) e não for uma tentativa de refresh
    if (error.response?.status === 401 && !originalRequest._retry && !isAuthRoute) {
      if (isRefreshing) {
        // Se já estamos fazendo refresh, adicionar à fila
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(token => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return axiosInstance(originalRequest);
        }).catch(err => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = sessionStorage.getItem('sanctum_access_token');
      
      if (refreshToken) {
        try {
          // Tentar fazer refresh do token
          const response = await axiosInstance.post('/api/auth/refresh-token', {
            refreshToken
          });
          
          const { token } = response.data;
          
          // Salvar novo token
          sessionStorage.setItem('sanctum_access_token', token);
          
          // Atualizar header padrão
          axiosInstance.defaults.headers.common.Authorization = `Bearer ${token}`;
          
          // Processar fila de requisições pendentes
          processQueue(null, token);
          
          // Tentar novamente a requisição original
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return axiosInstance(originalRequest);
          
        } catch (refreshError) {
          // Refresh falhou, fazer logout
          processQueue(refreshError, null);
          
          // Limpar tokens
          sessionStorage.removeItem('sanctum_access_token');
          delete axiosInstance.defaults.headers.common.Authorization;
          
          // Redirecionar para login apenas se não for rota de auth
          if (typeof window !== 'undefined' && !isAuthRoute) {
            window.location.href = '/auth/sign-in';
          }
          
          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      } else {
        // Não há token de refresh, redirecionar para login apenas se não for rota de auth
        if (typeof window !== 'undefined' && !isAuthRoute) {
          window.location.href = '/auth/sign-in';
        }
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;

// ----------------------------------------------------------------------

export const fetcher = async (args: string | [string, AxiosRequestConfig]) => {
  try {
    const [url, config] = Array.isArray(args) ? args : [args];

    const res = await axiosInstance.get(url, { ...config });

    return res.data;
  } catch (error) {
    // Log de erro sem expor dados sensíveis
    if (process.env.NODE_ENV === 'development') {
      console.error(
        'Falha ao buscar:',
        typeof error === 'object' && error && 'message' in error
          ? error.message
          : 'Erro desconhecido'
      );
    }
    throw error;
  }
};

// ----------------------------------------------------------------------

export const endpoints = {
  chat: '/api/chat',
  kanban: '/api/kanban',
  calendar: '/api/calendar',
  auth: {
    me: '/api/auth/me', // Endpoint padronizado conforme documentação
    signIn: '/api/auth/login', // Endpoint do Laravel
    signUp: '/api/auth/register', // Endpoint do backend Node.js criado
    checkEmail: '/api/auth/check-email', // Endpoint para verificar disponibilidade de email
    refresh: '/api/auth/refresh-token', // Refresh token JWT
    logout: '/api/auth/logout', // Logout JWT
    forgotPassword: '/api/auth/forgot-password', // Recuperação de senha
    resetPassword: '/api/auth/reset-password', // Reset de senha
    verifyEmail: '/api/administrator/validate-email', // Verificação de email
    resendVerification: '/api/auth/resend-verification-email', // Reenviar verificação
    sendVerificationCode: '/api/administrator/send-verification-token', // Enviar código de verificação
    verifyCode: '/api/administrator/validate-token', // Verificar código de verificação
    passwordRequirements: '/api/administrator/password-requirements',
    checkPasswordStrength: '/api/administrator/check-password-strength',
  },
  mail: { list: '/api/mail/list', details: '/api/mail/details', labels: '/api/mail/labels' },
  post: {
    list: '/api/post/list',
    details: '/api/post/details',
    latest: '/api/post/latest',
    search: '/api/post/search',
  },

  client: {
    list: '/api/client/list',
    details: '/api/client/details',
    search: '/api/client/search',
  },
  property: {
    list: '/api/products',
    details: '/api/products',
    search: '/api/products/search',
    stats: '/api/products/stats',
    filters: '/api/products/filters',
    create: '/api/products',
    update: '/api/products',
    delete: '/api/products',
  },
  // Unified products endpoint (same as property for compatibility)
  products: {
    list: '/api/products',
    details: '/api/products',
    search: '/api/products/search',
    stats: '/api/products/stats',
    filters: '/api/products/filters',
    create: '/api/products',
    update: '/api/products',
    delete: '/api/products',
  },
  user: {
    profile: '/api/user/profile', // Dados do usuário e organização
    update: '/api/users/profile', // Atualizar dados do usuário
  },
  realEstate: {
    list: '/api/real-estate',
    create: '/api/real-estate',
    details: '/api/real-estate',
    update: '/api/real-estate',
    delete: '/api/real-estate',
  },


  corretor: {
    list: '/api/corretor/list',
    details: '/api/corretor',
    search: '/api/corretor/search',
    create: '/api/corretor',
    update: '/api/corretor',
    delete: '/api/corretor',
  },
  grupo: {
    list: '/api/grupo/list',
    details: '/api/grupo',
    search: '/api/grupo/search',
    create: '/api/grupo',
    update: '/api/grupo',
    delete: '/api/grupo',
  },
  comissao: {
    list: '/api/comissao/list',
    details: '/api/comissao',
    search: '/api/comissao/search',
    totais: '/api/comissao/totais',
    create: '/api/comissao',
    update: '/api/comissao',
    delete: '/api/comissao',
  },
};
