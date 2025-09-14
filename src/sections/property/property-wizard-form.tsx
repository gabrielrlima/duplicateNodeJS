import { z as zod } from 'zod';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { useBoolean } from 'minimal-shared/hooks';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useState, useEffect, useCallback } from 'react';

import {
  Box,
  Alert,
  Button,
  Typography,
  LinearProgress,
} from '@mui/material';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { createProperty } from 'src/actions/property';
import { useRealEstateContext } from 'src/contexts/real-estate-context';

import { Form } from 'src/components/hook-form';

import { OwnerStep } from './steps/owner-step';
import { ImagesStep } from './steps/images-step';
import { ReviewStep } from './steps/review-step';
import { LocationStep } from './steps/location-step';
// Importar os componentes de cada etapa
import { BasicInfoStep } from './steps/basic-info-step';
import { CharacteristicsStep } from './steps/characteristics-step';

// Schema completo do formulário
const PropertyWizardSchema = zod.object({
  // Informações Básicas
  titulo: zod.string().min(1, 'Título é obrigatório'),
  descricao: zod.string().optional(),
  preco: zod.coerce.number().min(0.01, 'Preço deve ser maior que zero'),
  precoNegociavel: zod.boolean().optional(),
  area: zod.coerce.number().optional(),
  finalidade: zod.enum(['venda', 'aluguel', 'venda_aluguel']).default('venda'),
  tipo: zod.enum(['apartamento', 'casa', 'sobrado', 'cobertura', 'kitnet', 'loft', 'chacara', 'fazenda', 'sitio', 'comercial', 'industrial']).default('apartamento'),
  status: zod.enum(['available', 'sold', 'reserved']).default('available'),
  condicao: zod.enum(['novo', 'seminovo', 'usado', 'reformado', 'a_reformar']).default('usado'),
  quartos: zod.coerce.number().min(0).optional(),
  banheiros: zod.coerce.number().min(0).optional(),
  vagasGaragem: zod.coerce.number().min(0).optional(),
  mobiliado: zod.boolean().optional(),
  
  // Localização
  endereco: zod.object({
    rua: zod.string().min(1, 'Rua é obrigatória'),
    numero: zod.string().min(1, 'Número é obrigatório'),
    complemento: zod.string().optional(),
    bairro: zod.string().min(1, 'Bairro é obrigatório'),
    cidade: zod.string().min(1, 'Cidade é obrigatória'),
    estado: zod.string().min(2, 'Estado é obrigatório').max(2, 'Use a sigla do estado'),
    cep: zod.string().min(8, 'CEP deve ter 8 dígitos'),
    andar: zod.string().optional(),
    nomeEdificio: zod.string().optional(),
    posicaoSolar: zod.enum(['norte', 'sul', 'leste', 'oeste', 'nordeste', 'noroeste', 'sudeste', 'sudoeste']).optional(),
  }),
  
  // Características
  suites: zod.coerce.number().min(0).optional(),
  anoConstucao: zod.string().optional(),
  condicaoImovel: zod.enum(['novo', 'seminovo', 'usado', 'reformado', 'a_reformar']).optional(),
  elevador: zod.boolean().optional(),
  sacada: zod.boolean().optional(),
  temDocumentacao: zod.boolean().default(false),
  comodidades: zod.record(zod.boolean()).optional(),
  
  // Imagens
  imagens: zod.array(zod.instanceof(File)).optional(),
  
  // Proprietário
  proprietario: zod.object({
    nome: zod.string().min(1, 'Nome do proprietário é obrigatório'),
    email: zod.string().email('Email inválido').min(1, 'Email é obrigatório'),
    telefone: zod.string().min(1, 'Telefone é obrigatório'),
    documento: zod.string().min(1, 'CPF/CNPJ é obrigatório'),
  }),
});

type PropertyWizardSchemaType = zod.infer<typeof PropertyWizardSchema>;

