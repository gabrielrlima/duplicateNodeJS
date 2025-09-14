import { useForm } from 'react-hook-form';
import { useState, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';

import { Box, Card, Grid2, Alert, Button, MenuItem, Typography, CardContent } from '@mui/material';

import { fillPropertyFormFromTerreno } from 'src/utils/clone-terreno-to-property';

import { z as zod } from 'src/lib/zod-config';

import { Iconify } from 'src/components/iconify';
import { Form, Field } from 'src/components/hook-form';

import { TerrenoCloneSelector } from './terreno-clone-selector';

interface PropertyInfoFormProps {
  onComplete: () => void;
}

// Schema de validação com Zod - Simplificado
const propertySchema = zod.object({
  // Informações básicas obrigatórias
  condition: zod.string().min(1, 'Condição do imóvel é obrigatória'),
  type: zod.string().min(1, 'Tipo de imóvel é obrigatório'),
  size: zod.coerce.number().min(1, 'Tamanho é obrigatório'),
  rooms: zod.coerce.number().min(1, 'Quantidade de quartos é obrigatória'),
  bathrooms: zod.coerce.number().min(1, 'Quantidade de banheiros é obrigatória'),

  // Informações opcionais
  suites: zod.coerce.number().min(0).optional(),
  parkingSpaces: zod.coerce.number().min(0).optional(),
  floor: zod.string().optional(),
  description: zod.string().min(10, 'Descrição deve ter pelo menos 10 caracteres').optional(),

  // Principais comodidades (reduzidas para as mais importantes)
  balcony: zod.boolean().optional(),
  barbecue: zod.boolean().optional(),
  privatePool: zod.boolean().optional(),
  airConditioner: zod.boolean().optional(),
  americanKitchen: zod.boolean().optional(),
  garden: zod.boolean().optional(),
});

// Tipo para os dados do formulário
type PropertyFormData = zod.infer<typeof propertySchema>;

const PropertyInfoForm: React.FC<PropertyInfoFormProps> = ({ onComplete }) => {
  const [openTerrenoSelector, setOpenTerrenoSelector] = useState(false);
  const [clonedFromTerreno, setClonedFromTerreno] = useState<string | null>(null);

  const defaultValues: PropertyFormData = {
    // Informações básicas obrigatórias
    condition: 'Novo',
    type: 'Apartamento',
    size: 50,
    rooms: 1,
    bathrooms: 1,

    // Informações opcionais
    suites: 0,
    parkingSpaces: 0,
    floor: '',
    description: '',

    // Principais comodidades
    balcony: false,
    barbecue: false,
    privatePool: false,
    airConditioner: false,
    americanKitchen: false,
    garden: false,
  };

  const methods = useForm<PropertyFormData>({
    resolver: zodResolver(propertySchema),
    defaultValues,
    mode: 'onChange', // Enable real-time validation
  });

  const {
    handleSubmit,
    watch,
    reset,
    formState: { errors, touchedFields },
  } = methods;
  const values = watch();

  // Função para lidar com a seleção do terreno
  const handleTerrenoSelect = (terreno: any) => {
    const propertyData = fillPropertyFormFromTerreno(terreno, values.type);
    reset(propertyData);
    setClonedFromTerreno(`${terreno.codigo} - ${terreno.titulo}`);
    setOpenTerrenoSelector(false);
  };

  // Real-time validation feedback
  const getFieldError = (fieldName: keyof PropertyFormData) =>
    touchedFields[fieldName] && errors[fieldName]?.message;

  // Salvar dados automaticamente no localStorage quando os valores mudarem
  useEffect(() => {
    localStorage.setItem('propertyFormData', JSON.stringify(values));
  }, [values]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      // Salvar dados no localStorage para persistência entre steps
      localStorage.setItem('propertyFormData', JSON.stringify(data));
      onComplete();
      console.info('Property data:', data);
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  });

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {/* Header */}
        <Box sx={{ mb: 2 }}>
          <Box
            sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}
          >
            <Box>
              <Typography variant="h4" sx={{ mb: 1, fontWeight: 600 }}>
                Cadastro de Imóvel
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Preencha as informações do seu imóvel para criar um anúncio completo e atrativo.
              </Typography>
            </Box>

            <Button
              variant="outlined"
              startIcon={<Iconify icon="solar:copy-bold" />}
              onClick={() => setOpenTerrenoSelector(true)}
              sx={{ minWidth: 180 }}
            >
              Clonar de Terreno
            </Button>
          </Box>

          {clonedFromTerreno && (
            <Alert severity="success" sx={{ mb: 2 }} onClose={() => setClonedFromTerreno(null)}>
              <Typography variant="body2">
                <strong>Dados clonados com sucesso!</strong>
                <br />
                Terreno: {clonedFromTerreno}
              </Typography>
            </Alert>
          )}
        </Box>

        {/* 1. Informações Básicas */}
        <Card sx={{ borderRadius: 2, boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.08)' }}>
          <CardContent sx={{ p: 4 }}>
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" sx={{ mb: 1, fontWeight: 600, color: 'primary.main' }}>
                1. Informações Básicas
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Defina o tipo e condição do seu imóvel
              </Typography>
            </Box>

            <Grid2 container spacing={3}>
              <Grid2 size={{ xs: 12, sm: 6 }}>
                <Field.Select
                  name="type"
                  label="Tipo de imóvel"
                  error={!!getFieldError('type')}
                  helperText={getFieldError('type')}
                >
                  <MenuItem value="Apartamento">Apartamento</MenuItem>
                  <MenuItem value="Casa">Casa</MenuItem>
                  <MenuItem value="Comercial">Comercial</MenuItem>
                </Field.Select>
              </Grid2>
              <Grid2 size={{ xs: 12, sm: 6 }}>
                <Field.Select
                  name="condition"
                  label="Condição do imóvel"
                  error={!!getFieldError('condition')}
                  helperText={getFieldError('condition')}
                >
                  <MenuItem value="Novo">Novo</MenuItem>
                  <MenuItem value="Usado">Usado</MenuItem>
                  <MenuItem value="Reformado">Reformado</MenuItem>
                </Field.Select>
              </Grid2>
            </Grid2>
          </CardContent>
        </Card>

        {/* 2. Detalhes do Imóvel */}
        <Card sx={{ borderRadius: 2, boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.08)' }}>
          <CardContent sx={{ p: 4 }}>
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" sx={{ mb: 1, fontWeight: 600, color: 'primary.main' }}>
                2. Detalhes do Imóvel
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Especifique as características físicas do imóvel
              </Typography>
            </Box>

            <Grid2 container spacing={3}>
              <Grid2 size={{ xs: 12, sm: 6, md: 4 }}>
                <Field.Text
                  name="size"
                  label="Área (m²)"
                  placeholder="Ex: 75"
                  type="number"
                  error={!!getFieldError('size')}
                  helperText={getFieldError('size') || 'Área total do imóvel'}
                />
              </Grid2>
              <Grid2 size={{ xs: 12, sm: 6, md: 4 }}>
                <Field.Text
                  name="rooms"
                  label="Quartos"
                  type="number"
                  placeholder="Ex: 3"
                  error={!!getFieldError('rooms')}
                  helperText={getFieldError('rooms') || 'Número de quartos'}
                />
              </Grid2>
              <Grid2 size={{ xs: 12, sm: 6, md: 4 }}>
                <Field.Text
                  name="bathrooms"
                  label="Banheiros"
                  type="number"
                  placeholder="Ex: 2"
                  error={!!getFieldError('bathrooms')}
                  helperText={getFieldError('bathrooms') || 'Número de banheiros'}
                />
              </Grid2>

              {/* Campos opcionais */}
              <Grid2 size={{ xs: 12, sm: 6, md: 4 }}>
                <Field.Text
                  name="suites"
                  label="Suítes"
                  type="number"
                  placeholder="Ex: 1"
                  error={!!getFieldError('suites')}
                  helperText={getFieldError('suites') || 'Número de suítes (opcional)'}
                />
              </Grid2>
              <Grid2 size={{ xs: 12, sm: 6, md: 4 }}>
                <Field.Text
                  name="parkingSpaces"
                  label="Vagas"
                  type="number"
                  placeholder="Ex: 2"
                  error={!!getFieldError('parkingSpaces')}
                  helperText={getFieldError('parkingSpaces') || 'Número de vagas (opcional)'}
                />
              </Grid2>
              {values.type !== 'Casa' && (
                <Grid2 size={{ xs: 12, sm: 6, md: 4 }}>
                  <Field.Text
                    name="floor"
                    label="Andar"
                    placeholder="Ex: 5º andar"
                    error={!!getFieldError('floor')}
                    helperText={getFieldError('floor') || 'Opcional'}
                  />
                </Grid2>
              )}
            </Grid2>
          </CardContent>
        </Card>

        {/* 3. Principais Comodidades */}
        <Card sx={{ borderRadius: 2, boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.08)' }}>
          <CardContent sx={{ p: 4 }}>
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" sx={{ mb: 1, fontWeight: 600, color: 'primary.main' }}>
                3. Principais Comodidades
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Selecione as comodidades mais importantes do seu imóvel
              </Typography>
            </Box>

            <Grid2 container spacing={3}>
              <Grid2 size={{ xs: 6, sm: 4, md: 3 }}>
                <Field.Checkbox name="balcony" label="Varanda/Sacada" />
              </Grid2>
              <Grid2 size={{ xs: 6, sm: 4, md: 3 }}>
                <Field.Checkbox name="barbecue" label="Churrasqueira" />
              </Grid2>
              <Grid2 size={{ xs: 6, sm: 4, md: 3 }}>
                <Field.Checkbox name="privatePool" label="Piscina" />
              </Grid2>
              <Grid2 size={{ xs: 6, sm: 4, md: 3 }}>
                <Field.Checkbox name="airConditioner" label="Ar condicionado" />
              </Grid2>
              <Grid2 size={{ xs: 6, sm: 4, md: 3 }}>
                <Field.Checkbox name="americanKitchen" label="Cozinha americana" />
              </Grid2>
              <Grid2 size={{ xs: 6, sm: 4, md: 3 }}>
                <Field.Checkbox name="garden" label="Jardim/Área verde" />
              </Grid2>
            </Grid2>
          </CardContent>
        </Card>

        {/* 4. Descrição */}
        <Card sx={{ borderRadius: 2, boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.08)' }}>
          <CardContent sx={{ p: 4 }}>
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" sx={{ mb: 1, fontWeight: 600, color: 'primary.main' }}>
                4. Descrição
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Descreva as características e diferenciais do seu imóvel
              </Typography>
            </Box>

            <Grid2 container spacing={3}>
              <Grid2 size={{ xs: 12 }}>
                <Field.Text
                  name="description"
                  label="Descrição"
                  placeholder="Descreva as principais características do imóvel..."
                  multiline
                  rows={4}
                  error={!!getFieldError('description')}
                  helperText={
                    getFieldError('description') || 'Descreva detalhes importantes sobre o imóvel'
                  }
                />
              </Grid2>
            </Grid2>
          </CardContent>
        </Card>
      </Box>

      {/* Modal de seleção de terreno */}
      <TerrenoCloneSelector
        open={openTerrenoSelector}
        onClose={() => setOpenTerrenoSelector(false)}
        onSelect={handleTerrenoSelect}
      />
    </Form>
  );
};

export default PropertyInfoForm;
