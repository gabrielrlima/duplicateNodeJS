import type { CardProps } from '@mui/material/Card';
import type { IPropertyItem } from 'src/types/property';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

type Props = CardProps & {
  property?: IPropertyItem;
  propertyData?: IPropertyItem;
};

export function PropertyDetailsLocation({ sx, property, propertyData, ...other }: Props) {
  const propertyItem = propertyData || property;
  const localizacao = propertyItem?.localizacao;
  
  const handleOpenMap = () => {
    if (localizacao?.coordenadas) {
      const url = `https://www.google.com/maps?q=${localizacao.coordenadas.lat},${localizacao.coordenadas.lng}`;
      window.open(url, '_blank');
    } else if (localizacao?.endereco) {
      // Fallback para busca por endereço
      const searchQuery = `${localizacao.endereco}, ${localizacao.bairro}, ${localizacao.cidade}, ${localizacao.estado}`;
      const url = `https://www.google.com/maps/search/${encodeURIComponent(searchQuery)}`;
      window.open(url, '_blank');
    }
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

  return (
    <Card sx={sx} {...other}>
      <CardHeader title="Localização" />

      <Box sx={{ p: 3 }}>
        <Box sx={{ mb: 3 }}>
          <Typography variant="body2" sx={{ color: 'text.secondary', mb: 0.5 }}>
            Endereço
          </Typography>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            {localizacao?.endereco || 'Não informado'}
          </Typography>

          {localizacao?.complemento && (
            <>
              <Typography variant="body2" sx={{ color: 'text.secondary', mb: 0.5 }}>
                Complemento
              </Typography>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                {localizacao.complemento}
              </Typography>
            </>
          )}

          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid item xs={12} sm={6}>
              <Typography variant="body2" sx={{ color: 'text.secondary', mb: 0.5 }}>
                Bairro
              </Typography>
              <Typography variant="subtitle2">
                {localizacao?.bairro || 'Não informado'}
              </Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Typography variant="body2" sx={{ color: 'text.secondary', mb: 0.5 }}>
                CEP
              </Typography>
              <Typography variant="subtitle2">
                {localizacao?.cep || 'Não informado'}
              </Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Typography variant="body2" sx={{ color: 'text.secondary', mb: 0.5 }}>
                Cidade
              </Typography>
              <Typography variant="subtitle2">
                {localizacao?.cidade || 'Não informado'}
              </Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Typography variant="body2" sx={{ color: 'text.secondary', mb: 0.5 }}>
                Estado
              </Typography>
              <Typography variant="subtitle2">
                {localizacao?.estado || 'Não informado'}
              </Typography>
            </Grid>
          </Grid>

          {/* Informações específicas do imóvel */}
          <Grid container spacing={2} sx={{ mb: 2 }}>
            {propertyItem?.caracteristicas?.andar && (
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" sx={{ color: 'text.secondary', mb: 0.5 }}>
                  Andar
                </Typography>
                <Typography variant="subtitle2">
                  {propertyItem.caracteristicas.andar}
                </Typography>
              </Grid>
            )}

            {propertyItem?.nomeEdificio && (
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" sx={{ color: 'text.secondary', mb: 0.5 }}>
                  Edifício
                </Typography>
                <Typography variant="subtitle2">
                  {propertyItem.nomeEdificio}
                </Typography>
              </Grid>
            )}

            {propertyItem?.posicaoSolar && (
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" sx={{ color: 'text.secondary', mb: 0.5 }}>
                  Posição Solar
                </Typography>
                <Typography variant="subtitle2">
                  {getPosicaoSolarLabel(propertyItem.posicaoSolar)}
                </Typography>
              </Grid>
            )}
          </Grid>
        </Box>

        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="outlined"
            size="small"
            startIcon={<Iconify icon="solar:map-point-bold" />}
            onClick={handleOpenMap}
            fullWidth
          >
            Ver no Mapa
          </Button>
        </Box>
      </Box>
    </Card>
  );
}