// Definição das etapas
const steps = [
  {
    label: 'Informações Básicas',
    description: 'Título, preço e detalhes gerais',
    component: BasicInfoStep,
    fields: ['titulo', 'descricao', 'preco', 'precoNegociavel', 'area', 'finalidade', 'tipo', 'status', 'condicao', 'quartos', 'banheiros', 'vagasGaragem', 'mobiliado'],
  },
  {
    label: 'Localização',
    description: 'Endereço completo do imóvel',
    component: LocationStep,
    fields: ['endereco.rua', 'endereco.numero', 'endereco.complemento', 'endereco.bairro', 'endereco.cidade', 'endereco.estado', 'endereco.cep', 'endereco.andar', 'endereco.nomeEdificio', 'endereco.posicaoSolar'],
  },
  {
    label: 'Características',
    description: 'Comodidades e características específicas',
    component: CharacteristicsStep,
    fields: ['suites', 'anoConstucao', 'condicaoImovel', 'elevador', 'sacada', 'temDocumentacao', 'comodidades'],
  },
  {
    label: 'Imagens',
    description: 'Fotos do imóvel',
    component: ImagesStep,
    fields: ['imagens'],
  },
  {
    label: 'Proprietário',
    description: 'Dados do proprietário',
    component: OwnerStep,
    fields: ['proprietario.nome', 'proprietario.email', 'proprietario.telefone', 'proprietario.documento'],
  },
  {
    label: 'Revisão',
    description: 'Confirme os dados antes de salvar',
    component: ReviewStep,
    fields: [],
  },
];

