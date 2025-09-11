import { Card, Stack, Typography, Grid, MenuItem } from '@mui/material';
import { Field } from 'src/components/hook-form';

export function CharacteristicsStep() {
  return (
    <Card sx={{ p: 4 }}>
      <Stack spacing={4}>
        <Stack spacing={1}>
          <Typography variant="h5" sx={{ fontWeight: 600 }}>
            Características
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Detalhe as características físicas do terreno
          </Typography>
        </Stack>

        <Stack spacing={3}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Field.Select
                name="topografia"
                label="Topografia"
                helperText="Formato do terreno"
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
                helperText="Condição da via de acesso"
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
                helperText="Possui documentação regularizada"
              />
            </Grid>
          </Grid>
          
          <Field.Text
            name="dimensoes"
            label="Dimensões"
            placeholder="Ex: 20m x 25m ou 500m²"
            helperText="Informe as medidas do terreno (opcional)"
          />
        </Stack>
      </Stack>
    </Card>
  );
}