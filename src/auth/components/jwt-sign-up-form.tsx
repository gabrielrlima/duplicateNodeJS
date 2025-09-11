import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { useState, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Fade from '@mui/material/Fade';
import Alert from '@mui/material/Alert';
import Slide from '@mui/material/Slide';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { Iconify } from 'src/components/iconify';
import { Form, Field } from 'src/components/hook-form';

import { useAuthContext } from '../hooks';
import { useAuthJWT } from '../hooks/use-auth-jwt';


// ----------------------------------------------------------------------

export type SignUpSchemaType = zod.infer<typeof SignUpSchema>;

export const SignUpSchema = zod.object({
  firstName: zod.string().min(2, { message: 'Nome deve ter pelo menos 2 caracteres!' }),
  lastName: zod.string().min(2, { message: 'Sobrenome deve ter pelo menos 2 caracteres!' }),
  email: zod
    .string()
    .min(1, { message: 'E-mail é obrigatório!' })
    .email({ message: 'E-mail deve ser um endereço válido!' }),
  password: zod
    .string()
    .min(1, { message: 'Senha é obrigatória!' })
    .min(8, { message: 'Senha deve ter pelo menos 8 caracteres!' })
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, {
      message: 'Senha deve conter ao menos: 1 maiúscula, 1 minúscula, 1 número e 1 caractere especial!'
    }),
  passwordConfirmation: zod.string().min(1, { message: 'Confirmação de senha é obrigatória!' }),
  phone: zod.string().optional(),
  businessId: zod.string().optional(),
}).refine((data) => data.password === data.passwordConfirmation, {
  message: "As senhas não coincidem!",
  path: ["passwordConfirmation"],
});

// ----------------------------------------------------------------------

type Props = {
  defaultValues?: Partial<SignUpSchemaType>;
};

