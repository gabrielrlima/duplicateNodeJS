import type { ITerrenoItem } from 'src/types/terreno';

import { z as zod } from 'zod';
import { useCallback, useEffect, useImperativeHandle, forwardRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useBoolean } from 'minimal-shared/hooks';
import { zodResolver } from '@hookform/resolvers/zod';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid2';
import Stack from '@mui/material/Stack';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { createTerreno, updateTerreno } from 'src/actions/terreno';
import { TERRENO_STATUS_OPTIONS } from 'src/_mock/_terreno';
import { useRealEstateContext } from 'src/contexts/real-estate-context';

import { toast } from 'sonner';
import { Iconify } from 'src/components/iconify';
import { Form, Field } from 'src/components/hook-form';

// ----------------------------------------------------------------------

export type NewTerrenoSchemaType = zod.infer<typeof NewTerrenoSchema>;

export const NewTerrenoSchema = zod.object({
  // Campos obrigatórios
  titulo: zod.string().min(1, 'Título é obrigatório'),
  preco: zod.coerce.number().min(0.01, 'Preço deve ser maior que zero'),
  area: zod.coerce.number().min(0.01, 'Área deve ser maior que zero'),
  
  // Proprietário - obrigatório
  proprietario: zod.object({
    nome: zod.string().min(1, 'Nome do proprietário é obrigatório'),
    email: zod.string().email('Email inválido').min(1, 'Email é obrigatório'),
    telefone: zod.string().min(1, 'Telefone é obrigatório'),
    documento: zod.string().min(1, 'CPF/CNPJ é obrigatório'),
  }),

  // Campos opcionais
  descricao: zod.string().optional(),
  status: zod.string().optional(),
  tipo: zod.string().optional(),
  observacoes: zod.string().optional(),
  imagens: zod.array(zod.custom<File | string>()).optional(),

  // Localização - campos opcionais
  localizacao: zod.object({
    endereco: zod.string().optional(),
    numero: zod.string().optional(),
    bairro: zod.string().optional(),
    cidade: zod.string().optional(),
    estado: zod.string().optional(),
    cep: zod.string().optional(),
  }).optional(),

  // Características - campos opcionais
  caracteristicas: zod.object({
    dimensoes: zod.string().optional(),
    formato: zod.string().optional(),
    topografia: zod.string().optional(),
    acesso: zod.string().optional(),
    documentacao: zod.string().optional(),
  }).optional(),

  // Campos calculados/extras
  precoM2: zod.coerce.number().optional(),
  preco_negociavel: zod.boolean().default(false),
  itu_anual: zod.coerce.number().optional(),
});

// ----------------------------------------------------------------------

type Props = {
  currentTerreno?: ITerrenoItem;
  onLoadingChange?: (loading: boolean) => void;
  renderActions?: (props: {
    onSave: () => void;
    onCancel: () => void;
    loading: boolean;
    isEditing: boolean;
  }) => React.ReactNode;
};

export type TerrenoFormRef = {
  onSave: () => void;
  onCancel: () => void;
};

