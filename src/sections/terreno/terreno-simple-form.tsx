import { useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z as zod } from 'zod';
import { useBoolean } from 'minimal-shared/hooks';
import { useRouter } from 'src/routes/hooks';
import { paths } from 'src/routes/paths';
import { useRealEstateContext } from 'src/contexts/real-estate-context';
import { createTerreno } from 'src/actions/terreno';
import { toast } from 'sonner';

import { Card, Stack, Button, Typography, Grid, MenuItem } from '@mui/material';
import { Form, Field } from 'src/components/hook-form';

// Schema expandido com campos essenciais
const SimpleSchema = zod.object({
  titulo: zod.string().min(1, 'Título é obrigatório'),
  descricao: zod.string().optional(),
  preco: zod.coerce.number().min(0.01, 'Preço deve ser maior que zero'),
  precoNegociavel: zod.boolean().optional(),
  area: zod.coerce.number().optional(),
  status: zod.enum(['available', 'sold', 'reserved']).default('available'),
  tipo: zod.enum(['residential', 'commercial', 'industrial', 'rural']).default('residential'),
  
  // Localização
  endereco: zod.object({
    rua: zod.string().min(1, 'Rua é obrigatória'),
    numero: zod.string().min(1, 'Número é obrigatório'),
    bairro: zod.string().min(1, 'Bairro é obrigatório'),
    cidade: zod.string().min(1, 'Cidade é obrigatória'),
    estado: zod.string().min(2, 'Estado é obrigatório').max(2, 'Use a sigla do estado'),
    cep: zod.string().min(8, 'CEP deve ter 8 dígitos'),
  }),
  
  // Características
  topografia: zod.enum(['flat', 'sloped', 'irregular']).default('flat'),
  tipoAcesso: zod.enum(['paved', 'dirt', 'cobblestone']).default('paved'),
  temDocumentacao: zod.boolean().default(false),
  dimensoes: zod.string().optional(),
  
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

export function TerrenoSimpleForm() {
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
      status: 'available' as const,
      tipo: 'residential' as const,
      endereco: {
        rua: '',
        numero: '',
        bairro: '',
        cidade: '',
        estado: '',
        cep: '',
      },
      topografia: 'flat' as const,
      tipoAcesso: 'paved' as const,
      temDocumentacao: false,
      dimensoes: '',
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
      console.log('🚀 Criando terreno simples:', data);
      console.log('Imobiliária atual:', currentRealEstate);

      if (!currentRealEstate?.id) {
        console.log('⚠️ Nenhuma imobiliária selecionada. Usando ID padrão para teste.');
        // toast.error('Selecione uma imobiliária primeiro!');
        // loadingSave.onFalse();
        // return;
      }

      // Dados completos para a API
      const terrenoData = {
        name: data.titulo,
        title: data.titulo,
        description: data.descricao || 'Terreno criado via formulário expandido',
        totalArea: data.area,
        value: data.preco,
        status: data.status,
        type: data.tipo,
        acceptsFinancing: data.precoNegociavel || false,
        address: {
          street: data.endereco.rua,
          number: data.endereco.numero,
          neighborhood: data.endereco.bairro,
          city: data.endereco.cidade,
          state: data.endereco.estado,
          zipCode: data.endereco.cep
        },
        owner: {
          name: data.proprietario.nome,
          email: data.proprietario.email,
          phone: data.proprietario.telefone,
          document: data.proprietario.documento
        },
        topography: data.topografia,
        dimensions: data.dimensoes || '',
        accessType: data.tipoAcesso,
        hasDocumentation: data.temDocumentacao,
        imagens: data.imagens || [],
        realEstateId: currentRealEstate?.id || 'test-real-estate-id'
      };

      console.log('Dados para API:', terrenoData);

      await createTerreno(terrenoData);
      toast.success('Terreno criado com sucesso!');
      reset();
      router.push(paths.dashboard.terrenos.root);
    } catch (error) {
      console.error('Erro ao criar terreno:', error);
      toast.error('Erro ao criar terreno. Verifique os dados e tente novamente.');
    } finally {
      loadingSave.onFalse();
    }
  });

  const handleCancel = useCallback(() => {
    router.push(paths.dashboard.terrenos.root);
  }, [router]);

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Card sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ mb: 3 }}>
          Criar Terreno - Formulário Completo
        </Typography>

        <Stack spacing={4}>
          {/* Informações Básicas */}
          <Stack spacing={3}>
            <Typography variant="h6">
              Informações Básicas
            </Typography>
            
            <Field.Text 
              name="titulo" 
              label="Título do Terreno" 
              placeholder="Ex: Terreno Residencial Vila Nova"
              required
            />
            
            <Field.Text 
              name="descricao" 
              label="Descrição" 
              placeholder="Descreva as características do terreno..."
              multiline
              rows={3}
            />

            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <Field.Number
                  name="preco"
                  label="Preço (R$)"
                  placeholder="Ex: 150000"
                  formatThousands
                  required
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <Field.Number
                  name="area"
                  label="Área (m²)"
                  placeholder="Ex: 500"
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
              <Grid item xs={12} md={6}>
                <Field.Select
                  name="status"
                  label="Status"
                >
                  <MenuItem value="available">Disponível</MenuItem>
                  <MenuItem value="sold">Vendido</MenuItem>
                  <MenuItem value="reserved">Reservado</MenuItem>
                </Field.Select>
              </Grid>
              <Grid item xs={12} md={6}>
                <Field.Select
                  name="tipo"
                  label="Tipo"
                >
                  <MenuItem value="residential">Residencial</MenuItem>
                  <MenuItem value="commercial">Comercial</MenuItem>
                  <MenuItem value="industrial">Industrial</MenuItem>
                  <MenuItem value="rural">Rural</MenuItem>
                </Field.Select>
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
                <Field.Text
                  name="endereco.estado"
                  label="Estado (UF)"
                  placeholder="Ex: SP"
                  inputProps={{ maxLength: 2 }}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Field.Cep
                  name="endereco.cep"
                  label="CEP"
                  placeholder="Ex: 01234-567"
                  required
                />
              </Grid>
            </Grid>
          </Stack>

          {/* Características */}
          <Stack spacing={3}>
            <Typography variant="h6">
              Características
            </Typography>
            
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <Field.Select
                  name="topografia"
                  label="Topografia"
                >
                  <MenuItem value="flat">Plano</MenuItem>
                  <MenuItem value="sloped">Inclinado</MenuItem>
                  <MenuItem value="irregular">Irregular</MenuItem>
                </Field.Select>
              </Grid>
              <Grid item xs={12} md={4}>
                <Field.Select
                  name="tipoAcesso"
                  label="Tipo de Acesso"
                >
                  <MenuItem value="paved">Asfaltado</MenuItem>
                  <MenuItem value="dirt">Terra</MenuItem>
                  <MenuItem value="cobblestone">Paralelepípedo</MenuItem>
                </Field.Select>
              </Grid>
              <Grid item xs={12} md={4}>
                <Field.Switch
                  name="temDocumentacao"
                  label="Tem Documentação"
                />
              </Grid>
            </Grid>
            
            <Field.Text
              name="dimensoes"
              label="Dimensões"
              placeholder="Ex: 20m x 25m"
            />
          </Stack>

          {/* Imagens */}
          <Stack spacing={3}>
            <Typography variant="h6">
              Imagens do Terreno
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
                console.log('🖱️ Botão Criar Terreno clicado!');
                console.log('📊 Estado do formulário:', methods.formState);
                console.log('❌ Erros de validação:', methods.formState.errors);
              }}
            >
              Criar Terreno
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