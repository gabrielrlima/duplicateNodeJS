import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState, useEffect, useCallback } from 'react';

import { Box, Card, Grid2, Alert, MenuItem, Typography, CardContent } from '@mui/material';

import { Iconify } from 'src/components/iconify';
import { Form, Field } from 'src/components/hook-form';

interface PropertyIdentificationFormProps {
  onComplete: () => void;
}

// Schema de validação seguindo a nova arquitetura
const identificationSchema = zod.object({
  // Seção 1.1 - Identificação Básica
  type: zod.string().min(1, 'Tipo de imóvel é obrigatório'),
  purpose: zod.string().min(1, 'Finalidade é obrigatória'),
  condition: zod.string().min(1, 'Condição é obrigatória'),
  status: zod.string().min(1, 'Status é obrigatório'),

  // Seção 1.2 - Localização Completa
  location: zod.object({
    zipCode: zod.string().min(9, 'CEP deve ter formato 00000-000'),
    street: zod.string().min(3, 'Rua é obrigatória'),
    number: zod.string().min(1, 'Número é obrigatório'),
    complement: zod.string().optional(),
    neighborhood: zod.string().min(2, 'Bairro é obrigatório'),
    city: zod.string().min(2, 'Cidade é obrigatória'),
    state: zod.string().min(2, 'Estado é obrigatório'),
    landmarks: zod.array(zod.string()).optional(),
  }),

  // Seção 1.3 - Contexto do Empreendimento
  building: zod.object({
    name: zod.string().optional(),
    buildYear: zod.coerce.number().min(1900, 'Ano deve ser válido'),
    type: zod.string().optional(),
    developer: zod.string().optional(),
  }),
});

type IdentificationFormData = zod.infer<typeof identificationSchema>;

