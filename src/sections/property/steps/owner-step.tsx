import { Card, Grid, Stack, Typography } from '@mui/material';

import { Field } from 'src/components/hook-form';

export function OwnerStep() {
  return (
    <Card sx={{ p: 4 }}>
      <Stack spacing={4}>
        <Stack spacing={1}>
          <Typography variant="h5" sx={{ fontWeight: 600 }}>
            Dados do Proprietário
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Informe os dados de contato do proprietário do imóvel
          </Typography>
        </Stack>

        <Stack spacing={3}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Field.Text
                name="proprietario.nome"
                label="Nome do Proprietário"
                placeholder="Ex: João Silva"
                required
                helperText="Nome completo do proprietário"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Field.Text
                name="proprietario.email"
                label="Email"
                placeholder="Ex: joao@email.com"
                required
                helperText="Email para contato"
              />
            </Grid>
          </Grid>

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Field.Phone
                name="proprietario.telefone"
                label="Telefone"
                placeholder="(11) 99999-9999"
                required
                helperText="Telefone com DDD"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Field.Document
                name="proprietario.documento"
                label="CPF/CNPJ"
                placeholder="123.456.789-00 ou 12.345.678/0001-90"
                required
                helperText="Documento de identificação"
              />
            </Grid>
          </Grid>
        </Stack>
      </Stack>
    </Card>
  );
}