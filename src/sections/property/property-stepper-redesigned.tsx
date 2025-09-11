import type { StepIconProps } from '@mui/material/StepIcon';

import React, { useState, useEffect, useCallback } from 'react';

import { styled } from '@mui/material/styles';
import Check from '@mui/icons-material/Check';
import HomeIcon from '@mui/icons-material/Home';
import StarIcon from '@mui/icons-material/Star';
import BuildIcon from '@mui/icons-material/Build';
import WarningIcon from '@mui/icons-material/Warning';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import {
  Box,
  Step,
  Chip,
  Alert,
  Button,
  Stepper,
  StepLabel,
  Typography,
  StepConnector,
  LinearProgress,
  stepConnectorClasses,
} from '@mui/material';

import { Iconify } from 'src/components/iconify';

import PropertyAmenitiesForm from './forms/property-amenities-form';
import PropertyPresentationForm from './forms/property-presentation-form';
// Importar os novos formulários reorganizados
import PropertyIdentificationForm from './forms/property-identification-form';
import PropertyCharacteristicsForm from './forms/property-characteristics-form';

// Conector personalizado para o stepper
const ModernConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 22,
    left: 'calc(-50% + 20px)',
    right: 'calc(50% + 20px)',
  },
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      borderColor: theme.palette.primary.main,
      borderTopWidth: 4,
      background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.light} 100%)`,
      borderImage: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.light} 100%) 1`,
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      borderColor: theme.palette.success.main,
      borderTopWidth: 4,
      background: theme.palette.success.main,
    },
  },
  [`& .${stepConnectorClasses.line}`]: {
    borderColor: theme.palette.grey[300],
    borderTopWidth: 2,
    borderRadius: 2,
    transition: 'all 0.3s ease-in-out',
  },
}));

// Container do ícone do stepper
const ModernStepIconRoot = styled('div')<{
  ownerState: { active?: boolean; completed?: boolean; error?: boolean };
}>(({ theme, ownerState }) => ({
  backgroundColor: ownerState.completed
    ? theme.palette.success.main
    : ownerState.active
      ? theme.palette.primary.main
      : ownerState.error
        ? theme.palette.error.main
        : theme.palette.grey[300],
  zIndex: 1,
  color: '#fff',
  width: 50,
  height: 50,
  display: 'flex',
  borderRadius: '50%',
  justifyContent: 'center',
  alignItems: 'center',
  fontSize: 22,
  fontWeight: 600,
  transition: 'all 0.3s ease-in-out',
  border: `3px solid ${ownerState.active ? theme.palette.primary.light : 'transparent'}`,
  boxShadow: ownerState.active
    ? `0 0 0 4px ${theme.palette.primary.main}20`
    : ownerState.completed
      ? `0 4px 12px ${theme.palette.success.main}40`
      : 'none',
  transform: ownerState.active ? 'scale(1.1)' : 'scale(1)',
}));

// Ícone personalizado do stepper
function ModernStepIcon(props: StepIconProps & { error?: boolean }) {
  const { active, completed, className, icon, error } = props;

  const getStepIcon = (step: number) => {
    const iconProps = { fontSize: 'inherit' as const };
    switch (step) {
      case 1:
        return <HomeIcon {...iconProps} />;
      case 2:
        return <BuildIcon {...iconProps} />;
      case 3:
        return <StarIcon {...iconProps} />;
      case 4:
        return <CameraAltIcon {...iconProps} />;
      default:
        return <span>{step}</span>;
    }
  };

  return (
    <ModernStepIconRoot ownerState={{ active, completed, error }} className={className}>
      {completed ? (
        <Check fontSize="inherit" />
      ) : error ? (
        <WarningIcon fontSize="inherit" />
      ) : (
        getStepIcon(Number(icon))
      )}
    </ModernStepIconRoot>
  );
}