// Estados brasileiros
const estadosBrasil = [
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

// Função para aplicar máscara no CEP
const applyCepMask = (value: string): string => {
  const numbers = value.replace(/\D/g, '');
  if (numbers.length <= 5) {
    return numbers;
  }
  return `${numbers.slice(0, 5)}-${numbers.slice(5, 8)}`;
};

const PropertyIdentificationForm: React.FC<PropertyIdentificationFormProps> = ({ onComplete }) => {
  const [cepLoading, setCepLoading] = useState(false);
  const [cepError, setCepError] = useState('');

  const defaultValues: IdentificationFormData = {
    type: '',
    purpose: '',
    condition: '',
    status: 'Em andamento',
    location: {
      zipCode: '',
      street: '',
      number: '',
      complement: '',
      neighborhood: '',
      city: '',
      state: '',
      landmarks: [],
    },
    building: {
      name: '',
      buildYear: new Date().getFullYear(),
      type: '',
      developer: '',
    },
  };

  const methods = useForm<IdentificationFormData>({
    resolver: zodResolver(identificationSchema),
    defaultValues,
    mode: 'onChange',
  });

  const {
    handleSubmit,
    watch,
    setValue,
    formState: { errors, touchedFields },
  } = methods;
  const values = watch();

  // Função para buscar endereço por CEP
  const fetchAddressByCep = useCallback(
    async (cep: string) => {
      if (cep.length !== 9) return;

      setCepLoading(true);
      setCepError('');

      try {
        const response = await fetch(`https://viacep.com.br/ws/${cep.replace('-', '')}/json/`);
        const data = await response.json();

        if (data.erro) {
          setCepError('CEP não encontrado');
          return;
        }

        setValue('location.street', data.logradouro || '');
        setValue('location.neighborhood', data.bairro || '');
        setValue('location.city', data.localidade || '');
        setValue('location.state', data.uf || '');
      } catch {
        setCepError('Erro ao buscar CEP');
      } finally {
        setCepLoading(false);
      }
    },
    [setValue]
  );

  // Monitorar mudanças no CEP
  useEffect(() => {
    const cep = values.location?.zipCode;
    if (cep && cep.length === 9) {
      fetchAddressByCep(cep);
    }
  }, [values.location?.zipCode, fetchAddressByCep]);

  // Salvar dados automaticamente no localStorage
  useEffect(() => {
    localStorage.setItem('propertyIdentificationData', JSON.stringify(values));
  }, [values]);

  // Carregar dados salvos
  useEffect(() => {
    const savedData = localStorage.getItem('propertyIdentificationData');
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      Object.keys(parsedData).forEach((key) => {
        setValue(key as keyof IdentificationFormData, parsedData[key]);
      });
    }
  }, [setValue]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      localStorage.setItem('propertyIdentificationData', JSON.stringify(data));
      onComplete();
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  });

  // Função para obter erro de campo
  const getFieldError = (fieldName: string) => {
    const keys = fieldName.split('.');
    let error: any = errors;
    let touched: any = touchedFields;

    for (const key of keys) {
      error = error?.[key];
      touched = touched?.[key];
    }

    return touched && error?.message;
  };

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Box sx={{ p: 4 }}>
        {/* Header */}
        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <Typography variant="h4" sx={{ mb: 2, fontWeight: 700, color: 'primary.main' }}>
            Identificação e Contexto
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Defina o que é o imóvel e onde está localizado
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {/* Seção 1.1 - Identificação Básica */}
          <Card sx={{ borderRadius: 3, boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.08)' }}>
            <CardContent sx={{ p: 4 }}>
              <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box
                  sx={{
                    p: 1.5,
                    borderRadius: 2,
                    bgcolor: 'primary.lighter',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Iconify icon="solar:home-bold" width={24} sx={{ color: 'primary.main' }} />
                </Box>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.main' }}>
                    1.1 Identificação Básica
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Defina o tipo, finalidade e condição do imóvel
                  </Typography>
                </Box>
              </Box>

              <Grid2 container spacing={3}>
                <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
                  <Field.Select
                    name="type"
                    label="Tipo de Imóvel"
                    error={!!getFieldError('type')}
                    helperText={getFieldError('type')}
                  >
                    <MenuItem value="apartment">Apartamento</MenuItem>
                    <MenuItem value="house">Casa</MenuItem>
                    <MenuItem value="commercial">Comercial</MenuItem>
                    <MenuItem value="land">Terreno</MenuItem>
                    <MenuItem value="farm">Chácara/Sítio</MenuItem>
                  </Field.Select>
                </Grid2>

                <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
                  <Field.Select
                    name="purpose"
                    label="Finalidade"
                    error={!!getFieldError('purpose')}
                    helperText={getFieldError('purpose')}
                  >
                    <MenuItem value="sale">Venda</MenuItem>
                    <MenuItem value="rent">Aluguel</MenuItem>
                    <MenuItem value="both">Venda e Aluguel</MenuItem>
                  </Field.Select>
                </Grid2>

                <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
                  <Field.Select
                    name="condition"
                    label="Condição"
                    error={!!getFieldError('condition')}
                    helperText={getFieldError('condition')}
                  >
                    <MenuItem value="new">Novo</MenuItem>
                    <MenuItem value="used">Usado</MenuItem>
                    <MenuItem value="renovated">Reformado</MenuItem>
                    <MenuItem value="under_construction">Em Construção</MenuItem>
                  </Field.Select>
                </Grid2>

                <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
                  <Field.Select
                    name="status"
                    label="Status"
                    error={!!getFieldError('status')}
                    helperText={getFieldError('status')}
                  >
                    <MenuItem value="Em andamento">Em andamento</MenuItem>
                    <MenuItem value="Pendente">Pendente</MenuItem>
                    <MenuItem value="Vendido">Vendido</MenuItem>
                    <MenuItem value="Alugado">Alugado</MenuItem>
                  </Field.Select>
                </Grid2>
              </Grid2>
            </CardContent>
          </Card>

          {/* Seção 1.2 - Localização Completa */}
          <Card sx={{ borderRadius: 3, boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.08)' }}>
            <CardContent sx={{ p: 4 }}>
              <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box
                  sx={{
                    p: 1.5,
                    borderRadius: 2,
                    bgcolor: 'info.lighter',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Iconify icon="solar:map-point-bold" width={24} sx={{ color: 'info.main' }} />
                </Box>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: 'info.main' }}>
                    1.2 Localização Completa
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Endereço completo com busca automática por CEP
                  </Typography>
                </Box>
              </Box>

              <Grid2 container spacing={3}>
                <Grid2 size={{ xs: 12, sm: 4 }}>
                  <Field.Text
                    name="location.zipCode"
                    label="CEP"
                    placeholder="00000-000"
                    error={!!getFieldError('location.zipCode') || !!cepError}
                    helperText={
                      getFieldError('location.zipCode') ||
                      cepError ||
                      'Digite o CEP para busca automática'
                    }
                    InputProps={{
                      endAdornment: cepLoading && (
                        <Iconify
                          icon="solar:loading-bold"
                          sx={{ animation: 'spin 1s linear infinite' }}
                        />
                      ),
                    }}
                    onChange={(e) => {
                      const maskedValue = applyCepMask(e.target.value);
                      setValue('location.zipCode', maskedValue);
                      setCepError('');
                    }}
                  />
                </Grid2>

                <Grid2 size={{ xs: 12, sm: 8 }}>
                  <Field.Text
                    name="location.street"
                    label="Rua/Avenida"
                    placeholder="Ex: Avenida Paulista"
                    error={!!getFieldError('location.street')}
                    helperText={getFieldError('location.street')}
                  />
                </Grid2>

                <Grid2 size={{ xs: 12, sm: 3 }}>
                  <Field.Text
                    name="location.number"
                    label="Número"
                    placeholder="Ex: 1000"
                    error={!!getFieldError('location.number')}
                    helperText={getFieldError('location.number')}
                  />
                </Grid2>

                <Grid2 size={{ xs: 12, sm: 3 }}>
                  <Field.Text
                    name="location.complement"
                    label="Complemento"
                    placeholder="Ex: Apto 101"
                    error={!!getFieldError('location.complement')}
                    helperText={getFieldError('location.complement') || 'Opcional'}
                  />
                </Grid2>

                <Grid2 size={{ xs: 12, sm: 6 }}>
                  <Field.Text
                    name="location.neighborhood"
                    label="Bairro"
                    placeholder="Ex: Bela Vista"
                    error={!!getFieldError('location.neighborhood')}
                    helperText={getFieldError('location.neighborhood')}
                  />
                </Grid2>

                <Grid2 size={{ xs: 12, sm: 8 }}>
                  <Field.Text
                    name="location.city"
                    label="Cidade"
                    placeholder="Ex: São Paulo"
                    error={!!getFieldError('location.city')}
                    helperText={getFieldError('location.city')}
                  />
                </Grid2>

                <Grid2 size={{ xs: 12, sm: 4 }}>
                  <Field.Select
                    name="location.state"
                    label="Estado"
                    error={!!getFieldError('location.state')}
                    helperText={getFieldError('location.state')}
                  >
                    {estadosBrasil.map((estado) => (
                      <MenuItem key={estado.value} value={estado.value}>
                        {estado.label}
                      </MenuItem>
                    ))}
                  </Field.Select>
                </Grid2>
              </Grid2>
            </CardContent>
          </Card>

          {/* Seção 1.3 - Contexto do Empreendimento */}
          <Card sx={{ borderRadius: 3, boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.08)' }}>
            <CardContent sx={{ p: 4 }}>
              <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box
                  sx={{
                    p: 1.5,
                    borderRadius: 2,
                    bgcolor: 'success.lighter',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Iconify
                    icon="solar:buildings-2-bold"
                    width={24}
                    sx={{ color: 'success.main' }}
                  />
                </Box>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: 'success.main' }}>
                    1.3 Contexto do Empreendimento
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Informações sobre o edifício ou condomínio
                  </Typography>
                </Box>
              </Box>

              <Grid2 container spacing={3}>
                <Grid2 size={{ xs: 12, sm: 6 }}>
                  <Field.Text
                    name="building.name"
                    label="Nome do Edifício/Condomínio"
                    placeholder="Ex: Edifício Solar"
                    error={!!getFieldError('building.name')}
                    helperText={getFieldError('building.name') || 'Opcional'}
                  />
                </Grid2>

                <Grid2 size={{ xs: 12, sm: 6 }}>
                  <Field.Text
                    name="building.buildYear"
                    label="Ano de Construção"
                    type="number"
                    placeholder={`Ex: ${new Date().getFullYear()}`}
                    error={!!getFieldError('building.buildYear')}
                    helperText={getFieldError('building.buildYear')}
                  />
                </Grid2>

                <Grid2 size={{ xs: 12, sm: 6 }}>
                  <Field.Text
                    name="building.type"
                    label="Tipo de Empreendimento"
                    placeholder="Ex: Residencial, Comercial, Misto"
                    error={!!getFieldError('building.type')}
                    helperText={getFieldError('building.type') || 'Opcional'}
                  />
                </Grid2>

                <Grid2 size={{ xs: 12, sm: 6 }}>
                  <Field.Text
                    name="building.developer"
                    label="Construtora/Incorporadora"
                    placeholder="Ex: Construtora ABC"
                    error={!!getFieldError('building.developer')}
                    helperText={getFieldError('building.developer') || 'Opcional'}
                  />
                </Grid2>
              </Grid2>
            </CardContent>
          </Card>

          {/* Resumo da Etapa */}
          <Alert
            severity="info"
            sx={{
              borderRadius: 3,
              '& .MuiAlert-icon': {
                fontSize: 24,
              },
            }}
            icon={<Iconify icon="solar:info-circle-bold" />}
          >
            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                Resumo da Identificação
              </Typography>
              <Typography variant="body2">
                {values.type && values.purpose
                  ? `${
                      values.type === 'apartment'
                        ? 'Apartamento'
                        : values.type === 'house'
                          ? 'Casa'
                          : values.type === 'commercial'
                            ? 'Comercial'
                            : values.type === 'land'
                              ? 'Terreno'
                              : 'Chácara/Sítio'
                    } para ${values.purpose === 'sale' ? 'venda' : values.purpose === 'rent' ? 'aluguel' : 'venda e aluguel'}`
                  : 'Selecione o tipo e finalidade do imóvel'}
                {values.location?.city &&
                  values.location?.neighborhood &&
                  ` • ${values.location.neighborhood}, ${values.location.city}/${values.location.state}`}
                {values.building?.name && ` • ${values.building.name}`}
              </Typography>
            </Box>
          </Alert>
        </Box>
      </Box>
    </Form>
  );
};

export default PropertyIdentificationForm;
