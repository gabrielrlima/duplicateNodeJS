import type { IPropertyItem } from 'src/types/property';

import { z as zod } from 'src/lib/zod-config';
import { useCallback } from 'react';
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

import { createProperty, updateProperty } from 'src/actions/property';
import { PROPERTY_TYPE_OPTIONS, PROPERTY_STATUS_OPTIONS } from 'src/_mock/_property';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { Form, Field, schemaHelper } from 'src/components/hook-form';

// ----------------------------------------------------------------------

export type NewPropertySchemaType = zod.infer<typeof NewPropertySchema>;

export const NewPropertySchema = zod.object({
  titulo: zod.string().min(1, { message: 'Título é obrigatório!' }),
  descricao: zod.string().min(1, { message: 'Descrição é obrigatória!' }),
  area: zod.coerce.number().positive({ message: 'Área deve ser maior que 0!' }),
  preco: zod.coerce.number().positive({ message: 'Preço deve ser maior que 0!' }),
  status: zod.string().min(1, { message: 'Status é obrigatório!' }),
  tipo: zod.string().min(1, { message: 'Tipo é obrigatório!' }),
  condicao: zod.string().min(1, { message: 'Condição é obrigatória!' }),
  negociavel: zod.boolean(),
  observacoes: zod.string().optional(),
  imagens: schemaHelper.files({ message: 'Imagens são obrigatórias!' }),

  // Localização
  localizacao: zod.object({
    endereco: zod.string().min(1, { message: 'Endereço é obrigatório!' }),
    numero: zod.string().min(1, { message: 'Número é obrigatório!' }),
    complemento: zod.string().optional(),
    bairro: zod.string().min(1, { message: 'Bairro é obrigatório!' }),
    cidade: zod.string().min(1, { message: 'Cidade é obrigatória!' }),
    estado: zod.string().min(1, { message: 'Estado é obrigatório!' }),
    cep: zod.string().min(8, { message: 'CEP deve ter 8 dígitos!' }),
  }),

  // Proprietário
  proprietario: zod.object({
    nome: zod.string().min(1, { message: 'Nome do proprietário é obrigatório!' }),
    email: zod.string().email({ message: 'Email deve ser válido!' }),
    telefone: zod.string().min(1, { message: 'Telefone é obrigatório!' }),
    documento: zod.string().min(1, { message: 'Documento é obrigatório!' }),
  }),

  // Características
  caracteristicas: zod.object({
    quartos: zod.coerce
      .number()
      .min(0, { message: 'Quantidade de quartos deve ser maior ou igual a 0!' }),
    banheiros: zod.coerce.number().min(1, { message: 'Deve ter pelo menos 1 banheiro!' }),
    suites: zod.coerce.number().min(0).optional(),
    vagasGaragem: zod.coerce.number().min(0).optional(),
    andar: zod.string().optional(),
    elevador: zod.boolean().optional(),
    mobiliado: zod.boolean().optional(),
  }),

  // Comodidades
  comodidades: zod.object({
    // Comodidades internas
    varanda: zod.boolean().optional(),
    churrasqueira: zod.boolean().optional(),
    piscina: zod.boolean().optional(),
    arCondicionado: zod.boolean().optional(),
    cozinhaAmericana: zod.boolean().optional(),
    jardim: zod.boolean().optional(),

    // Comodidades do condomínio
    playground: zod.boolean().optional(),
    piscinaCondominio: zod.boolean().optional(),
    churrasqueiraCondominio: zod.boolean().optional(),
    academia: zod.boolean().optional(),
    salaoFestas: zod.boolean().optional(),
    lavanderia: zod.boolean().optional(),
    espacoGourmet: zod.boolean().optional(),
    recepcao24h: zod.boolean().optional(),
    rampasAcesso: zod.boolean().optional(),
    salaoJogos: zod.boolean().optional(),
    quadraEsportes: zod.boolean().optional(),
    sauna: zod.boolean().optional(),
    brinquedoteca: zod.boolean().optional(),
    corrimao: zod.boolean().optional(),
    vagaDeficiente: zod.boolean().optional(),
    areaVerde: zod.boolean().optional(),
  }),

  // Valores
  valores: zod.object({
    valorCondominio: zod.coerce.number().min(0).optional(),
    valorIPTU: zod.coerce.number().min(0).optional(),
    aceitaFinanciamento: zod.boolean().optional(),
    aceitaFGTS: zod.boolean().optional(),
  }),

  // Campos não obrigatórios
  codigo: zod.string(),
  precoM2: zod.coerce.number(),
});

// ----------------------------------------------------------------------

type Props = {
  currentProperty?: IPropertyItem;
};

