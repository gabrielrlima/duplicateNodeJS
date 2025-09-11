import type { IComissaoItem } from 'src/types/comissao';

import { z as zod } from 'zod';
import { useMemo, useState, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useFieldArray } from 'react-hook-form';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Step from '@mui/material/Step';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Stepper from '@mui/material/Stepper';
import MenuItem from '@mui/material/MenuItem';
import StepLabel from '@mui/material/StepLabel';
import CardHeader from '@mui/material/CardHeader';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import InputAdornment from '@mui/material/InputAdornment';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useComissoes } from 'src/hooks/use-comissoes';
import { useProductsByCategory } from 'src/hooks/use-products';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { Form, Field } from 'src/components/hook-form';

// ----------------------------------------------------------------------

const STEPS = ['Configuração Básica', 'Distribuição'];

// ----------------------------------------------------------------------
// SCHEMAS DE VALIDAÇÃO
// ----------------------------------------------------------------------

// Schema para participante
const ParticipanteSchema = zod.object({
  tipo: zod.enum([
    'imobiliaria',
    'corretor_principal',
    'corretor_suporte',
    'coordenador',
    'grupo',
    'captador',
  ] as const),
  percentual: zod.coerce
    .number()
    .min(0.01, 'Percentual deve ser maior que 0')
    .max(100, 'Percentual não pode ser maior que 100'),
});

// Schema principal do formulário
const ComissaoFormSchema = zod.object({
  // Configuração básica
  nome: zod.string().min(1, 'Nome é obrigatório'),
  descricao: zod.string().optional(),
  categoriaProduto: zod.enum(['imovel', 'terreno', 'empreendimento'] as const),
  produtoId: zod.string().min(1, 'Produto é obrigatório'),
  percentualVenda: zod.coerce
    .number()
    .min(0.01, 'Percentual deve ser maior que 0')
    .max(100, 'Percentual não pode ser maior que 100'),

  // Distribuição
  participantes: zod.array(ParticipanteSchema).min(1, 'Pelo menos um participante é obrigatório'),

  // Metadados
  tipoComissao: zod.literal('total_imobiliaria'),
  status: zod.enum(['ativo', 'inativo'] as const).default('ativo'),
});

type ComissaoFormData = zod.infer<typeof ComissaoFormSchema>;

// ----------------------------------------------------------------------
// TIPOS E CONSTANTES
// ----------------------------------------------------------------------

const TIPOS_PARTICIPANTE = [
  { value: 'imobiliaria', label: 'Imobiliária' },
  { value: 'corretor_principal', label: 'Corretor Principal' },
  { value: 'corretor_suporte', label: 'Corretor Suporte' },
  { value: 'coordenador', label: 'Coordenador' },
  { value: 'grupo', label: 'Grupo' },
  { value: 'captador', label: 'Captador' },
] as const;

type Props = {
  currentComissao?: IComissaoItem;
};

// ----------------------------------------------------------------------
// COMPONENTE PRINCIPAL
// ----------------------------------------------------------------------

