import { useState, useCallback } from 'react';

import axios, { endpoints } from 'src/lib/axios';

import { setSession } from 'src/auth/context/jwt/utils';

import type { SignInParams, SignUpParams } from '../types';

// ----------------------------------------------------------------------

export function useAuthJWT() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Login com JWT
  const signIn = useCallback(async (params: SignInParams) => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(endpoints.auth.signIn, {
        email: params.email,
        password: params.password,
      });

      if (process.env.NODE_ENV === 'development') {
        console.log('📥 Resposta de login recebida:', {
          status: response.status,
          data: response.data
        });
      }

      // O backend retorna os dados dentro de response.data.data
      const responseData = response.data.data;
      
      if (!responseData) {
        throw new Error('Dados não encontrados na resposta do servidor');
      }

      const { token, user } = responseData;

      if (!token) {
        throw new Error('Token não recebido do servidor');
      }

      if (!user) {
        throw new Error('Dados do usuário não recebidos do servidor');
      }

      // Salvar token na sessão
      await setSession(token);

      // Salvar dados do usuário
      const userData = { ...user, accessToken: token };
      
      if (process.env.NODE_ENV === 'development') {
        console.log('✅ Login JWT realizado com sucesso:', {
          email: user.email,
          hasToken: !!token
        });
      }

      return userData;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Erro ao fazer login';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  // Registro com JWT
  const signUp = useCallback(async (params: SignUpParams & { phone?: string; businessId?: string }) => {
    setLoading(true);
    setError(null);

    try {
      if (process.env.NODE_ENV === 'development') {
        console.log('🚀 Iniciando registro com dados:', {
          firstName: params.firstName,
          lastName: params.lastName,
          email: params.email,
          hasPassword: !!params.password,
          phone: params.phone,
          businessId: params.businessId
        });
      }

      const payload = {
        firstName: params.firstName,
        lastName: params.lastName,
        email: params.email.toLowerCase().trim(),
        password: params.password,
        passwordConfirmation: params.password,
        phone: params.phone || '',
        businessId: params.businessId || '',
      };

      if (process.env.NODE_ENV === 'development') {
        console.log('📤 Enviando payload para:', endpoints.auth.signUp, payload);
      }

      const response = await axios.post(endpoints.auth.signUp, payload);

      if (process.env.NODE_ENV === 'development') {
        console.log('📥 Resposta recebida:', {
          status: response.status,
          statusText: response.statusText,
          data: response.data,
          headers: response.headers
        });
      }

      // Verificar se a resposta tem a estrutura esperada
      if (!response.data) {
        throw new Error('Resposta vazia do servidor');
      }

      // O backend retorna os dados dentro de response.data.data
      const responseData = response.data.data;
      
      if (!responseData) {
        throw new Error('Dados não encontrados na resposta do servidor');
      }

      const { token, user } = responseData;

      if (process.env.NODE_ENV === 'development') {
        console.log('🔍 Dados extraídos da resposta:', {
          hasToken: !!token,
          hasUser: !!user,
          tokenType: typeof token,
          userType: typeof user,
          responseData
        });
      }

      if (!token) {
        throw new Error('Token não recebido do servidor');
      }

      if (!user) {
        throw new Error('Dados do usuário não recebidos do servidor');
      }

      // Salvar token na sessão
      await setSession(token);

      // Salvar dados do usuário
      const userData = { ...user, accessToken: token };
      
      if (process.env.NODE_ENV === 'development') {
        console.log('✅ Registro JWT realizado com sucesso:', {
          email: user.email,
          hasToken: !!token,
          userData
        });
      }

      return userData;
    } catch (err: any) {
      if (process.env.NODE_ENV === 'development') {
        console.error('❌ Erro detalhado no registro:', {
          message: err.message,
          response: err.response,
          status: err.response?.status,
          statusText: err.response?.statusText,
          data: err.response?.data,
          stack: err.stack
        });
      }

      let errorMessage = 'Erro ao fazer registro';
      
      // Tratar diferentes tipos de erro
      if (err.response) {
        // Erro HTTP com resposta do servidor
        const { status, data } = err.response;
        
        if (data?.message) {
          errorMessage = data.message;
        } else if (data?.errors && Array.isArray(data.errors)) {
          // Erros de validação
          errorMessage = data.errors.map((e: any) => e.message).join(', ');
        } else {
          // Mensagens padrão baseadas no status
          switch (status) {
            case 400:
              errorMessage = 'Dados inválidos. Verifique as informações.';
              break;
            case 422:
              errorMessage = 'Este e-mail já está cadastrado.';
              break;
            case 500:
              errorMessage = 'Erro interno do servidor. Tente novamente.';
              break;
            default:
              errorMessage = `Erro no servidor (${status}). Tente novamente.`;
          }
        }
      } else if (err.request) {
        // Erro de rede (sem resposta do servidor)
        errorMessage = 'Erro de conexão. Verifique sua internet e tente novamente.';
      } else if (err.message) {
        // Outros erros
        errorMessage = err.message;
      }
      
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  // Verificação de disponibilidade de email
  const checkEmailAvailability = useCallback(async (email: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(endpoints.auth.checkEmail, {
        email: email.toLowerCase().trim(),
      });

      return response.data.data;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Erro ao verificar email';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  // Logout
  const signOut = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // Tentar fazer logout no servidor
      await axios.post(endpoints.auth.logout);
    } catch (err) {
      // Mesmo se falhar no servidor, limpar sessão local
      console.warn('Erro ao fazer logout no servidor:', err);
    } finally {
      // Sempre limpar sessão local
      await setSession(null);
      setLoading(false);
      
      if (process.env.NODE_ENV === 'development') {
        console.log('✅ Logout realizado');
      }
    }
  }, []);

  // Recuperação de senha
  const forgotPassword = useCallback(async (email: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(endpoints.auth.forgotPassword, { email });
      
      if (process.env.NODE_ENV === 'development') {
        console.log('✅ Email de recuperação enviado');
      }

      return response.data;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Erro ao enviar email de recuperação';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  // Reset de senha
  const resetPassword = useCallback(async (token: string, email: string, password: string, passwordConfirmation: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(endpoints.auth.resetPassword, {
        token,
        email,
        password,
        password_confirmation: passwordConfirmation,
      });
      
      if (process.env.NODE_ENV === 'development') {
        console.log('✅ Senha redefinida com sucesso');
      }

      return response.data;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Erro ao redefinir senha';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  // Verificação de email
  const verifyEmail = useCallback(async (email: string, token: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(endpoints.auth.verifyEmail, {
        email,
        token,
      });
      
      if (process.env.NODE_ENV === 'development') {
        console.log('✅ Email verificado com sucesso');
      }

      return response.data;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Erro ao verificar email';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  // Reenviar verificação de email
  const resendVerification = useCallback(async (email: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(endpoints.auth.resendVerification, { email });
      
      if (process.env.NODE_ENV === 'development') {
        console.log('✅ Email de verificação reenviado');
      }

      return response.data;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Erro ao reenviar email de verificação';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  // Enviar código de verificação para registro
  const sendVerificationCode = useCallback(async (email: string, name?: string, surname?: string) => {
    setLoading(true);
    setError(null);

    const payload: any = {
      email: email.toLowerCase().trim()
    };

    // Só adicionar name e surname se tiverem conteúdo válido
    if (name && name.trim().length >= 2) {
      payload.name = name.trim();
    }
    if (surname && surname.trim().length >= 2) {
      payload.surname = surname.trim();
    }

    if (process.env.NODE_ENV === 'development') {
      console.log('📤 Enviando dados para send-verification-token:', payload);
    }

    try {
      const response = await axios.post(endpoints.auth.sendVerificationCode, payload);
      
      if (process.env.NODE_ENV === 'development') {
        console.log('✅ Código de verificação enviado para:', email);
      }

      return response.data;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Erro ao enviar código de verificação';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  // Verificar código de verificação para registro
  const verifyCode = useCallback(async (email: string, code: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(endpoints.auth.verifyCode, { 
        email: email.toLowerCase().trim(),
        code: code.trim()
      });
      
      if (process.env.NODE_ENV === 'development') {
        console.log('✅ Código verificado com sucesso para:', email);
      }

      return response.data;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Código inválido ou expirado';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  // Refresh token
  const refreshToken = useCallback(async () => {
    try {
      const response = await axios.post(endpoints.auth.refresh);
      const { token } = response.data;
      
      if (token) {
        await setSession(token);
        
        if (process.env.NODE_ENV === 'development') {
          console.log('✅ Token renovado com sucesso');
        }
        
        return token;
      }
      
      throw new Error('Token não recebido');
    } catch (err: any) {
      console.error('Erro ao renovar token:', err);
      // Se falhar, fazer logout
      await setSession(null);
      throw err;
    }
  }, []);

  // Verificar se email já existe
  const checkEmail = useCallback(async (email: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(endpoints.auth.checkEmail, { 
        email: email.toLowerCase().trim() 
      });
      
      if (process.env.NODE_ENV === 'development') {
        console.log('✅ Email verificado:', email);
      }

      return response.data;
    } catch (err: any) {
      // Tratar erro 422 como resposta válida (email já existe)
      if (err.response?.status === 422) {
        return {
          success: false,
          message: err.response.data?.message || 'Email não disponível',
          data: {
            email: email.toLowerCase().trim(),
            is_available: false
          },
          error_type: 'email_already_exists'
        };
      }
      
      const errorMessage = err.response?.data?.message || 'Erro ao verificar email';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  // Obter requisitos de senha
  const passwordRequirements = useCallback(async () => {
    try {
      const response = await axios.get(endpoints.auth.passwordRequirements);
      
      if (process.env.NODE_ENV === 'development') {
        console.log('✅ Requisitos de senha obtidos');
      }

      return response.data;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Erro ao obter requisitos de senha';
      console.error(errorMessage);
      return null;
    }
  }, []);

  // Verificar força da senha
  const checkPasswordStrength = useCallback(async (password: string) => {
    try {
      const response = await axios.post(endpoints.auth.checkPasswordStrength, { 
        password 
      });
      
      if (process.env.NODE_ENV === 'development') {
        console.log('✅ Força da senha verificada');
      }

      return response.data;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Erro ao verificar força da senha';
      console.error(errorMessage);
      return null;
    }
  }, []);

  // Função para limpar o erro manualmente
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    loading,
    error,
    signIn,
    signUp,
    signOut,
    forgotPassword,
    resetPassword,
    verifyEmail,
    resendVerification,
    sendVerificationCode,
    verifyCode,
    refreshToken,
    checkEmail,
    checkEmailAvailability,
    passwordRequirements,
    checkPasswordStrength,
    clearError,
  };
}