import { z as zod } from 'zod';
import { toast } from 'sonner';
import { useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { useBoolean } from 'minimal-shared/hooks';
import { zodResolver } from '@hookform/resolvers/zod';

import { Card, Grid, Stack, Button, MenuItem, Typography } from '@mui/material';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { createProperty } from 'src/actions/property';
import { useRealEstateContext } from 'src/contexts/real-estate-context';

import { Form, Field } from 'src/components/hook-form';

// Schema expandido com campos essenciais
const SimpleSchema = zod.object({
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
  elevador: zod.boolean().optional(),
  sacada: zod.boolean().optional(),
  temDocumentacao: zod.boolean().default(false),
  
  // Imagens
  imagens: zod.array(zod.instanceof(File)).optional(),
  
  proprietario: zod.object({
    nome: zod.string().min(1, 'Nome do proprietário é obrigatório'),
    email: zod.string().email('Email inválido').min(1, 'Email é obrigatório'),
    telefone: zod.string().min(1, 'Telefone é obrigatório'),
    documento: zod.string().min(1, 'CPF/CNPJ é obrigatório'),
  }),
});

type SimpleSchemaType = zod.infer<typeof SimpleSchema>;

export function PropertySimpleForm() {
  const router = useRouter();
  const loadingSave = useBoolean();
  const { currentRealEstate } = useRealEstateContext();

  const methods = useForm<SimpleSchemaType>({
    resolver: zodResolver(SimpleSchema),
    defaultValues: {
      titulo: '',
      descricao: '',
      preco: 0,
      precoNegociavel: false,
      area: 0,
      finalidade: 'venda' as const,
      tipo: 'apartamento' as const,
      status: 'available' as const,
      condicao: 'usado' as const,
      quartos: 0,
      banheiros: 0,
      vagasGaragem: 0,
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
      suites: 0,
      anoConstucao: '',
      elevador: false,
      sacada: false,
      temDocumentacao: false,
      imagens: [],
      proprietario: {
        nome: '',
        email: '',
        telefone: '',
        documento: '',
      },
    },
  });

  const { handleSubmit, reset } = methods;

  const onSubmit = handleSubmit(async (data) => {
    console.log('🎯 onSubmit chamado!');
    console.log('📋 Dados do formulário:', data);
    
    loadingSave.onTrue();

    try {
      console.log('🚀 Criando imóvel simples:', data);
      console.log('Imobiliária atual:', currentRealEstate);

      if (!currentRealEstate?.id) {
        console.log('⚠️ Nenhuma imobiliária selecionada. Usando ID padrão para teste.');
      }

      // Dados completos para a API
      const propertyData = {
        name: data.titulo,
        title: data.titulo,
        description: data.descricao || 'Imóvel criado via formulário expandido',
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

  const handleCancel = useCallback(() => {
    router.push(paths.dashboard.property.root);
  }, [router]);

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Card sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ mb: 3 }}>
          Criar Imóvel - Formulário Completo
        </Typography>

        <Stack spacing={4}>
          {/* Informações Básicas */}
          <Stack spacing={3}>
            <Typography variant="h6">
              Informações Básicas
            </Typography>
            
            <Field.Text 
              name="titulo" 
              label="Título do Imóvel" 
              placeholder="Ex: Apartamento 3 quartos Vila Nova"
              required
            />
            
            <Field.Text 
              name="descricao" 
              label="Descrição" 
              placeholder="Descreva as características do imóvel..."
              multiline
              rows={3}
            />

            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <Field.Number
                  name="preco"
                  label="Preço"
                  placeholder="R$ 350.000,00"
                  formatCurrency
                  required
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <Field.Number
                  name="area"
                  label="Área (m²)"
                  placeholder="Ex: 80"
                  formatThousands
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <Field.Switch
                  name="precoNegociavel"
                  label="Preço Negociável"
                />
              </Grid>
            </Grid>

            <Grid container spacing={2}>
              <Grid item xs={12} md={3}>
                <Field.Select
                  name="finalidade"
                  label="Finalidade"
                >
                  <MenuItem value="venda">Venda</MenuItem>
                  <MenuItem value="aluguel">Aluguel</MenuItem>
                  <MenuItem value="venda_aluguel">Venda e Aluguel</MenuItem>
                </Field.Select>
              </Grid>
              <Grid item xs={12} md={3}>
                <Field.Select
                  name="tipo"
                  label="Tipo"
                >
                  <MenuItem value="apartamento">Apartamento</MenuItem>
                  <MenuItem value="casa">Casa</MenuItem>
                  <MenuItem value="sobrado">Sobrado</MenuItem>
                  <MenuItem value="cobertura">Cobertura</MenuItem>
                  <MenuItem value="kitnet">Kitnet</MenuItem>
                  <MenuItem value="loft">Loft</MenuItem>
                  <MenuItem value="chacara">Chácara</MenuItem>
                  <MenuItem value="fazenda">Fazenda</MenuItem>
                  <MenuItem value="sitio">Sítio</MenuItem>
                  <MenuItem value="comercial">Comercial</MenuItem>
                  <MenuItem value="industrial">Industrial</MenuItem>
                </Field.Select>
              </Grid>
              <Grid item xs={12} md={3}>
                <Field.Select
                  name="status"
                  label="Status"
                >
                  <MenuItem value="available">Disponível</MenuItem>
                  <MenuItem value="sold">Vendido</MenuItem>
                  <MenuItem value="reserved">Reservado</MenuItem>
                </Field.Select>
              </Grid>
              <Grid item xs={12} md={3}>
                <Field.Select
                  name="condicao"
                  label="Condição"
                >
                  <MenuItem value="novo">Novo</MenuItem>
                  <MenuItem value="seminovo">Semi-novo</MenuItem>
                  <MenuItem value="usado">Usado</MenuItem>
                  <MenuItem value="reformado">Reformado</MenuItem>
                  <MenuItem value="a_reformar">A reformar</MenuItem>
                </Field.Select>
              </Grid>
            </Grid>

            <Grid container spacing={2}>
              <Grid item xs={12} md={3}>
                <Field.Number
                  name="quartos"
                  label="Quartos"
                  placeholder="Ex: 3"
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <Field.Number
                  name="suites"
                  label="Suítes"
                  placeholder="Ex: 1"
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <Field.Number
                  name="banheiros"
                  label="Banheiros"
                  placeholder="Ex: 2"
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <Field.Number
                  name="vagasGaragem"
                  label="Vagas Garagem"
                  placeholder="Ex: 1"
                />
              </Grid>
            </Grid>

            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <Field.Text
                  name="anoConstucao"
                  label="Ano de Construção"
                  placeholder="Ex: 2020"
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <Field.Switch
                  name="mobiliado"
                  label="Mobiliado"
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <Field.Switch
                  name="temDocumentacao"
                  label="Documentação Regular"
                />
              </Grid>
            </Grid>
          </Stack>

          {/* Localização */}
          <Stack spacing={3}>
            <Typography variant="h6">
              Localização
            </Typography>
            
            <Grid container spacing={2}>
              <Grid item xs={12} md={8}>
                <Field.Text
                  name="endereco.rua"
                  label="Rua"
                  placeholder="Ex: Rua das Flores"
                  required
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <Field.Text
                  name="endereco.numero"
                  label="Número"
                  placeholder="Ex: 123"
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Field.Text
                  name="endereco.complemento"
                  label="Complemento"
                  placeholder="Ex: Apto 45"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Field.Text
                  name="endereco.bairro"
                  label="Bairro"
                  placeholder="Ex: Centro"
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Field.Text
                  name="endereco.cidade"
                  label="Cidade"
                  placeholder="Ex: São Paulo"
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Field.Select
                  name="endereco.estado"
                  label="Estado (UF)"
                  required
                >
                  <MenuItem value="AC">Acre</MenuItem>
                  <MenuItem value="AL">Alagoas</MenuItem>
                  <MenuItem value="AP">Amapá</MenuItem>
                  <MenuItem value="AM">Amazonas</MenuItem>
                  <MenuItem value="BA">Bahia</MenuItem>
                  <MenuItem value="CE">Ceará</MenuItem>
                  <MenuItem value="DF">Distrito Federal</MenuItem>
                  <MenuItem value="ES">Espírito Santo</MenuItem>
                  <MenuItem value="GO">Goiás</MenuItem>
                  <MenuItem value="MA">Maranhão</MenuItem>
                  <MenuItem value="MT">Mato Grosso</MenuItem>
                  <MenuItem value="MS">Mato Grosso do Sul</MenuItem>
                  <MenuItem value="MG">Minas Gerais</MenuItem>
                  <MenuItem value="PA">Pará</MenuItem>
                  <MenuItem value="PB">Paraíba</MenuItem>
                  <MenuItem value="PR">Paraná</MenuItem>
                  <MenuItem value="PE">Pernambuco</MenuItem>
                  <MenuItem value="PI">Piauí</MenuItem>
                  <MenuItem value="RJ">Rio de Janeiro</MenuItem>
                  <MenuItem value="RN">Rio Grande do Norte</MenuItem>
                  <MenuItem value="RS">Rio Grande do Sul</MenuItem>
                  <MenuItem value="RO">Rondônia</MenuItem>
                  <MenuItem value="RR">Roraima</MenuItem>
                  <MenuItem value="SC">Santa Catarina</MenuItem>
                  <MenuItem value="SP">São Paulo</MenuItem>
                  <MenuItem value="SE">Sergipe</MenuItem>
                  <MenuItem value="TO">Tocantins</MenuItem>
                </Field.Select>
              </Grid>
              <Grid item xs={12} md={4}>
                <Field.Cep
                  name="endereco.cep"
                  label="CEP"
                  placeholder="Ex: 01234-567"
                  required
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <Field.Text
                  name="endereco.andar"
                  label="Andar"
                  placeholder="Ex: 5º andar"
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <Field.Text
                  name="endereco.nomeEdificio"
                  label="Nome do Edifício"
                  placeholder="Ex: Edifício Central"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Field.Select
                  name="endereco.posicaoSolar"
                  label="Posição Solar"
                >
                  <MenuItem value="norte">Norte</MenuItem>
                  <MenuItem value="sul">Sul</MenuItem>
                  <MenuItem value="leste">Leste</MenuItem>
                  <MenuItem value="oeste">Oeste</MenuItem>
                  <MenuItem value="nordeste">Nordeste</MenuItem>
                  <MenuItem value="noroeste">Noroeste</MenuItem>
                  <MenuItem value="sudeste">Sudeste</MenuItem>
                  <MenuItem value="sudoeste">Sudoeste</MenuItem>
                </Field.Select>
              </Grid>
            </Grid>
          </Stack>

          {/* Características Adicionais */}
          <Stack spacing={3}>
            <Typography variant="h6">
              Características Adicionais
            </Typography>
            
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <Field.Switch
                  name="elevador"
                  label="Elevador"
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <Field.Switch
                  name="sacada"
                  label="Sacada/Varanda"
                />
              </Grid>
            </Grid>
          </Stack>

          {/* Imagens */}
          <Stack spacing={3}>
            <Typography variant="h6">
              Imagens do Imóvel
            </Typography>
            
            <Field.Upload
              name="imagens"
              multiple
              accept={{ 'image/*': [] }}
              maxSize={3145728} // 3MB
              onUpload={() => console.info('ON UPLOAD')}
              helperText="Tamanho máximo: 3MB por arquivo • Formatos aceitos: JPG, PNG, WEBP • Múltiplas imagens permitidas"
            />
          </Stack>

          {/* Dados do Proprietário */}
          <Stack spacing={3}>
            <Typography variant="h6">
              Dados do Proprietário
            </Typography>

            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Field.Text
                  name="proprietario.nome"
                  label="Nome do Proprietário"
                  placeholder="Ex: João Silva"
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Field.Text
                  name="proprietario.email"
                  label="Email"
                  placeholder="Ex: joao@email.com"
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Field.Text
                  name="proprietario.telefone"
                  label="Telefone"
                  placeholder="Ex: (11) 99999-9999"
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Field.Text
                  name="proprietario.documento"
                  label="CPF/CNPJ"
                  placeholder="Ex: 123.456.789-00"
                  required
                />
              </Grid>
            </Grid>
          </Stack>

          <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
            <Button
              type="submit"
              variant="contained"
              size="large"
              loading={loadingSave.value}
              sx={{ minWidth: 200 }}
              onClick={() => {
                console.log('🖱️ Botão Criar Produto clicado!');
                console.log('📊 Estado do formulário:', methods.formState);
                console.log('❌ Erros de validação:', methods.formState.errors);
              }}
            >
              Criar Produto
            </Button>
            <Button
              variant="outlined"
              size="large"
              onClick={handleCancel}
              disabled={loadingSave.value}
            >
              Cancelar
            </Button>
          </Stack>
        </Stack>
      </Card>
    </Form>
  );
}