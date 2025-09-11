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

export function CobrancaCreateView() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    cliente: '',
    valor: '',
    vencimento: '',
    descricao: '',
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
      // Implementar lógica de criação
      console.log('Creating cobranca:', formData);
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simular API call
      router.push(paths.dashboard.cobranca.list);
    } catch (error) {
      console.error('Error creating cobranca:', error);
    } finally {
      setLoading(false);
    }
  }, [formData, router]);

  return (
    <Container maxWidth="lg">
      <CustomBreadcrumbs
        heading="Nova Cobrança"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Cobrança', href: paths.dashboard.cobranca.root },
          { name: 'Nova' },
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
              Criar Cobrança
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
