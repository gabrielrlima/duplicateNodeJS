import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { useState, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';

import { Box, Card, Chip, Grid2, Alert, MenuItem, Typography, CardContent } from '@mui/material';

import { Upload } from 'src/components/upload';
import { Iconify } from 'src/components/iconify';
import { Form, Field } from 'src/components/hook-form';

interface PropertyPresentationFormProps {
  onComplete: () => void;
}

// Schema de validação para apresentação e comercialização
const presentationSchema = zod.object({
  // Seção 4.1 - Documentação Visual
  media: zod.object({
    photos: zod.array(zod.any()).min(1, 'Pelo menos 1 foto é obrigatória'),
    floorPlan: zod.any().optional(),
    videoTour: zod.string().optional(),
  }),

  // Seção 4.2 - Informações Comerciais
  commercial: zod
    .object({
      salePrice: zod.coerce.number().optional(),
      rentPrice: zod.coerce.number().optional(),
      condominiumFee: zod.coerce.number().min(0, 'Valor do condomínio deve ser válido'),
      iptu: zod.coerce.number().min(0, 'Valor do IPTU deve ser válido'),
      otherFees: zod
        .array(
          zod.object({
            name: zod.string(),
            value: zod.coerce.number().min(0),
          })
        )
        .optional(),
      paymentConditions: zod.object({
        financing: zod.boolean(),
        fgts: zod.boolean(),
        exchange: zod.boolean(),
      }),
    })
    .refine((data) => data.salePrice || data.rentPrice, {
      message: 'Pelo menos um valor (venda ou aluguel) deve ser informado',
      path: ['salePrice'],
    }),

  // Seção 4.3 - Descrição e Marketing
  marketing: zod.object({
    title: zod.string().min(10, 'Título deve ter pelo menos 10 caracteres'),
    description: zod.string().min(50, 'Descrição deve ter pelo menos 50 caracteres'),
    highlights: zod.array(zod.string()).optional(),
    targetAudience: zod.string().optional(),
    observations: zod.string().optional(),
    restrictions: zod.array(zod.string()).optional(),
  }),
});

type PresentationFormData = zod.infer<typeof presentationSchema>;

const PropertyPresentationForm: React.FC<PropertyPresentationFormProps> = ({ onComplete }) => {
  const [uploadedPhotos, setUploadedPhotos] = useState<File[]>([]);
  const [floorPlan, setFloorPlan] = useState<File | null>(null);
  const [highlights, setHighlights] = useState<string[]>([]);
  const [newHighlight, setNewHighlight] = useState('');
  const [restrictions, setRestrictions] = useState<string[]>([]);
  const [newRestriction, setNewRestriction] = useState('');
  const [otherFees, setOtherFees] = useState<Array<{ name: string; value: number }>>([]);

  const defaultValues: PresentationFormData = {
    media: {
      photos: [],
      floorPlan: null,
      videoTour: '',
    },
    commercial: {
      salePrice: undefined,
      rentPrice: undefined,
      condominiumFee: 0,
      iptu: 0,
      otherFees: [],
      paymentConditions: {
        financing: false,
        fgts: false,
        exchange: false,
      },
    },
    marketing: {
      title: '',
      description: '',
      highlights: [],
      targetAudience: '',
      observations: '',
      restrictions: [],
    },
  };

  const methods = useForm<PresentationFormData>({
    resolver: zodResolver(presentationSchema),
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
    const dataToSave = {
      ...values,
      media: {
        ...values.media,
        photos: uploadedPhotos,
        floorPlan,
      },
      marketing: {
        ...values.marketing,
        highlights,
        restrictions,
      },
      commercial: {
        ...values.commercial,
        otherFees,
      },
    };
    localStorage.setItem('propertyPresentationData', JSON.stringify(dataToSave));
  }, [values, uploadedPhotos, floorPlan, highlights, restrictions, otherFees]);

  // Carregar dados salvos
  useEffect(() => {
    const savedData = localStorage.getItem('propertyPresentationData');
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      Object.keys(parsedData).forEach((key) => {
        if (key !== 'media' && key !== 'marketing' && key !== 'commercial') {
          setValue(key as keyof PresentationFormData, parsedData[key]);
        }
      });

      // Carregar dados específicos
      if (parsedData.media?.photos) {
        setUploadedPhotos(parsedData.media.photos);
      }
      if (parsedData.media?.floorPlan) {
        setFloorPlan(parsedData.media.floorPlan);
      }
      if (parsedData.marketing?.highlights) {
        setHighlights(parsedData.marketing.highlights);
      }
      if (parsedData.marketing?.restrictions) {
        setRestrictions(parsedData.marketing.restrictions);
      }
      if (parsedData.commercial?.otherFees) {
        setOtherFees(parsedData.commercial.otherFees);
      }
    }
  }, [setValue]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      const finalData = {
        ...data,
        media: {
          ...data.media,
          photos: uploadedPhotos,
          floorPlan,
        },
        marketing: {
          ...data.marketing,
          highlights,
          restrictions,
        },
        commercial: {
          ...data.commercial,
          otherFees,
        },
      };

      localStorage.setItem('propertyPresentationData', JSON.stringify(finalData));
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

  // Funções para gerenciar highlights
  const addHighlight = () => {
    if (newHighlight.trim() && !highlights.includes(newHighlight.trim())) {
      setHighlights([...highlights, newHighlight.trim()]);
      setNewHighlight('');
    }
  };

  const removeHighlight = (highlight: string) => {
    setHighlights(highlights.filter((item) => item !== highlight));
  };

  // Funções para gerenciar restrições
  const addRestriction = () => {
    if (newRestriction.trim() && !restrictions.includes(newRestriction.trim())) {
      setRestrictions([...restrictions, newRestriction.trim()]);
      setNewRestriction('');
    }
  };

  const removeRestriction = (restriction: string) => {
    setRestrictions(restrictions.filter((item) => item !== restriction));
  };

  // Funções para gerenciar outras taxas
  const addOtherFee = () => {
    setOtherFees([...otherFees, { name: '', value: 0 }]);
  };

  const updateOtherFee = (index: number, field: 'name' | 'value', value: string | number) => {
    const newFees = [...otherFees];
    newFees[index] = { ...newFees[index], [field]: value };
    setOtherFees(newFees);
  };

  const removeOtherFee = (index: number) => {
    setOtherFees(otherFees.filter((_, i) => i !== index));
  };

  // Função para formatar moeda
  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Box sx={{ p: 4 }}>
        {/* Header */}
        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <Typography variant="h4" sx={{ mb: 2, fontWeight: 700, color: 'primary.main' }}>
            Apresentação e Comercialização
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Finalize seu anúncio com fotos, valores e descrição atrativa
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {/* Seção 4.1 - Documentação Visual */}
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
                  <Iconify icon="solar:camera-bold" width={24} sx={{ color: 'primary.main' }} />
                </Box>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.main' }}>
                    4.1 Documentação Visual
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Fotos e materiais visuais do imóvel
                  </Typography>
                </Box>
              </Box>

              {/* Upload de Fotos */}
              <Box sx={{ mb: 4 }}>
                <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
                  Fotos do Imóvel *
                </Typography>

                <Upload
                  multiple
                  value={uploadedPhotos}
                  onDrop={(acceptedFiles) => {
                    setUploadedPhotos([...uploadedPhotos, ...acceptedFiles]);
                    setValue('media.photos', [...uploadedPhotos, ...acceptedFiles]);
                  }}
                  onRemove={(file) => {
                    const newFiles = uploadedPhotos.filter((f) => f !== file);
                    setUploadedPhotos(newFiles);
                    setValue('media.photos', newFiles);
                  }}
                  accept={{
                    'image/*': ['.jpeg', '.jpg', '.png', '.webp'],
                  }}
                  helperText="Adicione pelo menos 3 fotos de boa qualidade. Formatos aceitos: JPG, PNG, WEBP"
                  error={!!getFieldError('media.photos')}
                />

                {getFieldError('media.photos') && (
                  <Typography variant="caption" color="error" sx={{ mt: 1, display: 'block' }}>
                    {getFieldError('media.photos')}
                  </Typography>
                )}
              </Box>

              {/* Upload de Planta Baixa */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
                  Planta Baixa (Opcional)
                </Typography>

                <Upload
                  value={floorPlan}
                  onDrop={(acceptedFiles) => {
                    const file = acceptedFiles[0];
                    setFloorPlan(file);
                    setValue('media.floorPlan', file);
                  }}
                  onDelete={() => {
                    setFloorPlan(null);
                    setValue('media.floorPlan', null);
                  }}
                  accept={{
                    'image/*': ['.jpeg', '.jpg', '.png', '.pdf'],
                  }}
                  helperText="Adicione a planta baixa do imóvel (JPG, PNG ou PDF)"
                />
              </Box>

              {/* Vídeo Tour */}
              <Box>
                <Field.Text
                  name="media.videoTour"
                  label="Link do Vídeo Tour (Opcional)"
                  placeholder="https://youtube.com/watch?v=..."
                  error={!!getFieldError('media.videoTour')}
                  helperText={
                    getFieldError('media.videoTour') || 'Link do YouTube, Vimeo ou similar'
                  }
                />
              </Box>
            </CardContent>
          </Card>

          {/* Seção 4.2 - Informações Comerciais */}
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
                    icon="solar:dollar-minimalistic-bold"
                    width={24}
                    sx={{ color: 'success.main' }}
                  />
                </Box>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: 'success.main' }}>
                    4.2 Informações Comerciais
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Valores, taxas e condições de pagamento
                  </Typography>
                </Box>
              </Box>

              {/* Valores Principais */}
              <Grid2 container spacing={3} sx={{ mb: 4 }}>
                <Grid2 size={{ xs: 12, sm: 6 }}>
                  <Field.Text
                    name="commercial.salePrice"
                    label="Valor de Venda (R$)"
                    type="number"
                    placeholder="Ex: 450000"
                    error={!!getFieldError('commercial.salePrice')}
                    helperText={getFieldError('commercial.salePrice') || 'Valor para venda'}
                  />
                </Grid2>

                <Grid2 size={{ xs: 12, sm: 6 }}>
                  <Field.Text
                    name="commercial.rentPrice"
                    label="Valor de Aluguel (R$)"
                    type="number"
                    placeholder="Ex: 2500"
                    error={!!getFieldError('commercial.rentPrice')}
                    helperText={
                      getFieldError('commercial.rentPrice') || 'Valor mensal para aluguel'
                    }
                  />
                </Grid2>
              </Grid2>

              {/* Taxas */}
              <Grid2 container spacing={3} sx={{ mb: 4 }}>
                <Grid2 size={{ xs: 12, sm: 6 }}>
                  <Field.Text
                    name="commercial.condominiumFee"
                    label="Condomínio (R$)"
                    type="number"
                    placeholder="Ex: 350"
                    error={!!getFieldError('commercial.condominiumFee')}
                    helperText={
                      getFieldError('commercial.condominiumFee') || 'Valor mensal do condomínio'
                    }
                  />
                </Grid2>

                <Grid2 size={{ xs: 12, sm: 6 }}>
                  <Field.Text
                    name="commercial.iptu"
                    label="IPTU (R$)"
                    type="number"
                    placeholder="Ex: 150"
                    error={!!getFieldError('commercial.iptu')}
                    helperText={getFieldError('commercial.iptu') || 'Valor mensal do IPTU'}
                  />
                </Grid2>
              </Grid2>

              {/* Outras Taxas */}
              {otherFees.length > 0 && (
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
                    Outras Taxas
                  </Typography>
                  {otherFees.map((fee, index) => (
                    <Grid2 container spacing={2} key={index} sx={{ mb: 2, alignItems: 'center' }}>
                      <Grid2 size={{ xs: 6 }}>
                        <Field.Text
                          name={`otherFee_${index}_name`}
                          label="Nome da Taxa"
                          placeholder="Ex: Taxa de Limpeza"
                          value={fee.name}
                          onChange={(e) => updateOtherFee(index, 'name', e.target.value)}
                        />
                      </Grid2>
                      <Grid2 size={{ xs: 4 }}>
                        <Field.Text
                          name={`otherFee_${index}_value`}
                          label="Valor (R$)"
                          type="number"
                          value={fee.value}
                          onChange={(e) =>
                            updateOtherFee(index, 'value', parseFloat(e.target.value) || 0)
                          }
                        />
                      </Grid2>
                      <Grid2 size={{ xs: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'center', pt: 2 }}>
                          <Iconify
                            icon="solar:trash-bin-minimalistic-bold"
                            width={20}
                            sx={{ color: 'error.main', cursor: 'pointer' }}
                            onClick={() => removeOtherFee(index)}
                          />
                        </Box>
                      </Grid2>
                    </Grid2>
                  ))}
                </Box>
              )}

              <Box sx={{ mb: 4, display: 'flex', justifyContent: 'center' }}>
                <Chip
                  label="+ Adicionar Outra Taxa"
                  onClick={addOtherFee}
                  variant="outlined"
                  sx={{ cursor: 'pointer' }}
                />
              </Box>

              {/* Condições de Pagamento */}
              <Box>
                <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
                  Condições de Pagamento
                </Typography>
                <Grid2 container spacing={2}>
                  <Grid2 size={{ xs: 4 }}>
                    <Field.Checkbox
                      name="commercial.paymentConditions.financing"
                      label="Aceita Financiamento"
                    />
                  </Grid2>
                  <Grid2 size={{ xs: 4 }}>
                    <Field.Checkbox name="commercial.paymentConditions.fgts" label="Aceita FGTS" />
                  </Grid2>
                  <Grid2 size={{ xs: 4 }}>
                    <Field.Checkbox
                      name="commercial.paymentConditions.exchange"
                      label="Aceita Permuta"
                    />
                  </Grid2>
                </Grid2>
              </Box>
            </CardContent>
          </Card>

          {/* Seção 4.3 - Descrição e Marketing */}
          <Card sx={{ borderRadius: 3, boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.08)' }}>
            <CardContent sx={{ p: 4 }}>
              <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box
                  sx={{
                    p: 1.5,
                    borderRadius: 2,
                    bgcolor: 'warning.lighter',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Iconify
                    icon="solar:document-text-bold"
                    width={24}
                    sx={{ color: 'warning.main' }}
                  />
                </Box>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: 'warning.main' }}>
                    4.3 Descrição e Marketing
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Título atrativo e descrição detalhada
                  </Typography>
                </Box>
              </Box>

              {/* Título */}
              <Box sx={{ mb: 3 }}>
                <Field.Text
                  name="marketing.title"
                  label="Título do Anúncio"
                  placeholder="Ex: Apartamento 3 quartos com vista para o mar em Copacabana"
                  error={!!getFieldError('marketing.title')}
                  helperText={getFieldError('marketing.title') || 'Título atrativo e descritivo'}
                />
              </Box>

              {/* Descrição */}
              <Box sx={{ mb: 4 }}>
                <Field.Text
                  name="marketing.description"
                  label="Descrição Detalhada"
                  placeholder="Descreva as principais características, diferenciais e vantagens do imóvel..."
                  multiline
                  rows={6}
                  error={!!getFieldError('marketing.description')}
                  helperText={
                    getFieldError('marketing.description') ||
                    `${values.marketing?.description?.length || 0} caracteres (mínimo 50)`
                  }
                />
              </Box>

              {/* Pontos Fortes */}
              <Box sx={{ mb: 4 }}>
                <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
                  Pontos Fortes a Destacar
                </Typography>

                <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                  {highlights.map((highlight, index) => (
                    <Chip
                      key={index}
                      label={highlight}
                      onDelete={() => removeHighlight(highlight)}
                      color="primary"
                      variant="outlined"
                    />
                  ))}
                </Box>

                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                  <Field.Text
                    name="newHighlight"
                    label="Adicionar Ponto Forte"
                    placeholder="Ex: Vista panorâmica"
                    value={newHighlight}
                    onChange={(e) => setNewHighlight(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addHighlight();
                      }
                    }}
                    sx={{ flex: 1 }}
                  />
                  <Chip
                    label="Adicionar"
                    onClick={addHighlight}
                    disabled={!newHighlight.trim()}
                    color="primary"
                    sx={{ cursor: 'pointer', mt: 1 }}
                  />
                </Box>
              </Box>

              {/* Público-Alvo */}
              <Box sx={{ mb: 4 }}>
                <Field.Select
                  name="marketing.targetAudience"
                  label="Público-Alvo (Opcional)"
                  error={!!getFieldError('marketing.targetAudience')}
                  helperText={
                    getFieldError('marketing.targetAudience') || 'Ajuda a direcionar o marketing'
                  }
                >
                  <MenuItem value="">Não especificado</MenuItem>
                  <MenuItem value="families">Famílias</MenuItem>
                  <MenuItem value="couples">Casais</MenuItem>
                  <MenuItem value="singles">Solteiros</MenuItem>
                  <MenuItem value="investors">Investidores</MenuItem>
                  <MenuItem value="seniors">Terceira Idade</MenuItem>
                  <MenuItem value="students">Estudantes</MenuItem>
                  <MenuItem value="professionals">Profissionais Liberais</MenuItem>
                </Field.Select>
              </Box>

              {/* Observações */}
              <Box sx={{ mb: 4 }}>
                <Field.Text
                  name="marketing.observations"
                  label="Observações Importantes (Opcional)"
                  placeholder="Informações adicionais relevantes..."
                  multiline
                  rows={3}
                  error={!!getFieldError('marketing.observations')}
                  helperText={
                    getFieldError('marketing.observations') ||
                    'Informações extras que podem ser úteis'
                  }
                />
              </Box>

              {/* Restrições */}
              <Box>
                <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
                  Restrições (Opcional)
                </Typography>

                <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                  {restrictions.map((restriction, index) => (
                    <Chip
                      key={index}
                      label={restriction}
                      onDelete={() => removeRestriction(restriction)}
                      color="error"
                      variant="outlined"
                    />
                  ))}
                </Box>

                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                  <Field.Text
                    name="newRestriction"
                    label="Adicionar Restrição"
                    placeholder="Ex: Não permite pets"
                    value={newRestriction}
                    onChange={(e) => setNewRestriction(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addRestriction();
                      }
                    }}
                    sx={{ flex: 1 }}
                  />
                  <Chip
                    label="Adicionar"
                    onClick={addRestriction}
                    disabled={!newRestriction.trim()}
                    color="error"
                    sx={{ cursor: 'pointer', mt: 1 }}
                  />
                </Box>
              </Box>
            </CardContent>
          </Card>

          {/* Resumo Final */}
          <Alert
            severity="success"
            sx={{
              borderRadius: 3,
              '& .MuiAlert-icon': {
                fontSize: 24,
              },
            }}
            icon={<Iconify icon="solar:check-circle-bold" />}
          >
            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                Resumo do Anúncio
              </Typography>
              <Typography variant="body2">
                {uploadedPhotos.length > 0 &&
                  `${uploadedPhotos.length} foto${uploadedPhotos.length > 1 ? 's' : ''}`}
                {values.commercial?.salePrice &&
                  ` • Venda: ${formatCurrency(values.commercial.salePrice)}`}
                {values.commercial?.rentPrice &&
                  ` • Aluguel: ${formatCurrency(values.commercial.rentPrice)}`}
                {values.marketing?.title &&
                  ` • "${values.marketing.title.substring(0, 50)}${values.marketing.title.length > 50 ? '...' : ''}"`}
                {highlights.length > 0 &&
                  ` • ${highlights.length} ponto${highlights.length > 1 ? 's' : ''} forte${highlights.length > 1 ? 's' : ''}`}
              </Typography>
            </Box>
          </Alert>
        </Box>
      </Box>
    </Form>
  );
};

export default PropertyPresentationForm;
