import type { IEmpreendimentoItem } from 'src/types/empreendimento';

import { z as zod } from 'zod';
import React, { useRef } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import LoadingButton from '@mui/lab/LoadingButton';
import InputAdornment from '@mui/material/InputAdornment';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import {
  EMPREENDIMENTO_TIPO_OPTIONS,
  EMPREENDIMENTO_STATUS_OPTIONS,
  EMPREENDIMENTO_BENEFICIOS_OPTIONS,
  EMPREENDIMENTO_CRONOGRAMA_OPTIONS,
  EMPREENDIMENTO_TIPO_SACADA_OPTIONS,
  EMPREENDIMENTO_TIPOS_UNIDADE_OPTIONS,
  EMPREENDIMENTO_CARACTERISTICAS_OPTIONS,
  EMPREENDIMENTO_TIPO_APARTAMENTO_OPTIONS,
  EMPREENDIMENTO_DIFERENCIAIS_EDIFICIO_OPTIONS,
  EMPREENDIMENTO_PLANTAS_CARACTERISTICAS_OPTIONS,
  EMPREENDIMENTO_DIFERENCIAIS_APARTAMENTO_OPTIONS,
  EMPREENDIMENTO_OPORTUNIDADES_DISPONIVEIS_OPTIONS,
} from 'src/_mock';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { Form, Field, schemaHelper } from 'src/components/hook-form';

import { EmpreendimentoPlantasManager } from './empreendimento-plantas-manager';

// ----------------------------------------------------------------------

export type NewEmpreendimentoSchemaType = zod.infer<typeof NewEmpreendimentoSchema>;

export const NewEmpreendimentoSchema = zod.object({
  titulo: zod.string().min(1, { message: 'Título é obrigatório!' }),
  descricao: zod.string().min(1, { message: 'Descrição é obrigatória!' }),
  book: zod.any().optional(),
  avatar: zod.any().optional(),
  tiposUnidade: zod.string().array().min(1, { message: 'Escolha pelo menos uma opção!' }),
  caracteristicas: zod.string().array().min(1, { message: 'Escolha pelo menos uma opção!' }),
  cronograma: zod.string().array().min(1, { message: 'Escolha pelo menos uma opção!' }),
  cidade: zod.string().min(1, { message: 'Cidade é obrigatória!' }),
  estado: zod.string().min(1, { message: 'Estado é obrigatório!' }),
  dataEntrega: schemaHelper.date({ message: { required: 'Data de entrega é obrigatória!' } }),
  preco: zod.object({
    valor: schemaHelper.nullableInput(
      zod.number({ coerce: true }).min(1, { message: 'Preço é obrigatório!' }),
      {
        // message when empty
        message: 'Preço é obrigatório!',
      }
    ),
    // tipo: zod.string(),
    tipo: zod.string(),
    negociavel: zod.boolean(),
  }),
  beneficios: zod.string().array().min(0, { message: 'Escolha pelo menos uma opção!' }),
  diferenciaisEdificio: zod.string().array().min(0, { message: 'Escolha pelo menos uma opção!' }),
  diferenciaisApartamento: zod
    .string()
    .array()
    .min(0, { message: 'Escolha pelo menos uma opção!' }),
  tipoApartamento: zod.string().array().min(0, { message: 'Escolha pelo menos uma opção!' }),
  tipoSacada: zod.string().array().min(0, { message: 'Escolha pelo menos uma opção!' }),
  oportunidadesDisponiveis: zod
    .string()
    .array()
    .min(0, { message: 'Escolha pelo menos uma opção!' }),
  plantas: zod
    .array(
      zod.object({
        id: zod.string(),
        nome: zod.string().min(1, { message: 'Nome da planta é obrigatório!' }),
        descricao: zod.string().optional(),
        area: zod.number({ coerce: true }).min(1, { message: 'Área é obrigatória!' }),
        quartos: zod
          .number({ coerce: true })
          .min(0, { message: 'Número de quartos é obrigatório!' }),
        banheiros: zod
          .number({ coerce: true })
          .min(1, { message: 'Número de banheiros é obrigatório!' }),
        vagas: zod.number({ coerce: true }).min(0, { message: 'Número de vagas é obrigatório!' }),
        suites: zod.number({ coerce: true }).min(0).optional(),
        disponivel: zod.boolean(),
        caracteristicas: zod.string().array().optional(),
        imagens: zod.any().array().optional(),
        preco: zod
          .object({
            valor: zod.number({ coerce: true }).min(0).optional(),
            negociavel: zod.boolean().optional(),
          })
          .optional(),
      })
    )
    .min(1, { message: 'Adicione pelo menos uma planta!' }),
  // tipoEmpreendimento: zod.string(),
  tipoEmpreendimento: zod.string(),
  // Novos campos para detalhes do empreendimento
  construtora: zod.object({
    name: zod.string().min(1, { message: 'Nome da construtora é obrigatório!' }),
    logo: zod.string().optional(),
    phoneNumber: zod.string().optional(),
    fullAddress: zod.string().optional(),
  }),
  statusEmpreendimento: zod.string().min(1, { message: 'Status do empreendimento é obrigatório!' }),
});

