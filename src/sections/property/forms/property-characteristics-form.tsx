import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { useState, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';

import { Box, Card, Chip, Grid2, Alert, MenuItem, Typography, CardContent } from '@mui/material';

import { Iconify } from 'src/components/iconify';
import { Form, Field } from 'src/components/hook-form';

interface PropertyCharacteristicsFormProps {
  onComplete: () => void;
}

// Schema de validação para características físicas
const characteristicsSchema = zod.object({
  // Seção 2.1 - Dimensões e Layout
  dimensions: zod.object({
    totalArea: zod.coerce.number().min(1, 'Área total é obrigatória'),
    privateArea: zod.coerce.number().optional(),
    rooms: zod.object({
      bedrooms: zod.coerce.number().min(0, 'Número de quartos deve ser válido'),
      suites: zod.coerce.number().min(0, 'Número de suítes deve ser válido'),
      bathrooms: zod.coerce.number().min(1, 'Deve ter pelo menos 1 banheiro'),
      livingRooms: zod.coerce.number().min(0, 'Número de salas deve ser válido'),
      kitchen: zod.coerce.number().min(0, 'Número de cozinhas deve ser válido'),
      serviceArea: zod.coerce.number().min(0, 'Número de áreas de serviço deve ser válido'),
      others: zod
        .array(
          zod.object({
            name: zod.string(),
            quantity: zod.coerce.number().min(1),
          })
        )
        .optional(),
    }),
  }),

  // Seção 2.2 - Características Estruturais
  structural: zod.object({
    floor: zod.coerce.number().optional(),
    orientation: zod.string().optional(),
    view: zod.string().optional(),
    accessibility: zod.boolean(),
    petFriendly: zod.boolean(),
    parkingSpaces: zod.coerce.number().min(0, 'Número de vagas deve ser válido'),
  }),

  // Seção 2.3 - Estado e Acabamentos
  condition: zod.object({
    conservation: zod.string().min(1, 'Estado de conservação é obrigatório'),
    finishingStandard: zod.string().optional(),
    furnished: zod.string().optional(),
    recentRenovations: zod.array(zod.string()).optional(),
  }),
});

type CharacteristicsFormData = zod.infer<typeof characteristicsSchema>;

const PropertyCharacteristicsForm: React.FC<PropertyCharacteristicsFormProps> = ({
  onComplete,
}) => {
  const [otherRooms, setOtherRooms] = useState<Array<{ name: string; quantity: number }>>([]);

  const defaultValues: CharacteristicsFormData = {
    dimensions: {
      totalArea: 0,
      privateArea: 0,
      rooms: {
        bedrooms: 0,
        suites: 0,
        bathrooms: 1,
        livingRooms: 1,
        kitchen: 1,
        serviceArea: 0,
        others: [],
      },
    },
    structural: {
      floor: undefined,
      orientation: '',
      view: '',
      accessibility: false,
      petFriendly: false,
      parkingSpaces: 0,
    },
    condition: {
      conservation: '',
      finishingStandard: '',
      furnished: '',
      recentRenovations: [],
    },
  };

  const methods = useForm<CharacteristicsFormData>({
    resolver: zodResolver(characteristicsSchema),
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

  // Salvar dados automaticamente no localStorage
  useEffect(() => {
    localStorage.setItem('propertyCharacteristicsData', JSON.stringify(values));
  }, [values]);

  // Carregar dados salvos
  useEffect(() => {
    const savedData = localStorage.getItem('propertyCharacteristicsData');
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      Object.keys(parsedData).forEach((key) => {
        setValue(key as keyof CharacteristicsFormData, parsedData[key]);
      });

      // Carregar outros cômodos
      if (parsedData.dimensions?.rooms?.others) {
        setOtherRooms(parsedData.dimensions.rooms.others);
      }
    }
  }, [setValue]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      // Incluir outros cômodos nos dados
      const finalData = {
        ...data,
        dimensions: {
          ...data.dimensions,
          rooms: {
            ...data.dimensions.rooms,
            others: otherRooms,
          },
        },
      };

      localStorage.setItem('propertyCharacteristicsData', JSON.stringify(finalData));
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

  // Adicionar outro cômodo
  const addOtherRoom = () => {
    setOtherRooms([...otherRooms, { name: '', quantity: 1 }]);
  };

  // Remover outro cômodo
  const removeOtherRoom = (index: number) => {
    const newRooms = otherRooms.filter((_, i) => i !== index);
    setOtherRooms(newRooms);
  };

  // Atualizar outro cômodo
  const updateOtherRoom = (index: number, field: 'name' | 'quantity', value: string | number) => {
    const newRooms = [...otherRooms];
    newRooms[index] = { ...newRooms[index], [field]: value };
    setOtherRooms(newRooms);
  };

  // Calcular total de cômodos
  const totalRooms = values.dimensions?.rooms
    ? values.dimensions.rooms.bedrooms +
      values.dimensions.rooms.suites +
      values.dimensions.rooms.bathrooms +
      values.dimensions.rooms.livingRooms +
      values.dimensions.rooms.kitchen +
      values.dimensions.rooms.serviceArea +
      otherRooms.reduce((sum, room) => sum + room.quantity, 0)
    : 0;

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Box sx={{ p: 4 }}>
        {/* Header */}
        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <Typography variant="h4" sx={{ mb: 2, fontWeight: 700, color: 'primary.main' }}>
            Características Físicas e Estruturais
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Descreva como o imóvel é construído e distribuído
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {/* Seção 2.1 - Dimensões e Layout */}
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
                  <Iconify icon="solar:ruler-bold" width={24} sx={{ color: 'primary.main' }} />
                </Box>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.main' }}>
                    2.1 Dimensões e Layout
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Área total e distribuição dos cômodos
                  </Typography>
                </Box>
              </Box>

              {/* Áreas */}
              <Grid2 container spacing={3} sx={{ mb: 4 }}>
                <Grid2 size={{ xs: 12, sm: 6 }}>
                  <Field.Text
                    name="dimensions.totalArea"
                    label="Área Total (m²)"
                    type="number"
                    placeholder="Ex: 85"
                    error={!!getFieldError('dimensions.totalArea')}
                    helperText={getFieldError('dimensions.totalArea') || 'Área total do imóvel'}
                  />
                </Grid2>

                <Grid2 size={{ xs: 12, sm: 6 }}>
                  <Field.Text
                    name="dimensions.privateArea"
                    label="Área Privativa (m²)"
                    type="number"
                    placeholder="Ex: 75"
                    error={!!getFieldError('dimensions.privateArea')}
                    helperText={
                      getFieldError('dimensions.privateArea') || 'Área privativa (opcional)'
                    }
                  />
                </Grid2>
              </Grid2>

              {/* Cômodos Principais */}
              <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
                Distribuição dos Cômodos
              </Typography>

              <Grid2 container spacing={3}>
                <Grid2 size={{ xs: 6, sm: 4, md: 2 }}>
                  <Field.Text
                    name="dimensions.rooms.bedrooms"
                    label="Quartos"
                    type="number"
                    error={!!getFieldError('dimensions.rooms.bedrooms')}
                    helperText={getFieldError('dimensions.rooms.bedrooms')}
                  />
                </Grid2>

                <Grid2 size={{ xs: 6, sm: 4, md: 2 }}>
                  <Field.Text
                    name="dimensions.rooms.suites"
                    label="Suítes"
                    type="number"
                    error={!!getFieldError('dimensions.rooms.suites')}
                    helperText={getFieldError('dimensions.rooms.suites')}
                  />
                </Grid2>

                <Grid2 size={{ xs: 6, sm: 4, md: 2 }}>
                  <Field.Text
                    name="dimensions.rooms.bathrooms"
                    label="Banheiros"
                    type="number"
                    error={!!getFieldError('dimensions.rooms.bathrooms')}
                    helperText={getFieldError('dimensions.rooms.bathrooms')}
                  />
                </Grid2>

                <Grid2 size={{ xs: 6, sm: 4, md: 2 }}>
                  <Field.Text
                    name="dimensions.rooms.livingRooms"
                    label="Salas"
                    type="number"
                    error={!!getFieldError('dimensions.rooms.livingRooms')}
                    helperText={getFieldError('dimensions.rooms.livingRooms')}
                  />
                </Grid2>

                <Grid2 size={{ xs: 6, sm: 4, md: 2 }}>
                  <Field.Text
                    name="dimensions.rooms.kitchen"
                    label="Cozinha"
                    type="number"
                    error={!!getFieldError('dimensions.rooms.kitchen')}
                    helperText={getFieldError('dimensions.rooms.kitchen')}
                  />
                </Grid2>

                <Grid2 size={{ xs: 6, sm: 4, md: 2 }}>
                  <Field.Text
                    name="dimensions.rooms.serviceArea"
                    label="Área Serviço"
                    type="number"
                    error={!!getFieldError('dimensions.rooms.serviceArea')}
                    helperText={getFieldError('dimensions.rooms.serviceArea')}
                  />
                </Grid2>
              </Grid2>

              {/* Outros Cômodos */}
              {otherRooms.length > 0 && (
                <Box sx={{ mt: 3 }}>
                  <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
                    Outros Cômodos
                  </Typography>
                  {otherRooms.map((room, index) => (
                    <Grid2 container spacing={2} key={index} sx={{ mb: 2, alignItems: 'center' }}>
                      <Grid2 size={{ xs: 6 }}>
                        <Field.Text
                          name={`otherRoom_${index}_name`}
                          label="Nome do Cômodo"
                          placeholder="Ex: Escritório"
                          value={room.name}
                          onChange={(e) => updateOtherRoom(index, 'name', e.target.value)}
                        />
                      </Grid2>
                      <Grid2 size={{ xs: 4 }}>
                        <Field.Text
                          name={`otherRoom_${index}_quantity`}
                          label="Quantidade"
                          type="number"
                          value={room.quantity}
                          onChange={(e) =>
                            updateOtherRoom(index, 'quantity', parseInt(e.target.value) || 1)
                          }
                        />
                      </Grid2>
                      <Grid2 size={{ xs: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'center', pt: 2 }}>
                          <Iconify
                            icon="solar:trash-bin-minimalistic-bold"
                            width={20}
                            sx={{ color: 'error.main', cursor: 'pointer' }}
                            onClick={() => removeOtherRoom(index)}
                          />
                        </Box>
                      </Grid2>
                    </Grid2>
                  ))}
                </Box>
              )}

              <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
                <Chip
                  label="+ Adicionar Outro Cômodo"
                  onClick={addOtherRoom}
                  variant="outlined"
                  sx={{ cursor: 'pointer' }}
                />
              </Box>
            </CardContent>
          </Card>

          {/* Seção 2.2 - Características Estruturais */}
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
                  <Iconify icon="solar:buildings-3-bold" width={24} sx={{ color: 'info.main' }} />
                </Box>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: 'info.main' }}>
                    2.2 Características Estruturais
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Posição, orientação e características especiais
                  </Typography>
                </Box>
              </Box>

              <Grid2 container spacing={3}>
                <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
                  <Field.Text
                    name="structural.floor"
                    label="Andar"
                    type="number"
                    placeholder="Ex: 5"
                    error={!!getFieldError('structural.floor')}
                    helperText={getFieldError('structural.floor') || 'Opcional para casas'}
                  />
                </Grid2>

                <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
                  <Field.Select
                    name="structural.orientation"
                    label="Orientação Solar"
                    error={!!getFieldError('structural.orientation')}
                    helperText={getFieldError('structural.orientation') || 'Opcional'}
                  >
                    <MenuItem value="">Não informado</MenuItem>
                    <MenuItem value="north">Norte</MenuItem>
                    <MenuItem value="south">Sul</MenuItem>
                    <MenuItem value="east">Leste</MenuItem>
                    <MenuItem value="west">Oeste</MenuItem>
                    <MenuItem value="northeast">Nordeste</MenuItem>
                    <MenuItem value="northwest">Noroeste</MenuItem>
                    <MenuItem value="southeast">Sudeste</MenuItem>
                    <MenuItem value="southwest">Sudoeste</MenuItem>
                  </Field.Select>
                </Grid2>

                <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
                  <Field.Select
                    name="structural.view"
                    label="Vista"
                    error={!!getFieldError('structural.view')}
                    helperText={getFieldError('structural.view') || 'Opcional'}
                  >
                    <MenuItem value="">Não informado</MenuItem>
                    <MenuItem value="sea">Mar</MenuItem>
                    <MenuItem value="city">Cidade</MenuItem>
                    <MenuItem value="mountain">Montanha</MenuItem>
                    <MenuItem value="park">Parque</MenuItem>
                    <MenuItem value="street">Rua</MenuItem>
                    <MenuItem value="internal">Área Interna</MenuItem>
                  </Field.Select>
                </Grid2>

                <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
                  <Field.Text
                    name="structural.parkingSpaces"
                    label="Vagas de Garagem"
                    type="number"
                    error={!!getFieldError('structural.parkingSpaces')}
                    helperText={getFieldError('structural.parkingSpaces')}
                  />
                </Grid2>
              </Grid2>

              {/* Características Especiais */}
              <Box sx={{ mt: 3 }}>
                <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
                  Características Especiais
                </Typography>
                <Grid2 container spacing={2}>
                  <Grid2 size={{ xs: 6, sm: 4 }}>
                    <Field.Checkbox name="structural.accessibility" label="Acessível para PCD" />
                  </Grid2>
                  <Grid2 size={{ xs: 6, sm: 4 }}>
                    <Field.Checkbox name="structural.petFriendly" label="Pet Friendly" />
                  </Grid2>
                </Grid2>
              </Box>
            </CardContent>
          </Card>

          {/* Seção 2.3 - Estado e Acabamentos */}
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
                  <Iconify icon="solar:hammer-bold" width={24} sx={{ color: 'success.main' }} />
                </Box>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: 'success.main' }}>
                    2.3 Estado e Acabamentos
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Condição atual e padrão de acabamento
                  </Typography>
                </Box>
              </Box>

              <Grid2 container spacing={3}>
                <Grid2 size={{ xs: 12, sm: 4 }}>
                  <Field.Select
                    name="condition.conservation"
                    label="Estado de Conservação"
                    error={!!getFieldError('condition.conservation')}
                    helperText={getFieldError('condition.conservation')}
                  >
                    <MenuItem value="excellent">Excelente</MenuItem>
                    <MenuItem value="good">Bom</MenuItem>
                    <MenuItem value="regular">Regular</MenuItem>
                    <MenuItem value="needs_renovation">Precisa Reformar</MenuItem>
                  </Field.Select>
                </Grid2>

                <Grid2 size={{ xs: 12, sm: 4 }}>
                  <Field.Select
                    name="condition.finishingStandard"
                    label="Padrão de Acabamento"
                    error={!!getFieldError('condition.finishingStandard')}
                    helperText={getFieldError('condition.finishingStandard') || 'Opcional'}
                  >
                    <MenuItem value="">Não informado</MenuItem>
                    <MenuItem value="luxury">Luxo</MenuItem>
                    <MenuItem value="high">Alto</MenuItem>
                    <MenuItem value="medium">Médio</MenuItem>
                    <MenuItem value="simple">Simples</MenuItem>
                  </Field.Select>
                </Grid2>

                <Grid2 size={{ xs: 12, sm: 4 }}>
                  <Field.Select
                    name="condition.furnished"
                    label="Mobiliado"
                    error={!!getFieldError('condition.furnished')}
                    helperText={getFieldError('condition.furnished') || 'Opcional'}
                  >
                    <MenuItem value="">Não informado</MenuItem>
                    <MenuItem value="furnished">Mobiliado</MenuItem>
                    <MenuItem value="semi_furnished">Semi-mobiliado</MenuItem>
                    <MenuItem value="unfurnished">Sem Móveis</MenuItem>
                  </Field.Select>
                </Grid2>
              </Grid2>
            </CardContent>
          </Card>

          {/* Resumo das Características */}
          <Alert
            severity="info"
            sx={{
              borderRadius: 3,
              '& .MuiAlert-icon': {
                fontSize: 24,
              },
            }}
            icon={<Iconify icon="solar:chart-bold" />}
          >
            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                Resumo das Características
              </Typography>
              <Typography variant="body2">
                {values.dimensions?.totalArea
                  ? `${values.dimensions.totalArea}m²`
                  : 'Área não informada'}
                {totalRooms > 0 && ` • ${totalRooms} cômodos`}
                {values.dimensions?.rooms?.bedrooms > 0 &&
                  ` • ${values.dimensions.rooms.bedrooms} quarto${values.dimensions.rooms.bedrooms > 1 ? 's' : ''}`}
                {values.dimensions?.rooms?.bathrooms > 0 &&
                  ` • ${values.dimensions.rooms.bathrooms} banheiro${values.dimensions.rooms.bathrooms > 1 ? 's' : ''}`}
                {values.structural?.parkingSpaces > 0 &&
                  ` • ${values.structural.parkingSpaces} vaga${values.structural.parkingSpaces > 1 ? 's' : ''}`}
                {values.structural?.floor && ` • ${values.structural.floor}º andar`}
                {values.condition?.conservation &&
                  ` • Estado: ${values.condition.conservation === 'excellent' ? 'Excelente' : values.condition.conservation === 'good' ? 'Bom' : values.condition.conservation === 'regular' ? 'Regular' : 'Precisa Reformar'}`}
              </Typography>
            </Box>
          </Alert>
        </Box>
      </Box>
    </Form>
  );
};

export default PropertyCharacteristicsForm;
