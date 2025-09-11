import { z as zod } from 'zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Slide from '@mui/material/Slide';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import IconButton from '@mui/material/IconButton';
import LoadingButton from '@mui/lab/LoadingButton';
import InputAdornment from '@mui/material/InputAdornment';

import { paths } from 'src/routes/paths';
import { useRouter, useSearchParams } from 'src/routes/hooks';

import { Iconify } from 'src/components/iconify';
import { Form, Field } from 'src/components/hook-form';

import { useAuthContext } from '../hooks';
import { useAuthJWT } from '../hooks/use-auth-jwt';

import type { SignInParams } from '../types';

// ----------------------------------------------------------------------

export type SignInSchemaType = zod.infer<typeof SignInSchema>;

export const SignInSchema = zod.object({
  email: zod
    .string()
    .min(1, { message: 'E-mail é obrigatório!' })
    .email({ message: 'E-mail deve ser um endereço válido!' }),
  password: zod
    .string()
    .min(1, { message: 'Senha é obrigatória!' })
    .min(6, { message: 'Senha deve ter pelo menos 6 caracteres!' }),
});

// ----------------------------------------------------------------------

type Props = {
  defaultValues?: SignInParams;
};

export function JWTSignInForm({ defaultValues }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { checkUserSession } = useAuthContext();
  const { signIn, loading, error } = useAuthJWT();

  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const methods = useForm<SignInSchemaType>({
    resolver: zodResolver(SignInSchema),
    defaultValues: defaultValues || {
      email: '',
      password: '',
    },
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      setErrorMsg('');
      setSnackbarOpen(false);
      
      // Fazer login
      await signIn({
        email: data.email,
        password: data.password,
      });

      // Atualizar contexto de autenticação
      await checkUserSession();

      // Redirecionar
      const returnTo = searchParams.get('returnTo');
      
      if (returnTo) {
        router.push(returnTo);
      } else {
        router.push(paths.dashboard.root);
      }
      
    } catch (err: any) {
      console.error('Erro no login:', err);
      
      // Capturar mensagens de erro específicas do backend
      let message = 'Erro ao fazer login. Tente novamente.';
      
      if (err.response?.data?.errors) {
        const errors = err.response.data.errors;
        if (errors.email) {
          message = errors.email[0];
        } else if (errors.password) {
          message = errors.password[0];
        } else if (err.response?.data?.message) {
          message = err.response.data.message;
        }
      } else if (err.response?.data?.message) {
        message = err.response.data.message;
      }
      
      setErrorMsg(message);
      setSnackbarOpen(true);
    }
  });

  const renderHead = (
    <Box sx={{ textAlign: 'center', mb: 5 }}>
      <Box component="h4" sx={{ mb: 1, typography: 'h4' }}>
        Entrar
      </Box>
      <Box component="p" sx={{ color: 'text.secondary', typography: 'body2' }}>
        Não tem uma conta?
        <Link href={paths.auth.signUp} variant="subtitle2" sx={{ ml: 0.5 }}>
          Criar conta
        </Link>
      </Box>
    </Box>
  );

  const renderForm = (
    <Box sx={{ gap: 3, display: 'flex', flexDirection: 'column', transition: 'all 0.3s ease-in-out', animation: 'fadeIn 0.3s ease-in-out' }}>
      <Field.Text
        name="email"
        label="E-mail"
        placeholder="exemplo@email.com"
        InputLabelProps={{ shrink: true }}
        autoComplete="email"
        sx={{
          '& .MuiOutlinedInput-root': {
            transition: 'all 0.3s ease-in-out',
            '&.Mui-focused': {
              borderColor: 'primary.main',
            },
          },
        }}
      />

      <Box sx={{ gap: 1.5, display: 'flex', flexDirection: 'column' }}>
        <Link
          component="button"
          type="button"
          onClick={() => router.push(paths.auth.resetPassword)}
          variant="body2"
          color="inherit"
          sx={{ alignSelf: 'flex-end' }}
        >
          Esqueceu a senha?
        </Link>

        <Field.Text
          name="password"
          label="Senha"
          placeholder="Sua senha"
          type={showPassword ? 'text' : 'password'}
          InputLabelProps={{ shrink: true }}
          sx={{
            '& .MuiOutlinedInput-root': {
              transition: 'all 0.3s ease-in-out',
              '&.Mui-focused': {
                borderColor: 'primary.main',
              },
            },
          }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setShowPassword(!showPassword)}
                  edge="end"
                  sx={{
                    transition: 'all 0.3s ease-in-out',
                    '&:hover': {
                      backgroundColor: 'action.hover',
                    },
                  }}
                >
                  <Iconify icon={showPassword ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
          autoComplete="current-password"
        />
      </Box>

      <LoadingButton
        fullWidth
        color="inherit"
        size="large"
        type="submit"
        variant="contained"
        loading={loading || isSubmitting}
        loadingIndicator="Entrando..."
        sx={{
          transition: 'all 0.3s ease-in-out',
          '&:hover': {
            transform: 'translateY(-1px)',
            boxShadow: 4,
          },
          '&:active': {
            transform: 'translateY(0)',
            boxShadow: 2,
          },
          '&.Mui-disabled': {
            opacity: 0.7,
          },
        }}
      >
        Entrar
      </LoadingButton>
    </Box>
  );

  return (
    <>
      {renderHead}

      <Form methods={methods} onSubmit={onSubmit}>
        {renderForm}
      </Form>

      <Snackbar
        open={Boolean(errorMsg || error)}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        TransitionComponent={Slide}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        sx={{ mt: 2 }}
        ClickAwayListenerProps={{
          onClickAway: () => setSnackbarOpen(false)
        }}
      >
        <Alert 
          severity="error" 
          variant="filled"
          onClose={() => setSnackbarOpen(false)}
          sx={{ 
            boxShadow: 3,
            borderRadius: 2,
            minWidth: 300,
            '& .MuiAlert-message': { fontWeight: 500 },
            animation: 'shake 0.5s ease-in-out'
          }}
        >
          {errorMsg || error}
        </Alert>
      </Snackbar>

      <Box
        component="style"
        dangerouslySetInnerHTML={{
          __html: `
            @keyframes shake {
              0%, 100% { transform: translateX(0); }
              10%, 30%, 50%, 70%, 90% { transform: translateX(-2px); }
              20%, 40%, 60%, 80% { transform: translateX(2px); }
            }
            
            @keyframes fadeIn {
              from { opacity: 0; transform: translateY(-10px); }
              to { opacity: 1; transform: translateY(0); }
            }
            
            .shake {
              animation: shake 0.5s ease-in-out;
            }
            
            .fadeIn {
              animation: fadeIn 0.3s ease-in-out;
            }
          `,
        }}
        sx={{ display: 'none' }}
      />
    </>
  );
}