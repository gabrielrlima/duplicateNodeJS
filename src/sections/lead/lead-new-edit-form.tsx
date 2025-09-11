import type { IClientItem } from 'src/types/client';

import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { isValidPhoneNumber } from 'react-phone-number-input/input';

import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid2';
import Stack from '@mui/material/Stack';
import LoadingButton from '@mui/lab/LoadingButton';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { toast } from 'src/components/snackbar';
import { Form, Field, schemaHelper } from 'src/components/hook-form';

// ----------------------------------------------------------------------

export type NewClientSchemaType = zod.infer<typeof NewClientSchema>;

export const NewClientSchema = zod.object({
  name: zod.string().min(1, { message: 'Nome é obrigatório!' }),
  email: zod
    .string()
    .min(1, { message: 'Email é obrigatório!' })
    .email({ message: 'Email deve ser um endereço de email válido!' }),
  phoneNumber: schemaHelper.phoneNumber({ isValid: isValidPhoneNumber }),
  status: zod.string(),
  isVerified: zod.boolean(),
});

// ----------------------------------------------------------------------

type Props = {
  currentClient?: IClientItem;
};

export function LeadNewEditForm({ currentClient }: Props) {
  const router = useRouter();

  const defaultValues: NewClientSchemaType = {
    status: '',
    isVerified: true,
    name: '',
    email: '',
    phoneNumber: '',
  };

  const methods = useForm<NewClientSchemaType>({
    mode: 'onSubmit',
    resolver: zodResolver(NewClientSchema),
    defaultValues,
    values: currentClient,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      reset();
      toast.success(currentClient ? 'Atualizado com sucesso!' : 'Criado com sucesso!');
      router.push(paths.dashboard.client.list);
      console.info('DATA', data);
    } catch (error) {
      console.error(error);
    }
  });

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12 }}>
          <Card sx={{ p: 3 }}>
            <Stack spacing={3}>
              <Field.Text name="name" label="Nome" />
              <Field.Text name="email" label="Email" />
              <Field.Phone
                name="phoneNumber"
                label="Telefone"
                country={!currentClient ? 'BR' : undefined}
              />
            </Stack>

            <Stack direction="row" spacing={2} sx={{ mt: 3, justifyContent: 'flex-end' }}>
              <LoadingButton
                type="submit"
                variant="contained"
                loading={isSubmitting}
                sx={{ bgcolor: 'grey.800', '&:hover': { bgcolor: 'grey.900' } }}
              >
                Adicionar lead
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </Form>
  );
}
