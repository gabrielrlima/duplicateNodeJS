import type { IPropertyItem } from 'src/types/property';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';

import { fCurrency } from 'src/utils/format-number';

// ----------------------------------------------------------------------

type Props = {
  property?: IPropertyItem;
  propertyData?: IPropertyItem;
};

export function PropertyDetailsFinancial({ property, propertyData }: Props) {
  const propertyItem = propertyData || property;
  const valores = propertyItem?.valores;
  
  const getFinalidadeLabel = (finalidade: string) => {
    const finalidadeMap = {
      venda: 'Venda',
      aluguel: 'Aluguel',
      venda_aluguel: 'Venda e Aluguel'
    };
    return finalidadeMap[finalidade as keyof typeof finalidadeMap] || finalidade;
  };

  return (
    <Card>
      <CardHeader title="Informações Financeiras" />
      <Box sx={{ p: 3 }}>
        <Stack spacing={3}>
          {/* Finalidade */}
          <Box>
            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
              Finalidade
            </Typography>
            <Chip 
              label={getFinalidadeLabel(propertyItem?.finalidade || 'venda')} 
              color="primary" 
              size="small" 
            />
          </Box>

          {/* Valores principais */}
          <Grid container spacing={2}>
            {propertyItem?.finalidade === 'venda' || propertyItem?.finalidade === 'venda_aluguel' ? (
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" sx={{ color: 'text.secondary', mb: 0.5 }}>
                  Preço de Venda
                </Typography>
                <Typography variant="h6" sx={{ color: 'success.main' }}>
                  {valores?.valorVenda ? fCurrency(valores.valorVenda) : propertyItem?.preco ? fCurrency(propertyItem.preco) : 'Não informado'}
                </Typography>
              </Grid>
            ) : null}

            {propertyItem?.finalidade === 'aluguel' || propertyItem?.finalidade === 'venda_aluguel' ? (
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" sx={{ color: 'text.secondary', mb: 0.5 }}>
                  Preço de Aluguel
                </Typography>
                <Typography variant="h6" sx={{ color: 'info.main' }}>
                  {valores?.valorAluguel ? fCurrency(valores.valorAluguel) : 'Não informado'}
                </Typography>
              </Grid>
            ) : null}

            <Grid item xs={12} sm={6}>
              <Typography variant="body2" sx={{ color: 'text.secondary', mb: 0.5 }}>
                Preço por m²
              </Typography>
              <Typography variant="subtitle2">
                {propertyItem?.precoM2 ? fCurrency(propertyItem.precoM2) : 'Não informado'}
              </Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Typography variant="body2" sx={{ color: 'text.secondary', mb: 0.5 }}>
                Preço Negociável
              </Typography>
              <Chip 
                label={propertyItem?.negociavel ? 'Sim' : 'Não'} 
                color={propertyItem?.negociavel ? 'success' : 'default'}
                size="small" 
              />
            </Grid>
          </Grid>

          {/* Taxas e impostos */}
          <Box>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Taxas e Impostos
            </Typography>
            
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" sx={{ color: 'text.secondary', mb: 0.5 }}>
                  Condomínio
                </Typography>
                <Typography variant="subtitle2">
                  {valores?.valorCondominio ? fCurrency(valores.valorCondominio) : 'Não informado'}
                </Typography>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Typography variant="body2" sx={{ color: 'text.secondary', mb: 0.5 }}>
                  IPTU
                </Typography>
                <Typography variant="subtitle2">
                  {valores?.valorIPTU ? fCurrency(valores.valorIPTU) : 'Não informado'}
                </Typography>
              </Grid>
            </Grid>
          </Box>

          {/* Documentação */}
          <Box>
            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
              Documentação
            </Typography>
            <Chip 
              label="Completa" 
              color="success"
              size="small" 
            />
          </Box>

          {/* Observações financeiras */}
          {propertyItem?.observacoes && (
            <Box>
              <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
                Observações
              </Typography>
              <Typography variant="body2" sx={{ lineHeight: 1.6 }}>
                {propertyItem.observacoes}
              </Typography>
            </Box>
          )}
        </Stack>
      </Box>
    </Card>
  );
}