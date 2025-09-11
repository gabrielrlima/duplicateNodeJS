import type { StepIconProps } from '@mui/material/StepIcon';

import React, { useState, useEffect, useCallback } from 'react';

import { styled } from '@mui/material/styles';
import Check from '@mui/icons-material/Check';
import HomeIcon from '@mui/icons-material/Home';
import WarningIcon from '@mui/icons-material/Warning';
import BusinessIcon from '@mui/icons-material/Business';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
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

import ImagesForm from './images-form';
import ValuesForm from './values-form';
import PropertyInfoForm from './property-info-form';
import LocationInfoForm from './location-info-form';
import CondominiumInfoForm from './condominium-info-form';

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
  width: 44,
  height: 44,
  display: 'flex',
  borderRadius: '50%',
  justifyContent: 'center',
  alignItems: 'center',
  fontSize: 20,
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
        return <BusinessIcon {...iconProps} />;
      case 3:
        return <LocationOnIcon {...iconProps} />;
      case 4:
        return <PhotoCameraIcon {...iconProps} />;
      case 5:
        return <AttachMoneyIcon {...iconProps} />;
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

// Passos do stepper
const steps = [
  {
    label: 'Informações do Imóvel',
    description: 'Detalhes básicos do imóvel',
    component: PropertyInfoForm,
  },
  { label: 'Condomínio', description: 'Informações do condomínio', component: CondominiumInfoForm },
  { label: 'Localização', description: 'Endereço completo', component: LocationInfoForm },
  { label: 'Imagens', description: 'Fotos do imóvel', component: ImagesForm },
  { label: 'Valores', description: 'Preços e condições', component: ValuesForm },
];

