import { useState, useCallback } from 'react';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

// ----------------------------------------------------------------------

type Props = {
  cobranca?: any;
};

export function CobrancaEditView({ cobranca }: Props) {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  // Inicializar com dados da cobrança ou valores padrão
  const [formData, setFormData] = useState({
    cliente: cobranca?.cliente || 'João Silva',
    produto: cobranca?.produto || 'Apartamento 2 quartos - Centro',
    valor: cobranca?.valor?.toString() || '1500.00',
    vencimento: cobranca?.vencimento || '2024-01-15',
    descricao: cobranca?.descricao || 'Cobrança referente ao serviço de consultoria imobiliária',
  });

  const handleChange = useCallback(
    (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
      setFormData((prev) => ({
        ...prev,
        [field]: event.target.value,
      }));
    },
    []
  );

  const handleSubmit = useCallback(async () => {
    setLoading(true);
    try {
      // Implementar lógica de atualização
      console.log('Updating cobranca:', formData);
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simular API call
      router.push(paths.dashboard.cobranca.list);
    } catch (error) {
      console.error('Error updating cobranca:', error);
    } finally {
      setLoading(false);
    }
  }, [formData, router]);

  return (
    <Container maxWidth="lg">
      <CustomBreadcrumbs
        heading="Editar Cobrança"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Cobrança', href: paths.dashboard.cobranca.root },
          { name: 'Editar' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <Card sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ mb: 3 }}>
          Informações da Cobrança
        </Typography>

        <Stack spacing={3}>
          <TextField
            fullWidth
            label="Cliente"
            value={formData.cliente}
            onChange={handleChange('cliente')}
            required
          />

          <TextField
            fullWidth
            label="Produto"
            value={formData.produto}
            onChange={handleChange('produto')}
            required
          />

          <TextField
            fullWidth
            label="Valor"
            type="number"
            value={formData.valor}
            onChange={handleChange('valor')}
            required
            InputProps={{
              startAdornment: 'R$ ',
            }}
          />

          <TextField
            fullWidth
            label="Data de Vencimento"
            type="date"
            value={formData.vencimento}
            onChange={handleChange('vencimento')}
            required
            InputLabelProps={{
              shrink: true,
            }}
          />

          <TextField
            fullWidth
            label="Descrição"
            multiline
            rows={4}
            value={formData.descricao}
            onChange={handleChange('descricao')}
          />

          <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
            <LoadingButton variant="contained" loading={loading} onClick={handleSubmit}>
              Salvar Alterações
            </LoadingButton>

            <Button variant="outlined" onClick={() => router.push(paths.dashboard.cobranca.list)}>
              Cancelar
            </Button>
          </Stack>
        </Stack>
      </Card>
    </Container>
  );
}