export function PropertyNewEditForm({ currentProperty }: Props) {
  const router = useRouter();

  const loadingSave = useBoolean();
  // Funções importadas diretamente

  const defaultValues: NewPropertySchemaType = {
    codigo: 'PROP-001',
    titulo: '',
    descricao: '',
    area: 0,
    preco: 0,
    precoM2: 0,
    status: 'Em andamento',
    tipo: 'Apartamento',
    condicao: 'novo',
    negociavel: false,
    observacoes: '',
    imagens: [],
    localizacao: {
      endereco: '',
      numero: '',
      complemento: '',
      bairro: '',
      cidade: '',
      estado: '',
      cep: '',
    },
    proprietario: {
      nome: '',
      email: '',
      telefone: '',
      documento: '',
    },
    caracteristicas: {
      quartos: 0,
      banheiros: 1,
      suites: 0,
      vagasGaragem: 0,
      andar: '',
      elevador: false,
      mobiliado: false,
    },
    comodidades: {
      varanda: false,
      churrasqueira: false,
      piscina: false,
      arCondicionado: false,
      cozinhaAmericana: false,
      jardim: false,
      playground: false,
      piscinaCondominio: false,
      churrasqueiraCondominio: false,
      academia: false,
      salaoFestas: false,
      lavanderia: false,
      espacoGourmet: false,
      recepcao24h: false,
      rampasAcesso: false,
      salaoJogos: false,
      quadraEsportes: false,
      sauna: false,
      brinquedoteca: false,
      corrimao: false,
      vagaDeficiente: false,
      areaVerde: false,
    },
    valores: {
      valorCondominio: 0,
      valorIPTU: 0,
      aceitaFinanciamento: false,
      aceitaFGTS: false,
    },
  };

  const methods = useForm<NewPropertySchemaType>({
    mode: 'all',
    resolver: zodResolver(NewPropertySchema),
    defaultValues,
    values: currentProperty
      ? {
          codigo: currentProperty.id || 'PROP-001',
          titulo: currentProperty.title || '',
          descricao: currentProperty.description || '',
          area: currentProperty.area || 0,
          preco: currentProperty.value || 0,
          precoM2: currentProperty.pricePerSquareMeter || 0,
          status: currentProperty.status || 'Em andamento',
          tipo: currentProperty.tipo || 'apartamento',
          condicao: currentProperty.caracteristicas?.condicao || 'novo',
          negociavel: false,
          observacoes: currentProperty.description || '',
          imagens: currentProperty.imagens || [],
          localizacao: {
            endereco: currentProperty.address || '',
            numero: currentProperty.number || '',
            complemento: currentProperty.complement || '',
            bairro: currentProperty.neighborhood || '',
            cidade: currentProperty.city || '',
            estado: currentProperty.state || '',
            cep: currentProperty.zipCode || '',
          },
          proprietario: {
            nome: currentProperty.owner?.name || '',
            email: currentProperty.owner?.email || '',
            telefone: currentProperty.owner?.phone || '',
            documento: currentProperty.owner?.document || '',
          },
          caracteristicas: {
            quartos: currentProperty.bedrooms || 0,
            banheiros: currentProperty.bathrooms || 1,
            suites: currentProperty.suites || 0,
            vagasGaragem: currentProperty.parkingSpaces || 0,
            andar: currentProperty.caracteristicas?.andar || '',
            elevador: currentProperty.elevator || false,
            mobiliado: currentProperty.furnished || false,
          },
          comodidades: {
            varanda: false,
            churrasqueira: false,
            piscina: false,
            arCondicionado: false,
            cozinhaAmericana: false,
            jardim: false,
            playground: false,
            piscinaCondominio: false,
            churrasqueiraCondominio: false,
            academia: false,
            salaoFestas: false,
            lavanderia: false,
            espacoGourmet: false,
            recepcao24h: false,
            rampasAcesso: false,
            salaoJogos: false,
            quadraEsportes: false,
            sauna: false,
            brinquedoteca: false,
            corrimao: false,
            vagaDeficiente: false,
            areaVerde: false,
          },
          valores: {
            valorCondominio: currentProperty.condominiumFee || 0,
            valorIPTU: currentProperty.iptu || 0,
            aceitaFinanciamento: currentProperty.acceptsFinancing || false,
            aceitaFGTS: currentProperty.acceptsExchange || false,
          },
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

  const handleSave = handleSubmit(async (data) => {
    loadingSave.onTrue();

    try {
      if (currentProperty) {
        // Atualizar imóvel existente
        await updateProperty(currentProperty.id, data);
        toast.success('Imóvel atualizado com sucesso!');
      } else {
        // Criar novo imóvel
        await createProperty(data);
        toast.success('Imóvel criado com sucesso!');
      }

      reset();
      loadingSave.onFalse();
      router.push(paths.dashboard.property.root);

      console.info('DATA', JSON.stringify(data, null, 2));
    } catch (error) {
      console.error(error);
      const errorMessage = error instanceof Error ? error.message : 'Erro ao salvar imóvel!';
      toast.error(errorMessage);
      loadingSave.onFalse();
    }
  });

  return (
    <Form methods={methods}>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 8 }}>
          <Card sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 3 }}>
              Informações Básicas
            </Typography>

            <Stack spacing={3}>
              <Field.Text
                name="titulo"
                label="Título do imóvel"
                placeholder="Ex: Apartamento 3 quartos com vista para o mar"
              />

              <Field.Text
                name="descricao"
                label="Descrição"
                multiline
                rows={3}
                placeholder="Descreva as principais características e diferenciais do imóvel..."
              />

              <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 4 }}>
                  <Field.Text
                    name="area"
                    label="Área (m²)"
                    type="number"
                    placeholder="120"
                    onBlur={handleAreaOrPrecoChange}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                  <Field.Text
                    name="preco"
                    label="Preço (R$)"
                    type="number"
                    placeholder="450000"
                    onBlur={handleAreaOrPrecoChange}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                  <Field.Text name="precoM2" label="Preço/m² (R$)" type="number" disabled />
                </Grid>
              </Grid>

              <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 4 }}>
                  <Field.Select name="tipo" label="Tipo de Imóvel">
                    {PROPERTY_TYPE_OPTIONS.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Field.Select>
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                  <Field.Select name="condicao" label="Condição">
                    <MenuItem value="novo">Novo</MenuItem>
                    <MenuItem value="usado">Usado</MenuItem>
                    <MenuItem value="reformado">Reformado</MenuItem>
                  </Field.Select>
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                  <Field.Select name="status" label="Status">
                    {PROPERTY_STATUS_OPTIONS.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Field.Select>
                </Grid>
              </Grid>

              <Field.Switch name="negociavel" label="Preço negociável" />

              <Field.Text
                name="observacoes"
                label="Observações"
                multiline
                rows={2}
                placeholder="Informações adicionais sobre o imóvel..."
              />
            </Stack>
          </Card>

          <Card sx={{ p: 3, mt: 3 }}>
            <Typography variant="h6" sx={{ mb: 3 }}>
              Localização
            </Typography>

            <Stack spacing={3}>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 8 }}>
                  <Field.Text
                    name="localizacao.endereco"
                    label="Endereço"
                    placeholder="Rua das Flores"
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                  <Field.Text name="localizacao.numero" label="Número" placeholder="123" />
                </Grid>
              </Grid>

              <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Field.Text
                    name="localizacao.complemento"
                    label="Complemento"
                    placeholder="Apto 45, Bloco B"
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Field.Text name="localizacao.bairro" label="Bairro" placeholder="Centro" />
                </Grid>
              </Grid>

              <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 4 }}>
                  <Field.Text name="localizacao.cidade" label="Cidade" placeholder="São Paulo" />
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                  <Field.Text name="localizacao.estado" label="Estado" placeholder="SP" />
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                  <Field.Text name="localizacao.cep" label="CEP" placeholder="01234-567" />
                </Grid>
              </Grid>
            </Stack>
          </Card>

          <Card sx={{ p: 3, mt: 3 }}>
            <Typography variant="h6" sx={{ mb: 3 }}>
              Características do Imóvel
            </Typography>

            <Stack spacing={3}>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 3 }}>
                  <Field.Text
                    name="caracteristicas.quartos"
                    label="Quartos"
                    type="number"
                    placeholder="3"
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 3 }}>
                  <Field.Text
                    name="caracteristicas.banheiros"
                    label="Banheiros"
                    type="number"
                    placeholder="2"
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 3 }}>
                  <Field.Text
                    name="caracteristicas.suites"
                    label="Suítes"
                    type="number"
                    placeholder="1"
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 3 }}>
                  <Field.Text
                    name="caracteristicas.vagasGaragem"
                    label="Vagas Garagem"
                    type="number"
                    placeholder="2"
                  />
                </Grid>
              </Grid>

              <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Field.Text name="caracteristicas.andar" label="Andar" placeholder="5º andar" />
                </Grid>
                <Grid size={{ xs: 12, md: 3 }}>
                  <Field.Switch name="caracteristicas.elevador" label="Elevador" />
                </Grid>
                <Grid size={{ xs: 12, md: 3 }}>
                  <Field.Switch name="caracteristicas.mobiliado" label="Mobiliado" />
                </Grid>
              </Grid>
            </Stack>
          </Card>

          <Card sx={{ p: 3, mt: 3 }}>
            <Typography variant="h6" sx={{ mb: 3 }}>
              Comodidades
            </Typography>

            <Stack spacing={3}>
              <Typography variant="subtitle2">Comodidades do Imóvel</Typography>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 4 }}>
                  <Field.Switch name="comodidades.varanda" label="Varanda" />
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                  <Field.Switch name="comodidades.churrasqueira" label="Churrasqueira" />
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                  <Field.Switch name="comodidades.piscina" label="Piscina" />
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                  <Field.Switch name="comodidades.arCondicionado" label="Ar Condicionado" />
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                  <Field.Switch name="comodidades.cozinhaAmericana" label="Cozinha Americana" />
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                  <Field.Switch name="comodidades.jardim" label="Jardim" />
                </Grid>
              </Grid>

              <Typography variant="subtitle2" sx={{ mt: 3 }}>
                Comodidades do Condomínio
              </Typography>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 4 }}>
                  <Field.Switch name="comodidades.playground" label="Playground" />
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                  <Field.Switch name="comodidades.piscinaCondominio" label="Piscina" />
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                  <Field.Switch name="comodidades.churrasqueiraCondominio" label="Churrasqueira" />
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                  <Field.Switch name="comodidades.academia" label="Academia" />
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                  <Field.Switch name="comodidades.salaoFestas" label="Salão de Festas" />
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                  <Field.Switch name="comodidades.lavanderia" label="Lavanderia" />
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                  <Field.Switch name="comodidades.espacoGourmet" label="Espaço Gourmet" />
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                  <Field.Switch name="comodidades.recepcao24h" label="Recepção 24h" />
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                  <Field.Switch name="comodidades.quadraEsportes" label="Quadra de Esportes" />
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                  <Field.Switch name="comodidades.sauna" label="Sauna" />
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                  <Field.Switch name="comodidades.brinquedoteca" label="Brinquedoteca" />
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                  <Field.Switch name="comodidades.areaVerde" label="Área Verde" />
                </Grid>
              </Grid>
            </Stack>
          </Card>

          <Card sx={{ p: 3, mt: 3 }}>
            <Typography variant="h6" sx={{ mb: 3 }}>
              Valores Adicionais
            </Typography>

            <Stack spacing={3}>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Field.Text
                    name="valores.valorCondominio"
                    label="Valor do Condomínio (R$)"
                    type="number"
                    placeholder="350"
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Field.Text
                    name="valores.valorIPTU"
                    label="Valor do IPTU (R$)"
                    type="number"
                    placeholder="120"
                  />
                </Grid>
              </Grid>

              <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Field.Switch name="valores.aceitaFinanciamento" label="Aceita Financiamento" />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Field.Switch name="valores.aceitaFGTS" label="Aceita FGTS" />
                </Grid>
              </Grid>
            </Stack>
          </Card>

          <Card sx={{ p: 3, mt: 3 }}>
            <Typography variant="h6" sx={{ mb: 3 }}>
              Fotos do Imóvel
            </Typography>

            <Stack spacing={1.5}>
              <Typography variant="subtitle2">Adicione fotos do imóvel</Typography>
              <Field.Upload
                multiple
                thumbnail
                name="imagens"
                maxSize={3145728}
                onRemove={handleRemoveFile}
                onRemoveAll={handleRemoveAllFiles}
                onUpload={() => console.info('ON UPLOAD')}
                helperText="Tamanho máximo: 3MB por arquivo • Formatos aceitos: JPG, PNG, WEBP"
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
              <Field.Text
                name="proprietario.nome"
                label="Nome Completo"
                placeholder="João Silva Santos"
              />
              <Field.Text
                name="proprietario.email"
                label="E-mail"
                type="email"
                placeholder="joao@email.com"
              />
              <Field.Phone
                name="proprietario.telefone"
                label="Telefone"
                country="BR"
                placeholder="(11) 99999-9999"
              />
              <Field.Document
                name="proprietario.documento"
                label="CPF/CNPJ"
              />
            </Stack>
          </Card>
        </Grid>
      </Grid>

      <Box
        sx={{
          mt: 3,
          gap: 2,
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <LoadingButton
          color="inherit"
          size="large"
          variant="outlined"
          onClick={() => router.push(paths.dashboard.property.root)}
        >
          Cancelar
        </LoadingButton>

        <LoadingButton
          size="large"
          variant="contained"
          loading={loadingSave.value && isSubmitting}
          onClick={handleSave}
          startIcon={<Iconify icon="solar:save-bold" />}
        >
          {currentProperty ? 'Atualizar' : 'Criar'} Imóvel
        </LoadingButton>
      </Box>
    </Form>
  );
}
