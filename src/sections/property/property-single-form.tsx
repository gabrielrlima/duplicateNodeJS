import type { IPropertyItem } from 'src/types/property';

import { mutate } from 'swr';
import { useForm, useFieldArray } from 'react-hook-form';
import { useBoolean } from 'minimal-shared/hooks';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRef, useMemo, useState, useEffect, useCallback } from 'react';

import { useTheme } from '@mui/material/styles';
import LoadingButton from '@mui/lab/LoadingButton';
import {
  Box,
  Card,
  Chip,
  Stack,
  Alert,
  Button,
  Dialog,
  Divider,
  MenuItem,
  Accordion,
  AlertTitle,
  CardHeader,
  Typography,
  DialogTitle,
  DialogContent,
  DialogActions,
  useMediaQuery,
  InputAdornment,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { endpoints } from 'src/lib/axios';
import { z as zod } from 'src/lib/zod-config';
import { createProperty, updateProperty } from 'src/actions/property';
import { useRealEstateContext } from 'src/contexts/real-estate-context';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { Form, Field } from 'src/components/hook-form';

// Removido import do PlantaBook - usando sistema inline simples

// Schema definitions
const BaseProductSchema = zod.object({
  tipo: zod.enum(['imovel', 'terreno', 'empreendimento'], {
    required_error: 'Selecione o tipo de produto',
    invalid_type_error: 'Tipo de produto inválido',
  }).default('imovel'),
  titulo: zod
    .string()
    .min(3, { message: 'Título deve ter pelo menos 3 caracteres' })
    .max(100, { message: 'Título não pode exceder 100 caracteres' })
    .regex(/^[a-zA-ZÀ-ÿ0-9\s\-.,:]+$/, { message: 'Título contém caracteres inválidos' }),
  // Campos de endereço separados
  rua: zod
    .string()
    .min(3, { message: 'Rua deve ter pelo menos 3 caracteres' })
    .max(100, { message: 'Rua muito longa' }),
  numero: zod
    .string()
    .min(1, { message: 'Número é obrigatório' })
    .max(10, { message: 'Número muito longo' }),
  complemento: zod
    .string()
    .max(50, { message: 'Complemento muito longo' })
    .optional(),
  bairro: zod
    .string()
    .min(2, { message: 'Bairro deve ter pelo menos 2 caracteres' })
    .max(50, { message: 'Bairro muito longo' }),
  cidade: zod
    .string()
    .min(2, { message: 'Cidade deve ter pelo menos 2 caracteres' })
    .max(50, { message: 'Cidade muito longa' }),
  estado: zod
    .string()
    .length(2, { message: 'Estado deve ter 2 caracteres (sigla)' }),
  cep: zod
    .string()
    .regex(/^\d{5}-?\d{3}$/, { message: 'CEP deve ter formato 00000-000' }),
  descricao: zod
    .string()
    .min(10, { message: 'Descrição deve ter pelo menos 10 caracteres' })
    .max(1000, { message: 'Descrição não pode exceder 1000 caracteres' }),
});

const ImovelSchema = BaseProductSchema.extend({
  preco: zod
    .coerce.number({ required_error: 'Preço é obrigatório' })
    .positive({ message: 'Preço deve ser maior que 0' })
    .max(999999999, { message: 'Preço muito alto' }),
  quartos: zod.coerce.number().min(1, { message: 'Número de quartos é obrigatório!' }),
  banheiros: zod.coerce.number().min(1, { message: 'Número de banheiros é obrigatório!' }),
  garagem: zod.coerce.number().min(0, { message: 'Número de vagas na garagem!' }),
  areaConstruida: zod.coerce.number().positive({ message: 'Área construída é obrigatória!' }),
});

const TerrenoSchema = BaseProductSchema.extend({
  preco: zod
    .coerce.number({ required_error: 'Preço é obrigatório' })
    .positive({ message: 'Preço deve ser maior que 0' })
    .max(999999999, { message: 'Preço muito alto' }),
  area: zod.coerce.number().positive({ message: 'Área do terreno é obrigatória!' }),
  frente: zod.coerce.number().positive({ message: 'Frente do terreno é obrigatória!' }),
  tipoSolo: zod.enum(['plano', 'inclinado', 'irregular']).default('plano'),
  zoneamento: zod.string().min(1, { message: 'Zoneamento é obrigatório!' }),
});

const PlantaSchema = zod.object({
  id: zod.string().optional(),
  area: zod.coerce.number().positive({ message: 'Área da planta é obrigatória!' }),
  precoPorM2: zod.coerce.number().positive({ message: 'Preço por m² é obrigatório!' }),
  descricao: zod.string().optional(),
});

const EmpreendimentoSchema = BaseProductSchema.extend({
  construtora: zod.string().optional(),
  previsaoEntrega: zod.string().optional(),
  unidadesDisponiveis: zod.coerce.number().min(0, { message: 'Unidades disponíveis não pode ser negativo!' }).optional(),
  plantas: zod.array(PlantaSchema).optional(),
});

// Define variantes com discriminador 'tipo' para validação dinâmica estável
const ImovelVariant = ImovelSchema.extend({ tipo: zod.literal('imovel') });
const TerrenoVariant = TerrenoSchema.extend({ tipo: zod.literal('terreno') });
const EmpreendimentoVariant = EmpreendimentoSchema.extend({ tipo: zod.literal('empreendimento') });
const ProductSchema = zod.discriminatedUnion('tipo', [ImovelVariant, TerrenoVariant, EmpreendimentoVariant]);

export type PlantaType = {
  id?: string;
  area: number;
  precoPorM2: number;
  descricao?: string;
};

export type ProductSingleFormType = zod.infer<typeof BaseProductSchema> & {
  // Campos específicos de imóvel e terreno
  preco?: number;
  // Campos específicos de imóvel
  quartos?: number;
  banheiros?: number;
  garagem?: number;
  areaConstruida?: number;
  // Campos específicos de terreno
  area?: number;
  frente?: number;
  tipoSolo?: string;
  zoneamento?: string;
  // Empreendimento
  construtora?: string;
  previsaoEntrega?: string;
  unidadesDisponiveis?: number;
  precoPorM2?: number;
  plantas?: PlantaType[];
};

type Props = {
  currentProperty?: IPropertyItem;
};

export function PropertySingleForm({ currentProperty }: Props) {
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { currentRealEstate } = useRealEstateContext();
  
  const [watchedType, setWatchedType] = useState(currentProperty?.tipo || 'imovel');
  const [expandedSections, setExpandedSections] = useState({
    basic: true,
    specific: true,
    actions: true
  });
  
  const exitDialog = useBoolean();
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const autoSaveTimeoutRef = useRef<NodeJS.Timeout>();
  
// Validação dinâmica por discriminador (não precisa recriar resolver ao alternar tipo)
  const currentSchema = ProductSchema;
  
  const methods = useForm<ProductSingleFormType>({
    resolver: zodResolver(currentSchema),
    defaultValues: {
       tipo: 'imovel' as const,
       titulo: '',
       preco: 0,
       rua: '',
       numero: '',
       complemento: '',
       bairro: '',
       cidade: '',
       estado: '',
       cep: '',
       descricao: '',
       // Campos específicos de imóvel
       quartos: 1,
       banheiros: 1,
       garagem: 0,
       areaConstruida: 0,
       // Campos específicos de terreno
       area: 0,
       frente: 0,
       tipoSolo: 'plano',
       zoneamento: '',
       // Valores padrão para empreendimento
       precoPorM2: 0,
       construtora: '',
       previsaoEntrega: new Date().toISOString(),
       unidadesDisponiveis: 1,
       plantas: [],
       ...(currentProperty ? {
          tipo: (currentProperty.tipo || (currentProperty as any).type) as 'imovel' | 'terreno' | 'empreendimento' || 'imovel',
          titulo: currentProperty.titulo || currentProperty.title || currentProperty.name || '',
          preco: currentProperty.preco || currentProperty.value || currentProperty.salePrice || 0,
          rua: currentProperty.street || (typeof currentProperty.localizacao === 'object' ? currentProperty.localizacao.endereco : '') || '',
          numero: currentProperty.streetNumber || currentProperty.number || (typeof currentProperty.localizacao === 'object' ? currentProperty.localizacao.numero : '') || '',
          complemento: currentProperty.complement || (typeof currentProperty.localizacao === 'object' ? currentProperty.localizacao.complemento : '') || '',
          bairro: currentProperty.neighborhood || (typeof currentProperty.localizacao === 'object' ? currentProperty.localizacao.bairro : '') || '',
          cidade: currentProperty.city || (typeof currentProperty.localizacao === 'object' ? currentProperty.localizacao.cidade : '') || '',
          estado: currentProperty.state || (typeof currentProperty.localizacao === 'object' ? currentProperty.localizacao.estado : '') || '',
          cep: currentProperty.zipCode || currentProperty.cep || (typeof currentProperty.localizacao === 'object' ? currentProperty.localizacao.cep : '') || '',
          descricao: currentProperty.descricao || currentProperty.description || '',
          // Mapear campos específicos de imóvel
          quartos: currentProperty.caracteristicas?.quartos || currentProperty.bedrooms || 1,
          banheiros: currentProperty.caracteristicas?.banheiros || currentProperty.bathrooms || 1,
          garagem: currentProperty.caracteristicas?.vagasGaragem || currentProperty.parkingSpaces || 0,
          areaConstruida: currentProperty.area || currentProperty.builtArea || 0,
          // Mapear campos específicos de terreno
          area: currentProperty.area || currentProperty.totalArea || 0,
          frente: 0,
          tipoSolo: 'plano',
          zoneamento: '',
          // Mapear campos de empreendimento - CORREÇÃO COMPLETA
        construtora: typeof (currentProperty as any).construtora === 'string' 
          ? (currentProperty as any).construtora 
          : (typeof (currentProperty as any).construtora === 'object' && (currentProperty as any).construtora?.name)
            ? (currentProperty as any).construtora.name
            : (typeof (currentProperty as any).constructor === 'string' ? (currentProperty as any).constructor : ''),
          previsaoEntrega: (currentProperty as any).previsaoEntrega || (currentProperty as any).deliveryDate || (currentProperty as any).expectedCompletion || new Date().toISOString(),
        unidadesDisponiveis: (currentProperty as any).unidadesDisponiveis || (currentProperty as any).availableUnits || (currentProperty as any).totalUnits || 1,
        plantas: (currentProperty as any).plantas || (currentProperty as any).floorPlans || [],
        precoPorM2: (currentProperty as any).precoM2 || (currentProperty as any).pricePerSquareMeter || (currentProperty as any).pricePerSqm || 0
        } : {})
     },
  });
  
  const { handleSubmit, watch, setValue, getValues, reset, control, formState: { errors, isDirty } } = methods;
  const plantas = watch('plantas') || [];
  
  // 🌱 Sistema simples de plantas com useFieldArray
  const { fields: plantasFields, append: addPlanta, remove: removePlanta } = useFieldArray({
    control,
    name: 'plantas'
  });
  
  // Função para adicionar nova planta
  const handleAddPlanta = useCallback(() => {
    if (plantasFields.length < 10) { // Máximo 10 plantas
      addPlanta({ area: 0, precoPorM2: 0, descricao: '' });
    }
  }, [addPlanta, plantasFields.length]);
  
  // Função para remover planta
  const handleRemovePlanta = useCallback((index: number) => {
    if (plantasFields.length > 1) { // Mínimo 1 planta
      removePlanta(index);
    }
  }, [removePlanta, plantasFields.length]);
  
  // Reset form when currentProperty changes (for edit mode) - ONLY on initial load
  const [hasInitialized, setHasInitialized] = useState(false);
  const [initializedPropertyId, setInitializedPropertyId] = useState<string | null>(null);
  
  // ✅ Sistema simplificado - removido bloqueio desnecessário
  
  useEffect(() => {
    console.log('🔄 RESET USEEFFECT - Executando com:', {
      hasCurrentProperty: !!currentProperty,
      hasInitialized,
      currentPropertyId: currentProperty?.id,
      timestamp: new Date().toISOString()
    });
    
    // Só executa o reset na primeira vez que currentProperty é carregado
    // Evita resetar o formulário durante a digitação do usuário
    // Verifica também se é uma propriedade diferente da já inicializada
    const shouldReset = currentProperty && 
      (!hasInitialized || initializedPropertyId !== currentProperty.id);
    
    if (shouldReset) {
      console.log('🚨 RESET DETECTADO - Iniciando reset do formulário!');
      console.log('🔍 Dados recebidos do backend (INICIAL):', currentProperty);
      console.log('🔍 Campos disponíveis:', Object.keys(currentProperty));
      console.log('🔍 Tipo original (tipo):', currentProperty.tipo);
      console.log('🔍 Tipo original (type):', (currentProperty as any).type);
      console.log('🔍 Tipo final mapeado:', currentProperty.tipo || (currentProperty as any).type || 'imovel');
      console.log('🔍 Address completo:', currentProperty.address);
      console.log('🔍 Street individual:', currentProperty.street);
      console.log('🔍 City individual:', currentProperty.city);
      console.log('🔍 State individual:', currentProperty.state);
      console.log('🏢 DADOS ESPECÍFICOS DE EMPREENDIMENTO:');
      console.log('   - construtora:', (currentProperty as any).construtora, typeof (currentProperty as any).construtora);
      console.log('   - previsaoEntrega:', (currentProperty as any).previsaoEntrega, typeof (currentProperty as any).previsaoEntrega);
      console.log('   - unidadesDisponiveis:', (currentProperty as any).unidadesDisponiveis, typeof (currentProperty as any).unidadesDisponiveis);
      console.log('   - plantas:', (currentProperty as any).plantas, Array.isArray((currentProperty as any).plantas));
      console.log('   - type:', (currentProperty as any).type);
      
      const resetValues = {
        tipo: (currentProperty.tipo || (currentProperty as any).type) as 'imovel' | 'terreno' | 'empreendimento' || 'imovel',
        titulo: currentProperty.titulo || currentProperty.title || currentProperty.name || '',
        preco: currentProperty.preco || currentProperty.value || currentProperty.salePrice || 0,
        rua: currentProperty.street || (typeof currentProperty.localizacao === 'object' ? currentProperty.localizacao.endereco : '') || '',
        numero: currentProperty.streetNumber || currentProperty.number || (typeof currentProperty.localizacao === 'object' ? currentProperty.localizacao.numero : '') || '',
        complemento: currentProperty.complement || (typeof currentProperty.localizacao === 'object' ? currentProperty.localizacao.complemento : '') || '',
        bairro: currentProperty.neighborhood || (typeof currentProperty.localizacao === 'object' ? currentProperty.localizacao.bairro : '') || '',
        cidade: currentProperty.city || (typeof currentProperty.localizacao === 'object' ? currentProperty.localizacao.cidade : '') || '',
        estado: currentProperty.state || (typeof currentProperty.localizacao === 'object' ? currentProperty.localizacao.estado : '') || '',
        cep: currentProperty.zipCode || currentProperty.cep || (typeof currentProperty.localizacao === 'object' ? currentProperty.localizacao.cep : '') || '',
        descricao: currentProperty.descricao || currentProperty.description || '',
        // Mapear campos específicos de imóvel
        quartos: currentProperty.caracteristicas?.quartos || currentProperty.bedrooms || 1,
        banheiros: currentProperty.caracteristicas?.banheiros || currentProperty.bathrooms || 1,
        garagem: currentProperty.caracteristicas?.vagasGaragem || currentProperty.parkingSpaces || 0,
        areaConstruida: currentProperty.area || currentProperty.builtArea || 0,
        // Mapear campos específicos de terreno
        area: currentProperty.area || currentProperty.totalArea || 0,
        frente: 0,
        tipoSolo: 'plano',
        zoneamento: '',
        // Mapear campos de empreendimento - CORREÇÃO COMPLETA
        construtora: typeof (currentProperty as any).construtora === 'string' 
          ? (currentProperty as any).construtora 
          : (typeof (currentProperty as any).construtora === 'object' && (currentProperty as any).construtora?.name)
            ? (currentProperty as any).construtora.name
            : (typeof (currentProperty as any).constructor === 'string' ? (currentProperty as any).constructor : ''),
        previsaoEntrega: (currentProperty as any).previsaoEntrega || (currentProperty as any).deliveryDate || (currentProperty as any).expectedCompletion || new Date().toISOString(),
        unidadesDisponiveis: (currentProperty as any).unidadesDisponiveis || (currentProperty as any).availableUnits || (currentProperty as any).totalUnits || 1,
        plantas: (currentProperty as any).plantas || (currentProperty as any).floorPlans || [],
        precoPorM2: (currentProperty as any).precoM2 || (currentProperty as any).pricePerSquareMeter || (currentProperty as any).pricePerSqm || 0
      };
      
      console.log('🔄 Valores mapeados para reset (INICIAL):', resetValues);
      console.log('🏢 VALORES ESPECÍFICOS DE EMPREENDIMENTO MAPEADOS:');
      console.log('   - construtora:', resetValues.construtora, typeof resetValues.construtora);
      console.log('   - previsaoEntrega:', resetValues.previsaoEntrega, typeof resetValues.previsaoEntrega);
      console.log('   - unidadesDisponiveis:', resetValues.unidadesDisponiveis, typeof resetValues.unidadesDisponiveis);
      console.log('   - plantas:', resetValues.plantas, Array.isArray(resetValues.plantas));
      
      console.log('🔄 RESET - Executando reset com valores:', resetValues);
      reset(resetValues);
      console.log('🔄 RESET - Reset executado, definindo watchedType:', resetValues.tipo);
      setWatchedType(resetValues.tipo);
      console.log('🔄 RESET - Marcando como inicializado para propriedade:', currentProperty.id);
      setHasInitialized(true); // Marca como inicializado
      setInitializedPropertyId(currentProperty.id); // Marca qual propriedade foi inicializada
      console.log('✅ Formulário resetado com sucesso (INICIAL)');
      
      // Verificar se os valores foram definidos corretamente no formulário
      setTimeout(() => {
        const currentValues = methods.getValues();
        console.log('🔍 VERIFICAÇÃO PÓS-RESET:');
        console.log('   - construtora no form:', currentValues.construtora, typeof currentValues.construtora);
        console.log('   - previsaoEntrega no form:', currentValues.previsaoEntrega, typeof currentValues.previsaoEntrega);
        console.log('   - unidadesDisponiveis no form:', currentValues.unidadesDisponiveis, typeof currentValues.unidadesDisponiveis);
        console.log('   - plantas no form:', currentValues.plantas?.length || 0, currentValues.plantas);
      }, 100);
    } else {
      console.log('🔄 RESET USEEFFECT - Condições não atendidas para reset:', {
        hasCurrentProperty: !!currentProperty,
        hasInitialized,
        initializedPropertyId,
        currentPropertyId: currentProperty?.id,
        shouldReset
      });
    }
  }, [currentProperty, reset, hasInitialized, initializedPropertyId, methods]);
  
  const handleTypeChange = useCallback((newType: string) => {
    const typedNewType = newType as 'imovel' | 'terreno' | 'empreendimento';
    setWatchedType(typedNewType);
    setValue('tipo', typedNewType);
    
    // Limpar campos específicos do tipo anterior e definir padrões para o novo tipo
    if (typedNewType === 'imovel') {
      // Limpar campos de terreno e empreendimento
      setValue('area', undefined);
      setValue('frente', undefined);
      setValue('tipoSolo', undefined);
      setValue('zoneamento', undefined);
      setValue('construtora', undefined);
      setValue('previsaoEntrega', undefined);
      setValue('unidadesDisponiveis', undefined);
      setValue('plantas', undefined);
      // Definir padrões para imóvel
      setValue('preco', 0);
      setValue('quartos', 1);
      setValue('banheiros', 1);
      setValue('garagem', 0);
      setValue('areaConstruida', 0);
    } else if (typedNewType === 'terreno') {
      // Limpar campos de imóvel e empreendimento
      setValue('quartos', undefined);
      setValue('banheiros', undefined);
      setValue('garagem', undefined);
      setValue('areaConstruida', undefined);
      setValue('construtora', undefined);
      setValue('previsaoEntrega', undefined);
      setValue('unidadesDisponiveis', undefined);
      setValue('plantas', undefined);
      // Definir padrões para terreno
      setValue('preco', 0);
      setValue('area', 0);
      setValue('frente', 0);
      setValue('tipoSolo', 'plano');
      setValue('zoneamento', '');
    } else if (typedNewType === 'empreendimento') {
      // Limpar campos de imóvel e terreno
      setValue('preco', undefined);
      setValue('quartos', undefined);
      setValue('banheiros', undefined);
      setValue('garagem', undefined);
      setValue('areaConstruida', undefined);
      setValue('area', undefined);
      setValue('frente', undefined);
      setValue('tipoSolo', undefined);
      setValue('zoneamento', undefined);
      // Definir padrões para empreendimento
      setValue('construtora', '');
      setValue('previsaoEntrega', new Date().toISOString());
      setValue('unidadesDisponiveis', 1);
      setValue('plantas', []);
    }
    
    setHasUnsavedChanges(true);
  }, [setValue]);
  
  const handleSectionToggle = useCallback((section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section as keyof typeof prev]
    }));
  }, []);
  
  // Função para sanitizar e validar dados antes do envio
  const sanitizeAndValidateData = useCallback((data: any, context: 'auto-save' | 'submit') => {
    console.log(`🧹 [${context.toUpperCase()}] SANITIZAÇÃO - Dados originais:`, JSON.stringify(data, null, 2));
    
    // ANÁLISE DETALHADA DOS DADOS DE ENTRADA
    console.log(`🔍 [${context.toUpperCase()}] ANÁLISE DETALHADA:`);
    Object.entries(data).forEach(([key, value]) => {
      const type = typeof value;
      const isArray = Array.isArray(value);
      const isNull = value === null;
      const isUndefined = value === undefined;
      const isNaN = type === 'number' && Number.isNaN(value);
      const isEmpty = type === 'string' && value === '';
      
      console.log(`   - ${key}: ${value} (${type}) ${isArray ? '[ARRAY]' : ''} ${isNull ? '[NULL]' : ''} ${isUndefined ? '[UNDEFINED]' : ''} ${isNaN ? '[NaN]' : ''} ${isEmpty ? '[EMPTY]' : ''}`);
    });
    
    // Verificar campos obrigatórios
    const requiredFields = ['titulo', 'tipo'];
    const missingFields = requiredFields.filter(field => !data[field] || (typeof data[field] === 'string' && data[field].trim() === ''));
    
    if (missingFields.length > 0) {
      console.error(`❌ [${context.toUpperCase()}] Campos obrigatórios ausentes:`, missingFields);
      throw new Error(`Campos obrigatórios ausentes: ${missingFields.join(', ')}`);
    }
    
    // SANITIZAÇÃO PREVENTIVA - Limpar campos problemáticos
    const sanitizedData = { ...data };
    
    // Sanitizar strings
    Object.keys(sanitizedData).forEach(key => {
      if (typeof sanitizedData[key] === 'string') {
        sanitizedData[key] = sanitizedData[key].trim();
      }
    });
    
    // Sanitizar números - converter strings numéricas e limpar NaN
    const numericFields = ['preco', 'area', 'areaConstruida', 'quartos', 'banheiros', 'garagem', 'frente', 'unidadesDisponiveis'];
    numericFields.forEach(field => {
      if (field in sanitizedData) {
        const original = sanitizedData[field];
        const converted = Number(original);
        
        if (isNaN(converted) || original === null || original === undefined || original === '') {
          sanitizedData[field] = 0;
          console.log(`🧹 [${context.toUpperCase()}] Sanitizado ${field}: ${original} → 0`);
        } else {
          sanitizedData[field] = Math.max(0, converted);
          if (original !== sanitizedData[field]) {
            console.log(`🧹 [${context.toUpperCase()}] Sanitizado ${field}: ${original} → ${sanitizedData[field]}`);
          }
        }
      }
    });
    
    console.log(`🧹 [${context.toUpperCase()}] Dados após sanitização:`, JSON.stringify(sanitizedData, null, 2));
    
    // Mapear dados do formulário para o formato do backend baseado no tipo
    const baseData = {
      title: String(sanitizedData.titulo || '').trim(),
      description: String(sanitizedData.descricao || '').trim(),
      type: String(sanitizedData.tipo || 'imovel').trim(),
      // Mapear endereço corretamente para o formato esperado pelo backend
      address: {
        street: String(sanitizedData.rua || '').trim(),
        number: String(sanitizedData.numero || '').trim(),
        complement: String(sanitizedData.complemento || '').trim(),
        neighborhood: String(sanitizedData.bairro || '').trim(),
        city: String(sanitizedData.cidade || '').trim(),
        state: String(sanitizedData.estado || '').trim(),
        zipCode: String(sanitizedData.cep || '').trim(),
        country: 'Brasil'
      },
      realEstateId: currentRealEstate?.id
    };
    
    console.log(`🗺️ [${context.toUpperCase()}] Base data mapeado:`, JSON.stringify(baseData, null, 2));

    // Adicionar campos específicos baseados no tipo
    let mappedData: any = { ...baseData };

    if (sanitizedData.tipo === 'empreendimento') {
      // Validação específica para empreendimentos
      const unidadesDisponiveis = sanitizedData.unidadesDisponiveis;
      const unidadesNum = Number(unidadesDisponiveis);
      
      console.log(`🏢 [${context.toUpperCase()}] Validando empreendimento:`);
      console.log(`   - unidadesDisponiveis original:`, unidadesDisponiveis, typeof unidadesDisponiveis);
      console.log(`   - unidadesDisponiveis convertido:`, unidadesNum, typeof unidadesNum);
      console.log(`   - isNaN(unidadesNum):`, isNaN(unidadesNum));
      console.log(`   - construtora:`, sanitizedData.construtora, typeof sanitizedData.construtora);
      console.log(`   - previsaoEntrega:`, sanitizedData.previsaoEntrega, typeof sanitizedData.previsaoEntrega);
      console.log(`   - plantas:`, sanitizedData.plantas, Array.isArray(sanitizedData.plantas));
      
      // Validar previsaoEntrega
      let previsaoEntrega = sanitizedData.previsaoEntrega;
      if (!previsaoEntrega || previsaoEntrega === '' || previsaoEntrega === null) {
        previsaoEntrega = new Date().toISOString();
        console.log(`🧹 [${context.toUpperCase()}] Previsão de entrega vazia, usando data atual:`, previsaoEntrega);
      }
      
      // CORREÇÃO: Mapear dados para o formato correto do ProductController
      mappedData = {
        ...baseData,
        // Campos específicos de empreendimento no formato correto
        construtora: String(sanitizedData.construtora || '').trim(),
        previsaoEntrega,
        unidadesDisponiveis: Math.max(0, Math.floor(unidadesNum)),
        availableUnits: Math.max(0, Math.floor(unidadesNum)), // Campo alternativo
        plantas: (() => {
          console.log(`🌱 [${context.toUpperCase()}] PROCESSANDO PLANTAS:`);
          console.log(`   - plantas originais:`, sanitizedData.plantas, Array.isArray(sanitizedData.plantas));
          
          if (!Array.isArray(sanitizedData.plantas)) {
            console.log(`   - plantas não é array, retornando array vazio`);
            return [];
          }
          
          const plantasValidas = sanitizedData.plantas.filter(p => {
            const isValid = p && typeof p === 'object' && p.area && p.precoPorM2;
            console.log(`   - planta ${p?.id || 'sem-id'}:`, p, 'válida:', isValid);
            return isValid;
          });
          
          console.log(`   - plantas válidas (${plantasValidas.length}):`, plantasValidas);
          return plantasValidas;
        })(),
        // Campos obrigatórios para empreendimentos
        area: Math.max(100, Number(sanitizedData.areaConstruida) || 100),
        value: 0 // Empreendimentos podem ter valor 0
      };
    } else if (sanitizedData.tipo === 'terreno') {
      // Validação específica para terrenos
      const preco = Number(sanitizedData.preco);
      const area = Number(sanitizedData.area);
      const frente = Number(sanitizedData.frente);
      
      console.log(`🏞️ [${context.toUpperCase()}] Validando terreno:`);
      console.log(`   - preco:`, sanitizedData.preco, '→', preco, isNaN(preco));
      console.log(`   - area:`, sanitizedData.area, '→', area, isNaN(area));
      console.log(`   - frente:`, sanitizedData.frente, '→', frente, isNaN(frente));
      console.log(`   - tipoSolo:`, sanitizedData.tipoSolo, typeof sanitizedData.tipoSolo);
      console.log(`   - zoneamento:`, sanitizedData.zoneamento, typeof sanitizedData.zoneamento);
      
      mappedData = {
        ...baseData,
        value: Math.max(0, preco),
        area: Math.max(0, area),
        totalArea: Math.max(0, area),
        frontage: Math.max(0, frente),
        topography: String(sanitizedData.tipoSolo || 'plano').trim(),
        zoning: String(sanitizedData.zoneamento || 'residential').trim()
      };
    } else {
      // Validação específica para imóveis
      const preco = Number(sanitizedData.preco);
      const areaConstruida = Number(sanitizedData.areaConstruida);
      const quartos = Number(sanitizedData.quartos);
      const banheiros = Number(sanitizedData.banheiros);
      const garagem = Number(sanitizedData.garagem);
      
      console.log(`🏠 [${context.toUpperCase()}] Validando imóvel:`);
      console.log(`   - preco:`, sanitizedData.preco, '→', preco, isNaN(preco));
      console.log(`   - areaConstruida:`, sanitizedData.areaConstruida, '→', areaConstruida, isNaN(areaConstruida));
      console.log(`   - quartos:`, sanitizedData.quartos, '→', quartos, isNaN(quartos));
      console.log(`   - banheiros:`, sanitizedData.banheiros, '→', banheiros, isNaN(banheiros));
      console.log(`   - garagem:`, sanitizedData.garagem, '→', garagem, isNaN(garagem));
      
      mappedData = {
        ...baseData,
        value: Math.max(0, preco),
        area: Math.max(0, areaConstruida),
        builtArea: Math.max(0, areaConstruida),
        bedrooms: Math.max(0, Math.floor(quartos)),
        bathrooms: Math.max(0, Math.floor(banheiros)),
        parkingSpaces: Math.max(0, Math.floor(garagem))
      };
    }
    
    // Verificar se há campos undefined ou null no objeto final
    const checkForInvalidFields = (obj: any, path = '') => {
      const invalidFields: string[] = [];
      
      for (const [key, value] of Object.entries(obj)) {
        const currentPath = path ? `${path}.${key}` : key;
        
        if (value === undefined) {
          invalidFields.push(`${currentPath} = undefined`);
        } else if (value === null) {
          invalidFields.push(`${currentPath} = null`);
        } else if (typeof value === 'number' && isNaN(value)) {
          invalidFields.push(`${currentPath} = NaN`);
        } else if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
          invalidFields.push(...checkForInvalidFields(value, currentPath));
        }
      }
      
      return invalidFields;
    };
    
    const invalidFields = checkForInvalidFields(mappedData);
    if (invalidFields.length > 0) {
      console.error(`❌ [${context.toUpperCase()}] Campos inválidos detectados:`, invalidFields);
    }
    
    // LIMPEZA FINAL - Remover campos null, undefined e NaN
    console.log(`🧽 [${context.toUpperCase()}] LIMPEZA FINAL - Removendo campos problemáticos:`);
    const cleanedData = JSON.parse(JSON.stringify(mappedData, (key, value) => {
      if (value === null || value === undefined) {
        console.log(`   - Removendo ${key}: ${value}`);
        return undefined; // Remove o campo
      }
      if (typeof value === 'number' && isNaN(value)) {
        console.log(`   - Convertendo NaN em ${key} para 0`);
        return 0;
      }
      return value;
    }));
    
    // Garantir que campos obrigatórios do backend estejam presentes
    if (!cleanedData.name && cleanedData.title) {
      cleanedData.name = cleanedData.title;
      console.log(`🔧 [${context.toUpperCase()}] Adicionando campo name obrigatório:`, cleanedData.name);
    }
    
    if (typeof cleanedData.area !== 'number' || cleanedData.area <= 0) {
      cleanedData.area = 100; // Valor padrão
      console.log(`🔧 [${context.toUpperCase()}] Definindo área padrão:`, cleanedData.area);
    }
    
    if (typeof cleanedData.value !== 'number' || cleanedData.value < 0) {
      cleanedData.value = 0; // Valor padrão
      console.log(`🔧 [${context.toUpperCase()}] Definindo valor padrão:`, cleanedData.value);
    }
    
    console.log(`✅ [${context.toUpperCase()}] Dados finais limpos:`, JSON.stringify(cleanedData, null, 2));
    return cleanedData;
  }, [currentRealEstate?.id]);

  // 🚫 SOLUÇÃO RADICAL: FUNÇÃO AUTO-SAVE COMPLETAMENTE REMOVIDA
  // Agora o salvamento é EXCLUSIVAMENTE manual via botão "Salvar Produto"
  
  // 🚫 SOLUÇÃO RADICAL: AUTO-SAVE USEEFFECT COMPLETAMENTE REMOVIDO
  // Detectar mudanças apenas para mostrar indicador visual
  useEffect(() => {
    if (isDirty && hasInitialized) {
      setHasUnsavedChanges(true);
      console.log('📝 MUDANÇAS DETECTADAS - Salvamento manual necessário');
    }
  }, [isDirty, hasInitialized]);
  
  const onSubmit = handleSubmit(async (data) => {
    setIsSubmitting(true);
    try {
      console.log('🚀 SUBMIT iniciado');
      
      if (currentProperty?.id) {
        console.log('📝 SUBMIT - Atualizando produto existente:', currentProperty.id);
        
        const mappedData = sanitizeAndValidateData(data, 'submit');
        
        console.log('📤 SUBMIT - Enviando dados para API:', JSON.stringify(mappedData, null, 2));
        
        await updateProperty(currentProperty.id, mappedData);
        toast.success('Produto atualizado com sucesso!');
        console.log('✅ SUBMIT - Sucesso!');
      } else {
        // Verificar se há imobiliária selecionada
        if (!currentRealEstate?.id) {
          toast.error('Nenhuma imobiliária selecionada. Selecione uma imobiliária antes de criar o produto.');
          return;
        }
        
        // Adicionar realEstateId do contexto aos dados
        const dataWithRealEstate = {
          ...data,
          realEstateId: currentRealEstate.id
        };
        
        console.log('📋 Dados completos para criação:', dataWithRealEstate);
        console.log('🏢 Imobiliária atual:', currentRealEstate);
        await createProperty(dataWithRealEstate);
        
        // Forçar invalidação do cache da lista de produtos
        console.log('🔄 Forçando invalidação do cache da lista...');
        const listKey = `${endpoints.property.list}?real_estate_id=${currentRealEstate.id}`;
        await mutate(listKey);
        
        // Invalidar cache global como fallback
        await mutate(() => true);
        
        toast.success('Produto criado com sucesso!');
        console.log('✅ Cache invalidado, produto deve aparecer na lista!');
      }
      setHasUnsavedChanges(false);
      router.push(paths.dashboard.property.root);
    } catch (error) {
      console.error('❌ SUBMIT - Erro detalhado:', {
        message: error instanceof Error ? error.message : 'Erro desconhecido',
        stack: error instanceof Error ? error.stack : undefined,
        productId: currentProperty?.id,
        realEstateId: currentRealEstate?.id,
        isUpdate: !!currentProperty?.id,
        formData: data,
        timestamp: new Date().toISOString()
      });
      
      // Tentar extrair mensagem de erro mais específica
      let errorMessage = 'Erro ao salvar produto';
      if (error instanceof Error) {
        if (error.message.includes('Dados inválidos')) {
          errorMessage = 'Dados inválidos: Verifique os campos obrigatórios e valores numéricos';
        } else if (error.message.includes('400')) {
          errorMessage = 'Erro de validação: Dados não aceitos pelo servidor';
        } else {
          errorMessage = error.message;
        }
      }
      
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  });
  
  const handleExit = useCallback(() => {
    if (hasUnsavedChanges) {
      exitDialog.onTrue();
    } else {
      router.push(paths.dashboard.property.root);
    }
  }, [hasUnsavedChanges, exitDialog, router]);
  
  // 🌱 Sistema simples de plantas inline - sem modal, sem complicações
  
  // Garantir que sempre tenha pelo menos uma planta para empreendimentos
  useEffect(() => {
    if (watchedType === 'empreendimento' && plantasFields.length === 0) {
      addPlanta({ area: 0, precoPorM2: 0, descricao: '' });
    }
  }, [watchedType, plantasFields.length, addPlanta]);

  // 🌱 Renderização simples de plantas inline
  const renderPlantasInline = useMemo(() => {
    if (watchedType !== 'empreendimento') return null;
    
    return (
      <Stack spacing={3}>
        <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Iconify icon="eva:home-outline" />
          Plantas do Empreendimento
        </Typography>
        
        {plantasFields.map((field, index) => (
          <Card key={field.id} sx={{ p: 3 }}>
            <Stack spacing={2}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="subtitle2" color="primary">
                  Planta {index + 1}
                </Typography>
                {plantasFields.length > 1 && (
                  <Button
                    size="small"
                    color="error"
                    onClick={() => handleRemovePlanta(index)}
                    startIcon={<Iconify icon="eva:trash-2-outline" />}
                  >
                    Remover
                  </Button>
                )}
              </Box>
              
              <Box
                sx={{
                  display: 'grid',
                  gap: 2,
                  gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }
                }}
              >
                <Field.Number
                  name={`plantas.${index}.area`}
                  label="Área (m²)"
                  placeholder="Ex: 65"
                  required
                />
                <Field.Number
                  name={`plantas.${index}.precoPorM2`}
                  label="Preço por m²"
                  placeholder="Ex: 8500"
                  formatCurrency
                  required
                />
              </Box>
            </Stack>
          </Card>
        ))}
        
        {plantasFields.length < 10 && (
          <Button
            variant="outlined"
            onClick={handleAddPlanta}
            startIcon={<Iconify icon="eva:plus-outline" />}
            sx={{ alignSelf: 'flex-start' }}
          >
            Adicionar Planta
          </Button>
        )}
        
        {plantasFields.length >= 10 && (
          <Alert severity="info">
            Máximo de 10 plantas atingido.
          </Alert>
        )}
      </Stack>
    );
  }, [watchedType, plantasFields, handleAddPlanta, handleRemovePlanta]);

  // Sistema inline não precisa de summary separado

  const renderSpecificFields = useMemo(() => {
    if (watchedType === 'imovel') {
      return (
        <Box
          rowGap={3}
          columnGap={2}
          display="grid"
          gridTemplateColumns={{
            xs: 'repeat(1, 1fr)',
            sm: 'repeat(2, 1fr)',
          }}
        >
          <Field.Number name="quartos" label="Quartos" />
          <Field.Number name="banheiros" label="Banheiros" />
          <Field.Number name="garagem" label="Garagem" />
          <Field.Number name="areaConstruida" label="Área Construída (m²)" />
        </Box>
      );
    }

    if (watchedType === 'terreno') {
      return (
        <Box
          rowGap={3}
          columnGap={2}
          display="grid"
          gridTemplateColumns={{
            xs: 'repeat(1, 1fr)',
            sm: 'repeat(2, 1fr)',
          }}
        >
          <Field.Number name="area" label="Área (m²)" />
          <Field.Number name="frente" label="Frente (m)" />
          <Field.Text name="tipoSolo" label="Tipo de Solo" />
          <Field.Text name="zoneamento" label="Zoneamento" />
        </Box>
      );
    }

    if (watchedType === 'empreendimento') {
      return (
        <Stack spacing={3}>
          <Box
            rowGap={3}
            columnGap={2}
            display="grid"
            gridTemplateColumns={{
              xs: 'repeat(1, 1fr)',
              sm: 'repeat(2, 1fr)',
            }}
          >
            <Field.Text
              name="construtora"
              label="Construtora"
            />
            <Field.DatePicker name="previsaoEntrega" label="Previsão de Entrega" />
            <Field.Number
              name="unidadesDisponiveis"
              label="Unidades Disponíveis"
              helperText="Número total de unidades no empreendimento"
            />
          </Box>
          
          <Divider />
          
          {renderPlantasInline}
        </Stack>
      );
    }

    return null;
  }, [watchedType, renderPlantasInline]);

  const renderBasicFieldsContent = useMemo(() => (
    <Stack spacing={3}>
      <Field.Select
        name="tipo"
        label="Tipo de Produto"
        value={watchedType}
        onChange={(event) => handleTypeChange(event.target.value)}
        required
        aria-describedby="tipo-help"
        aria-label="Selecionar tipo de produto"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Iconify icon="eva:cube-outline" aria-hidden="true" />
            </InputAdornment>
          ),
        }}
      >
        <MenuItem value="imovel" aria-label="Selecionar imóvel">Imóvel</MenuItem>
        <MenuItem value="terreno" aria-label="Selecionar terreno">Terreno</MenuItem>
        <MenuItem value="empreendimento" aria-label="Selecionar empreendimento">Empreendimento</MenuItem>
      </Field.Select>
      
      <Typography variant="caption" id="tipo-help" color="text.secondary">
        Selecione o tipo de produto que você deseja cadastrar
      </Typography>

      <Field.Text
        name="titulo"
        label="Título"
        required
        placeholder={watchedType === 'empreendimento' ? 'Ex: Future Design Empreendimento' : watchedType === 'terreno' ? 'Ex: Terreno 500m² no Centro' : 'Ex: Apartamento 3 quartos Vila Madalena'}
        aria-describedby="titulo-help"
        aria-label={`Título do ${watchedType}`}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Iconify icon="eva:edit-outline" aria-hidden="true" />
            </InputAdornment>
          ),
        }}
      />
      
      <Typography variant="caption" id="titulo-help" color="text.secondary">
        Título chamativo e descritivo (3-100 caracteres)
      </Typography>

      {watchedType !== 'empreendimento' && (
        <>
          <Field.Number
            name="preco"
            label="Preço"
            required
            placeholder="R$ 0,00"
            formatCurrency
            aria-describedby="preco-help"
          />
          
          <Typography variant="caption" id="preco-help" color="text.secondary">
            Valor em reais (R$)
          </Typography>
        </>
      )}

      {/* Campos de Endereço */}
      <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
        Endereço
      </Typography>
      
      <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', md: '2fr 1fr' } }}>
        <Field.Text
          name="rua"
          label="Rua"
          required
          placeholder="Ex: Rua das Flores"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Iconify icon="eva:pin-outline" aria-hidden="true" />
              </InputAdornment>
            ),
          }}
        />
        
        <Field.Text
          name="numero"
          label="Número"
          required
          placeholder="Ex: 123"
        />
      </Box>
      
      <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' } }}>
        <Field.Text
          name="complemento"
          label="Complemento"
          placeholder="Ex: Apto 45, Bloco B"
        />
        
        <Field.Text
          name="bairro"
          label="Bairro"
          required
          placeholder="Ex: Centro"
        />
      </Box>
      
      <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', md: '2fr 1fr 1fr' } }}>
        <Field.Text
          name="cidade"
          label="Cidade"
          required
          placeholder="Ex: São Paulo"
        />
        
        <Field.Select
          name="estado"
          label="Estado"
          required
        >
          <MenuItem value="AC">AC</MenuItem>
          <MenuItem value="AL">AL</MenuItem>
          <MenuItem value="AP">AP</MenuItem>
          <MenuItem value="AM">AM</MenuItem>
          <MenuItem value="BA">BA</MenuItem>
          <MenuItem value="CE">CE</MenuItem>
          <MenuItem value="DF">DF</MenuItem>
          <MenuItem value="ES">ES</MenuItem>
          <MenuItem value="GO">GO</MenuItem>
          <MenuItem value="MA">MA</MenuItem>
          <MenuItem value="MT">MT</MenuItem>
          <MenuItem value="MS">MS</MenuItem>
          <MenuItem value="MG">MG</MenuItem>
          <MenuItem value="PA">PA</MenuItem>
          <MenuItem value="PB">PB</MenuItem>
          <MenuItem value="PR">PR</MenuItem>
          <MenuItem value="PE">PE</MenuItem>
          <MenuItem value="PI">PI</MenuItem>
          <MenuItem value="RJ">RJ</MenuItem>
          <MenuItem value="RN">RN</MenuItem>
          <MenuItem value="RS">RS</MenuItem>
          <MenuItem value="RO">RO</MenuItem>
          <MenuItem value="RR">RR</MenuItem>
          <MenuItem value="SC">SC</MenuItem>
          <MenuItem value="SP">SP</MenuItem>
          <MenuItem value="SE">SE</MenuItem>
          <MenuItem value="TO">TO</MenuItem>
        </Field.Select>
        
        <Field.Text
          name="cep"
          label="CEP"
          required
          placeholder="00000-000"
          inputProps={{ maxLength: 9 }}
        />
      </Box>
      
      <Typography variant="caption" color="text.secondary">
        Preencha todos os campos de endereço para melhor localização do Imóvel
      </Typography>

      <Field.Text
        name="descricao"
        label="Descrição"
        multiline
        rows={4}
        required
        placeholder={watchedType === 'empreendimento' ? 'Descreva as características principais do empreendimento...' : watchedType === 'terreno' ? 'Descreva as características do terreno (topografia, localização, potencial de uso)...' : 'Descreva as características principais do Imóvel (quartos, área, diferenciais)...'}
        aria-describedby="descricao-help"
        aria-label={`Descrição detalhada do ${watchedType}`}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start" sx={{ alignSelf: 'flex-start', mt: 1 }}>
              <Iconify icon="eva:file-text-outline" aria-hidden="true" />
            </InputAdornment>
          ),
        }}
      />
      
      <Typography variant="caption" id="descricao-help" color="text.secondary">
        Descrição detalhada (10-1000 caracteres)
      </Typography>
    </Stack>
  ), [watchedType, handleTypeChange]);

  const renderBasicFields = useMemo(() => {
    if (isMobile) {
      return (
        <Accordion 
          expanded={watchedType === 'empreendimento' ? true : expandedSections.basic !== false} 
          onChange={watchedType === 'empreendimento' ? undefined : () => handleSectionToggle('basic')}
          defaultExpanded
        >
          <AccordionSummary 
            expandIcon={watchedType === 'empreendimento' ? null : <Iconify icon="eva:arrow-down-fill" />}
            sx={{ 
              '& .MuiAccordionSummary-content': { 
                alignItems: 'center',
                gap: 1
              }
            }}
          >
            <Iconify icon="eva:file-text-outline" width={20} />
            <Typography variant="h6">Informações Básicas</Typography>
            <Chip size="small" label="Obrigatório" color="primary" />
          </AccordionSummary>
          <AccordionDetails>
            <Stack spacing={3}>
              {renderBasicFieldsContent}
            </Stack>
          </AccordionDetails>
        </Accordion>
      );
    }
    
    return (
      <Card role="region" aria-labelledby="basic-fields-title">
        <CardHeader 
          id="basic-fields-title"
          title="Informações Básicas" 
          subheader="Dados principais do produto" 
          sx={{ mb: 3 }} 
          titleTypographyProps={{ 
            component: 'h2',
            'aria-level': 2
          }}
        />
        
        <Divider />
        
        <Stack spacing={3} sx={{ p: { xs: 2, sm: 3 } }} role="group" aria-labelledby="basic-fields-title">
          {renderBasicFieldsContent}
        </Stack>
      </Card>
    );
  }, [isMobile, watchedType, expandedSections.basic, handleSectionToggle, renderBasicFieldsContent]);

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Stack spacing={3}>
        {renderBasicFields}
        
        {renderSpecificFields && (
          <Card>
            <CardHeader 
              title="Informações Específicas" 
              subheader={`Dados específicos para ${watchedType}`} 
              sx={{ mb: 3 }} 
            />
            <Divider />
            <Stack spacing={3} sx={{ p: { xs: 2, sm: 3 } }}>
              {renderSpecificFields}
            </Stack>
          </Card>
        )}
        
        {/* 💾 Ações do Produto */}
        <Card>
          <CardHeader 
            title="Ações do Produto" 
            subheader="Salvar ou cancelar alterações" 
            sx={{ mb: 2 }} 
          />
          <Divider />
          <Stack spacing={3} sx={{ p: 3 }}>
            {/* Indicador de mudanças */}
            {hasUnsavedChanges && (
              <Alert severity="info">
                <AlertTitle>Mudanças detectadas</AlertTitle>
                Você tem alterações não salvas. Use o botão "Salvar Produto" para persistir as mudanças.
                {lastSaved && (
                  <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                    Último salvamento: {lastSaved.toLocaleTimeString()}
                  </Typography>
                )}
              </Alert>
            )}
            
            {/* Botões de ação */}
            <Stack direction="row" spacing={2} justifyContent="flex-end" flexWrap="wrap">
              <Button variant="outlined" onClick={handleExit}>
                Cancelar
              </Button>
              
              <LoadingButton
                type="submit"
                variant="contained"
                color="primary"
                loading={isSubmitting}
                startIcon={<Iconify icon="eva:save-outline" />}
              >
                {currentProperty ? 'Atualizar' : 'Criar'} Produto
              </LoadingButton>
            </Stack>
          </Stack>
        </Card>
      </Stack>
      
      <Dialog open={exitDialog.value} onClose={exitDialog.onFalse}>
        <DialogTitle>Alterações não salvas</DialogTitle>
        <DialogContent>
          <Typography>
            Você tem alterações não salvas. Deseja sair sem salvar?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={exitDialog.onFalse}>Cancelar</Button>
          <Button 
            onClick={() => {
              exitDialog.onFalse();
              router.push(paths.dashboard.property.root);
            }}
            color="error"
          >
            Sair sem salvar
          </Button>
        </DialogActions>
      </Dialog>
    </Form>
  );
}