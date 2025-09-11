import { useFormContext } from 'react-hook-form';
import { Card, Stack, Typography, Grid, Box, Chip, Divider } from '@mui/material';
import { Iconify } from 'src/components/iconify';

export function ReviewStep() {
  const { watch } = useFormContext();
  const formData = watch();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value || 0);
  };

  const getStatusLabel = (status: string) => {
    const statusMap = {
      available: 'Disponível',
      sold: 'Vendido',
      reserved: 'Reservado',
    };
    return statusMap[status as keyof typeof statusMap] || status;
  };

  const getTipoLabel = (tipo: string) => {
    const tipoMap = {
      residential: 'Residencial',
      commercial: 'Comercial',
      industrial: 'Industrial',
      rural: 'Rural',
    };
    return tipoMap[tipo as keyof typeof tipoMap] || tipo;
  };

  const getTopografiaLabel = (topografia: string) => {
    const topografiaMap = {
      flat: 'Plano',
      sloped: 'Inclinado',
      irregular: 'Irregular',
    };
    return topografiaMap[topografia as keyof typeof topografiaMap] || topografia;
  };

  const getTipoAcessoLabel = (tipoAcesso: string) => {
    const tipoAcessoMap = {
      paved: 'Asfaltado',
      dirt: 'Terra',
      cobblestone: 'Paralelepípedo',
    };
    return tipoAcessoMap[tipoAcesso as keyof typeof tipoAcessoMap] || tipoAcesso;
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
                  Tipo
                </Typography>
                <Typography variant="body1">
                  {getTipoLabel(formData.tipo)}
                </Typography>
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
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {formData.endereco?.bairro}, {formData.endereco?.cidade} - {formData.endereco?.estado}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              CEP: {formData.endereco?.cep}
            </Typography>
          </Box>

          <Divider />

          {/* Características */}
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <Iconify icon="solar:settings-bold" sx={{ color: 'primary.main' }} />
              <Typography variant="h6" color="primary.main">
                Características
              </Typography>
            </Box>
            
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <Typography variant="subtitle2" color="text.secondary">
                  Topografia
                </Typography>
                <Typography variant="body1">
                  {getTopografiaLabel(formData.topografia)}
                </Typography>
              </Grid>
              
              <Grid item xs={12} md={4}>
                <Typography variant="subtitle2" color="text.secondary">
                  Tipo de Acesso
                </Typography>
                <Typography variant="body1">
                  {getTipoAcessoLabel(formData.tipoAcesso)}
                </Typography>
              </Grid>
              
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
              
              {formData.dimensoes && (
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Dimensões
                  </Typography>
                  <Typography variant="body1">
                    {formData.dimensoes}
                  </Typography>
                </Grid>
              )}
            </Grid>
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