export function ComissaoNewEditForm({ currentComissao }: Props) {
  const router = useRouter();
  const [activeStep, setActiveStep] = useState(0);
  const [mensagemErroParticipante, setMensagemErroParticipante] = useState<string>('');

  // Estado para categoria selecionada
  const [categoriaAtual, setCategoriaAtual] = useState<string>('imovel');

  // Hook para buscar produtos baseado na categoria
  const {
    products: produtosFiltrados,
    loading: loadingProdutos,
    error: errorProdutos,
  } = useProductsByCategory(categoriaAtual);

  // Hook para gerenciar comissões
  const { createComissao, updateComissao } = useComissoes();

  // Valores padrão do formulário
  const defaultValues: ComissaoFormData = {
    nome: currentComissao?.nome || '',
    descricao: currentComissao?.descricao || '',
    categoriaProduto: 'imovel',
    produtoId: '',
    percentualVenda: 0,
    participantes: [],
    tipoComissao: 'total_imobiliaria',
    status: 'ativo',
  };

  // Configuração do formulário
  const methods = useForm<ComissaoFormData>({
    resolver: zodResolver(ComissaoFormSchema),
    defaultValues,
    mode: 'onChange', // Validação em tempo real
  });

  const {
    watch,
    control,
    setValue,
    handleSubmit,
    getValues,
    formState: { isSubmitting, isValid, isDirty, errors },
  } = methods;

  // Field array para participantes
  const {
    fields: participantes,
    append: adicionarParticipante,
    remove: removerParticipante,
  } = useFieldArray({
    control,
    name: 'participantes',
  });

  // Trigger de validação automática quando campos são preenchidos
  useEffect(() => {
    // Monitorar mudanças nos campos dos participantes
    const subscription = watch((value, { name }) => {
      if (name && name.startsWith('participantes.')) {
        console.log('🔄 Campo de participante alterado:', { name, value: value.participantes });
        // A validação será automaticamente executada devido ao useMemo
      }
    });

    return () => subscription.unsubscribe();
  }, [watch]);

  // ----------------------------------------------------------------------
  // LÓGICA DE PRODUTOS - INTEGRAÇÃO COM BACKEND
  // ----------------------------------------------------------------------

  // Observar mudanças na categoria do formulário
  const categoriaProdutoWatch = watch('categoriaProduto');

  useEffect(() => {
    if (categoriaProdutoWatch && categoriaProdutoWatch !== categoriaAtual) {
      // Atualizar categoria para buscar novos produtos
      setCategoriaAtual(categoriaProdutoWatch);
      // Limpar seleção de produto quando categoria muda
      setValue('produtoId', '');
    }
  }, [categoriaProdutoWatch, categoriaAtual, setValue]);

  // ----------------------------------------------------------------------
  // VALIDAÇÕES
  // ----------------------------------------------------------------------

  // Validação do primeiro passo
  const nome = watch('nome');
  const produtoId = watch('produtoId');
  const percentualVenda = watch('percentualVenda');

  const primeiroPassoValido = useMemo(() => {
    const dadosAtual = {
      nome,
      categoriaProduto: categoriaProdutoWatch,
      produtoId,
      percentualVenda,
    };

    // Verificar se todos os campos obrigatórios estão preenchidos
    const temNome = dadosAtual.nome && dadosAtual.nome.trim().length > 0;
    const temCategoria = dadosAtual.categoriaProduto;
    const temProduto = dadosAtual.produtoId && dadosAtual.produtoId.trim().length > 0;
    const temPercentual = dadosAtual.percentualVenda && dadosAtual.percentualVenda > 0;

    // Validação concluída
    return temNome && temCategoria && temProduto && temPercentual;
  }, [nome, categoriaProdutoWatch, produtoId, percentualVenda]);

  // Dados dos participantes - validação automática em tempo real
  const participantesData = useMemo(() => {
    const watchedData = watch('participantes') || [];

    // Combinar dados do watch com dados dos fields existentes
    const dadosCombinados = [];

    // Para cada field existente, verificar se tem dados válidos
    for (let i = 0; i < participantes.length; i++) {
      const watchedItem = watchedData[i];
      const fieldData = getValues(`participantes.${i}`);

      // Usar dados do watch se disponíveis, senão usar dados do field
      const dadosParticipante = watchedItem || fieldData;

      // Só incluir se tiver dados válidos (tipo e percentual preenchidos)
      if (
        dadosParticipante &&
        dadosParticipante.tipo &&
        dadosParticipante.percentual !== undefined &&
        dadosParticipante.percentual !== null &&
        String(dadosParticipante.percentual).trim() !== ''
      ) {
        dadosCombinados.push(dadosParticipante);
      }
    }

    console.log('🔍 participantesData atualizado:', {
      watchedData,
      fieldsLength: participantes.length,
      dadosCombinados,
      validCount: dadosCombinados.length,
    });

    return dadosCombinados;
  }, [watch, participantes, getValues]);

  // Cálculo do percentual total - usando watch diretamente para atualizações em tempo real
  const participantesWatched = watch('participantes');
  const percentualTotal = useMemo(() => {
    const participantesAtuais = participantesWatched || [];
    const total = participantesAtuais.reduce((sum, p) => {
      const percentual =
        typeof p?.percentual === 'number' ? p.percentual : parseFloat(p?.percentual) || 0;
      return sum + percentual;
    }, 0);

    // Arredondar para evitar problemas de precisão de ponto flutuante
    return Math.round(total * 100) / 100;
  }, [participantesWatched]);

  // Validação do segundo passo
  const segundoPassoValido = useMemo(() => {
    // Debug logs para diagnóstico
    console.log('🔍 Validação do segundo passo:', {
      participantesData,
      participantesFields: participantes,
      percentualTotal,
      participantesLength: participantesData.length,
      fieldsLength: participantes.length,
    });

    // Deve ter pelo menos um participante
    if (participantesData.length === 0) {
      console.log('❌ Validação falhou: Nenhum participante');
      return false;
    }

    // Usar participantesData diretamente
    const dadosParaValidar = participantesData;

    console.log('📋 Dados para validar:', dadosParaValidar);

    // Validação mais robusta dos participantes
    const participantesValidos = dadosParaValidar.filter((p, index) => {
      // Verificar se o participante existe
      if (!p) {
        console.log(`❌ Participante ${index + 1}: objeto nulo/undefined`);
        return false;
      }

      // Verificar tipo - deve ser string não vazia
      const tipoValido = p.tipo && typeof p.tipo === 'string' && p.tipo.trim() !== '';
      if (!tipoValido) {
        console.log(`❌ Participante ${index + 1}: tipo inválido`, {
          tipo: p.tipo,
          tipoType: typeof p.tipo,
        });
        return false;
      }

      // Verificar percentual - aceitar string ou número, mas deve ser > 0
      let percentualNumerico = 0;
      if (typeof p.percentual === 'number') {
        percentualNumerico = p.percentual;
      } else if (typeof p.percentual === 'string') {
        const percentualParsed = parseFloat(p.percentual);
        percentualNumerico = isNaN(percentualParsed) ? 0 : percentualParsed;
      }

      const percentualValido = percentualNumerico > 0;
      if (!percentualValido) {
        console.log(`❌ Participante ${index + 1}: percentual inválido`, {
          percentual: p.percentual,
          percentualType: typeof p.percentual,
          percentualNumerico,
        });
        return false;
      }

      console.log(`✅ Participante ${index + 1}: válido`, {
        tipo: p.tipo,
        percentual: p.percentual,
        percentualNumerico,
      });
      return true;
    });

    const todosValidos = participantesValidos.length === dadosParaValidar.length;

    console.log('📊 Participantes válidos:', {
      total: dadosParaValidar.length,
      validos: participantesValidos.length,
      todosValidos,
      participantesDetalhes: dadosParaValidar.map((p, i) => ({
        index: i + 1,
        tipo: p?.tipo,
        percentual: p?.percentual,
        tipoType: typeof p?.tipo,
        percentualType: typeof p?.percentual,
      })),
    });

    if (!todosValidos) {
      console.log('❌ Validação falhou: Participantes inválidos');
      return false;
    }

    // Total deve estar próximo de 100% (margem de erro de 0.1%)
    const margemErro = Math.abs(percentualTotal - 100);
    const percentualValido = margemErro <= 0.1;

    console.log('💯 Validação percentual:', {
      percentualTotal,
      margemErro,
      percentualValido,
    });

    if (!percentualValido) {
      console.log('❌ Validação falhou: Percentual total inválido');
      return false;
    }

    // Não deve haver tipos duplicados
    const tipos = dadosParaValidar
      .map((p) => p?.tipo)
      .filter((tipo) => tipo && typeof tipo === 'string' && tipo.trim() !== '');
    const tiposUnicos = new Set(tipos);
    const semDuplicados = tipos.length === tiposUnicos.size;

    console.log('🔄 Validação tipos:', {
      tipos,
      tiposUnicos: Array.from(tiposUnicos),
      semDuplicados,
    });

    if (!semDuplicados) {
      console.log('❌ Validação falhou: Tipos duplicados');
      return false;
    }

    console.log('✅ Validação do segundo passo: APROVADA');
    return true;
  }, [participantesData, percentualTotal, participantes]);

  // ----------------------------------------------------------------------
  // HANDLERS
  // ----------------------------------------------------------------------

  const handleProximo = () => {
    setActiveStep((prev) => prev + 1);
  };

  const handleVoltar = () => {
    setActiveStep((prev) => prev - 1);
  };

  const handleAdicionarParticipante = () => {
    // Limpar mensagem de erro anterior
    setMensagemErroParticipante('');

    // Verificar se já atingiu o limite máximo
    if (participantes.length >= 6) {
      setMensagemErroParticipante('Limite máximo de 6 participantes atingido.');
      return;
    }

    // Verificar quantos tipos já foram selecionados
    const tiposSelecionados = participantesData.map((p) => p?.tipo).filter(Boolean);
    const tiposDisponiveis = TIPOS_PARTICIPANTE.filter(
      (tipo) => !tiposSelecionados.includes(tipo.value)
    );

    // Se todos os tipos estão ocupados, mostrar alerta
    if (tiposDisponiveis.length === 0) {
      setMensagemErroParticipante(
        'Todos os tipos de participantes já foram adicionados. Remova um participante existente para adicionar um novo tipo.'
      );
      return;
    }

    // Adicionar novo participante se há tipos disponíveis
    adicionarParticipante({
      tipo: '' as any,
      percentual: 0,
    });
  };

  const onSubmit = handleSubmit(
    async (data) => {
      console.log('🚀 onSubmit chamado com sucesso!');
      console.log('📋 Dados do formulário:', data);
      console.log('👥 Participantes:', data.participantes);
      console.log('📊 Validação segundo passo:', segundoPassoValido);

      try {
        console.log('⏳ Iniciando salvamento...');

        // Preparar dados para a API
        const comissaoData = {
          nome: data.nome,
          descricao: data.descricao,
          tipo: 'total_imobiliaria' as const,
          tipoProduto: data.categoriaProduto,
          percentualTotal: data.percentualVenda,
          produtoId: data.produtoId,
          participantes: data.participantes.map(p => ({
            tipo: p.tipo,
            percentual: p.percentual,
            ativo: true,
            fixo: false,
            obrigatorio: false
          })),
          status: data.status,
          realEstateId: '68b1df705757655b21fc5210' // ID da imobiliária (deve vir do contexto do usuário)
        };

        if (currentComissao) {
          await updateComissao(currentComissao.id, comissaoData);
          toast.success('Comissão atualizada com sucesso!');
        } else {
          await createComissao(comissaoData);
          toast.success('Comissão criada com sucesso!');
        }

        console.log('✅ Salvamento concluído!');
        console.log('🔄 Redirecionando...');
        router.push(paths.dashboard.comissoes.root);
      } catch (error: any) {
        console.error('❌ Erro no salvamento:', error);

        // Tratamento de erro mais específico para API
        if (error.response?.status === 422) {
          const validationErrors = error.response?.data?.errors || {};
          const errorMessages = Object.entries(validationErrors)
            .map(([field, messages]: [string, any]) => {
              const errorList = Array.isArray(messages) ? messages : [messages];
              return `${field}: ${errorList.join(', ')}`;
            })
            .join('\n');

          toast.error(`Erro de validação:\n${errorMessages}`);
        } else if (error.response?.status === 500) {
          toast.error('Erro interno do servidor. Tente novamente mais tarde.');
        } else if (error.message) {
          toast.error(`Erro: ${error.message}`);
        } else {
          toast.error('Erro ao salvar comissão. Tente novamente.');
        }
      }
    },
    (validationErrors) => {
      console.error('❌ Erros de validação do formulário:', validationErrors);
      console.log('📋 Dados atuais do formulário:', getValues());
      console.log('🔍 Estado de validação:', {
        isValid,
        isSubmitting,
        isDirty,
        segundoPassoValido,
        participantesData,
      });

      // Mostrar toast com informações dos erros
      const errorMessages = Object.entries(validationErrors)
        .map(([field, error]) => `${field}: ${error?.message || 'Erro desconhecido'}`)
        .join(', ');

      toast.error(`Erros de validação: ${errorMessages}`);
    }
  );

  // ----------------------------------------------------------------------
  // RENDER DOS PASSOS
  // ----------------------------------------------------------------------

  const renderPrimeiroPasso = () => (
    <Stack spacing={4}>
      <Box>
        <Typography variant="h5" sx={{ color: 'text.primary', fontWeight: 700, mb: 1 }}>
          Configuração Básica
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Defina as informações básicas da regra de comissão
        </Typography>
      </Box>

      <Card sx={{ p: 3 }}>
        <Stack spacing={3}>
          <Field.Text
            name="nome"
            label="Nome da Regra"
            placeholder="Ex: Comissão Apartamentos"
            required
          />

          <Field.Text
            name="descricao"
            label="Descrição"
            placeholder="Descrição opcional"
            multiline
            rows={3}
          />

          <Field.Select name="categoriaProduto" label="Categoria do Produto" required>
            <MenuItem value="imovel">Imóvel</MenuItem>
            <MenuItem value="terreno">Terreno</MenuItem>
            <MenuItem value="empreendimento">Empreendimento</MenuItem>
          </Field.Select>

          {/* Campo de seleção de produto com loading e tratamento de erro */}
          <Field.Select
            name="produtoId"
            label="Escolha o produto"
            required
            disabled={loadingProdutos}
          >
            <MenuItem value="">
              {loadingProdutos ? 'Carregando produtos...' : 'Selecione um produto'}
            </MenuItem>
            {!loadingProdutos &&
              !errorProdutos &&
              produtosFiltrados.map((produto) => (
                <MenuItem key={produto.id} value={produto.id}>
                  {produto.nome}
                </MenuItem>
              ))}
            {!loadingProdutos && errorProdutos && (
              <MenuItem value="" disabled>
                Erro ao carregar produtos
              </MenuItem>
            )}
            {!loadingProdutos && !errorProdutos && produtosFiltrados.length === 0 && (
              <MenuItem value="" disabled>
                Nenhum produto encontrado
              </MenuItem>
            )}
          </Field.Select>

          {/* Mensagem de erro para produtos */}
          {errorProdutos && (
            <Alert severity="error" sx={{ mt: 1 }}>
              {errorProdutos}
            </Alert>
          )}

          <Field.Text
            name="percentualVenda"
            label="Percentual sobre Venda"
            type="number"
            required
            InputProps={{
              endAdornment: <InputAdornment position="end">%</InputAdornment>,
            }}
          />
        </Stack>
      </Card>

      {/* Feedback de validação */}
      {!primeiroPassoValido && (
        <Alert severity="info">Preencha todos os campos obrigatórios para continuar</Alert>
      )}
    </Stack>
  );

  const renderSegundoPasso = () => (
    <Stack spacing={4}>
      <Box>
        <Typography variant="h5" sx={{ color: 'text.primary', fontWeight: 700, mb: 1 }}>
          Distribuição de Comissões
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Configure como a comissão será distribuída entre os participantes
        </Typography>
      </Box>

      {/* Resumo da comissão */}
      <Card sx={{ p: 3, bgcolor: 'background.neutral' }}>
        <Stack spacing={3}>
          {/* Nome da Regra */}
          <Stack spacing={1}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, color: 'text.primary' }}>
              {watch('nome') || 'Nome da Regra'}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {watch('descricao') || 'Sem descrição'}
            </Typography>
          </Stack>

          <Divider />

          {/* Informações do Produto */}
          <Stack spacing={2}>
            <Stack direction="row" spacing={2} alignItems="center">
              <Iconify
                icon={
                  categoriaProdutoWatch === 'imovel'
                    ? 'mdi:home'
                    : categoriaProdutoWatch === 'terreno'
                      ? 'mdi:terrain'
                      : 'mdi:city'
                }
                sx={{ color: 'primary.main' }}
              />
              <Stack>
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  {categoriaProdutoWatch === 'imovel'
                    ? 'Imóvel'
                    : categoriaProdutoWatch === 'terreno'
                      ? 'Terreno'
                      : 'Empreendimento'}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Categoria do produto
                </Typography>
              </Stack>
            </Stack>

            {watch('produtoId') && (
              <Stack direction="row" spacing={2} alignItems="center">
                <Iconify icon="mdi:tag" sx={{ color: 'info.main' }} />
                <Stack>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {produtosFiltrados.find((p) => p.id === watch('produtoId'))?.nome ||
                      'Produto selecionado'}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Produto específico
                  </Typography>
                </Stack>
              </Stack>
            )}

            <Stack direction="row" spacing={2} alignItems="center">
              <Iconify icon="mdi:percent" sx={{ color: 'success.main' }} />
              <Stack>
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  {watch('percentualVenda') || 0}% sobre a venda
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Percentual de comissão
                </Typography>
              </Stack>
            </Stack>
          </Stack>
        </Stack>
      </Card>

      {/* Lista de participantes */}
      <Stack spacing={2}>
        {participantes.map((field, index) => {
          // Obter dados atuais dos participantes em tempo real
          const participantesAtuais = watch('participantes') || [];

          // Filtrar tipos já selecionados, excluindo o índice atual
          const tiposSelecionados = participantesAtuais
            .map((p, idx) => ({ tipo: p?.tipo, index: idx }))
            .filter((item) => item.tipo && item.index !== index)
            .map((item) => item.tipo);

          return (
            <Card key={field.id} sx={{ p: 3 }}>
              <Stack spacing={2}>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Typography variant="subtitle2">Participante {index + 1}</Typography>
                  <IconButton
                    onClick={() => {
                      removerParticipante(index);
                      // Limpar mensagem de erro ao remover participante
                      setMensagemErroParticipante('');
                    }}
                    color="error"
                    size="small"
                  >
                    <Iconify icon="mingcute:delete-2-line" />
                  </IconButton>
                </Stack>

                <Stack direction="row" spacing={2}>
                  <Field.Select
                    name={`participantes.${index}.tipo`}
                    label="Tipo de Participante"
                    sx={{ flex: 1 }}
                  >
                    <MenuItem value="" disabled>
                      Selecionar tipo
                    </MenuItem>
                    {TIPOS_PARTICIPANTE.map((tipo) => {
                      const isDisabled = tiposSelecionados.includes(tipo.value);
                      return (
                        <MenuItem key={tipo.value} value={tipo.value} disabled={isDisabled}>
                          {tipo.label}
                          {isDisabled && (
                            <Typography
                              component="span"
                              variant="caption"
                              color="text.secondary"
                              sx={{ ml: 1 }}
                            >
                              (já selecionado)
                            </Typography>
                          )}
                        </MenuItem>
                      );
                    })}
                  </Field.Select>

                  <Field.Text
                    name={`participantes.${index}.percentual`}
                    label="Percentual"
                    type="number"
                    sx={{ flex: 1 }}
                    InputProps={{
                      endAdornment: <InputAdornment position="end">%</InputAdornment>,
                    }}
                  />
                </Stack>
              </Stack>
            </Card>
          );
        })}
      </Stack>

      {/* Mensagem de erro para participantes duplicados */}
      {mensagemErroParticipante && (
        <Alert severity="error" onClose={() => setMensagemErroParticipante('')}>
          {mensagemErroParticipante}
        </Alert>
      )}

      {/* Botão adicionar participante */}
      <Button
        onClick={handleAdicionarParticipante}
        variant="outlined"
        size="large"
        startIcon={<Iconify icon="mingcute:add-line" />}
        sx={{ alignSelf: 'center' }}
        disabled={participantes.length >= 6}
      >
        Adicionar Participante
      </Button>

      {/* Informação sobre limite de participantes */}
      {participantes.length >= 6 && !mensagemErroParticipante && (
        <Alert severity="info">Limite máximo de 6 participantes atingido</Alert>
      )}

      {/* Validações */}
      {percentualTotal > 100 && (
        <Alert severity="error">O total da distribuição não pode exceder 100%</Alert>
      )}

      {percentualTotal < 100 && participantes.length > 0 && (
        <Alert severity="warning">
          Faltam {(100 - (typeof percentualTotal === 'number' ? percentualTotal : 0)).toFixed(1)}%
          para completar a distribuição
        </Alert>
      )}

      {Math.abs(percentualTotal - 100) <= 0.1 && percentualTotal > 0 && (
        <Alert severity="success">Distribuição completa! ✓</Alert>
      )}
    </Stack>
  );

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return renderPrimeiroPasso();
      case 1:
        return renderSegundoPasso();
      default:
        return null;
    }
  };

  // ----------------------------------------------------------------------
  // RENDER PRINCIPAL
  // ----------------------------------------------------------------------

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Card>
        <CardHeader
          title={currentComissao ? 'Editar Comissão' : 'Nova Comissão'}
          subheader="Configure as regras de distribuição de comissão"
          sx={{ pb: 3 }}
        />

        <Divider />

        <Box sx={{ p: 3 }}>
          {/* Stepper */}
          <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
            {STEPS.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          {/* Conteúdo do passo */}
          {renderStepContent(activeStep)}

          {/* Botões de navegação */}
          <Stack direction="row" justifyContent="space-between" sx={{ mt: 4 }}>
            <Button
              disabled={activeStep === 0}
              onClick={handleVoltar}
              variant="outlined"
              size="large"
            >
              Voltar
            </Button>

            {activeStep === STEPS.length - 1 ? (
              <LoadingButton
                type="submit"
                variant="contained"
                size="large"
                loading={isSubmitting}
                disabled={!segundoPassoValido}
                sx={{ minWidth: 120 }}
                onClick={() => {
                  console.log('🖱️ Botão Criar/Atualizar clicado!');
                  console.log('🔍 Estado atual:', {
                    segundoPassoValido,
                    isSubmitting,
                    activeStep,
                    participantesData,
                    isValid,
                    errors,
                    percentualTotal,
                    botaoHabilitado: segundoPassoValido,
                  });
                }}
              >
                {currentComissao ? 'Atualizar' : 'Criar'}
              </LoadingButton>
            ) : (
              <Button
                onClick={handleProximo}
                variant="contained"
                size="large"
                disabled={!primeiroPassoValido}
                sx={{ minWidth: 120 }}
              >
                Próximo
              </Button>
            )}
          </Stack>
        </Box>
      </Card>
    </Form>
  );
}
