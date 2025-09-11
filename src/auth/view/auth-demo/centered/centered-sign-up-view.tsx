import { z as zod } from 'zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useBoolean } from 'minimal-shared/hooks';
import { zodResolver } from '@hookform/resolvers/zod';
import { isValidPhoneNumber } from 'react-phone-number-input/input';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import IconButton from '@mui/material/IconButton';
import LoadingButton from '@mui/lab/LoadingButton';
import InputAdornment from '@mui/material/InputAdornment';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';

import { Iconify } from 'src/components/iconify';
import { AnimateLogoRotate } from 'src/components/animate';
import { Form, Field, schemaHelper } from 'src/components/hook-form';

import { signUp } from 'src/auth/context/jwt';
import { useAuthContext } from 'src/auth/hooks';
import { SignUpTerms } from 'src/auth/components/sign-up-terms';

import { FormHead } from '../../../components/form-head';

// ----------------------------------------------------------------------

export type SignUpSchemaType = zod.infer<typeof SignUpSchema>;

export const SignUpSchema = zod
  .object({
    firstName: zod.string().min(1, { message: 'Nome é obrigatório!' }),
    lastName: zod.string().min(1, { message: 'Sobrenome é obrigatório!' }),
    email: zod
      .string()
      .min(1, { message: 'Email é obrigatório!' })
      .email({ message: 'Email deve ser um endereço válido!' }),
    phone: schemaHelper.phoneNumber({
      isValid: isValidPhoneNumber,
      message: {
        required: 'Telefone é obrigatório!',
        invalid_type: 'Formato de telefone inválido!',
      },
    }),
    password: zod
      .string()
      .min(1, { message: 'Senha é obrigatória!' })
      .min(6, { message: 'Senha deve ter pelo menos 6 caracteres!' }),
    confirmPassword: zod.string().min(1, { message: 'Confirmação de senha é obrigatória!' }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'As senhas não coincidem',
    path: ['confirmPassword'],
  });

// ----------------------------------------------------------------------

export function CenteredSignUpView() {
  const router = useRouter();
  const { checkUserSession } = useAuthContext();
  const showPassword = useBoolean();
  const showConfirmPassword = useBoolean();
  const [error, setError] = useState('');

  const defaultValues: SignUpSchemaType = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  };

  const methods = useForm<SignUpSchemaType>({
    resolver: zodResolver(SignUpSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      setError('');

      await signUp({
        name: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        password: data.password,
        passwordConfirmation: data.confirmPassword,
        role: 'admin',
      });

      if (checkUserSession) {
        await checkUserSession();
      }

      router.push(paths.dashboard.root);
    } catch (err: any) {
      console.error(err);

      // Tratamento específico para diferentes tipos de erro
      let errorMessage = 'Erro ao criar conta';

      if (err.response?.status === 422) {
        const validationErrors = err.response?.data?.errors || {};

        // Verificar se é erro de email já cadastrado
        if (validationErrors.email) {
          const emailErrors = Array.isArray(validationErrors.email)
            ? validationErrors.email
            : [validationErrors.email];

          if (
            emailErrors.some(
              (emailError) =>
                emailError.toLowerCase().includes('já') ||
                emailError.toLowerCase().includes('already') ||
                emailError.toLowerCase().includes('exists') ||
                emailError.toLowerCase().includes('taken')
            )
          ) {
            errorMessage = 'Este email já está cadastrado. Tente fazer login ou use outro email.';
          } else {
            errorMessage = emailErrors.join(', ');
          }
        } else {
          // Outros erros de validação
          const errorMessages = Object.entries(validationErrors)
            .map(([field, messages]: [string, any]) => {
              const fieldName =
                {
                  name: 'Nome',
                  last_name: 'Sobrenome',
                  email: 'Email',
                  phone: 'Telefone',
                  password: 'Senha',
                }[field] || field;

              const errorList = Array.isArray(messages) ? messages : [messages];
              return `${fieldName}: ${errorList.join(', ')}`;
            })
            .join('\n');

          errorMessage = errorMessages || 'Erro de validação. Verifique os dados informados.';
        }
      } else if (err.message) {
        errorMessage = err.message;
      }

      setError(errorMessage);
    }
  });

  const renderForm = () => (
    <Box
      sx={{
        gap: 3,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Field.Text name="firstName" label="Nome" placeholder="Seu nome" />

      <Field.Text name="lastName" label="Sobrenome" placeholder="Seu sobrenome" />

      <Field.Text name="email" label="Seu e-mail" placeholder="Seu e-mail" />

      <Field.Phone name="phone" label="Telefone" country="BR" placeholder="Celular" />

      <Field.Text
        name="password"
        label="Crie uma senha"
        placeholder="Senha"
        type={showPassword.value ? 'text' : 'password'}
        slotProps={{
          input: {
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={showPassword.onToggle} edge="end">
                  <Iconify icon={showPassword.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
                </IconButton>
              </InputAdornment>
            ),
          },
        }}
      />

      <Field.Text
        name="confirmPassword"
        label="Confirme a senha"
        placeholder="Reescreva a senha"
        type={showConfirmPassword.value ? 'text' : 'password'}
        slotProps={{
          input: {
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={showConfirmPassword.onToggle} edge="end">
                  <Iconify
                    icon={showConfirmPassword.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'}
                  />
                </IconButton>
              </InputAdornment>
            ),
          },
        }}
      />

      {error && (
        <Box
          sx={{
            color: 'error.main',
            textAlign: 'center',
            mt: 1,
            mb: 1,
            p: 2,
            bgcolor: 'error.lighter',
            borderRadius: 1,
            typography: 'body2',
          }}
        >
          {error}
        </Box>
      )}

      <LoadingButton
        fullWidth
        color="inherit"
        size="large"
        type="submit"
        variant="contained"
        loading={isSubmitting}
        loadingIndicator="Criando conta..."
      >
        Criar conta
      </LoadingButton>
    </Box>
  );

  return (
    <>
      <AnimateLogoRotate sx={{ mb: 3, mx: 'auto' }} />

      <FormHead
        title="Comece totalmente grátis"
        description={
          <>
            {`Já possui uma conta? `}
            <Link
              component={RouterLink}
              href={paths.auth.signIn}
              variant="subtitle2"
              sx={{
                color: (theme) => (theme.palette.mode === 'dark' ? '#ffffff' : 'primary.main'),
                fontWeight: 600,
                textDecoration: 'underline',
                '&:hover': {
                  color: (theme) => (theme.palette.mode === 'dark' ? '#e0e0e0' : 'primary.dark'),
                  textDecoration: 'underline',
                },
              }}
            >
              Entrar
            </Link>
          </>
        }
      />

      <Form methods={methods} onSubmit={onSubmit}>
        {renderForm()}
      </Form>

      <SignUpTerms />
      {/* <FormDivider /> */}
      {/* <FormSocials
        signInWithGoogle={() => { }}
        singInWithGithub={() => { }}
        signInWithTwitter={() => { }}
      /> */}
    </>
  );
}
