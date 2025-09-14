import { useFormContext } from 'react-hook-form';

import { Box, Card, Grid, Chip, Stack, Divider, Typography } from '@mui/material';

import { Iconify } from 'src/components/iconify';

export function ReviewStep() {
  const { watch } = useFormContext();
  const formData = watch();

  const formatCurrency = (value: number) => new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value || 0);

  const getStatusLabel = (status: string) => {
    const statusMap = {
      available: 'Disponível',
      sold: 'Vendido',
      reserved: 'Reservado'
    };
    return statusMap[status as keyof typeof statusMap] || status;
  };

  const getTipoLabel = (tipo: string) => {
    const tipoMap = {
      apartamento: 'Apartamento',
      casa: 'Casa',
      sobrado: 'Sobrado',
      cobertura: 'Cobertura',
      kitnet: 'Kitnet',
      loft: 'Loft',
      chacara: 'Chácara',
      fazenda: 'Fazenda',
      sitio: 'Sítio',
      comercial: 'Comercial',
      industrial: 'Industrial'
    };
    return tipoMap[tipo as keyof typeof tipoMap] || tipo;
  };

  const getFinalidadeLabel = (finalidade: string) => {
    const finalidadeMap = {
      venda: 'Venda',
      aluguel: 'Aluguel',
      venda_aluguel: 'Venda e Aluguel'
    };
    return finalidadeMap[finalidade as keyof typeof finalidadeMap] || finalidade;
  };

  const getCondicaoLabel = (condicao: string) => {
    const condicaoMap = {
      novo: 'Novo',
      seminovo: 'Semi-novo',
      usado: 'Usado',
      reformado: 'Reformado',
      a_reformar: 'A reformar'
    };
    return condicaoMap[condicao as keyof typeof condicaoMap] || condicao;
  };

  const getPosicaoSolarLabel = (posicao: string) => {
    const posicaoMap = {
      norte: 'Norte',
      sul: 'Sul',
      leste: 'Leste',
      oeste: 'Oeste',
      nordeste: 'Nordeste',
      noroeste: 'Noroeste',
      sudeste: 'Sudeste',
      sudoeste: 'Sudoeste'
    };
    return posicaoMap[posicao as keyof typeof posicaoMap] || posicao;
  };

  const renderComodidades = (comodidades: any) => {
    if (!comodidades) return 'Nenhuma comodidade selecionada';
    
    const comodidadesSelecionadas = Object.entries(comodidades)
      .filter(([_, value]) => value === true)
      .map(([key, _]) => {
        const labels: { [key: string]: string } = {
          arCondicionado: 'Ar Condicionado',
          aquecimento: 'Aquecimento',
          churrasqueira: 'Churrasqueira',
          lareira: 'Lareira',
          jardim: 'Jardim',
          quintal: 'Quintal',
          areaServico: 'Área de Serviço',
          despensa: 'Despensa',
          closet: 'Closet',
          escritorio: 'Escritório',
          lavabo: 'Lavabo',
          dependenciaEmpregada: 'Dependência de Empregada',
          condominio_piscina: 'Piscina',
          condominio_academia: 'Academia',
          condominio_salaFestas: 'Salão de Festas',
          condominio_playground: 'Playground',
          condominio_quadraEsportes: 'Quadra de Esportes',
          condominio_sauna: 'Sauna',
          condominio_salaoJogos: 'Salão de Jogos',
          condominio_jardimComum: 'Jardim Comum',
          condominio_portaria24h: 'Portaria 24h',
          condominio_seguranca: 'Segurança',
          condominio_interfone: 'Interfone',
          condominio_circuitoFechado: 'Circuito Fechado'
        };
        return labels[key] || key;
      });
    
    return comodidadesSelecionadas.length > 0 
      ? comodidadesSelecionadas.join(', ') 
      : 'Nenhuma comodidade selecionada';
  };

  return (
    <Card sx={{ p: 4 }}>
      <Stack spacing={4}>
        <Stack spacing={1}>
          <Typography variant="h5" sx={{ fontWeight: 600 }}>
            Revisão dos Dados
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Confira todas as informações antes de finalizar o cadastro
          </Typography>
        </Stack>

        <Stack spacing={4}>
          {/* Informações Básicas */}
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <Iconify icon="solar:home-bold" sx={{ color: 'primary.main' }} />
              <Typography variant="h6" color="primary.main">
                Informações Básicas
              </Typography>
            </Box>
            
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant="subtitle2" color="text.secondary">
                  Título
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  {formData.titulo || 'Não informado'}
                </Typography>
              </Grid>
              
              {formData.descricao && (
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Descrição
                  </Typography>
                  <Typography variant="body2">
                    {formData.descricao}
                  </Typography>
                </Grid>
              )}
              
              <Grid item xs={12} md={4}>
                <Typography variant="subtitle2" color="text.secondary">
                  Preço
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 600, color: 'success.main' }}>
                  {formatCurrency(formData.preco)}
                  {formData.precoNegociavel && (
                    <Chip 
                      label="Negociável" 
                      size="small" 
                      color="info" 
                      sx={{ ml: 1 }} 
                    />
                  )}
                </Typography>
              </Grid>
              
              {formData.area && (
                <Grid item xs={12} md={4}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Área
                  </Typography>
                  <Typography variant="body1">
                    {formData.area.toLocaleString('pt-BR')} m²
                  </Typography>
                </Grid>
              )}
              
              <Grid item xs={12} md={4}>
                <Typography variant="subtitle2" color="text.secondary">
                  Finalidade
                </Typography>
                <Typography variant="body1">
                  {getFinalidadeLabel(formData.finalidade)}
                </Typography>
              </Grid>
              
              <Grid item xs={12} md={4}>
                <Typography variant="subtitle2" color="text.secondary">
                  Tipo
                </Typography>
                <Typography variant="body1">
                  {getTipoLabel(formData.tipo)}
                </Typography>
              </Grid>
              
              <Grid item xs={12} md={4}>
                <Typography variant="subtitle2" color="text.secondary">
                  Status
                </Typography>
                <Chip 
                  label={getStatusLabel(formData.status)} 
                  color={formData.status === 'available' ? 'success' : 'default'}
                  size="small"
                />
              </Grid>
              
              <Grid item xs={12} md={4}>
                <Typography variant="subtitle2" color="text.secondary">
                  Condição
                </Typography>
                <Typography variant="body1">
                  {getCondicaoLabel(formData.condicao)}
                </Typography>
              </Grid>
            </Grid>
          </Box>

          <Divider />

          {/* Características do Imóvel */}
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <Iconify icon="solar:settings-bold" sx={{ color: 'primary.main' }} />
              <Typography variant="h6" color="primary.main">
                Características do Imóvel
              </Typography>
            </Box>
            
            <Grid container spacing={2}>
              <Grid item xs={12} md={3}>
                <Typography variant="subtitle2" color="text.secondary">
                  Quartos
                </Typography>
                <Typography variant="body1">
                  {formData.quartos || 0}
                </Typography>
              </Grid>
              
              <Grid item xs={12} md={3}>
                <Typography variant="subtitle2" color="text.secondary">
                  Suítes
                </Typography>
                <Typography variant="body1">
                  {formData.suites || 0}
                </Typography>
              </Grid>
              
              <Grid item xs={12} md={3}>
                <Typography variant="subtitle2" color="text.secondary">
                  Banheiros
                </Typography>
                <Typography variant="body1">
                  {formData.banheiros || 0}
                </Typography>
              </Grid>
              
              <Grid item xs={12} md={3}>
                <Typography variant="subtitle2" color="text.secondary">
                  Vagas de Garagem
                </Typography>
                <Typography variant="body1">
                  {formData.vagasGaragem || 0}
                </Typography>
              </Grid>
              
              {formData.anoConstucao && (
                <Grid item xs={12} md={4}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Ano de Construção
                  </Typography>
                  <Typography variant="body1">
                    {formData.anoConstucao}
                  </Typography>
                </Grid>
              )}
              
              {formData.posicaoSolar && (
                <Grid item xs={12} md={4}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Posição Solar
                  </Typography>
                  <Typography variant="body1">
                    {getPosicaoSolarLabel(formData.posicaoSolar)}
                  </Typography>
                </Grid>
              )}
              
              <Grid item xs={12} md={4}>
                <Typography variant="subtitle2" color="text.secondary">
                  Documentação
                </Typography>
                <Chip 
                  label={formData.temDocumentacao ? 'Regularizada' : 'Pendente'}
                  color={formData.temDocumentacao ? 'success' : 'warning'}
                  size="small"
                />
              </Grid>
              
              <Grid item xs={12} md={4}>
                <Typography variant="subtitle2" color="text.secondary">
                  Elevador
                </Typography>
                <Chip 
                  label={formData.elevador ? 'Sim' : 'Não'}
                  color={formData.elevador ? 'success' : 'default'}
                  size="small"
                />
              </Grid>
              
              <Grid item xs={12} md={4}>
                <Typography variant="subtitle2" color="text.secondary">
                  Sacada/Varanda
                </Typography>
                <Chip 
                  label={formData.sacada ? 'Sim' : 'Não'}
                  color={formData.sacada ? 'success' : 'default'}
                  size="small"
                />
              </Grid>
              
              <Grid item xs={12} md={4}>
                <Typography variant="subtitle2" color="text.secondary">
                  Mobiliado
                </Typography>
                <Chip 
                  label={formData.mobiliado ? 'Sim' : 'Não'}
                  color={formData.mobiliado ? 'success' : 'default'}
                  size="small"
                />
              </Grid>
            </Grid>
          </Box>

          <Divider />

          {/* Localização */}
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <Iconify icon="solar:map-point-bold" sx={{ color: 'primary.main' }} />
              <Typography variant="h6" color="primary.main">
                Localização
              </Typography>
            </Box>
            
            <Typography variant="body1">
              {formData.endereco?.rua}, {formData.endereco?.numero}
              {formData.endereco?.complemento && `, ${formData.endereco.complemento}`}
            </Typography>
            {formData.endereco?.andar && (
              <Typography variant="body2" color="text.secondary">
                Andar: {formData.endereco.andar}
              </Typography>
            )}
            {formData.endereco?.nomeEdificio && (
              <Typography variant="body2" color="text.secondary">
                Edifício: {formData.endereco.nomeEdificio}
              </Typography>
            )}
            <Typography variant="body2" color="text.secondary">
              {formData.endereco?.bairro}, {formData.endereco?.cidade} - {formData.endereco?.estado}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              CEP: {formData.endereco?.cep}
            </Typography>
          </Box>

          <Divider />

          {/* Comodidades */}
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <Iconify icon="solar:star-bold" sx={{ color: 'primary.main' }} />
              <Typography variant="h6" color="primary.main">
                Comodidades
              </Typography>
            </Box>
            
            <Typography variant="body2">
              {renderComodidades(formData.comodidades)}
            </Typography>
          </Box>

          <Divider />

          {/* Imagens */}
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <Iconify icon="solar:camera-bold" sx={{ color: 'primary.main' }} />
              <Typography variant="h6" color="primary.main">
                Imagens
              </Typography>
            </Box>
            
            <Typography variant="body1">
              {formData.imagens?.length || 0} imagem(ns) selecionada(s)
            </Typography>
          </Box>

          <Divider />

          {/* Proprietário */}
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <Iconify icon="solar:user-bold" sx={{ color: 'primary.main' }} />
              <Typography variant="h6" color="primary.main">
                Proprietário
              </Typography>
            </Box>
            
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Nome
                </Typography>
                <Typography variant="body1">
                  {formData.proprietario?.nome || 'Não informado'}
                </Typography>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Email
                </Typography>
                <Typography variant="body1">
                  {formData.proprietario?.email || 'Não informado'}
                </Typography>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Telefone
                </Typography>
                <Typography variant="body1">
                  {formData.proprietario?.telefone || 'Não informado'}
                </Typography>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  CPF/CNPJ
                </Typography>
                <Typography variant="body1">
                  {formData.proprietario?.documento || 'Não informado'}
                </Typography>
              </Grid>
            </Grid>
          </Box>
        </Stack>
      </Stack>
    </Card>
  );
}