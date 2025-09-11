import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { useState, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';

import { Box, Card, Chip, Grid2, Alert, Typography, CardContent } from '@mui/material';

import { Iconify } from 'src/components/iconify';
import { Form, Field } from 'src/components/hook-form';

interface PropertyAmenitiesFormProps {
  onComplete: () => void;
}

// Schema de validação para comodidades (todas opcionais)
const amenitiesSchema = zod.object({
  // Seção 3.1 - Comodidades do Imóvel
  propertyAmenities: zod.object({
    balcony: zod.boolean(),
    privateBarbecue: zod.boolean(),
    privatePool: zod.boolean(),
    garden: zod.boolean(),
    airConditioning: zod.boolean(),
    heating: zod.boolean(),
    americanKitchen: zod.boolean(),
    gourmetArea: zod.boolean(),
    fireplace: zod.boolean(),
    closet: zod.boolean(),
    office: zod.boolean(),
    others: zod.array(zod.string()).optional(),
  }),

  // Seção 3.2 - Infraestrutura do Condomínio
  condominiumAmenities: zod.object({
    security: zod.object({
      reception24h: zod.boolean(),
      cameras: zod.boolean(),
      alarm: zod.boolean(),
      electronicGate: zod.boolean(),
    }),
    leisure: zod.object({
      pool: zod.boolean(),
      sportsCourt: zod.boolean(),
      playground: zod.boolean(),
      partyRoom: zod.boolean(),
      gourmetSpace: zod.boolean(),
      gameRoom: zod.boolean(),
      library: zod.boolean(),
      cinema: zod.boolean(),
    }),
    services: zod.object({
      gym: zod.boolean(),
      sauna: zod.boolean(),
      laundry: zod.boolean(),
      coworking: zod.boolean(),
      petCare: zod.boolean(),
      concierge: zod.boolean(),
    }),
    facilities: zod.object({
      elevator: zod.boolean(),
      generator: zod.boolean(),
      waterTank: zod.boolean(),
      solarEnergy: zod.boolean(),
      fiberOptic: zod.boolean(),
    }),
    accessibility: zod.object({
      ramps: zod.boolean(),
      handrails: zod.boolean(),
      accessibleParking: zod.boolean(),
      braille: zod.boolean(),
    }),
  }),

  // Seção 3.3 - Diferenciais da Localização
  locationAdvantages: zod.object({
    publicTransport: zod.array(zod.string()).optional(),
    commerce: zod.array(zod.string()).optional(),
    education: zod.array(zod.string()).optional(),
    healthcare: zod.array(zod.string()).optional(),
    leisure: zod.array(zod.string()).optional(),
  }),
});

type AmenitiesFormData = zod.infer<typeof amenitiesSchema>;

const PropertyAmenitiesForm: React.FC<PropertyAmenitiesFormProps> = ({ onComplete }) => {
  const [customAmenities, setCustomAmenities] = useState<string[]>([]);
  const [newAmenity, setNewAmenity] = useState('');

  const defaultValues: AmenitiesFormData = {
    propertyAmenities: {
      balcony: false,
      privateBarbecue: false,
      privatePool: false,
      garden: false,
      airConditioning: false,
      heating: false,
      americanKitchen: false,
      gourmetArea: false,
      fireplace: false,
      closet: false,
      office: false,
      others: [],
    },
    condominiumAmenities: {
      security: {
        reception24h: false,
        cameras: false,
        alarm: false,
        electronicGate: false,
      },
      leisure: {
        pool: false,
        sportsCourt: false,
        playground: false,
        partyRoom: false,
        gourmetSpace: false,
        gameRoom: false,
        library: false,
        cinema: false,
      },
      services: {
        gym: false,
        sauna: false,
        laundry: false,
        coworking: false,
        petCare: false,
        concierge: false,
      },
      facilities: {
        elevator: false,
        generator: false,
        waterTank: false,
        solarEnergy: false,
        fiberOptic: false,
      },
      accessibility: {
        ramps: false,
        handrails: false,
        accessibleParking: false,
        braille: false,
      },
    },
    locationAdvantages: {
      publicTransport: [],
      commerce: [],
      education: [],
      healthcare: [],
      leisure: [],
    },
  };

  const methods = useForm<AmenitiesFormData>({
    resolver: zodResolver(amenitiesSchema),
    defaultValues,
    mode: 'onChange',
  });

  const { handleSubmit, watch, setValue } = methods;
  const values = watch();

  // Salvar dados automaticamente no localStorage
  useEffect(() => {
    localStorage.setItem('propertyAmenitiesData', JSON.stringify(values));
  }, [values]);

  // Carregar dados salvos
  useEffect(() => {
    const savedData = localStorage.getItem('propertyAmenitiesData');
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      Object.keys(parsedData).forEach((key) => {
        setValue(key as keyof AmenitiesFormData, parsedData[key]);
      });

      // Carregar comodidades customizadas
      if (parsedData.propertyAmenities?.others) {
        setCustomAmenities(parsedData.propertyAmenities.others);
      }
    }
  }, [setValue]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      // Incluir comodidades customizadas nos dados
      const finalData = {
        ...data,
        propertyAmenities: {
          ...data.propertyAmenities,
          others: customAmenities,
        },
      };

      localStorage.setItem('propertyAmenitiesData', JSON.stringify(finalData));
      onComplete();
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  });

  // Adicionar comodidade customizada
  const addCustomAmenity = () => {
    if (newAmenity.trim() && !customAmenities.includes(newAmenity.trim())) {
      setCustomAmenities([...customAmenities, newAmenity.trim()]);
      setNewAmenity('');
    }
  };

  // Remover comodidade customizada
  const removeCustomAmenity = (amenity: string) => {
    setCustomAmenities(customAmenities.filter((item) => item !== amenity));
  };

  // Contar comodidades selecionadas
  const countSelectedAmenities = () => {
    let count = 0;

    // Comodidades do imóvel
    Object.values(values.propertyAmenities || {}).forEach((value) => {
      if (typeof value === 'boolean' && value) count++;
    });
    count += customAmenities.length;

    // Comodidades do condomínio
    Object.values(values.condominiumAmenities || {}).forEach((category) => {
      if (typeof category === 'object') {
        Object.values(category).forEach((value) => {
          if (typeof value === 'boolean' && value) count++;
        });
      }
    });

    return count;
  };

  const selectedCount = countSelectedAmenities();

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Box sx={{ p: 4 }}>
        {/* Header */}
        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <Typography variant="h4" sx={{ mb: 2, fontWeight: 700, color: 'primary.main' }}>
            Comodidades e Diferenciais
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Destaque o que o imóvel oferece de especial
          </Typography>

          {selectedCount > 0 && (
            <Chip
              label={`${selectedCount} comodidade${selectedCount > 1 ? 's' : ''} selecionada${selectedCount > 1 ? 's' : ''}`}
              color="primary"
              variant="filled"
              sx={{ mt: 2, fontWeight: 600 }}
            />
          )}
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {/* Seção 3.1 - Comodidades do Imóvel */}
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
                  <Iconify icon="solar:home-smile-bold" width={24} sx={{ color: 'primary.main' }} />
                </Box>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.main' }}>
                    3.1 Comodidades do Imóvel
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Características e facilidades internas do imóvel
                  </Typography>
                </Box>
              </Box>

              <Grid2 container spacing={2}>
                <Grid2 size={{ xs: 6, sm: 4, md: 3 }}>
                  <Field.Checkbox name="propertyAmenities.balcony" label="Varanda/Sacada" />
                </Grid2>
                <Grid2 size={{ xs: 6, sm: 4, md: 3 }}>
                  <Field.Checkbox name="propertyAmenities.privateBarbecue" label="Churrasqueira" />
                </Grid2>
                <Grid2 size={{ xs: 6, sm: 4, md: 3 }}>
                  <Field.Checkbox name="propertyAmenities.privatePool" label="Piscina Privativa" />
                </Grid2>
                <Grid2 size={{ xs: 6, sm: 4, md: 3 }}>
                  <Field.Checkbox name="propertyAmenities.garden" label="Jardim/Quintal" />
                </Grid2>
                <Grid2 size={{ xs: 6, sm: 4, md: 3 }}>
                  <Field.Checkbox
                    name="propertyAmenities.airConditioning"
                    label="Ar Condicionado"
                  />
                </Grid2>
                <Grid2 size={{ xs: 6, sm: 4, md: 3 }}>
                  <Field.Checkbox name="propertyAmenities.heating" label="Aquecimento" />
                </Grid2>
                <Grid2 size={{ xs: 6, sm: 4, md: 3 }}>
                  <Field.Checkbox
                    name="propertyAmenities.americanKitchen"
                    label="Cozinha Americana"
                  />
                </Grid2>
                <Grid2 size={{ xs: 6, sm: 4, md: 3 }}>
                  <Field.Checkbox name="propertyAmenities.gourmetArea" label="Área Gourmet" />
                </Grid2>
                <Grid2 size={{ xs: 6, sm: 4, md: 3 }}>
                  <Field.Checkbox name="propertyAmenities.fireplace" label="Lareira" />
                </Grid2>
                <Grid2 size={{ xs: 6, sm: 4, md: 3 }}>
                  <Field.Checkbox name="propertyAmenities.closet" label="Closet" />
                </Grid2>
                <Grid2 size={{ xs: 6, sm: 4, md: 3 }}>
                  <Field.Checkbox name="propertyAmenities.office" label="Escritório" />
                </Grid2>
              </Grid2>

              {/* Comodidades Customizadas */}
              <Box sx={{ mt: 3 }}>
                <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
                  Outras Comodidades
                </Typography>

                <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                  {customAmenities.map((amenity, index) => (
                    <Chip
                      key={index}
                      label={amenity}
                      onDelete={() => removeCustomAmenity(amenity)}
                      color="primary"
                      variant="outlined"
                    />
                  ))}
                </Box>

                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                  <Field.Text
                    name="customAmenity"
                    label="Adicionar Comodidade"
                    placeholder="Ex: Hidromassagem"
                    value={newAmenity}
                    onChange={(e) => setNewAmenity(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addCustomAmenity();
                      }
                    }}
                    sx={{ flex: 1 }}
                  />
                  <Chip
                    label="Adicionar"
                    onClick={addCustomAmenity}
                    disabled={!newAmenity.trim()}
                    color="primary"
                    sx={{ cursor: 'pointer', mt: 1 }}
                  />
                </Box>
              </Box>
            </CardContent>
          </Card>

          {/* Seção 3.2 - Infraestrutura do Condomínio */}
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
                  <Iconify icon="solar:buildings-2-bold" width={24} sx={{ color: 'info.main' }} />
                </Box>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: 'info.main' }}>
                    3.2 Infraestrutura do Condomínio
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Facilidades e serviços oferecidos pelo condomínio
                  </Typography>
                </Box>
              </Box>

              {/* Segurança */}
              <Box sx={{ mb: 4 }}>
                <Typography
                  variant="subtitle1"
                  sx={{ mb: 2, fontWeight: 600, color: 'error.main' }}
                >
                  🛡️ Segurança
                </Typography>
                <Grid2 container spacing={2}>
                  <Grid2 size={{ xs: 6, sm: 4, md: 3 }}>
                    <Field.Checkbox
                      name="condominiumAmenities.security.reception24h"
                      label="Portaria 24h"
                    />
                  </Grid2>
                  <Grid2 size={{ xs: 6, sm: 4, md: 3 }}>
                    <Field.Checkbox name="condominiumAmenities.security.cameras" label="Câmeras" />
                  </Grid2>
                  <Grid2 size={{ xs: 6, sm: 4, md: 3 }}>
                    <Field.Checkbox
                      name="condominiumAmenities.security.alarm"
                      label="Sistema de Alarme"
                    />
                  </Grid2>
                  <Grid2 size={{ xs: 6, sm: 4, md: 3 }}>
                    <Field.Checkbox
                      name="condominiumAmenities.security.electronicGate"
                      label="Portão Eletrônico"
                    />
                  </Grid2>
                </Grid2>
              </Box>

              {/* Lazer */}
              <Box sx={{ mb: 4 }}>
                <Typography
                  variant="subtitle1"
                  sx={{ mb: 2, fontWeight: 600, color: 'success.main' }}
                >
                  🎯 Lazer
                </Typography>
                <Grid2 container spacing={2}>
                  <Grid2 size={{ xs: 6, sm: 4, md: 3 }}>
                    <Field.Checkbox name="condominiumAmenities.leisure.pool" label="Piscina" />
                  </Grid2>
                  <Grid2 size={{ xs: 6, sm: 4, md: 3 }}>
                    <Field.Checkbox
                      name="condominiumAmenities.leisure.sportsCourt"
                      label="Quadra Esportiva"
                    />
                  </Grid2>
                  <Grid2 size={{ xs: 6, sm: 4, md: 3 }}>
                    <Field.Checkbox
                      name="condominiumAmenities.leisure.playground"
                      label="Playground"
                    />
                  </Grid2>
                  <Grid2 size={{ xs: 6, sm: 4, md: 3 }}>
                    <Field.Checkbox
                      name="condominiumAmenities.leisure.partyRoom"
                      label="Salão de Festas"
                    />
                  </Grid2>
                  <Grid2 size={{ xs: 6, sm: 4, md: 3 }}>
                    <Field.Checkbox
                      name="condominiumAmenities.leisure.gourmetSpace"
                      label="Espaço Gourmet"
                    />
                  </Grid2>
                  <Grid2 size={{ xs: 6, sm: 4, md: 3 }}>
                    <Field.Checkbox
                      name="condominiumAmenities.leisure.gameRoom"
                      label="Sala de Jogos"
                    />
                  </Grid2>
                  <Grid2 size={{ xs: 6, sm: 4, md: 3 }}>
                    <Field.Checkbox
                      name="condominiumAmenities.leisure.library"
                      label="Biblioteca"
                    />
                  </Grid2>
                  <Grid2 size={{ xs: 6, sm: 4, md: 3 }}>
                    <Field.Checkbox name="condominiumAmenities.leisure.cinema" label="Cinema" />
                  </Grid2>
                </Grid2>
              </Box>

              {/* Serviços */}
              <Box sx={{ mb: 4 }}>
                <Typography
                  variant="subtitle1"
                  sx={{ mb: 2, fontWeight: 600, color: 'warning.main' }}
                >
                  🔧 Serviços
                </Typography>
                <Grid2 container spacing={2}>
                  <Grid2 size={{ xs: 6, sm: 4, md: 3 }}>
                    <Field.Checkbox name="condominiumAmenities.services.gym" label="Academia" />
                  </Grid2>
                  <Grid2 size={{ xs: 6, sm: 4, md: 3 }}>
                    <Field.Checkbox name="condominiumAmenities.services.sauna" label="Sauna" />
                  </Grid2>
                  <Grid2 size={{ xs: 6, sm: 4, md: 3 }}>
                    <Field.Checkbox
                      name="condominiumAmenities.services.laundry"
                      label="Lavanderia"
                    />
                  </Grid2>
                  <Grid2 size={{ xs: 6, sm: 4, md: 3 }}>
                    <Field.Checkbox
                      name="condominiumAmenities.services.coworking"
                      label="Coworking"
                    />
                  </Grid2>
                  <Grid2 size={{ xs: 6, sm: 4, md: 3 }}>
                    <Field.Checkbox name="condominiumAmenities.services.petCare" label="Pet Care" />
                  </Grid2>
                  <Grid2 size={{ xs: 6, sm: 4, md: 3 }}>
                    <Field.Checkbox
                      name="condominiumAmenities.services.concierge"
                      label="Concierge"
                    />
                  </Grid2>
                </Grid2>
              </Box>

              {/* Facilidades */}
              <Box sx={{ mb: 4 }}>
                <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600, color: 'info.main' }}>
                  ⚡ Facilidades
                </Typography>
                <Grid2 container spacing={2}>
                  <Grid2 size={{ xs: 6, sm: 4, md: 3 }}>
                    <Field.Checkbox
                      name="condominiumAmenities.facilities.elevator"
                      label="Elevador"
                    />
                  </Grid2>
                  <Grid2 size={{ xs: 6, sm: 4, md: 3 }}>
                    <Field.Checkbox
                      name="condominiumAmenities.facilities.generator"
                      label="Gerador"
                    />
                  </Grid2>
                  <Grid2 size={{ xs: 6, sm: 4, md: 3 }}>
                    <Field.Checkbox
                      name="condominiumAmenities.facilities.waterTank"
                      label="Cisterna"
                    />
                  </Grid2>
                  <Grid2 size={{ xs: 6, sm: 4, md: 3 }}>
                    <Field.Checkbox
                      name="condominiumAmenities.facilities.solarEnergy"
                      label="Energia Solar"
                    />
                  </Grid2>
                  <Grid2 size={{ xs: 6, sm: 4, md: 3 }}>
                    <Field.Checkbox
                      name="condominiumAmenities.facilities.fiberOptic"
                      label="Fibra Óptica"
                    />
                  </Grid2>
                </Grid2>
              </Box>

              {/* Acessibilidade */}
              <Box>
                <Typography
                  variant="subtitle1"
                  sx={{ mb: 2, fontWeight: 600, color: 'secondary.main' }}
                >
                  ♿ Acessibilidade
                </Typography>
                <Grid2 container spacing={2}>
                  <Grid2 size={{ xs: 6, sm: 4, md: 3 }}>
                    <Field.Checkbox
                      name="condominiumAmenities.accessibility.ramps"
                      label="Rampas"
                    />
                  </Grid2>
                  <Grid2 size={{ xs: 6, sm: 4, md: 3 }}>
                    <Field.Checkbox
                      name="condominiumAmenities.accessibility.handrails"
                      label="Corrimão"
                    />
                  </Grid2>
                  <Grid2 size={{ xs: 6, sm: 4, md: 3 }}>
                    <Field.Checkbox
                      name="condominiumAmenities.accessibility.accessibleParking"
                      label="Vaga PCD"
                    />
                  </Grid2>
                  <Grid2 size={{ xs: 6, sm: 4, md: 3 }}>
                    <Field.Checkbox
                      name="condominiumAmenities.accessibility.braille"
                      label="Sinalização Braille"
                    />
                  </Grid2>
                </Grid2>
              </Box>
            </CardContent>
          </Card>

          {/* Seção 3.3 - Diferenciais da Localização */}
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
                    icon="solar:map-point-wave-bold"
                    width={24}
                    sx={{ color: 'success.main' }}
                  />
                </Box>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: 'success.main' }}>
                    3.3 Diferenciais da Localização
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Proximidade a serviços e pontos de interesse (opcional)
                  </Typography>
                </Box>
              </Box>

              <Alert severity="info" sx={{ borderRadius: 2 }}>
                <Typography variant="body2">
                  Esta seção é opcional. Você pode adicionar informações sobre proximidade a
                  transporte público, comércio, escolas, hospitais e áreas de lazer para valorizar
                  ainda mais o imóvel.
                </Typography>
              </Alert>
            </CardContent>
          </Card>

          {/* Resumo das Comodidades */}
          <Alert
            severity={selectedCount > 10 ? 'success' : selectedCount > 5 ? 'info' : 'warning'}
            sx={{
              borderRadius: 3,
              '& .MuiAlert-icon': {
                fontSize: 24,
              },
            }}
            icon={<Iconify icon="solar:star-bold" />}
          >
            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                Score de Comodidades:{' '}
                {selectedCount > 10 ? 'Excelente' : selectedCount > 5 ? 'Bom' : 'Básico'}
              </Typography>
              <Typography variant="body2">
                {selectedCount === 0
                  ? 'Nenhuma comodidade selecionada. Adicione comodidades para tornar o anúncio mais atrativo.'
                  : selectedCount > 10
                    ? 'Ótimo! Seu imóvel possui muitas comodidades que o tornam muito atrativo.'
                    : selectedCount > 5
                      ? 'Bom conjunto de comodidades. Considere adicionar mais diferenciais se disponíveis.'
                      : 'Comodidades básicas selecionadas. Adicione mais para destacar o imóvel.'}
              </Typography>
            </Box>
          </Alert>
        </Box>
      </Box>
    </Form>
  );
};

export default PropertyAmenitiesForm;
