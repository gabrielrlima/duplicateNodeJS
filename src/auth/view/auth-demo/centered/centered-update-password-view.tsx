import { z as zod } from 'zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useBoolean } from 'minimal-shared/hooks';
import { zodResolver } from '@hookform/resolvers/zod';

import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import LoadingButton from '@mui/lab/LoadingButton';
import InputAdornment from '@mui/material/InputAdornment';

import { paths } from 'src/routes/paths';
import { useSearchParams } from 'src/routes/hooks';

import { SentIcon } from 'src/assets/icons';

import { Iconify } from 'src/components/iconify';
import { Form, Field } from 'src/components/hook-form';

import { resetPassword } from '../../../context/jwt';
import { FormHead } from '../../../components/form-head';
import { FormReturnLink } from '../../../components/form-return-link';

// ----------------------------------------------------------------------

export type UpdatePasswordSchemaType = zod.infer<typeof UpdatePasswordSchema>;

export const UpdatePasswordSchema = zod
  .object({
    password: zod
      .string()
      .min(1, { message: 'Senha é obrigatória!' })
      .min(6, { message: 'Senha deve ter 6 caracteres.' }),
    confirmPassword: zod.string().min(1, { message: 'Confirme a senha!' }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'As senhas não coincidem',
    path: ['confirmPassword'],
  });

// ----------------------------------------------------------------------

export function CenteredUpdatePasswordView() {
  const showPassword = useBoolean();
  const searchParams = useSearchParams();

  const token = searchParams.get('token') || '';
  const emailFromQuery = searchParams.get('email') || '';

  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const defaultValues: UpdatePasswordSchemaType = {
    password: '',
    confirmPassword: '',
  };

  const methods = useForm<UpdatePasswordSchemaType>({
    resolver: zodResolver(UpdatePasswordSchema),
    defaultValues,
  });
  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      setError('');
      await resetPassword({
        email: emailFromQuery,
        token,
        password: data.password,
        passwordConfirmation: data.confirmPassword,
      });
      setSuccess(true);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Erro ao atualizar senha.');
    }
  });

  const renderForm = () => (
    <Box sx={{ gap: 3, display: 'flex', flexDirection: 'column' }}>
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

      {success && (
        <Box
          sx={{
            color: 'success.main',
            textAlign: 'center',
            mt: 1,
            mb: 1,
            p: 2,
            bgcolor: 'success.lighter',
            borderRadius: 1,
            typography: 'body2',
          }}
        >
          Senha atualizada com sucesso!
        </Box>
      )}

      <Field.Text
        name="password"
        label="Senha"
        placeholder="6+ caracteres"
        type={showPassword.value ? 'text' : 'password'}
        slotProps={{
          inputLabel: { shrink: true },
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
        type={showPassword.value ? 'text' : 'password'}
        slotProps={{
          inputLabel: { shrink: true },
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

      <LoadingButton
        fullWidth
        size="large"
        type="submit"
        variant="contained"
        loading={isSubmitting}
        loadingIndicator="Atualizando..."
      >
        Atualizar senha
      </LoadingButton>
    </Box>
  );

  return (
    <>
      <FormHead
        icon={<SentIcon />}
        title="Atualize sua senha"
        description="Defina uma nova senha para acessar sua conta."
      />

      <Form methods={methods} onSubmit={onSubmit}>
        {renderForm()}
      </Form>

      <FormReturnLink href={paths.auth.signIn} />
    </>
  );
}
