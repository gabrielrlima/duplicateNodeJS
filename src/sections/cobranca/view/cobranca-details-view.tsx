import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';

import { paths } from 'src/routes/paths';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

// ----------------------------------------------------------------------

type Props = {
  cobranca?: any;
};

export function CobrancaDetailsView({ cobranca }: Props) {
  // Fallback para mock data se não houver cobrança
  const currentCobranca = cobranca || {
    id: '1',
    cliente: 'João Silva',
    produto: 'Apartamento 2 quartos - Centro',
    valor: 1500.0,
    vencimento: '2024-01-15',
    status: 'Pendente',
    descricao: 'Cobrança referente ao serviço de consultoria imobiliária',
    dataCriacao: '2024-01-01',
  };

  return (
    <Container maxWidth="lg">
      <CustomBreadcrumbs
        heading="Detalhes da Cobrança"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Cobrança', href: paths.dashboard.cobranca.root },
          { name: 'Detalhes' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <Card>
        <CardContent>
          <Stack spacing={3}>
            <Typography variant="h6">Informações da Cobrança</Typography>

            <Stack spacing={2}>
              <Stack direction="row" spacing={2}>
                <Typography variant="subtitle2" sx={{ minWidth: 120 }}>
                  Cliente:
                </Typography>
                <Typography variant="body2">{currentCobranca.cliente}</Typography>
              </Stack>

              <Stack direction="row" spacing={2}>
                <Typography variant="subtitle2" sx={{ minWidth: 120 }}>
                  Produto:
                </Typography>
                <Typography variant="body2">{currentCobranca.produto}</Typography>
              </Stack>

              <Stack direction="row" spacing={2}>
                <Typography variant="subtitle2" sx={{ minWidth: 120 }}>
                  Valor:
                </Typography>
                <Typography variant="body2">
                  R$ {currentCobranca.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </Typography>
              </Stack>

              <Stack direction="row" spacing={2}>
                <Typography variant="subtitle2" sx={{ minWidth: 120 }}>
                  Vencimento:
                </Typography>
                <Typography variant="body2">
                  {new Date(currentCobranca.vencimento).toLocaleDateString('pt-BR')}
                </Typography>
              </Stack>

              <Stack direction="row" spacing={2}>
                <Typography variant="subtitle2" sx={{ minWidth: 120 }}>
                  Status:
                </Typography>
                <Typography variant="body2">{currentCobranca.status}</Typography>
              </Stack>

              <Stack direction="row" spacing={2}>
                <Typography variant="subtitle2" sx={{ minWidth: 120 }}>
                  Data de Criação:
                </Typography>
                <Typography variant="body2">
                  {new Date(currentCobranca.dataCriacao).toLocaleDateString('pt-BR')}
                </Typography>
              </Stack>

              {currentCobranca.descricao && (
                <Stack spacing={1}>
                  <Typography variant="subtitle2">Descrição:</Typography>
                  <Typography variant="body2">{currentCobranca.descricao}</Typography>
                </Stack>
              )}
            </Stack>
          </Stack>
        </CardContent>
      </Card>
    </Container>
  );
}
