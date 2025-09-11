import type { ICorretor } from 'src/types/corretor';

import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { isValidPhoneNumber } from 'react-phone-number-input/input';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid2';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { fData } from 'src/utils/format-number';

import { Label } from 'src/components/label';
import { toast } from 'src/components/snackbar';
import { Form, Field, schemaHelper } from 'src/components/hook-form';

// ----------------------------------------------------------------------

export type NewCorretorSchemaType = zod.infer<typeof NewCorretorSchema>;

export const NewCorretorSchema = zod.object({
  avatarUrl: schemaHelper.file({ message: 'Avatar é obrigatório!' }),
  name: zod.string().min(1, { message: 'Nome é obrigatório!' }),
  email: zod
    .string()
    .min(1, { message: 'Email é obrigatório!' })
    .email({ message: 'Email deve ser um endereço válido!' }),
  phone: schemaHelper.phoneNumber({ isValid: isValidPhoneNumber }),
  endereco: zod.string().min(1, { message: 'Endereço é obrigatório!' }),
  pais: zod.string().min(1, { message: 'País é obrigatório!' }),
  estado: zod.string().min(1, { message: 'Estado é obrigatório!' }),
  cidade: zod.string().min(1, { message: 'Cidade é obrigatória!' }),
  cep: zod.string().min(1, { message: 'CEP é obrigatório!' }),
  tipoChavePix: zod.string().min(1, { message: 'Tipo de chave Pix é obrigatório!' }),
  chavePix: zod.string().min(1, { message: 'Chave Pix é obrigatória!' }),
  cargo: zod.string().min(1, { message: 'Cargo é obrigatório!' }),
  creci: zod.string().min(1, { message: 'CRECI é obrigatório!' }),
  especialidade: zod.string().optional(),

  grupo: zod.string().optional(),
  // Not required
  status: zod.string(),
});

// ----------------------------------------------------------------------

type Props = {
  currentCorretor?: ICorretor;
};