export function JWTSignUpForm({ defaultValues }: Props) {
  const router = useRouter();
  const { checkUserSession } = useAuthContext();
  const { signUp, checkEmail, error, clearError } = useAuthJWT();

  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const methods = useForm<SignUpSchemaType>({
    resolver: zodResolver(SignUpSchema),
    defaultValues: defaultValues || {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      passwordConfirmation: '',
    },
  });

  const {
    handleSubmit,
    reset,
  } = methods;



  // Reset completo quando a página for recarregada
  useEffect(() => {
    // Resetar todos os campos do formulário
    reset({
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      passwordConfirmation: '',
    });
    
    // Resetar todos os estados locais
    setShowPassword(false);
    setErrorMsg('');
    setSuccessMsg('');
  }, [reset]); // Incluir reset como dependência



  const onSubmit = handleSubmit(async (data) => {
    try {
      setErrorMsg('');
      setSuccessMsg('');
      
      // Primeiro, verificar se o email já está cadastrado
      const checkEmailResponse = await checkEmail(data.email);
      
      // Se o email não está disponível (já existe), mostrar erro
      if (!checkEmailResponse.data?.is_available) {
        setErrorMsg('Este e-mail já está cadastrado. Tente fazer login ou use outro e-mail.');
        return;
      }
      
      // Fazer o cadastro direto
      await signUp({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password,
        passwordConfirmation: data.passwordConfirmation,
        phone: '',
        businessId: '',
      });

      // Mostrar mensagem de sucesso
      setSuccessMsg('Conta criada com sucesso! Redirecionando...');

      // Aguardar um momento para mostrar a mensagem
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Redirecionar diretamente para dashboard
      // O token já foi salvo na sessão pela função signUp
      router.push(paths.dashboard.root);
      
      // Atualizar contexto de autenticação em background (sem aguardar)
      setTimeout(() => {
        checkUserSession().catch(console.error);
      }, 100);
      
    } catch (err: any) {
      console.error('Erro no cadastro:', err);
      
      // Tratamento específico para diferentes tipos de erro
      let errorMessage = 'Erro ao criar conta. Tente novamente.';
      
      if (err.response?.status === 422) {
        errorMessage = err.response?.data?.message || 'Dados inválidos. Verifique as informações.';
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setErrorMsg(errorMessage);
    }
  });

  const renderHead = (
    <Box sx={{ textAlign: 'center', mb: 5 }}>
        <Box component="h4" sx={{ mb: 1, typography: 'h4' }}>
          Criar Conta
        </Box>
        <Box component="p" sx={{ color: 'text.secondary', typography: 'body2', mt: 1 }}>
          Já tem uma conta?
          <Link href={paths.auth.signIn} variant="subtitle2" sx={{ ml: 0.5 }}>
            Entrar
          </Link>
        </Box>
      </Box>
  );

  const renderForm = (
    <Box sx={{ gap: 3, display: 'flex', flexDirection: 'column', transition: 'all 0.3s ease-in-out' }}>
      <Field.Text
        name="firstName"
        label="Nome"
        placeholder="Seu nome"
        InputLabelProps={{ shrink: true }}
        autoComplete="given-name"
      />

      <Field.Text
        name="lastName"
        label="Sobrenome"
        placeholder="Seu sobrenome"
        InputLabelProps={{ shrink: true }}
        autoComplete="family-name"
      />

      <Field.Text
        name="email"
        label="E-mail"
        placeholder="exemplo@email.com"
        InputLabelProps={{ shrink: true }}
        autoComplete="email"
      />

      <Field.Text
        name="password"
        label="Senha"
        placeholder="Sua senha"
        type={showPassword ? 'text' : 'password'}
        InputLabelProps={{ shrink: true }}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                onClick={() => setShowPassword(!showPassword)}
                edge="end"
              >
                <Iconify icon={showPassword ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
              </IconButton>
            </InputAdornment>
          ),
        }}
        autoComplete="new-password"
      />

      <Field.Text
        name="passwordConfirmation"
        label="Confirmar Senha"
        placeholder="Confirme sua senha"
        type={showPassword ? 'text' : 'password'}
        InputLabelProps={{ shrink: true }}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                onClick={() => setShowPassword(!showPassword)}
                edge="end"
              >
                <Iconify icon={showPassword ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
              </IconButton>
            </InputAdornment>
          ),
        }}
        autoComplete="new-password"
      />

      <Button
        fullWidth
        size="large"
        type="submit"
        variant="contained"
      >
        Criar conta
      </Button>

      <Box sx={{ textAlign: 'center', color: 'text.secondary', typography: 'body2', px: 1 }}>
        Ao me inscrever, concordo com os{' '}
        <Box component="span" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
          termos de uso
        </Box>
        {' '}e a{' '}
        <Box component="span" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
          política de privacidade
        </Box>
        .
      </Box>
    </Box>
  );



  return (
    <>
      {renderHead}

      <Snackbar
        open={Boolean(errorMsg || error)}
        autoHideDuration={6000}
        onClose={() => {
          setErrorMsg('');
          if (error) {
            clearError();
          }
        }}
        TransitionComponent={Slide}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        sx={{ mt: 2 }}
        ClickAwayListenerProps={{
          onClickAway: () => {
            setErrorMsg('');
            if (error) {
              clearError();
            }
          }
        }}
      >
        <Alert 
          severity="error" 
          onClose={() => {
            setErrorMsg('');
            if (error) {
              clearError();
            }
          }}
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

      <Snackbar
        open={Boolean(successMsg)}
        autoHideDuration={6000}
        onClose={() => setSuccessMsg('')}
        TransitionComponent={Fade}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        sx={{ mt: 2 }}
        ClickAwayListenerProps={{
          onClickAway: () => setSuccessMsg('')
        }}
      >
        <Alert 
          severity="success" 
          onClose={() => setSuccessMsg('')}
          sx={{ 
            boxShadow: 3,
            borderRadius: 2,
            minWidth: 300,
            '& .MuiAlert-message': { fontWeight: 500 }
          }}
        >
          {successMsg}
        </Alert>
      </Snackbar>

      <Box sx={{
        '@keyframes shake': {
          '0%, 100%': { transform: 'translateX(0)' },
          '10%, 30%, 50%, 70%, 90%': { transform: 'translateX(-2px)' },
          '20%, 40%, 60%, 80%': { transform: 'translateX(2px)' }
        },
        '@keyframes fadeIn': {
          '0%': { opacity: 0, transform: 'translateY(-10px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' }
        }
      }} />

      <Form methods={methods} onSubmit={onSubmit}>
        {renderForm}
      </Form>
    </>
  );
}