// Passos do stepper reorganizados
const steps = [
  {
    label: 'Identificação e Contexto',
    description: 'O que é e onde está',
    component: PropertyIdentificationForm,
    icon: 'solar:home-bold',
    sections: ['Identificação Básica', 'Localização Completa', 'Contexto do Empreendimento'],
  },
  {
    label: 'Características Físicas',
    description: 'Como é construído e distribuído',
    component: PropertyCharacteristicsForm,
    icon: 'solar:buildings-2-bold',
    sections: ['Dimensões e Layout', 'Características Estruturais', 'Estado e Acabamentos'],
  },
  {
    label: 'Comodidades e Diferenciais',
    description: 'O que oferece de especial',
    component: PropertyAmenitiesForm,
    icon: 'solar:star-bold',
    sections: [
      'Comodidades do Imóvel',
      'Infraestrutura do Condomínio',
      'Diferenciais da Localização',
    ],
  },
  {
    label: 'Apresentação e Comercialização',
    description: 'Como apresentar e vender',
    component: PropertyPresentationForm,
    icon: 'solar:camera-bold',
    sections: ['Documentação Visual', 'Informações Comerciais', 'Descrição e Marketing'],
  },
];

export default function PropertyStepperRedesigned() {
  const [activeStep, setActiveStep] = useState(0);
  const [completed, setCompleted] = useState<Record<number, boolean>>({});
  const [formValid, setFormValid] = useState(false);
  const [validationMessage, setValidationMessage] = useState('');
  const [qualityScore, setQualityScore] = useState(0);

  // Verifica se todos os passos estão completos
  const isLastStep = () => activeStep === steps.length - 1;

  // Função para calcular score de qualidade
  const calculateQualityScore = useCallback((): number => {
    const storageKeys = [
      'propertyIdentificationData',
      'propertyCharacteristicsData',
      'propertyAmenitiesData',
      'propertyPresentationData',
    ];

    let totalScore = 0;
    const maxScore = 400; // 100 pontos por etapa

    storageKeys.forEach((key, index) => {
      const data = localStorage.getItem(key);
      if (data) {
        const parsedData = JSON.parse(data);
        totalScore += calculateStepScore(parsedData, index);
      }
    });

    return Math.round((totalScore / maxScore) * 100);
  }, []);

  // Função para calcular score de cada etapa
  const calculateStepScore = (data: any, stepIndex: number): number => {
    let score = 0;

    switch (stepIndex) {
      case 0: {
        // Identificação e Contexto
        if (data.type) score += 25;
        if (data.purpose) score += 25;
        if (data.location?.zipCode && data.location?.street) score += 30;
        if (data.building?.name) score += 20;
        break;
      }
      case 1: {
        // Características Físicas
        if (data.dimensions?.totalArea) score += 30;
        if (data.dimensions?.rooms?.bedrooms) score += 25;
        if (data.structural?.floor !== undefined) score += 20;
        if (data.condition?.conservation) score += 25;
        break;
      }
      case 2: {
        // Comodidades
        const amenitiesCount = Object.values(data.propertyAmenities || {}).filter(Boolean).length;
        score += Math.min(amenitiesCount * 10, 50);
        const condominiumCount = Object.values(data.condominiumAmenities || {}).filter(
          Boolean
        ).length;
        score += Math.min(condominiumCount * 5, 50);
        break;
      }
      case 3: {
        // Apresentação
        if (data.media?.photos?.length > 0) score += 40;
        if (data.commercial?.salePrice || data.commercial?.rentPrice) score += 30;
        if (data.marketing?.description?.length > 50) score += 30;
        break;
      }
      default:
        break;
    }

    return Math.min(score, 100);
  };

  // Função para validar o step atual
  const validateCurrentStep = useCallback((): boolean => {
    const storageKeys = [
      'propertyIdentificationData',
      'propertyCharacteristicsData',
      'propertyAmenitiesData',
      'propertyPresentationData',
    ];

    const data = localStorage.getItem(storageKeys[activeStep]);
    const currentStepData = data ? JSON.parse(data) : null;

    switch (activeStep) {
      case 0: // Identificação e Contexto
        return !!(
          currentStepData?.type &&
          currentStepData?.purpose &&
          currentStepData?.location?.zipCode &&
          currentStepData?.location?.street &&
          currentStepData?.location?.number &&
          currentStepData?.location?.neighborhood &&
          currentStepData?.location?.city &&
          currentStepData?.location?.state
        );
      case 1: // Características Físicas
        return !!(
          currentStepData?.dimensions?.totalArea &&
          currentStepData?.dimensions?.rooms?.bedrooms &&
          currentStepData?.dimensions?.rooms?.bathrooms &&
          currentStepData?.condition?.conservation
        );
      case 2: // Comodidades
        return true; // Esta etapa é sempre válida (comodidades são opcionais)
      case 3: // Apresentação
        return !!(
          currentStepData?.media?.photos?.length > 0 &&
          (currentStepData?.commercial?.salePrice || currentStepData?.commercial?.rentPrice) &&
          currentStepData?.marketing?.description?.length > 20
        );
      default:
        return false;
    }
  }, [activeStep]);

  // Função para obter mensagem de validação
  const getValidationMessage = useCallback((): string => {
    switch (activeStep) {
      case 0:
        return 'Complete a identificação básica e localização do imóvel';
      case 1:
        return 'Preencha as características físicas essenciais';
      case 2:
        return 'Selecione as comodidades disponíveis (opcional)';
      case 3:
        return 'Adicione fotos, valores e descrição do imóvel';
      default:
        return 'Complete as informações necessárias';
    }
  }, [activeStep]);

  // Validar step em tempo real
  useEffect(() => {
    const isValid = validateCurrentStep();
    setFormValid(isValid);

    if (!isValid) {
      setValidationMessage(getValidationMessage());
    } else {
      setValidationMessage('');
    }

    // Atualizar score de qualidade
    const score = calculateQualityScore();
    setQualityScore(score);
  }, [activeStep, validateCurrentStep, getValidationMessage, calculateQualityScore]);

  // Verificar mudanças no localStorage
  useEffect(() => {
    const handleStorageChange = () => {
      const isValid = validateCurrentStep();
      setFormValid(isValid);

      if (!isValid) {
        setValidationMessage(getValidationMessage());
      } else {
        setValidationMessage('');
      }

      const score = calculateQualityScore();
      setQualityScore(score);
    };

    const interval = setInterval(handleStorageChange, 1000);
    return () => clearInterval(interval);
  }, [activeStep, validateCurrentStep, getValidationMessage, calculateQualityScore]);

  // Marca o passo atual como completo
  const handleComplete = () => {
    if (!formValid && activeStep !== 2) {
      // Etapa 2 (comodidades) é sempre válida
      setValidationMessage(getValidationMessage());
      return;
    }

    const newCompleted = { ...completed };
    newCompleted[activeStep] = true;
    setCompleted(newCompleted);

    if (!isLastStep()) {
      handleNext();
    } else {
      handleSubmitForm();
    }
  };

  // Função para enviar o formulário
  const handleSubmitForm = () => {
    const allData = {
      identification: JSON.parse(localStorage.getItem('propertyIdentificationData') || '{}'),
      characteristics: JSON.parse(localStorage.getItem('propertyCharacteristicsData') || '{}'),
      amenities: JSON.parse(localStorage.getItem('propertyAmenitiesData') || '{}'),
      presentation: JSON.parse(localStorage.getItem('propertyPresentationData') || '{}'),
      qualityScore,
      completedAt: new Date().toISOString(),
    };

    console.log('Dados completos do formulário reorganizado:', allData);

    // Aqui você pode enviar os dados para o backend
    // await api.post('/properties', allData);

    alert(`Formulário enviado com sucesso! Score de qualidade: ${qualityScore}%`);
  };

  // Avança para o próximo passo
  const handleNext = () => {
    const newActiveStep = activeStep + 1;
    setActiveStep(newActiveStep);
    setValidationMessage('');
  };

  // Retorna para o passo anterior
  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
    setValidationMessage('');
  };

  // Renderiza o componente do passo atual
  const renderStepContent = () => {
    const StepComponent = steps[activeStep].component;
    return <StepComponent onComplete={handleComplete} />;
  };

  const progressPercentage = ((activeStep + 1) / steps.length) * 100;
  const qualityColor = qualityScore >= 80 ? 'success' : qualityScore >= 60 ? 'warning' : 'error';

  return (
    <Box sx={{ width: '100%', maxWidth: 1400, mx: 'auto', p: 3 }}>
      {/* Header com título e progresso */}
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Typography variant="h3" sx={{ mb: 2, fontWeight: 700, color: 'primary.main' }}>
          Cadastro Inteligente de Imóvel
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 3, maxWidth: 600, mx: 'auto' }}>
          Sistema reorganizado para uma experiência mais intuitiva e anúncios de alta qualidade
        </Typography>

        {/* Métricas de progresso */}
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 4, mb: 3 }}>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main' }}>
              {activeStep + 1}/{steps.length}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Etapas
            </Typography>
          </Box>

          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h4" sx={{ fontWeight: 700, color: `${qualityColor}.main` }}>
              {qualityScore}%
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Qualidade
            </Typography>
          </Box>

          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h4" sx={{ fontWeight: 700, color: 'success.main' }}>
              {Object.keys(completed).length}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Concluídas
            </Typography>
          </Box>
        </Box>

        {/* Barra de progresso */}
        <Box sx={{ mb: 3 }}>
          <Box
            sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}
          >
            <Typography variant="body1" sx={{ fontWeight: 600 }}>
              {steps[activeStep].label}
            </Typography>
            <Chip
              label={`${Math.round(progressPercentage)}% concluído`}
              size="medium"
              color={progressPercentage === 100 ? 'success' : 'primary'}
              variant="filled"
              sx={{ fontWeight: 600 }}
            />
          </Box>
          <LinearProgress
            variant="determinate"
            value={progressPercentage}
            sx={{
              height: 10,
              borderRadius: 5,
              backgroundColor: 'grey.200',
              '& .MuiLinearProgress-bar': {
                borderRadius: 5,
                background:
                  progressPercentage === 100
                    ? 'linear-gradient(90deg, #4caf50 0%, #66bb6a 100%)'
                    : 'linear-gradient(90deg, #1976d2 0%, #42a5f5 100%)',
              },
            }}
          />
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            {steps[activeStep].description}
          </Typography>
        </Box>
      </Box>

      {/* Stepper */}
      <Stepper
        alternativeLabel
        activeStep={activeStep}
        connector={<ModernConnector />}
        sx={{ mb: 5 }}
      >
        {steps.map((step, index) => {
          const stepProps: { completed?: boolean } = {};
          const isStepCompleted = index < activeStep || (index === activeStep && formValid);
          const hasError = index === activeStep && !formValid && validationMessage && index !== 2;

          return (
            <Step key={step.label} {...stepProps} completed={isStepCompleted}>
              <StepLabel
                StepIconComponent={(props) => <ModernStepIcon {...props} error={!!hasError} />}
                optional={
                  <Box sx={{ textAlign: 'center', mt: 1 }}>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                      {step.description}
                    </Typography>
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        gap: 0.5,
                        mt: 0.5,
                        flexWrap: 'wrap',
                      }}
                    >
                      {step.sections.map((section, idx) => (
                        <Chip
                          key={idx}
                          label={section}
                          size="small"
                          variant="outlined"
                          sx={{ fontSize: '0.65rem', height: 20 }}
                        />
                      ))}
                    </Box>
                  </Box>
                }
                error={!!hasError}
                sx={{
                  '& .MuiStepLabel-label': {
                    fontSize: '1rem',
                    fontWeight: 600,
                    mt: 1,
                  },
                }}
              >
                {step.label}
              </StepLabel>
            </Step>
          );
        })}
      </Stepper>

      {/* Feedback de validação */}
      {validationMessage && activeStep !== 2 && (
        <Alert
          severity={formValid ? 'success' : 'info'}
          sx={{
            mb: 3,
            borderRadius: 3,
            '& .MuiAlert-icon': {
              fontSize: 24,
            },
          }}
          icon={formValid ? <Check /> : <Iconify icon="solar:info-circle-bold" />}
        >
          <Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
              {formValid
                ? `Etapa ${activeStep + 1} concluída com sucesso!`
                : `Etapa ${activeStep + 1}: ${steps[activeStep].label}`}
            </Typography>
            <Typography variant="body2">
              {formValid ? 'Todas as informações essenciais foram preenchidas.' : validationMessage}
            </Typography>
          </Box>
        </Alert>
      )}

      {/* Score de qualidade */}
      {qualityScore > 0 && (
        <Alert
          severity={qualityColor}
          sx={{
            mb: 3,
            borderRadius: 3,
          }}
          icon={<Iconify icon="solar:star-bold" />}
        >
          <Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
              Score de Qualidade: {qualityScore}%
            </Typography>
            <Typography variant="body2">
              {qualityScore >= 80
                ? 'Excelente! Seu anúncio está muito completo.'
                : qualityScore >= 60
                  ? 'Bom! Adicione mais detalhes para melhorar.'
                  : 'Preencha mais informações para criar um anúncio atrativo.'}
            </Typography>
          </Box>
        </Alert>
      )}

      {/* Conteúdo do formulário */}
      <Box
        sx={{
          mb: 4,
          backgroundColor: 'background.paper',
          borderRadius: 4,
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
          overflow: 'hidden',
          transition: 'all 0.3s ease-in-out',
          border: '1px solid',
          borderColor: 'divider',
          '&:hover': {
            boxShadow: '0 12px 40px rgba(0, 0, 0, 0.12)',
          },
        }}
      >
        {renderStepContent()}
      </Box>

      {/* Botões de navegação */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mt: 4,
          pt: 3,
          borderTop: '2px solid',
          borderColor: 'divider',
        }}
      >
        <Button
          color="inherit"
          variant="outlined"
          disabled={activeStep === 0}
          onClick={handleBack}
          startIcon={<Iconify icon="solar:arrow-left-bold" />}
          sx={{
            minWidth: 140,
            borderRadius: 3,
            py: 1.5,
            fontWeight: 600,
          }}
        >
          {activeStep === 0 ? 'Cancelar' : 'Voltar'}
        </Button>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              Etapa {activeStep + 1} de {steps.length}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {steps[activeStep].sections.length} seções
            </Typography>
          </Box>

          <Button
            variant="contained"
            onClick={handleComplete}
            disabled={!formValid && activeStep !== 2}
            endIcon={
              <Iconify icon={isLastStep() ? 'solar:check-circle-bold' : 'solar:arrow-right-bold'} />
            }
            sx={{
              minWidth: 140,
              borderRadius: 3,
              py: 1.5,
              fontWeight: 600,
              bgcolor:
                formValid || activeStep === 2
                  ? isLastStep()
                    ? 'success.main'
                    : 'primary.main'
                  : 'grey.400',
              '&:hover': {
                bgcolor:
                  formValid || activeStep === 2
                    ? isLastStep()
                      ? 'success.dark'
                      : 'primary.dark'
                    : 'grey.500',
              },
              '&:disabled': {
                bgcolor: 'grey.300',
                color: 'grey.600',
              },
            }}
          >
            {isLastStep() ? 'Finalizar Cadastro' : 'Continuar'}
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
