import { Card, Stack, Typography, Grid, MenuItem } from '@mui/material';
import { Field } from 'src/components/hook-form';

export function BasicInfoStep() {
  return (
    <Card sx={{ p: 4 }}>
      <Stack spacing={4}>
        <Stack spacing={1}>
          <Typography variant="h5" sx={{ fontWeight: 600 }}>
            Informações Básicas
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Preencha os dados principais do terreno
          </Typography>
        </Stack>

        <Stack spacing={3}>
          <Field.Text 
            name="titulo" 
            label="Título do Terreno" 
            placeholder="Ex: Terreno Residencial Vila Nova"
            required
            helperText="Escolha um título atrativo e descritivo"
          />
          
          <Field.Text 
            name="descricao" 
            label="Descrição" 
            placeholder="Descreva as características do terreno..."
            multiline
            rows={4}
            helperText="Detalhe as principais características e diferenciais do terreno"
          />

          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Field.Number
                name="preco"
                label="Preço (R$)"
                placeholder="Ex: 150000"
                formatThousands
                required
                helperText="Valor de venda do terreno"
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <Field.Number
                name="area"
                label="Área (m²)"
                placeholder="Ex: 500"
                formatThousands
                helperText="Área total do terreno"
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <Field.Switch
                name="precoNegociavel"
                label="Preço Negociável"
                helperText="Marque se aceita negociação"
              />
            </Grid>
          </Grid>

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Field.Select
                name="status"
                label="Status"
                helperText="Situação atual do terreno"
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
                helperText="Classificação do terreno"
              >
                <MenuItem value="residential">Residencial</MenuItem>
                <MenuItem value="commercial">Comercial</MenuItem>
                <MenuItem value="industrial">Industrial</MenuItem>
                <MenuItem value="rural">Rural</MenuItem>
              </Field.Select>
            </Grid>
          </Grid>
        </Stack>
      </Stack>
    </Card>
  );
}