export const TerrenoNewEditForm = forwardRef<TerrenoFormRef, Props>(({ currentTerreno, onLoadingChange, renderActions }, ref) => {
  const router = useRouter();
  const loadingSave = useBoolean();
  const { currentRealEstate } = useRealEstateContext();
  const [hasChanges, setHasChanges] = useState(false);
  const [initialValues, setInitialValues] = useState<NewTerrenoSchemaType | null>(null);

  const defaultValues: NewTerrenoSchemaType = {
    titulo: '',
    preco: 0,
    area: 0,
    proprietario: {
      nome: '',
      email: '',
      telefone: '',
      documento: '',
    },
    descricao: '',
    status: 'disponivel',
    tipo: 'residencial',
    observacoes: '',
    imagens: [],
    localizacao: {
      endereco: '',
      numero: '',
      bairro: '',
      cidade: '',
      estado: 'SP',
      cep: '',
    },
    caracteristicas: {
      dimensoes: '',
      formato: '',
      topografia: '',
      acesso: '',
      documentacao: '',
    },
    precoM2: 0,
    preco_negociavel: false,
    itu_anual: 0,
  };

  const methods = useForm<NewTerrenoSchemaType>({
    mode: 'onChange',
    resolver: zodResolver(NewTerrenoSchema),
    defaultValues,
    values: currentTerreno
      ? {
          titulo: currentTerreno.titulo,
          descricao: currentTerreno.descricao,
          area: currentTerreno.area,
          preco: currentTerreno.preco,
          precoM2: currentTerreno.precoM2,
          status: currentTerreno.status === 'available' ? 'disponivel' :
                  currentTerreno.status === 'reserved' ? 'reservado' :
                  currentTerreno.status === 'sold' ? 'vendido' :
                  currentTerreno.status === 'inactive' ? 'suspenso' :
                  currentTerreno.status,
          tipo: currentTerreno.tipo === 'residential' ? 'residencial' :
                currentTerreno.tipo === 'commercial' ? 'comercial' :
                currentTerreno.tipo === 'industrial' ? 'industrial' :
                currentTerreno.tipo === 'rural' ? 'rural' :
                currentTerreno.tipo,

          observacoes: currentTerreno.observacoes || '',
          localizacao: {
            ...currentTerreno.localizacao,
            numero: currentTerreno.localizacao.numero || '',
          },
          proprietario: currentTerreno.proprietario,
          caracteristicas: {
            ...currentTerreno.caracteristicas,
            dimensoes: currentTerreno.dimensoes || currentTerreno.caracteristicas.formato || '',
            topografia: currentTerreno.caracteristicas.topografia === 'plano' ? 'plano' :
                       currentTerreno.caracteristicas.topografia === 'aclive' ? 'aclive' :
                       currentTerreno.caracteristicas.topografia === 'declive' ? 'declive' :
                       currentTerreno.caracteristicas.topografia === 'irregular' ? 'irregular' :
                       currentTerreno.caracteristicas.topografia === 'inclinado' ? 'inclinado' :
                       currentTerreno.caracteristicas.topografia === 'flat' ? 'plano' :
                       currentTerreno.caracteristicas.topografia === 'sloped' ? 'inclinado' :
                       currentTerreno.caracteristicas.topografia,
            acesso: currentTerreno.caracteristicas.acesso === 'asfalto' ? 'asfalto' :
                   currentTerreno.caracteristicas.acesso === 'terra' ? 'terra' :
                   currentTerreno.caracteristicas.acesso === 'paved' ? 'asfalto' :
                   currentTerreno.caracteristicas.acesso === 'dirt' ? 'terra' :
                   currentTerreno.caracteristicas.acesso,
            documentacao: currentTerreno.caracteristicas.documentacao === 'sim' ? 'escritura' :
                         currentTerreno.caracteristicas.documentacao === 'nao' ? '' :
                         ['escritura', 'contrato', 'posse', 'financiado'].includes(currentTerreno.caracteristicas.documentacao) ? 
                         currentTerreno.caracteristicas.documentacao : '',

          },
          preco_negociavel: currentTerreno.preco_negociavel || false,
          itu_anual: currentTerreno.itu_anual || 0,
          imagens: currentTerreno.imagens || [],
        }
      : undefined,
  });

  const {
    reset,
    watch,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  // Função para comparação profunda de objetos
  const deepEqual = useCallback((obj1: any, obj2: any): boolean => {
    if (obj1 === obj2) return true;
    if (obj1 == null || obj2 == null) return false;
    if (typeof obj1 !== 'object' || typeof obj2 !== 'object') return obj1 === obj2;
    
    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);
    
    if (keys1.length !== keys2.length) return false;
    
    for (const key of keys1) {
      if (!keys2.includes(key)) return false;
      if (!deepEqual(obj1[key], obj2[key])) return false;
    }
    
    return true;
  }, []);

  // Monitorar mudanças nos valores do formulário
  useEffect(() => {
    if (currentTerreno && initialValues) {
      const hasFormChanges = !deepEqual(values, initialValues);
      setHasChanges(hasFormChanges);
    } else if (!currentTerreno) {
      // Para novos terrenos, sempre permitir salvar
      setHasChanges(true);
    }
  }, [values, initialValues, currentTerreno, deepEqual]);

  // Definir valores iniciais quando o terreno atual for carregado
  useEffect(() => {
    if (currentTerreno && !initialValues) {
      const initial = {
        titulo: currentTerreno.titulo,
        descricao: currentTerreno.descricao,
        area: currentTerreno.area,
        preco: currentTerreno.preco,
        precoM2: currentTerreno.precoM2,
        status: currentTerreno.status === 'available' ? 'disponivel' :
                currentTerreno.status === 'reserved' ? 'reservado' :
                currentTerreno.status === 'sold' ? 'vendido' :
                currentTerreno.status === 'inactive' ? 'suspenso' :
                currentTerreno.status,
        tipo: currentTerreno.tipo === 'residential' ? 'residencial' :
              currentTerreno.tipo === 'commercial' ? 'comercial' :
              currentTerreno.tipo === 'industrial' ? 'industrial' :
              currentTerreno.tipo === 'rural' ? 'rural' :
              currentTerreno.tipo,

        observacoes: currentTerreno.observacoes || '',
        localizacao: {
          ...currentTerreno.localizacao,
          numero: currentTerreno.localizacao.numero || '',
        },
        proprietario: currentTerreno.proprietario,
        caracteristicas: {
          ...currentTerreno.caracteristicas,
          dimensoes: currentTerreno.dimensoes || currentTerreno.caracteristicas.formato || '',
          topografia: currentTerreno.caracteristicas.topografia === 'plano' ? 'plano' :
                     currentTerreno.caracteristicas.topografia === 'aclive' ? 'aclive' :
                     currentTerreno.caracteristicas.topografia === 'declive' ? 'declive' :
                     currentTerreno.caracteristicas.topografia === 'irregular' ? 'irregular' :
                     currentTerreno.caracteristicas.topografia === 'inclinado' ? 'inclinado' :
                     currentTerreno.caracteristicas.topografia === 'flat' ? 'plano' :
                     currentTerreno.caracteristicas.topografia === 'sloped' ? 'inclinado' :
                     currentTerreno.caracteristicas.topografia,
          acesso: currentTerreno.caracteristicas.acesso === 'asfalto' ? 'asfalto' :
                 currentTerreno.caracteristicas.acesso === 'terra' ? 'terra' :
                 currentTerreno.caracteristicas.acesso === 'paved' ? 'asfalto' :
                 currentTerreno.caracteristicas.acesso === 'dirt' ? 'terra' :
                 currentTerreno.caracteristicas.acesso,
          documentacao: currentTerreno.caracteristicas.documentacao === 'sim' ? 'escritura' :
                       currentTerreno.caracteristicas.documentacao === 'nao' ? '' :
                       ['escritura', 'contrato', 'posse', 'financiado'].includes(currentTerreno.caracteristicas.documentacao) ? 
                       currentTerreno.caracteristicas.documentacao : '',

        },
        preco_negociavel: currentTerreno.preco_negociavel || false,
        itu_anual: currentTerreno.itu_anual || 0,
        imagens: currentTerreno.imagens || [],
      };
      setInitialValues(initial);
    }
  }, [currentTerreno]);

  const handleRemoveFile = useCallback(
    (inputFile: File | string) => {
      const filtered = values.imagens && values.imagens?.filter((file) => file !== inputFile);
      setValue('imagens', filtered);
    },
    [setValue, values.imagens]
  );

  const handleRemoveAllFiles = useCallback(() => {
    setValue('imagens', [], { shouldValidate: true });
  }, [setValue]);

  // Calcular preço por m² automaticamente
  const handleAreaOrPrecoChange = () => {
    if (values.area > 0 && values.preco > 0) {
      setValue('precoM2', values.preco / values.area);
    }
  };

  const handleCancel = () => {
    router.push(paths.dashboard.terrenos.root);
  };

  const handleSave = handleSubmit(async (data) => {
    console.log('🎯 handleSave chamado!');
    console.log('📋 Dados do formulário:', data);
    
    loadingSave.onTrue();

    try {
      console.log('🚀 Salvando terreno:', data);
      console.log('Imobiliária atual:', currentRealEstate);

      if (!currentRealEstate?.id) {
        console.log('⚠️ Nenhuma imobiliária selecionada. Usando ID padrão para teste.');
        // toast.error('Selecione uma imobiliária primeiro!');
        // loadingSave.onFalse();
        // return;
      }

      // Transformar dados do formulário para o formato da API
      const terrenoData = {
        name: data.titulo,
        title: data.titulo,
        description: data.descricao || 'Terreno criado via formulário',
        totalArea: data.area,
        value: data.preco,
        status: data.status === 'disponivel' ? 'available' :
                data.status === 'reservado' ? 'reserved' :
                data.status === 'vendido' ? 'sold' :
                data.status === 'suspenso' ? 'inactive' :
                'available',
        type: data.tipo === 'residencial' ? 'residential' : 
              data.tipo === 'comercial' ? 'commercial' : 
              data.tipo === 'industrial' ? 'industrial' :
              data.tipo === 'rural' ? 'rural' : 'residential',
        acceptsFinancing: Boolean(data.preco_negociavel),
        address: {
          street: data.localizacao?.endereco || 'Não informado',
          number: data.localizacao?.numero || 'S/N',
          neighborhood: data.localizacao?.bairro || 'Não informado',
          city: data.localizacao?.cidade || 'Não informado',
          state: data.localizacao?.estado || 'SP',
          zipCode: data.localizacao?.cep || '00000-000'
        },
        owner: {
          name: data.proprietario.nome,
          email: data.proprietario.email,
          phone: data.proprietario.telefone,
          document: data.proprietario.documento
        },
        topography: data.caracteristicas?.topografia === 'plano' ? 'flat' :
                    data.caracteristicas?.topografia === 'inclinado' ? 'sloped' :
                    data.caracteristicas?.topografia === 'aclive' ? 'sloped' :
                    data.caracteristicas?.topografia === 'declive' ? 'sloped' :
                    data.caracteristicas?.topografia === 'irregular' ? 'irregular' :
                    'flat',
        dimensions: data.caracteristicas?.dimensoes || '',
        accessType: data.caracteristicas?.acesso === 'asfalto' ? 'paved' :
                   data.caracteristicas?.acesso === 'terra' ? 'dirt' :
                   data.caracteristicas?.acesso === 'paralelepipedo' ? 'cobblestone' :
                   data.caracteristicas?.acesso === 'concreto' ? 'paved' :
                   'paved',
        hasDocumentation: Boolean(data.caracteristicas?.documentacao),
        imagens: data.imagens || [],
        realEstateId: currentRealEstate?.id || 'test-real-estate-id'
      };
      console.log('Dados para API:', terrenoData);

      if (currentTerreno) {
        await updateTerreno(currentTerreno.id, terrenoData);
        toast.success('Terreno atualizado com sucesso!');
      } else {
        await createTerreno(terrenoData);
        toast.success('Terreno criado com sucesso!');
      }

      reset();
      router.push(paths.dashboard.terrenos.root);
    } catch (error) {
      console.error('Erro ao salvar terreno:', error);
      toast.error('Erro ao salvar terreno. Verifique os dados e tente novamente.');
    } finally {
      loadingSave.onFalse();
    }
  });

  // Expor funções através do ref
  useImperativeHandle(ref, () => ({
    onSave: handleSave,
    onCancel: handleCancel,
  }), [handleSave, handleCancel]);

  // Notificar mudanças de loading
  useEffect(() => {
    if (onLoadingChange) {
      onLoadingChange(loadingSave.value && isSubmitting);
    }
  }, [onLoadingChange, loadingSave.value, isSubmitting]);

  // Expor funções para o header através da prop renderActions (compatibilidade)
  useEffect(() => {
    if (renderActions) {
      renderActions({
        onSave: handleSave,
        onCancel: handleCancel,
        loading: loadingSave.value && isSubmitting,
        isEditing: !!currentTerreno,
      });
    }
  }, [renderActions, loadingSave.value, isSubmitting, currentTerreno, handleSave, handleCancel]);

  return (
    <Form methods={methods} onSubmit={handleSave}>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 8 }}>
          <Card sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 3 }}>
              Informações Básicas
            </Typography>

            <Stack spacing={3}>
              <Field.Text name="titulo" label="Título" placeholder="Digite o título do terreno" />

              <Field.Text name="descricao" label="Descrição" placeholder="Descreva as características do terreno" multiline rows={3} />

              <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 4 }}>
                  <Field.Number
                    name="area"
                    label="Área (m²)"
                    placeholder="Ex: 500"
                    formatThousands
                    onBlur={handleAreaOrPrecoChange}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                  <Field.Number
                    name="preco"
                    label="Preço (R$)"
                    placeholder="Ex: 150.000"
                    formatThousands
                    onBlur={handleAreaOrPrecoChange}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                  <Field.Number name="precoM2" label="Preço/m² (R$)" formatThousands disabled />
                </Grid>
              </Grid>

              <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Field.Select name="status" label="Status" placeholder="Selecione o status">
                    {TERRENO_STATUS_OPTIONS.map((option) => {
                      const isCurrentStatus = currentTerreno && currentTerreno.status === option.value;
                      return (
                        <MenuItem 
                          key={option.value} 
                          value={option.value}
                          disabled={isCurrentStatus}
                        >
                          {option.label}
                        </MenuItem>
                      );
                    })}
                  </Field.Select>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Field.Select name="tipo" label="Tipo" placeholder="Selecione o tipo">
                    <MenuItem value="residencial">Residencial</MenuItem>
                    <MenuItem value="comercial">Comercial</MenuItem>
                    <MenuItem value="industrial">Industrial</MenuItem>
                    <MenuItem value="rural">Rural</MenuItem>
                  </Field.Select>
                </Grid>
              </Grid>

              <Field.Switch name="preco_negociavel" label="Preço Negociável" />
              
              <Field.Number 
                name="itu_anual" 
                label="ITU Anual (R$)" 
                placeholder="Ex: 1.200"
                formatThousands
                InputProps={{
                  startAdornment: 'R$'
                }}
              />

              <Field.Text name="observacoes" label="Observações" placeholder="Informações adicionais sobre o terreno" multiline rows={2} />
            </Stack>
          </Card>

          <Card sx={{ p: 3, mt: 3 }}>
            <Typography variant="h6" sx={{ mb: 3 }}>
              Localização
            </Typography>

            <Stack spacing={3}>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 8 }}>
                  <Field.Text name="localizacao.endereco" label="Endereço" placeholder="Ex: Rua das Flores, 123" />
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                  <Field.Text name="localizacao.numero" label="Número" placeholder="Ex: 123" />
                </Grid>
              </Grid>

              <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Field.Text name="localizacao.bairro" label="Bairro" placeholder="Ex: Centro" />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Field.Text name="localizacao.cidade" label="Cidade" placeholder="Ex: São Paulo" />
                </Grid>
              </Grid>

              <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Field.Text name="localizacao.estado" label="Estado" placeholder="Ex: SP" />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Field.Cep name="localizacao.cep" label="CEP" placeholder="Ex: 01234-567" />
                </Grid>
              </Grid>
            </Stack>
          </Card>

          <Card sx={{ p: 3, mt: 3 }}>
            <Typography variant="h6" sx={{ mb: 3 }}>
              Características
            </Typography>

            <Stack spacing={3}>
              <Field.Text 
                name="caracteristicas.dimensoes" 
                label="Dimensões" 
                placeholder="Ex: 10m x 20m"
              />
              
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Field.Select name="caracteristicas.formato" label="Formato" placeholder="Selecione o formato">
                    <MenuItem value="retangular">Retangular</MenuItem>
                    <MenuItem value="quadrado">Quadrado</MenuItem>
                    <MenuItem value="irregular">Irregular</MenuItem>
                    <MenuItem value="triangular">Triangular</MenuItem>
                  </Field.Select>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Field.Select name="caracteristicas.topografia" label="Topografia" placeholder="Selecione a topografia">
                    <MenuItem value="plano">Plano</MenuItem>
                <MenuItem value="inclinado">Inclinado</MenuItem>
                <MenuItem value="aclive">Aclive</MenuItem>
                <MenuItem value="declive">Declive</MenuItem>
                    <MenuItem value="irregular">Irregular</MenuItem>
                  </Field.Select>
                </Grid>
              </Grid>

              <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Field.Select name="caracteristicas.acesso" label="Acesso" placeholder="Selecione o tipo de acesso">
                    <MenuItem value="asfalto">Asfalto</MenuItem>
                    <MenuItem value="terra">Terra</MenuItem>
                    <MenuItem value="paralelepipedo">Paralelepípedo</MenuItem>
                    <MenuItem value="concreto">Concreto</MenuItem>
                  </Field.Select>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Field.Select name="caracteristicas.documentacao" label="Documentação" placeholder="Selecione a documentação">
                    <MenuItem value="escritura">Escritura</MenuItem>
                    <MenuItem value="contrato">Contrato</MenuItem>
                    <MenuItem value="posse">Posse</MenuItem>
                    <MenuItem value="financiado">Financiado</MenuItem>
                  </Field.Select>
                </Grid>
              </Grid>
            </Stack>
          </Card>

          <Card sx={{ p: 3, mt: 3 }}>
            <Typography variant="h6" sx={{ mb: 3 }}>
              Imagens
            </Typography>

            <Stack spacing={1.5}>
              <Typography variant="subtitle2">Fotos do Terreno</Typography>
              <Field.Upload
                multiple
                thumbnail
                name="imagens"
                maxSize={3145728}
                onRemove={handleRemoveFile}
                onRemoveAll={handleRemoveAllFiles}
                onUpload={undefined}
              />
            </Stack>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 3 }}>
              Proprietário
            </Typography>

            <Stack spacing={3}>
              <Field.Text name="proprietario.nome" label="Nome" placeholder="Ex: João Silva" />
              <Field.Text name="proprietario.email" label="Email" placeholder="Ex: joao@email.com" />
              <Field.Phone name="proprietario.telefone" label="Telefone" placeholder="Ex: (11) 99999-9999" country="BR" />
              <Field.Document name="proprietario.documento" label="CPF/CNPJ" placeholder="Ex: 123.456.789-00" />
            </Stack>
          </Card>
        </Grid>
      </Grid>

      {!renderActions && (
        <Box
          sx={{
            mt: 3,
            gap: 2,
            display: 'flex',
            justifyContent: 'flex-end',
          }}
        >
          <LoadingButton
            color="inherit"
            size="large"
            variant="outlined"
            onClick={handleCancel}
          >
            Cancelar
          </LoadingButton>

          <LoadingButton
            type="submit"
            size="large"
            variant="contained"
            loading={loadingSave.value}
            disabled={currentTerreno ? !hasChanges : false}
            onClick={() => {
              console.log('🖱️ Botão Criar Terreno clicado!');
              console.log('📊 Estado do formulário:', methods.formState);
              console.log('❌ Erros de validação:', methods.formState.errors);
              console.log('🔄 Há mudanças:', hasChanges);
              handleSave();
            }}
            startIcon={<Iconify icon="solar:save-bold" />}
          >
            {currentTerreno ? 'Atualizar' : 'Criar'} Terreno
          </LoadingButton>
        </Box>
      )}
    </Form>
  );
});
