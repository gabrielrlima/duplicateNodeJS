import type { ILeadItem } from 'src/types/lead';

import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { isValidPhoneNumber } from 'react-phone-number-input/input';

import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import MenuItem from '@mui/material/MenuItem';
import LoadingButton from '@mui/lab/LoadingButton';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';

import { BROKERS, UNIT_OPTIONS, PRODUCT_OPTIONS, LEAD_STATUS_OPTIONS } from 'src/_mock/_lead';

import { toast } from 'src/components/snackbar';
import { Form, Field, schemaHelper } from 'src/components/hook-form';

// ----------------------------------------------------------------------

export type LeadQuickEditSchemaType = zod.infer<typeof LeadQuickEditSchema>;

export const LeadQuickEditSchema = zod.object({
  name: zod.string().min(1, { message: 'Nome é obrigatório!' }),
  email: zod
    .string()
    .min(1, { message: 'Email é obrigatório!' })
    .email({ message: 'Email deve ser um endereço válido!' }),
  phoneNumber: schemaHelper.phoneNumber({ isValid: isValidPhoneNumber }),
  country: schemaHelper.nullableInput(zod.string().min(1, { message: 'País é obrigatório!' }), {
    message: 'País é obrigatório!',
  }),
  state: zod.string().min(1, { message: 'Estado é obrigatório!' }),
  city: zod.string().min(1, { message: 'Cidade é obrigatória!' }),
  address: zod.string().min(1, { message: 'Endereço é obrigatório!' }),
  zipCode: zod.string().min(1, { message: 'CEP é obrigatório!' }),
  productInterest: zod.string().min(1, { message: 'Produto de interesse é obrigatório!' }),
  interestUnit: zod.string().min(1, { message: 'Unidade de interesse é obrigatória!' }),
  broker: zod.string().min(1, { message: 'Corretor é obrigatório!' }),
  // Not required
  status: zod.string(),
});

// ----------------------------------------------------------------------

type Props = {
  open: boolean;
  onClose: () => void;
  currentLead?: ILeadItem;
};

export function LeadQuickEditForm({ currentLead, open, onClose }: Props) {
  const defaultValues: LeadQuickEditSchemaType = {
    name: '',
    email: '',
    phoneNumber: '',
    address: '',
    country: '',
    state: '',
    city: '',
    zipCode: '',
    status: '',
    productInterest: '',
    interestUnit: '',
    broker: '',
  };

  const methods = useForm<LeadQuickEditSchemaType>({
    mode: 'all',
    resolver: zodResolver(LeadQuickEditSchema),
    defaultValues,
    values: currentLead,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    const promise = new Promise((resolve) => setTimeout(resolve, 1000));

    try {
      reset();
      onClose();

      toast.promise(promise, {
        loading: 'Loading...',
        success: 'Update success!',
        error: 'Update error!',
      });

      await promise;

      console.info('DATA', data);
    } catch (error) {
      console.error(error);
    }
  });

  return (
    <Dialog
      fullWidth
      maxWidth={false}
      open={open}
      onClose={onClose}
      PaperProps={{ sx: { maxWidth: 720 } }}
    >
      <DialogTitle>Edição rápida de lead</DialogTitle>

      <Form methods={methods} onSubmit={onSubmit}>
        <DialogContent>
          <Alert variant="outlined" severity="info" sx={{ mb: 3 }}>
            Lead aguardando qualificação
          </Alert>

          <Box
            sx={{
              rowGap: 3,
              columnGap: 2,
              display: 'grid',
              gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' },
            }}
          >
            <Field.Select name="status" label="Status">
              {LEAD_STATUS_OPTIONS.map((status) => (
                <MenuItem key={status.value} value={status.value}>
                  {status.label}
                </MenuItem>
              ))}
            </Field.Select>

            <Field.Select name="broker" label="Corretor">
              {BROKERS.map((broker) => (
                <MenuItem key={broker} value={broker}>
                  {broker}
                </MenuItem>
              ))}
            </Field.Select>

            <Field.Text name="name" label="Nome" />
            <Field.Text name="email" label="Email" />
            <Field.Phone name="phoneNumber" label="Telefone" />

            <Field.Text name="address" label="Endereço" />

            <Field.CountrySelect
              fullWidth
              name="country"
              label="País"
              placeholder="Escolha um país"
            />

            <Field.Text name="state" label="Estado" />
            <Field.Text name="city" label="Cidade" />
            <Field.Text name="zipCode" label="CEP" />

            <Field.Select name="productInterest" label="Produto interessado">
              {PRODUCT_OPTIONS.map((product) => (
                <MenuItem key={product.value} value={product.value}>
                  {product.label}
                </MenuItem>
              ))}
            </Field.Select>

            <Field.Select name="interestUnit" label="Unidade de interesse">
              {UNIT_OPTIONS.map((unit) => (
                <MenuItem key={unit.value} value={unit.value}>
                  {unit.label}
                </MenuItem>
              ))}
            </Field.Select>
          </Box>
        </DialogContent>

        <DialogActions>
          <Button variant="outlined" onClick={onClose}>
            Cancelar
          </Button>

          <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
            Atualizar
          </LoadingButton>
        </DialogActions>
      </Form>
    </Dialog>
  );
}