export function CorretorNewEditForm({ currentCorretor }: Props) {
  const router = useRouter();

  const defaultValues: NewCorretorSchemaType = {
    status: 'ativo',
    avatarUrl: null,
    name: '',
    email: '',
    phone: '',
    endereco: '',
    pais: 'Brasil',
    estado: '',
    cidade: '',
    cep: '',
    tipoChavePix: '',
    chavePix: '',
    cargo: '',
    creci: '',
    especialidade: '',

    grupo: '',
  };

  const methods = useForm<NewCorretorSchemaType>({
    mode: 'onSubmit',
    resolver: zodResolver(NewCorretorSchema),
    defaultValues,
    values: currentCorretor,
  });

  const {
    reset,
    watch,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  const onSubmit = handleSubmit(async (data) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      reset();
      toast.success(
        currentCorretor ? 'Corretor atualizado com sucesso!' : 'Corretor criado com sucesso!'
      );
      router.push(paths.dashboard.corretores.list);
      console.info('DATA', data);
    } catch (error) {
      console.error(error);
    }
  });

  const tipoChavePixOptions = [
    { value: 'cpf', label: 'CPF' },
    { value: 'cnpj', label: 'CNPJ' },
    { value: 'email', label: 'E-mail' },
    { value: 'telefone', label: 'Telefone' },
    { value: 'chave_aleatoria', label: 'Chave Aleatória' },
  ];

  const cargoOptions = [
    { value: 'corretor', label: 'Corretor' },
    { value: 'corretor_senior', label: 'Corretor Sênior' },
    { value: 'supervisor', label: 'Supervisor' },
    { value: 'gerente', label: 'Gerente' },
    { value: 'diretor', label: 'Diretor' },
  ];

  const estadoOptions = [
    { value: 'AC', label: 'Acre' },
    { value: 'AL', label: 'Alagoas' },
    { value: 'AP', label: 'Amapá' },
    { value: 'AM', label: 'Amazonas' },
    { value: 'BA', label: 'Bahia' },
    { value: 'CE', label: 'Ceará' },
    { value: 'DF', label: 'Distrito Federal' },
    { value: 'ES', label: 'Espírito Santo' },
    { value: 'GO', label: 'Goiás' },
    { value: 'MA', label: 'Maranhão' },
    { value: 'MT', label: 'Mato Grosso' },
    { value: 'MS', label: 'Mato Grosso do Sul' },
    { value: 'MG', label: 'Minas Gerais' },
    { value: 'PA', label: 'Pará' },
    { value: 'PB', label: 'Paraíba' },
    { value: 'PR', label: 'Paraná' },
    { value: 'PE', label: 'Pernambuco' },
    { value: 'PI', label: 'Piauí' },
    { value: 'RJ', label: 'Rio de Janeiro' },
    { value: 'RN', label: 'Rio Grande do Norte' },
    { value: 'RS', label: 'Rio Grande do Sul' },
    { value: 'RO', label: 'Rondônia' },
    { value: 'RR', label: 'Roraima' },
    { value: 'SC', label: 'Santa Catarina' },
    { value: 'SP', label: 'São Paulo' },
    { value: 'SE', label: 'Sergipe' },
    { value: 'TO', label: 'Tocantins' },
  ];

  const grupoOptions = [
    { value: 'vendas', label: 'Vendas' },
    { value: 'locacao', label: 'Locação' },
    { value: 'captacao', label: 'Captação' },
    { value: 'comercial', label: 'Comercial' },
    { value: 'residencial', label: 'Residencial' },
  ];

  const especialidadeOptions = [
    { value: 'imoveis_residenciais', label: 'Imóveis Residenciais' },
    { value: 'imoveis_comerciais', label: 'Imóveis Comerciais' },
    { value: 'imoveis_rurais', label: 'Imóveis Rurais' },
    { value: 'imoveis_luxo', label: 'Imóveis de Luxo' },
    { value: 'locacao', label: 'Locação' },
    { value: 'investimentos', label: 'Investimentos Imobiliários' },
    { value: 'leiloes', label: 'Leilões' },
    { value: 'plantas', label: 'Plantas e Lançamentos' },
  ];

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ pt: 10, pb: 5, px: 3 }}>
            {currentCorretor && (
              <Label
                color={
                  (values.status === 'ativo' && 'success') ||
                  (values.status === 'inativo' && 'error') ||
                  'warning'
                }
                sx={{ position: 'absolute', top: 24, right: 24 }}
              >
                {values.status}
              </Label>
            )}

            <Box sx={{ mb: 5 }}>
              <Field.UploadAvatar
                name="avatarUrl"
                maxSize={3145728}
                helperText={
                  <Typography
                    variant="caption"
                    sx={{
                      mt: 3,
                      mx: 'auto',
                      display: 'block',
                      textAlign: 'center',
                      color: 'text.disabled',
                    }}
                  >
                    Permitido *.jpeg, *.jpg, *.png, *.gif
                    <br /> tamanho máximo de {fData(3145728)}
                  </Typography>
                }
              />
            </Box>

            {currentCorretor && (
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                  Status do Corretor
                </Typography>
                <Field.Select name="status" label="Status">
                  <MenuItem value="ativo">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Label color="success">Ativo</Label>
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        Corretor ativo e disponível
                      </Typography>
                    </Box>
                  </MenuItem>
                  <MenuItem value="ferias">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Label color="warning">Férias</Label>
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        Corretor em período de férias
                      </Typography>
                    </Box>
                  </MenuItem>
                  <MenuItem value="inativo">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Label color="error">Inativo</Label>
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        Corretor desativado
                      </Typography>
                    </Box>
                  </MenuItem>
                </Field.Select>
              </Box>
            )}

            {currentCorretor && (
              <Stack sx={{ mt: 3, alignItems: 'center', justifyContent: 'center' }}>
                <Button variant="soft" color="error">
                  Excluir corretor
                </Button>
              </Stack>
            )}
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 8 }}>
          <Card sx={{ p: 3 }}>
            <Box
              sx={{
                rowGap: 3,
                columnGap: 2,
                display: 'grid',
                gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' },
              }}
            >
              <Field.Text name="name" label="Nome" />
              <Field.Text name="email" label="Email" />
              <Field.Phone
                name="phone"
                label="Número de celular"
                country={!currentCorretor ? 'BR' : undefined}
              />
              <Field.Text name="endereco" label="Endereço" />

              <Field.Select name="pais" label="País">
                <MenuItem value="Brasil">Brasil</MenuItem>
              </Field.Select>

              <Field.Select name="estado" label="Estado">
                {estadoOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Field.Select>

              <Field.Text name="cidade" label="Cidade" />
              <Field.Text name="cep" label="CEP" />

              <Field.Select name="tipoChavePix" label="Tipo de chave Pix">
                {tipoChavePixOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Field.Select>

              <Field.Text name="chavePix" label="Chave Pix" />

              <Field.Select name="cargo" label="Cargo">
                {cargoOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Field.Select>

              <Field.Text name="creci" label="CRECI" />

              <Field.Select name="especialidade" label="Especialidade">
                <MenuItem value="">Selecione uma especialidade</MenuItem>
                {especialidadeOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Field.Select>

              <Field.Select name="grupo" label="Grupo">
                <MenuItem value="">Selecione um grupo</MenuItem>
                {grupoOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Field.Select>
            </Box>

            <Stack sx={{ mt: 3, alignItems: 'flex-end' }}>
              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                {!currentCorretor ? 'Criar corretor' : 'Atualizar'}
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </Form>
  );
}
