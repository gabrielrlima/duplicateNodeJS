import type { IVendasItem } from 'src/types/vendas';

import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { useEffect, useCallback } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import CardHeader from '@mui/material/CardHeader';
import LoadingButton from '@mui/lab/LoadingButton';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { _clientList } from 'src/_mock';
import { useGetProperties } from 'src/actions/property';

import { toast } from 'src/components/snackbar';
import { Form, Field } from 'src/components/hook-form';

// ----------------------------------------------------------------------

export type NewVendasSchemaType = zod.infer<typeof NewVendasSchema>;

export const NewVendasSchema = zod.object({
  name: zod.string().optional(),
  isNewClient: zod.boolean(),
  clientName: zod.string().optional(),
  clientPhone: zod.string().optional(),
  clientEmail: zod.string().optional(),
  code: zod.string().min(1, { message: 'Product code is required!' }),
  unitType: zod.string().optional(),
  availableUnits: zod.string().optional(),
});

// ----------------------------------------------------------------------

type Props = {
  currentVendas?: IVendasItem;
  onValidationChange?: (isValid: boolean) => void;
  onSubmittingChange?: (isSubmitting: boolean) => void;
  onCreateAtendimento?: () => void;
  isCreatingAtendimento?: boolean;
};

export function VendasNewEditForm({
  currentVendas,
  onValidationChange,
  onSubmittingChange,
  onCreateAtendimento,
  isCreatingAtendimento = false,
}: Props) {
  const { properties } = useGetProperties();
  const router = useRouter();

  const defaultValues: NewVendasSchemaType = {
    name: '',
    isNewClient: false,
    clientName: '',
    clientPhone: '',
    clientEmail: '',
    /********/
    code: '',
    unitType: '',
    availableUnits: '',
  };

  // Dados mockados removidos para corrigir avisos do ESLint

  const methods = useForm<NewVendasSchemaType>({
    resolver: zodResolver(NewVendasSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  // Phone number formatting function
  const formatPhoneNumber = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 2) return `(${numbers}`;
    if (numbers.length <= 3) return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
    if (numbers.length <= 7)
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 3)} ${numbers.slice(3)}`;
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 3)} ${numbers.slice(3, 7)}-${numbers.slice(7, 11)}`;
  };

  // Custom validation logic usando useCallback para evitar recriação a cada renderização
  const isFormValid = useCallback(() => {
    // Check if property code is selected (always required)
    if (!values.code) return false;

    // Check client validation - either existing client OR new client with all fields
    const hasExistingClient = !!values.name && !values.isNewClient;
    const hasNewClientComplete =
      values.isNewClient && !!(values.clientName && values.clientPhone && values.clientEmail);

    return hasExistingClient || hasNewClientComplete;
  }, [
    values.code,
    values.name,
    values.isNewClient,
    values.clientName,
    values.clientPhone,
    values.clientEmail,
  ]);

  // Monitor form validation and submitting state
  useEffect(() => {
    onValidationChange?.(isFormValid());
  }, [
    values.name,
    values.isNewClient,
    values.clientName,
    values.clientPhone,
    values.clientEmail,
    values.code,
    onValidationChange,
    isFormValid,
  ]);

  useEffect(() => {
    onSubmittingChange?.(isSubmitting);
  }, [isSubmitting, onSubmittingChange]);

  // Handle client selection logic
  useEffect(() => {
    // If a client is selected from the autocomplete, disable "Novo cliente" switch
    if (values.name && !values.isNewClient) {
      // Client selected, ensure new client fields are cleared
      setValue('clientName', '');
      setValue('clientPhone', '');
      setValue('clientEmail', '');
    }
  }, [values.name, values.isNewClient, setValue]);

  // Handle new client switch logic
  useEffect(() => {
    if (values.isNewClient) {
      // If "Novo cliente" is enabled, clear the existing client selection
      setValue('name', '');
    }
  }, [values.isNewClient, setValue]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      reset();
      toast.success(currentVendas ? 'Update success!' : 'Create success!');
      router.push(paths.dashboard.vendas.root);
      console.info('DATA', data);
    } catch (error) {
      console.error(error);
    }
  });

  const renderDetails = () => (
    <Card>
      <CardHeader
        title="Registrar novo atendimento"
        subheader="Preencha as informações solicitadas"
        sx={{ mb: 3 }}
      />

      <Divider />

      <Stack spacing={3} sx={{ p: 3 }}>
        <Field.Autocomplete
          name="name"
          label="Busque um cliente existente"
          placeholder="Digite o nome do cliente..."
          options={_clientList.map((client) => client.name)}
          getOptionLabel={(option) => option}
          disabled={values.isNewClient}
          renderOption={(props, option) => {
            const client = _clientList.find((c) => c.name === option);
            return (
              <li {...props} key={option}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box
                    component="img"
                    src={client?.avatarUrl}
                    sx={{ width: 32, height: 32, borderRadius: '50%' }}
                  />
                  <Box>
                    <Typography variant="body2">{client?.name}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {client?.email}
                    </Typography>
                  </Box>
                </Box>
              </li>
            );
          }}
        />

        <Field.Switch name="isNewClient" label="Novo cliente" />

        {values.isNewClient && (
          <>
            <Field.Text
              name="clientName"
              label="Nome completo"
              placeholder="Digite o nome completo do cliente"
            />
            <Field.Text
              name="clientPhone"
              label="WhatsApp"
              placeholder="(00) 0 0000-0000"
              onChange={(event) => {
                const formattedValue = formatPhoneNumber(event.target.value);
                setValue('clientPhone', formattedValue);
              }}
              inputProps={{
                inputMode: 'numeric',
                pattern: '[0-9]*',
                maxLength: 16,
              }}
            />
            <Field.Text name="clientEmail" label="E-mail" placeholder="E-mail" type="email" />
          </>
        )}
      </Stack>
    </Card>
  );

  const renderProperties = () => (
    <Card>
      <CardHeader
        title="Selecione o imóvel"
        subheader="Informe qual o imóvel de interesse do cliente"
        sx={{ mb: 3 }}
      />

      <Divider />

      <Stack spacing={3} sx={{ p: 3 }}>
        <Field.Autocomplete
          name="code"
          label="Imóvel"
          placeholder="Busque o imóvel que será comprado"
          options={(properties || []).map((property) => property.id)}
          getOptionLabel={(option) => {
            const property = (properties || []).find((p) => p.id === option);
            return property ? property.name : option;
          }}
          renderOption={(props, option) => {
            const property = (properties || []).find((p) => p.id === option);
            return (
              <li {...props} key={option}>
                <Typography variant="body2">{property?.name}</Typography>
              </li>
            );
          }}
        />
      </Stack>
    </Card>
  );

  return (
    <Form methods={methods} onSubmit={onSubmit} id="vendas-form">
      <Stack spacing={{ xs: 3, md: 5 }} sx={{ mx: 'auto', maxWidth: { xs: 720, xl: 880 } }}>
        {renderDetails()}
        {renderProperties()}

        {onCreateAtendimento && (
          <Box sx={{ mt: 3 }}>
            <LoadingButton
              fullWidth
              variant="contained"
              color="warning"
              size="large"
              disabled={!isFormValid()}
              loading={isCreatingAtendimento}
              onClick={onCreateAtendimento}
            >
              Criar novo atendimento
            </LoadingButton>
          </Box>
        )}
      </Stack>
    </Form>
  );
}