// ----------------------------------------------------------------------

type Props = {
  currentEmpreendimento?: IEmpreendimentoItem;
};

export function EmpreendimentoNewEditForm({ currentEmpreendimento }: Props) {
  const router = useRouter();
  const bookInputRef = useRef<HTMLInputElement>(null);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  const defaultValues: NewEmpreendimentoSchemaType = {
    titulo: '',
    descricao: '',
    book: null,
    avatar: null,
    tiposUnidade: [],
    tipoEmpreendimento: 'Residencial',
    caracteristicas: [],
    cronograma: [],
    cidade: '',
    estado: '',
    dataEntrega: null,
    preco: { valor: null, negociavel: false },
    beneficios: [],
    diferenciaisEdificio: [],
    diferenciaisApartamento: [],
    tipoApartamento: [],
    tipoSacada: [],
    oportunidadesDisponiveis: [],
    plantas: [
      {
        id: '1',
        nome: 'Planta Tipo 1',
        descricao: '',
        area: 0,
        quartos: 2,
        banheiros: 1,
        vagas: 1,
        suites: 0,
        disponivel: true,
        caracteristicas: [],
      },
    ],
    construtora: {
      name: '',
      logo: '',
      phoneNumber: '',
      fullAddress: '',
    },
    statusEmpreendimento: '',
  };

  const methods = useForm<NewEmpreendimentoSchemaType>({
    mode: 'all',
    resolver: zodResolver(NewEmpreendimentoSchema),
    defaultValues,
    values: currentEmpreendimento,
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
      toast.success(
        currentEmpreendimento
          ? 'Atualização realizada com sucesso!'
          : 'Empreendimento criado com sucesso!'
      );
      router.push(paths.dashboard.empreendimentos.root);
      console.info('DATA', data);
    } catch (error) {
      console.error(error);
    }
  });

  const renderDetails = () => (
    <Card>
      <CardHeader title="Detalhes" subheader="Título, descrição, imagem..." sx={{ mb: 3 }} />

      <Divider />

      <Stack spacing={3} sx={{ p: 3 }}>
        <Stack spacing={1.5}>
          <Typography variant="subtitle2">Título</Typography>
          <Field.Text name="titulo" placeholder="Ex: Residencial Vista Bela..." />
        </Stack>

        <Stack spacing={1.5}>
          <Typography variant="subtitle2">Descrição</Typography>
          <Field.Text
            name="descricao"
            placeholder="Descreva as principais características do empreendimento..."
            multiline
            rows={4}
          />
        </Stack>

        <Stack spacing={1.5}>
          <Typography variant="subtitle2">Book do Empreendimento</Typography>
          <Controller
            name="book"
            render={({ field, fieldState: { error } }) => {
              const hasFile =
                field.value && (Array.isArray(field.value) ? field.value.length > 0 : field.value);

              const handleBookUpload = () => {
                if (bookInputRef.current) {
                  bookInputRef.current.click();
                }
              };

              const handleBookChange = (event: React.ChangeEvent<HTMLInputElement>) => {
                const files = event.target.files;
                if (files && files.length > 0) {
                  field.onChange(files[0]);
                }
              };

              const fileName = hasFile
                ? Array.isArray(field.value)
                  ? field.value[0]?.name
                  : field.value?.name || 'Arquivo selecionado'
                : null;

              return (
                <Box>
                  <Button
                    variant={hasFile ? 'contained' : 'outlined'}
                    color={hasFile ? 'success' : 'primary'}
                    onClick={handleBookUpload}
                    startIcon={
                      hasFile ? (
                        <Iconify icon="eva:checkmark-circle-2-fill" />
                      ) : (
                        <Iconify icon="eva:file-text-outline" />
                      )
                    }
                    sx={{
                      width: '100%',
                      height: 56,
                      borderStyle: hasFile ? 'solid' : 'dashed',
                      borderWidth: 2,
                      borderColor: hasFile ? 'success.main' : 'grey.300',
                      bgcolor: hasFile ? 'success.lighter' : 'transparent',
                      color: hasFile ? 'success.dark' : 'inherit',
                      '&:hover': {
                        bgcolor: hasFile ? 'success.light' : 'grey.50',
                      },
                    }}
                  >
                    {hasFile ? 'Book Selecionado' : 'Selecionar Book'}
                  </Button>

                  {hasFile && (
                    <Box sx={{ mt: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="body2" color="success.main" sx={{ flex: 1 }}>
                        {fileName}
                      </Typography>
                      <IconButton size="small" onClick={() => field.onChange(null)} color="error">
                        <Iconify icon="eva:close-fill" width={16} />
                      </IconButton>
                    </Box>
                  )}

                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ mt: 1, display: 'block' }}
                  >
                    Formatos aceitos: PDF, DOC, DOCX
                  </Typography>

                  {error && (
                    <Typography variant="caption" color="error" sx={{ mt: 1, display: 'block' }}>
                      {error.message}
                    </Typography>
                  )}

                  <input
                    ref={bookInputRef}
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleBookChange}
                    style={{ display: 'none' }}
                  />
                </Box>
              );
            }}
          />
        </Stack>

        <Stack spacing={1.5}>
          <Typography variant="subtitle2">Avatar do Empreendimento</Typography>
          <Controller
            name="avatar"
            render={({ field, fieldState: { error } }) => {
              const hasFile =
                field.value && (Array.isArray(field.value) ? field.value.length > 0 : field.value);

              const handleAvatarUpload = () => {
                if (avatarInputRef.current) {
                  avatarInputRef.current.click();
                }
              };

              const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
                const files = event.target.files;
                if (files && files.length > 0) {
                  field.onChange(files[0]);
                }
              };

              const fileName = hasFile
                ? Array.isArray(field.value)
                  ? field.value[0]?.name
                  : field.value?.name || 'Arquivo selecionado'
                : null;

              return (
                <Box>
                  <Button
                    variant={hasFile ? 'contained' : 'outlined'}
                    color={hasFile ? 'success' : 'primary'}
                    onClick={handleAvatarUpload}
                    startIcon={
                      hasFile ? (
                        <Iconify icon="eva:checkmark-circle-2-fill" />
                      ) : (
                        <Iconify icon="eva:image-outline" />
                      )
                    }
                    sx={{
                      width: '100%',
                      height: 56,
                      borderStyle: hasFile ? 'solid' : 'dashed',
                      borderWidth: 2,
                      borderColor: hasFile ? 'success.main' : 'grey.300',
                      bgcolor: hasFile ? 'success.lighter' : 'transparent',
                      color: hasFile ? 'success.dark' : 'inherit',
                      '&:hover': {
                        bgcolor: hasFile ? 'success.light' : 'grey.50',
                      },
                    }}
                  >
                    {hasFile ? 'Imagem Selecionada' : 'Selecionar Imagem'}
                  </Button>

                  {hasFile && (
                    <Box sx={{ mt: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="body2" color="success.main" sx={{ flex: 1 }}>
                        {fileName}
                      </Typography>
                      <IconButton size="small" onClick={() => field.onChange(null)} color="error">
                        <Iconify icon="eva:close-fill" width={16} />
                      </IconButton>
                    </Box>
                  )}

                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ mt: 1, display: 'block' }}
                  >
                    Formatos aceitos: JPG, JPEG, PNG, WEBP
                  </Typography>

                  {error && (
                    <Typography variant="caption" color="error" sx={{ mt: 1, display: 'block' }}>
                      {error.message}
                    </Typography>
                  )}

                  <input
                    ref={avatarInputRef}
                    type="file"
                    accept=".jpg,.jpeg,.png,.webp"
                    onChange={handleAvatarChange}
                    style={{ display: 'none' }}
                  />
                </Box>
              );
            }}
          />
        </Stack>
      </Stack>
    </Card>
  );

  const renderEmpreendimentoDetails = () => (
    <Card>
      <CardHeader title="Detalhes do Empreendimento" sx={{ mb: 3 }} />

      <Divider />

      <Stack spacing={3} sx={{ p: 3 }}>
        <Stack spacing={1.5}>
          <Typography variant="subtitle2">Construtora</Typography>
          <Field.Text name="construtora.name" placeholder="Nome da construtora" />
        </Stack>

        <Stack spacing={1.5}>
          <Typography variant="subtitle2">Status do Empreendimento</Typography>
          <Field.Autocomplete
            name="statusEmpreendimento"
            placeholder="Selecionar status"
            options={EMPREENDIMENTO_STATUS_OPTIONS}
            getOptionLabel={(option) => option?.label || ''}
            isOptionEqualToValue={(option, value) =>
              option?.value === value?.value || option?.value === value
            }
          />
        </Stack>

        <Stack spacing={1}>
          <Typography variant="subtitle2">Tipo de empreendimento</Typography>
          <Field.RadioGroup
            row
            name="tipoEmpreendimento"
            options={EMPREENDIMENTO_TIPO_OPTIONS}
            sx={{ gap: 4 }}
          />
        </Stack>

        <Stack spacing={1}>
          <Typography variant="subtitle2">Tipos de unidade</Typography>
          <Field.MultiCheckbox
            row
            name="tiposUnidade"
            options={EMPREENDIMENTO_TIPOS_UNIDADE_OPTIONS}
            sx={{ gap: 4 }}
          />
        </Stack>

        <Stack spacing={1.5}>
          <Typography variant="subtitle2">Localização</Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 2 }}>
            <Field.Text name="cidade" placeholder="Cidade" />
            <Field.Text name="estado" placeholder="Estado" />
          </Box>
        </Stack>

        <Stack spacing={1.5}>
          <Typography variant="subtitle2">Data de entrega</Typography>
          <Field.DatePicker name="dataEntrega" />
        </Stack>

        <Stack spacing={2}>
          <Typography variant="subtitle2">Preço do m²</Typography>

          <Field.Text
            name="preco.valor"
            placeholder="0.00"
            type="number"
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start" sx={{ mr: 0.75 }}>
                    <Box component="span" sx={{ color: 'text.disabled' }}>
                      R$
                    </Box>
                  </InputAdornment>
                ),
              },
            }}
          />
        </Stack>
      </Stack>
    </Card>
  );

  const renderProperties = () => (
    <Card>
      <CardHeader title="Características e Diferenciais" sx={{ mb: 3 }} />

      <Divider />

      <Stack spacing={3} sx={{ p: 3 }}>
        <Stack spacing={1.5}>
          <Typography variant="subtitle2">Características</Typography>
          <Field.Autocomplete
            name="caracteristicas"
            placeholder="+ Características"
            multiple
            disableCloseOnSelect
            options={EMPREENDIMENTO_CARACTERISTICAS_OPTIONS.map((option) => option)}
            getOptionLabel={(option) => option || ''}
            renderOption={(props, option) => (
              <li {...props} key={option}>
                {option}
              </li>
            )}
            renderTags={(selected, getTagProps) =>
              selected.map((option, index) => (
                <Chip
                  {...getTagProps({ index })}
                  key={option}
                  label={option}
                  size="small"
                  color="info"
                  variant="soft"
                />
              ))
            }
          />
        </Stack>

        <Stack spacing={1.5}>
          <Typography variant="subtitle2">Cronograma</Typography>
          <Field.Autocomplete
            name="cronograma"
            placeholder="+ Cronograma"
            multiple
            disableCloseOnSelect
            options={EMPREENDIMENTO_CRONOGRAMA_OPTIONS.map((option) => option)}
            getOptionLabel={(option) => option || ''}
            renderOption={(props, option) => (
              <li {...props} key={option}>
                {option}
              </li>
            )}
            renderTags={(selected, getTagProps) =>
              selected.map((option, index) => (
                <Chip
                  {...getTagProps({ index })}
                  key={option}
                  label={option}
                  size="small"
                  color="info"
                  variant="soft"
                />
              ))
            }
          />
        </Stack>

        <Stack spacing={1}>
          <Typography variant="subtitle2">Benefícios</Typography>
          <Field.MultiCheckbox
            name="beneficios"
            options={EMPREENDIMENTO_BENEFICIOS_OPTIONS}
            sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)' }}
          />
        </Stack>

        <Stack spacing={1}>
          <Typography variant="subtitle2">Diferenciais do Edifício</Typography>
          <Field.MultiCheckbox
            name="diferenciaisEdificio"
            options={EMPREENDIMENTO_DIFERENCIAIS_EDIFICIO_OPTIONS.map((option) => ({
              label: option,
              value: option,
            }))}
            sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)' }}
          />
        </Stack>

        <Stack spacing={1}>
          <Typography variant="subtitle2">Diferenciais do Apartamento</Typography>
          <Field.MultiCheckbox
            name="diferenciaisApartamento"
            options={EMPREENDIMENTO_DIFERENCIAIS_APARTAMENTO_OPTIONS.map((option) => ({
              label: option,
              value: option,
            }))}
            sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)' }}
          />
        </Stack>

        <Stack spacing={1}>
          <Typography variant="subtitle2">Tipo de Apartamento</Typography>
          <Field.MultiCheckbox
            name="tipoApartamento"
            options={EMPREENDIMENTO_TIPO_APARTAMENTO_OPTIONS.map((option) => ({
              label: option,
              value: option,
            }))}
            sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)' }}
          />
        </Stack>

        <Stack spacing={1}>
          <Typography variant="subtitle2">Tipo de Sacada</Typography>
          <Field.MultiCheckbox
            name="tipoSacada"
            options={EMPREENDIMENTO_TIPO_SACADA_OPTIONS.map((option) => ({
              label: option,
              value: option,
            }))}
            sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)' }}
          />
        </Stack>

        <Stack spacing={1}>
          <Typography variant="subtitle2">Oportunidades Disponíveis</Typography>
          <Field.MultiCheckbox
            name="oportunidadesDisponiveis"
            options={EMPREENDIMENTO_OPORTUNIDADES_DISPONIVEIS_OPTIONS.map((option) => ({
              label: option,
              value: option,
            }))}
            sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)' }}
          />
        </Stack>
      </Stack>
    </Card>
  );

  const renderActions = () => (
    <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
      <LoadingButton type="submit" variant="contained" size="large" loading={isSubmitting}>
        {!currentEmpreendimento ? 'Criar empreendimento' : 'Salvar alterações'}
      </LoadingButton>
    </Box>
  );

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Stack spacing={{ xs: 3, md: 5 }} sx={{ mx: 'auto', maxWidth: { xs: 720, xl: 880 } }}>
        {renderDetails()}
        {renderEmpreendimentoDetails()}
        {renderProperties()}
        <EmpreendimentoPlantasManager
          caracteristicasOptions={EMPREENDIMENTO_PLANTAS_CARACTERISTICAS_OPTIONS}
        />
        {renderActions()}
      </Stack>
    </Form>
  );
}
