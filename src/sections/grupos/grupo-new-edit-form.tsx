import type { IGrupo } from 'src/types/grupo';

import { z as zod } from 'zod';
import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, Controller } from 'react-hook-form';

import { LoadingButton } from '@mui/lab';
import {
  Box,
  Card,
  Grid2,
  Stack,
  Button,
  Switch,
  MenuItem,
  TextField,
  Typography,
  Autocomplete,
  FormControlLabel,
} from '@mui/material';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useCorretores } from 'src/hooks/use-corretores';

import { fData } from 'src/utils/format-number';

import { Label } from 'src/components/label';
import { toast } from 'src/components/snackbar';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { Form, Field, schemaHelper } from 'src/components/hook-form';

// ----------------------------------------------------------------------

export type NewGrupoSchemaType = zod.infer<typeof NewGrupoSchema>;

export const NewGrupoSchema = zod.object({
  avatarUrl: schemaHelper.file().optional(),
  name: zod.string().min(1, { message: 'Nome é obrigatório!' }),
  description: zod.string().min(1, { message: 'Descrição é obrigatória!' }),
  leader: zod.string().min(1, { message: 'Gerente é obrigatório!' }),

  meta: zod.number().min(0, { message: 'Meta deve ser um número positivo!' }).optional(),
  tipo: zod.string().min(1, { message: 'Tipo é obrigatório!' }),

  // Not required
  status: zod.enum(['ativo', 'inativo', 'suspenso']),
});

// ----------------------------------------------------------------------

type Props = {
  currentGrupo?: IGrupo;
};

