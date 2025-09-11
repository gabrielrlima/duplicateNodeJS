import { z as zod } from 'zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Box from '@mui/material/Box';
import LoadingButton from '@mui/lab/LoadingButton';

import { paths } from 'src/routes/paths';

import { PasswordIcon } from 'src/assets/icons';

import { Form, Field } from 'src/components/hook-form';

import { forgotPassword } from '../../../context/jwt';
import { FormHead } from '../../../components/form-head';
import { FormReturnLink } from '../../../components/form-return-link';

// ----------------------------------------------------------------------

export type ResetPasswordSchemaType = zod.infer<typeof ResetPasswordSchema>;

export const ResetPasswordSchema = zod.object({
  email: zod
    .string()
    .min(1, { message: 'Email é obrigatório!' })
    .email({ message: 'Email deve ser um endereço válido!' }),
});

// ----------------------------------------------------------------------

export function CenteredResetPasswordView() {
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const defaultValues: ResetPasswordSchemaType = {
    email: '',
  };

  const methods = useForm<ResetPasswordSchemaType>({
    resolver: zodResolver(ResetPasswordSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      setError('');
      await forgotPassword(data.email);
      setSuccess(true);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Erro ao solicitar redefinição de senha.');
    }
  });

  const renderForm = () => (
    <Box sx={{ gap: 3, display: 'flex', flexDirection: 'column' }}>
      <Field.Text
        name="email"
        label="Email"
        placeholder="example@gmail.com"
        autoFocus
        slotProps={{ inputLabel: { shrink: true } }}
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
          Verifique seu email e siga as instruções para redefinir a senha.
        </Box>
      )}

      <LoadingButton
        fullWidth
        size="large"
        type="submit"
        variant="contained"
        loading={isSubmitting}
        loadingIndicator="Enviando solicitação..."
      >
        Enviar solicitação
      </LoadingButton>
    </Box>
  );

  return (
    <>
      <FormHead
        icon={<PasswordIcon />}
        title="Esqueceu sua senha?"
        description="Digite seu email e enviaremos um link para você redefinir sua senha."
      />

      <Form methods={methods} onSubmit={onSubmit}>
        {renderForm()}
      </Form>

      <FormReturnLink href={paths.auth.signIn} />
    </>
  );
}