export function PropertyWizardForm() {
  console.log('🚀🚀🚀 PropertyWizardForm component loaded - WIZARD FORM ATIVO 🚀🚀🚀');
  
  const router = useRouter();
  const loadingSave = useBoolean();
  const { currentRealEstate } = useRealEstateContext();
  
  const [activeStep, setActiveStep] = useState(0);
  const [completed, setCompleted] = useState<Record<number, boolean>>({});
  const [formValid, setFormValid] = useState(false);
  const [validationMessage, setValidationMessage] = useState('');

  const methods = useForm<PropertyWizardSchemaType>({
    resolver: zodResolver(PropertyWizardSchema),
    mode: 'onChange',
    defaultValues: {
      titulo: '',
      descricao: '',
      preco: undefined,
      precoNegociavel: false,
      area: undefined,
      finalidade: 'venda' as const,
      tipo: 'apartamento' as const,
      status: 'available' as const,
      condicao: 'usado' as const,
      quartos: undefined,
      banheiros: undefined,
      vagasGaragem: undefined,
      mobiliado: false,
      endereco: {
        rua: '',
        numero: '',
        complemento: '',
        bairro: '',
        cidade: '',
        estado: '',
        cep: '',
        andar: '',
        nomeEdificio: '',
        posicaoSolar: undefined,
      },
      suites: undefined,
      anoConstucao: '',
      condicaoImovel: undefined,
      elevador: false,
      sacada: false,
      temDocumentacao: false,
      comodidades: {},
      imagens: [],
      proprietario: {
        nome: '',
        email: '',
        telefone: '',
        documento: '',
      },
    },
  });

  const { handleSubmit, reset, trigger, watch, formState: { errors } } = methods;

  // Watch dos campos principais para debug
  const watchedValues = watch(['titulo', 'preco', 'endereco.rua', 'endereco.numero', 'endereco.bairro', 'endereco.cidade', 'endereco.estado', 'endereco.cep']);
  console.log('👀 Valores observados:', { 
    titulo: watchedValues[0], 
    preco: watchedValues[1],
    endereco: {
      rua: watchedValues[2],
      numero: watchedValues[3],
      bairro: watchedValues[4],
      cidade: watchedValues[5],
      estado: watchedValues[6],
      cep: watchedValues[7]
    }
  });

  // Verifica se é a última etapa
  const isLastStep = () => activeStep === steps.length - 1;

  // Função para validar a etapa atual
  const validateCurrentStep = useCallback(async (): Promise<boolean> => {
    console.log('🔍 validateCurrentStep - activeStep:', activeStep);
    const currentStepFields = steps[activeStep].fields;
    console.log('🔍 currentStepFields:', currentStepFields);
    
    if (currentStepFields.length === 0) {
      // Etapa de revisão não precisa de validação
      console.log('✅ Etapa de revisão - sem validação necessária');
      return true;
    }

    // Para a primeira etapa, validar apenas campos obrigatórios básicos
    if (activeStep === 0) {
      console.log('🔍 Etapa 1 - validando campos obrigatórios');
      
      // Usar trigger para validar apenas os campos obrigatórios da primeira etapa
      const requiredFields = ['titulo', 'preco'];
      
      try {
        // Verificar valores atuais dos campos
        const currentValues = methods.getValues();
        console.log('🔍 Valores atuais:', { 
          titulo: currentValues.titulo, 
          preco: currentValues.preco,
          area: currentValues.area,
          finalidade: currentValues.finalidade,
          tipo: currentValues.tipo,
          status: currentValues.status
        });
        
        // Validar usando trigger do react-hook-form
        const validationResults = await Promise.all(
          requiredFields.map(async (field) => {
            const isValid = await trigger(field as keyof PropertyWizardSchemaType);
            console.log(`🔍 Campo ${field} válido:`, isValid);
            return isValid;
          })
        );
        
        const isValid = validationResults.every(result => result === true);
        console.log('🔍 Resultado final etapa 1:', isValid);
        console.log('🔍 Erros atuais:', errors);
        
        return isValid;
      } catch (error) {
        console.error('🔍 Erro na validação da etapa 1:', error);
        return false;
      }
    }

    // Para a etapa de localização (etapa 1), validar campos obrigatórios
    if (activeStep === 1) {
      const currentValues = methods.getValues();
      const endereco = currentValues.endereco;
      
      console.log('🔍 DEBUG - Valores do endereço:', endereco);
      
      const hasValidRua = endereco?.rua && endereco.rua.trim().length > 0;
      const hasValidNumero = endereco?.numero && endereco.numero.trim().length > 0;
      const hasValidBairro = endereco?.bairro && endereco.bairro.trim().length > 0;
      const hasValidCidade = endereco?.cidade && endereco.cidade.trim().length > 0;
      const hasValidEstado = endereco?.estado && endereco.estado.trim().length > 0;
      const hasValidCep = endereco?.cep && endereco.cep.trim().length >= 8;
      
      console.log('🔍 DEBUG - Validações individuais:', {
        rua: { value: endereco?.rua, valid: hasValidRua },
        numero: { value: endereco?.numero, valid: hasValidNumero },
        bairro: { value: endereco?.bairro, valid: hasValidBairro },
        cidade: { value: endereco?.cidade, valid: hasValidCidade },
        estado: { value: endereco?.estado, valid: hasValidEstado },
        cep: { value: endereco?.cep, valid: hasValidCep }
      });
      
      const isValid = hasValidRua && hasValidNumero && hasValidBairro && hasValidCidade && hasValidEstado && hasValidCep;
      console.log('🔍 Resultado etapa 2 (localização):', isValid);
      return isValid;
    }

    // Para a etapa do proprietário (etapa 4), validar todos os campos obrigatórios
    if (activeStep === 4) {
      const currentValues = methods.getValues();
      const proprietario = currentValues.proprietario;
      
      const hasValidNome = proprietario?.nome && proprietario.nome.trim().length > 0;
      const hasValidEmail = proprietario?.email && proprietario.email.trim().length > 0 && proprietario.email.includes('@');
      const hasValidTelefone = proprietario?.telefone && proprietario.telefone.trim().length > 0;
      const hasValidDocumento = proprietario?.documento && proprietario.documento.trim().length > 0;
      
      const isValid = hasValidNome && hasValidEmail && hasValidTelefone && hasValidDocumento;
      console.log('🔍 Resultado etapa 5 (proprietário):', isValid);
      return isValid;
    }

    // Para outras etapas, sempre permitir continuar (campos opcionais)
    console.log('🔍 Etapa opcional:', activeStep);
    return true;
  }, [activeStep, methods]);

  // Função para obter mensagem de validação
  const getValidationMessage = (): string => {
    const currentStepFields = steps[activeStep].fields;
    const stepErrors = currentStepFields.filter(field => {
      const fieldPath = field.split('.');
      let error = errors;
      for (const path of fieldPath) {
        error = error?.[path as keyof typeof error] as any;
      }
      return error;
    });

    if (stepErrors.length > 0) {
      return `Por favor, preencha todos os campos obrigatórios desta etapa.`;
    }
    return 'Todos os campos desta etapa estão válidos!';
  };

  // Efeito para validar a etapa atual
  useEffect(() => {
    console.log('🔄 useEffect de validação executado - activeStep:', activeStep);
    console.log('🔄 Dependências do useEffect:', { 
      activeStep, 
      errorsCount: Object.keys(errors).length, 
      formValid,
      watchedValues: { 
        titulo: watchedValues[0], 
        preco: watchedValues[1],
        endereco: {
          rua: watchedValues[2],
          numero: watchedValues[3],
          bairro: watchedValues[4],
          cidade: watchedValues[5],
          estado: watchedValues[6],
          cep: watchedValues[7]
        }
      }
    });
    
    const validate = async () => {
      console.log('🔄 Iniciando validação...');
      console.log('🔄 Estado atual antes da validação:', { formValid });
      
      const isValid = await validateCurrentStep();
      console.log('🔄 Resultado da validação:', isValid);
      console.log('🔄 Estado anterior formValid:', formValid);
      
      if (formValid !== isValid) {
        console.log('🔄 Estado formValid vai mudar de', formValid, 'para', isValid);
        setFormValid(isValid);
      } else {
        console.log('🔄 Estado formValid permanece o mesmo:', isValid);
      }
      
      setValidationMessage(getValidationMessage());
      console.log('🔄 Validação concluída');
    };
    
    // Pequeno delay para permitir que os campos sejam renderizados
    const timer = setTimeout(validate, 100);
    return () => clearTimeout(timer);
  }, [activeStep, validateCurrentStep, errors, formValid, watchedValues]);

  // Avança para a próxima etapa
  const handleNext = async () => {
    const isValid = await validateCurrentStep();
    
    if (!isValid) {
      setValidationMessage(getValidationMessage());
      return;
    }

    // Marca a etapa atual como completa
    const newCompleted = { ...completed };
    newCompleted[activeStep] = true;
    setCompleted(newCompleted);

    if (!isLastStep()) {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
      setValidationMessage('');
    }
  };

  // Retorna para a etapa anterior
  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
    setValidationMessage('');
  };

  // Submete o formulário
  const onSubmit = handleSubmit(async (data) => {
    console.log('🎯 Submetendo formulário wizard:', data);
    
    loadingSave.onTrue();

    try {
      if (!currentRealEstate?.id) {
        console.log('⚠️ Nenhuma imobiliária selecionada. Usando ID padrão para teste.');
      }

      // Dados completos para a API
      const propertyData = {
        name: data.titulo,
        title: data.titulo,
        description: data.descricao || 'Imóvel criado via formulário wizard',
        totalArea: data.area,
        value: data.preco,
        status: data.status,
        type: data.tipo,
        purpose: data.finalidade,
        condition: data.condicao,
        acceptsFinancing: data.precoNegociavel || false,
        bedrooms: data.quartos,
        bathrooms: data.banheiros,
        parkingSpaces: data.vagasGaragem,
        furnished: data.mobiliado,
        suites: data.suites,
        yearBuilt: data.anoConstucao,
        elevator: data.elevador,
        balcony: data.sacada,
        hasDocumentation: data.temDocumentacao,
        amenities: data.comodidades,
        address: {
          street: data.endereco.rua,
          number: data.endereco.numero,
          complement: data.endereco.complemento,
          neighborhood: data.endereco.bairro,
          city: data.endereco.cidade,
          state: data.endereco.estado,
          zipCode: data.endereco.cep,
          floor: data.endereco.andar,
          buildingName: data.endereco.nomeEdificio,
          sunPosition: data.endereco.posicaoSolar
        },
        owner: {
          name: data.proprietario.nome,
          email: data.proprietario.email,
          phone: data.proprietario.telefone,
          document: data.proprietario.documento
        },
        imagens: data.imagens || [],
        realEstateId: currentRealEstate?.id || 'test-real-estate-id'
      };

      console.log('Dados para API:', propertyData);

      await createProperty(propertyData);
      toast.success('Imóvel criado com sucesso!');
      reset();
      router.push(paths.dashboard.property.root);
    } catch (error) {
      console.error('Erro ao criar imóvel:', error);
      toast.error('Erro ao criar imóvel. Verifique os dados e tente novamente.');
    } finally {
      loadingSave.onFalse();
    }
  });

  // Renderiza o conteúdo da etapa atual
  const renderStepContent = () => {
    const StepComponent = steps[activeStep].component;
    return <StepComponent />;
  };

  const progressPercentage = ((activeStep + 1) / steps.length) * 100;

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Box sx={{ width: '100%', maxWidth: 1200, mx: 'auto', p: 3 }}>
        {/* Barra de progresso */}
        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <Box sx={{ mb: 3 }}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                mb: 1,
              }}
            >
              <Typography variant="body2" color="text.secondary">
                Etapa {activeStep + 1} de {steps.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {Math.round(progressPercentage)}% concluído
              </Typography>
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
                  background: completed[activeStep]
                    ? 'linear-gradient(90deg, #4caf50 0%, #66bb6a 100%)'
                    : 'linear-gradient(90deg, #1976d2 0%, #42a5f5 100%)',
                },
              }}
            />
          </Box>
        </Box>

        {/* Alerta de validação */}
        {validationMessage && (
          <Alert
            severity={formValid ? 'success' : 'warning'}
            sx={{ mb: 3, borderRadius: 2 }}
          >
            {validationMessage}
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
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Button
            disabled={activeStep === 0}
            onClick={handleBack}
            variant="outlined"
            size="large"
            sx={{ minWidth: 120 }}
          >
            Voltar
          </Button>

          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="outlined"
              size="large"
              onClick={() => router.push(paths.dashboard.property.root)}
              disabled={loadingSave.value}
            >
              Cancelar
            </Button>
            
            {isLastStep() ? (
              <Button
                type="submit"
                variant="contained"
                size="large"
                loading={loadingSave.value}
                disabled={!formValid}
                sx={{
                  minWidth: 140,
                  bgcolor: 'success.main',
                  '&:hover': {
                    bgcolor: 'success.dark',
                  },
                }}
              >
                Finalizar
              </Button>
            ) : (
              <Button
                onClick={handleNext}
                variant="contained"
                size="large"
                disabled={!formValid}
                sx={{
                  minWidth: 140,
                  bgcolor: formValid ? 'black' : 'grey.400',
                  color: formValid ? 'white' : 'text.disabled',
                  '&:hover': {
                    bgcolor: formValid ? '#333' : 'grey.500',
                    color: formValid ? 'white' : 'inherit',
                  },
                  '&:disabled': {
                    bgcolor: 'grey.300',
                    color: 'text.disabled',
                  },
                }}
              >
                Continuar
              </Button>
            )}
          </Box>
        </Box>
      </Box>
    </Form>
  );
}