import axios, { endpoints } from 'src/lib/axios';

import { setSession } from './utils';

// ----------------------------------------------------------------------

export type SignInParams = {
  email: string;
  password: string;
};

export type SignUpParams = {
  name: string;
  lastName: string;
  email: string;
  phone?: string;
  password: string;
  passwordConfirmation: string;
  role?: string;
  businessId?: string;
  verificationCode?: string;
};

// ----------------------------------------------------------------------

/** **************************************
 * Sign in
 *************************************** */
export const signInWithPassword = async ({ email, password }: SignInParams): Promise<void> => {
  try {
    const params = { email, password };

    console.log('🔐 [Login] Iniciando login para:', email);
    
    const res = await axios.post(endpoints.auth.signIn, params);

    console.log('📡 [Login] Resposta recebida - Status:', res.status);
    console.log('📡 [Login] Estrutura completa da resposta:', JSON.stringify(res.data, null, 2));
    console.log('📡 [Login] Dados da resposta:', {
      hasToken: !!res.data.data?.token,
      hasError: !!res.data.error,
      message: res.data.message,
      success: res.data.success,
      hasData: !!res.data.data
    });

    // Verifica se a resposta foi bem-sucedida (status 200-299)
    if (res.status < 200 || res.status >= 300) {
      console.error('❌ [Login] Status de erro:', res.status);
      throw new Error('Erro na autenticação');
    }

    // Verifica se houve erro na resposta
    if (res.data.error) {
      console.error('❌ [Login] Erro na resposta:', res.data.error);
      throw new Error(res.data.error);
    }

    // Verifica se o email não foi verificado
    if (res.data.message === 'Email ainda não verificado.') {
      console.error('❌ [Login] Email não verificado');
      throw new Error('Email ainda não verificado.');
    }

    // Acessa o token corretamente da estrutura aninhada
    const token = res.data.data?.token;

    if (!token) {
      console.error('❌ [Login] Token não encontrado na resposta');
      console.error('❌ [Login] Estrutura da resposta:', res.data);
      throw new Error('Token de acesso não encontrado na resposta');
    }

    console.log('✅ [Login] Token recebido, salvando sessão...');
    await setSession(token);
    console.log('✅ [Login] Login concluído com sucesso!');
    
  } catch (error: any) {
    console.error('❌ [Login] Erro durante o login:', {
      message: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      responseData: error.response?.data,
      isAxiosError: error.isAxiosError
    });

    // Se for um erro do Axios, extrai a mensagem da resposta
    if (error.response?.data?.error) {
      throw new Error(error.response.data.error);
    }

    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }

    // Se for erro 401, usar mensagem específica
    if (error.response?.status === 401) {
      throw new Error('Credenciais inválidas');
    }

    throw error;
  }
};

/** **************************************
 * Sign up
 *************************************** */
export const signUp = async ({
  name,
  lastName,
  email,
  phone,
  password,
  passwordConfirmation,
  role = 'corretor',
  businessId = '',
  verificationCode = '',
}: SignUpParams & { businessId?: string; verificationCode?: string }): Promise<{ user: any; token: string }> => {
  const params = {
    firstName: name,
    lastName,
    email,
    phone,
    password,
    password_confirmation: passwordConfirmation,
    role,
    businessId,
    verification_code: verificationCode,
  };

  try {
    const res = await axios.post(endpoints.auth.signUp, params);

    const { token, user } = res.data;

    if (!token || !user) {
      throw new Error('Token ou usuário não encontrado na resposta');
    }

    setSession(token);

    return { user, token };
  } catch (error: any) {
    console.error('Erro durante o cadastro:', error);

    // Se for um erro do Axios, extrai a mensagem da resposta
    if (error.response?.data?.error) {
      throw new Error(error.response.data.error);
    }

    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }

    throw error;
  }
};

/** **************************************
 * Sign out
 *************************************** */
export const signOut = async (): Promise<void> => {
  try {
    await setSession(null);
  } catch (error) {
    console.error('Erro durante o logout:', error);
    throw error;
  }
};

/** **************************************
 * Forgot password
 *************************************** */
export const forgotPassword = async (email: string): Promise<void> => {
  try {
    await axios.post('/api/auth/forgot-password', { email });
  } catch (error: any) {
    console.error('Erro ao solicitar redefinição de senha:', error);

    if (error.response?.data?.error) {
      throw new Error(error.response.data.error);
    }

    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }

    throw error;
  }
};

/** **************************************
 * Reset password
 *************************************** */
export type ResetPasswordParams = {
  email: string;
  token: string;
  password: string;
  passwordConfirmation: string;
};

export const resetPassword = async ({
  email,
  token,
  password,
  passwordConfirmation,
}: ResetPasswordParams): Promise<void> => {
  try {
    await axios.post('/api/auth/reset-password', {
      email,
      token,
      password,
      password_confirmation: passwordConfirmation,
    });
  } catch (error: any) {
    console.error('Erro ao redefinir senha:', error);

    if (error.response?.data?.error) {
      throw new Error(error.response.data.error);
    }

    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }

    throw error;
  }
};