export function GrupoNewEditForm({ currentGrupo }: Props) {
  const router = useRouter();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const { corretores, loading: corretoresLoading } = useCorretores();

  const defaultValues: NewGrupoSchemaType = {
    avatarUrl: null,
    name: '',
    description: '',
    leader: '',
    meta: 0,
    tipo: '',

    status: 'ativo',
  };

  const methods = useForm<NewGrupoSchemaType>({
    mode: 'onSubmit',
    resolver: zodResolver(NewGrupoSchema),
    defaultValues,
    values: currentGrupo
      ? {
          avatarUrl: currentGrupo.avatarUrl || null,
          name: currentGrupo.name,
          description: currentGrupo.description,
          leader: currentGrupo.leader,
          meta: currentGrupo.meta || 0,
          tipo: currentGrupo.tipo || '',

          status: currentGrupo.status,
        }
      : undefined,
  });

  const handleDeleteGroup = async () => {
    try {
      // Simula a exclusão do grupo
      await new Promise((resolve) => setTimeout(resolve, 500));
      toast.success('Grupo excluído com sucesso!');
      router.push(paths.dashboard.grupos.list);
      setConfirmOpen(false);
    } catch (error) {
      console.error(error);
      toast.error('Erro ao excluir grupo');
    }
  };

  const {
    reset,
    watch,
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  const onSubmit = handleSubmit(async (data) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));

      if (currentGrupo) {
        // Editando grupo existente
        reset();
        toast.success('Grupo atualizado com sucesso!');
        router.push(paths.dashboard.grupos.details(currentGrupo.id));
      } else {
        // Criando novo grupo
        // Simular criação e obter ID do novo grupo
        const newGrupoId = `grupo-${Date.now()}`; // Em produção, isso viria da API
        reset();
        toast.success('Grupo criado com sucesso!');
        router.push(paths.dashboard.grupos.details(newGrupoId));
      }

      console.info('DATA', data);
    } catch (error) {
      console.error(error);
    }
  });

  const tipoOptions = [
    { value: 'Residencial', label: 'Residencial' },
    { value: 'Comercial', label: 'Comercial' },
    { value: 'Rural', label: 'Rural' },
    { value: 'Lançamentos', label: 'Lançamentos' },
    { value: 'Aluguel', label: 'Aluguel' },
    { value: 'Venda', label: 'Venda' },
    { value: 'Aluguel por Temporada', label: 'Aluguel por Temporada' },
    { value: 'Industrial', label: 'Industrial' },
    { value: 'Terrenos e Lotes', label: 'Terrenos e Lotes' },
    { value: 'Imóveis de Alto Padrão', label: 'Imóveis de Alto Padrão' },
    { value: 'Oportunidades', label: 'Oportunidades' },
  ];

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Grid2 container spacing={3}>
        <Grid2 size={{ xs: 12, md: 4 }}>
          <Card sx={{ pt: 10, pb: 5, px: 3 }}>
            {currentGrupo && (
              <Label
                color={
                  (values.status === 'ativo' && 'success') ||
                  (values.status === 'suspenso' && 'error') ||
                  'warning'
                }
                sx={{ position: 'absolute', top: 24, right: 24 }}
              >
                {values.status}
              </Label>
            )}

            <Box sx={{ mb: 5, textAlign: 'center' }}>
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

            {currentGrupo && (
              <FormControlLabel
                labelPlacement="start"
                control={
                  <Controller
                    name="status"
                    control={control}
                    render={({ field }) => (
                      <Switch
                        {...field}
                        checked={field.value === 'ativo'}
                        onChange={(event) =>
                          field.onChange(event.target.checked ? 'ativo' : 'inativo')
                        }
                      />
                    )}
                  />
                }
                label={
                  <>
                    <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                      Status Ativo
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      Ativar ou desativar o grupo
                    </Typography>
                  </>
                }
                sx={{
                  mx: 0,
                  mb: 3,
                  width: 1,
                  justifyContent: 'space-between',
                }}
              />
            )}

            {currentGrupo && (
              <Stack sx={{ mt: 3, alignItems: 'center', justifyContent: 'center' }}>
                <Button variant="soft" color="error" onClick={() => setConfirmOpen(true)}>
                  Excluir grupo
                </Button>
              </Stack>
            )}
          </Card>
        </Grid2>

        <Grid2 size={{ xs: 12, md: 8 }}>
          <Card sx={{ p: 3 }}>
            <Box
              sx={{
                rowGap: 3,
                columnGap: 2,
                display: 'grid',
                gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' },
              }}
            >
              <Field.Text name="name" label="Nome do Grupo" />

              <Controller
                name="leader"
                control={methods.control}
                render={({ field, fieldState: { error } }) => (
                  <Autocomplete
                    {...field}
                    options={corretores.filter((corretor) => corretor.status === 'ativo')}
                    getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
                    isOptionEqualToValue={(option, value) =>
                      typeof value === 'string' ? option.name === value : option.id === value.id
                    }
                    onChange={(event, newValue) => {
                      field.onChange(newValue ? newValue.name : '');
                    }}
                    value={corretores.find((corretor) => corretor.name === field.value) || null}
                    loading={corretoresLoading}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Gerente"
                        error={!!error}
                        helperText={error?.message}
                        placeholder="Pesquisar gerente..."
                      />
                    )}
                    renderOption={(props, option) => (
                      <Box component="li" {...props}>
                        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                          <Typography variant="body2">{option.name}</Typography>
                          <Typography variant="caption" color="text.secondary">
                            {option.email} • CRECI: {option.creci}
                          </Typography>
                        </Box>
                      </Box>
                    )}
                    noOptionsText="Nenhum corretor encontrado"
                  />
                )}
              />

              <Box sx={{ gridColumn: { sm: 'span 2' } }}>
                <Field.Text name="description" label="Descrição" multiline rows={3} />
              </Box>

              <Field.Text
                name="meta"
                label="Meta"
                type="number"
                InputProps={{ inputProps: { min: 0 } }}
              />

              <Field.Select name="tipo" label="Tipo">
                {tipoOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Field.Select>
            </Box>

            <Stack sx={{ mt: 3, alignItems: 'flex-end' }}>
              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                {!currentGrupo ? 'Criar grupo' : 'Salvar alterações'}
              </LoadingButton>
            </Stack>
          </Card>
        </Grid2>
      </Grid2>

      <ConfirmDialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        title="Excluir grupo"
        content={
          <>
            Tem certeza de que deseja excluir este grupo?
            <br />
            <Typography component="span" sx={{ color: 'error.main', fontWeight: 'fontWeightBold' }}>
              Esta ação é irreversível e não pode ser desfeita.
            </Typography>
          </>
        }
        action={
          <Button variant="contained" color="error" onClick={handleDeleteGroup}>
            Excluir
          </Button>
        }
      />
    </Form>
  );
}