export default function PropertyStepper() {
  const [activeStep, setActiveStep] = useState(0);
  const [completed, setCompleted] = useState<Record<number, boolean>>({});
  const [formValid, setFormValid] = useState(false);
  const [validationMessage, setValidationMessage] = useState('');

  // Verifica se todos os passos estão completos
  const isLastStep = () => activeStep === steps.length - 1;

  // Função para validar o step atual
  const validateCurrentStep = useCallback((): boolean => {
    const storageKeys = [
      'propertyFormData',
      'condominiumFormData',
      'locationFormData',
      'propertyImages',
      'valuesFormData',
    ];

    const data = localStorage.getItem(storageKeys[activeStep]);
    const currentStepData = data ? JSON.parse(data) : null;

    switch (activeStep) {
      case 0: // PropertyInfoForm
        return !!(
          currentStepData?.size &&
          currentStepData?.condition &&
          currentStepData?.type &&
          currentStepData?.rooms &&
          currentStepData?.suites &&
          currentStepData?.bathrooms &&
          currentStepData?.parkingSpaces
        );
      case 1: // CondominiumInfoForm
        return !!(currentStepData?.buildYear && currentStepData?.condominiumFee);
      case 2: // LocationInfoForm
        return !!(
          currentStepData?.cep &&
          currentStepData?.rua &&
          currentStepData?.numero &&
          currentStepData?.bairro &&
          currentStepData?.cidade &&
          currentStepData?.estado
        );
      case 3: {
        // ImagesForm
        const images = JSON.parse(localStorage.getItem('propertyImages') || '[]');
        return images.length > 0;
      }
      case 4: // ValuesForm
        return !!(
          currentStepData?.purpose &&
          currentStepData?.condominiumValue &&
          currentStepData?.iptuValue
        );
      default:
        return false;
    }
  }, [activeStep]);

  // Função para obter mensagem de validação
  const getValidationMessage = useCallback((): string => {
    switch (activeStep) {
      case 0:
        return 'Preencha todos os campos obrigatórios sobre o imóvel';
      case 1:
        return 'Preencha as informações do condomínio';
      case 2:
        return 'Preencha o endereço completo do imóvel';
      case 3:
        return 'Adicione pelo menos uma imagem do imóvel';
      case 4:
        return 'Preencha os valores do imóvel';
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
  }, [activeStep, validateCurrentStep, getValidationMessage]);

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
    };

    // Verificar a cada 500ms se houve mudanças
    const interval = setInterval(handleStorageChange, 500);

    return () => clearInterval(interval);
  }, [activeStep, validateCurrentStep, getValidationMessage]);

  // Marca o passo atual como completo
  const handleComplete = () => {
    if (!formValid) {
      setValidationMessage(getValidationMessage());
      return;
    }

    const newCompleted = { ...completed };
    newCompleted[activeStep] = true;
    setCompleted(newCompleted);

    // Só devemos avançar se não for o último passo
    if (!isLastStep()) {
      handleNext();
    } else {
      // Enviar formulário completo
      handleSubmitForm();
    }
  };

  // Função para enviar o formulário
  const handleSubmitForm = () => {
    const allData = {
      property: JSON.parse(localStorage.getItem('propertyFormData') || '{}'),
      propertyAmenities: JSON.parse(localStorage.getItem('propertyAmenities') || '{}'),
      condominium: JSON.parse(localStorage.getItem('condominiumFormData') || '{}'),
      condominiumAmenities: JSON.parse(localStorage.getItem('condominiumAmenities') || '{}'),
      location: JSON.parse(localStorage.getItem('locationFormData') || '{}'),
      images: JSON.parse(localStorage.getItem('propertyImages') || '[]'),
      values: JSON.parse(localStorage.getItem('valuesFormData') || '{}'),
      valuesOptions: JSON.parse(localStorage.getItem('valuesAdditionalOptions') || '{}'),
    };

    console.log('Dados completos do formulário:', allData);

    // Aqui você pode enviar os dados para o backend
    // await api.post('/properties', allData);

    // Limpar localStorage após envio bem-sucedido
    // localStorage.removeItem('propertyFormData');
    // localStorage.removeItem('propertyAmenities');
    // ... etc

    alert('Formulário enviado com sucesso!');
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

  return (
    <Box sx={{ width: '100%', maxWidth: 1200, mx: 'auto', p: 3 }}>
      {/* Header com título e progresso */}
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Typography variant="h4" sx={{ mb: 2, fontWeight: 600 }}>
          Cadastro de Imóvel
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Preencha as informações do seu imóvel em {steps.length} etapas simples
        </Typography>

        {/* Barra de progresso */}
        <Box sx={{ mb: 3 }}>
          <Box
            sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}
          >
            <Typography variant="body2" color="text.secondary">
              Etapa {activeStep + 1} de {steps.length}
            </Typography>
            <Chip
              label={`${Math.round(progressPercentage)}% concluído`}
              size="small"
              color={progressPercentage === 100 ? 'success' : 'primary'}
              variant="outlined"
            />
          </Box>
          <LinearProgress
            variant="determinate"
            value={progressPercentage}
            sx={{
              height: 8,
              borderRadius: 4,
              backgroundColor: 'grey.200',
              '& .MuiLinearProgress-bar': {
                borderRadius: 4,
                background:
                  progressPercentage === 100
                    ? 'linear-gradient(90deg, #4caf50 0%, #66bb6a 100%)'
                    : 'linear-gradient(90deg, #1976d2 0%, #42a5f5 100%)',
              },
            }}
          />
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
          const hasError = index === activeStep && !formValid && validationMessage;

          return (
            <Step key={step.label} {...stepProps} completed={isStepCompleted}>
              <StepLabel
                StepIconComponent={(props) => <ModernStepIcon {...props} error={!!hasError} />}
                optional={
                  <Typography variant="caption" color="text.secondary">
                    {step.description}
                  </Typography>
                }
                error={!!hasError}
              >
                {step.label}
              </StepLabel>
            </Step>
          );
        })}
      </Stepper>

      {/* Feedback de validação */}
      {validationMessage && (
        <Alert
          severity={formValid ? 'success' : 'warning'}
          sx={{
            mb: 3,
            borderRadius: 2,
            '& .MuiAlert-icon': {
              fontSize: 20,
            },
          }}
          icon={formValid ? <Check /> : <WarningIcon />}
        >
          {formValid ? `Etapa ${activeStep + 1} concluída com sucesso!` : validationMessage}
        </Alert>
      )}

      {/* Conteúdo do formulário */}
      <Box
        sx={{
          mb: 4,
          backgroundColor: 'background.paper',
          borderRadius: 3,
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
          overflow: 'hidden',
          transition: 'all 0.3s ease-in-out',
          '&:hover': {
            boxShadow: '0 8px 30px rgba(0, 0, 0, 0.12)',
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
          borderTop: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Button
          color="inherit"
          variant="outlined"
          disabled={activeStep === 0}
          onClick={handleBack}
          sx={{
            minWidth: 120,
            borderRadius: 2,
          }}
        >
          {activeStep === 0 ? 'Cancelar' : 'Voltar'}
        </Button>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Chip
            label={`${activeStep + 1} de ${steps.length}`}
            size="small"
            variant="outlined"
            color="primary"
          />
          <Button
            variant="contained"
            onClick={handleComplete}
            disabled={!formValid}
            sx={{
              minWidth: 120,
              borderRadius: 2,
              fontWeight: 600,
              bgcolor: formValid ? (isLastStep() ? 'success.main' : 'primary.main') : 'grey.400',
              '&:hover': {
                bgcolor: formValid ? (isLastStep() ? 'success.dark' : 'primary.dark') : 'grey.500',
              },
              '&:disabled': {
                bgcolor: 'grey.300',
                color: 'grey.600',
              },
            }}
          >
            {isLastStep() ? 'Finalizar' : 'Continuar'}
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
