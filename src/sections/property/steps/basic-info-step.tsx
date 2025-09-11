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
            Preencha os dados principais do imóvel
          </Typography>
        </Stack>

        <Stack spacing={3}>
          <Field.Text 
            name="titulo" 
            label="Título do Imóvel" 
            placeholder="Ex: Apartamento 3 Quartos Vila Madalena"
            required
            helperText="Escolha um título atrativo e descritivo"
          />
          
          <Field.Text 
            name="descricao" 
            label="Descrição" 
            placeholder="Descreva as características do imóvel..."
            multiline
            rows={4}
            helperText="Detalhe as principais características e diferenciais do imóvel"
          />

          <Field.Number
            name="preco"
            label="Preço"
            placeholder="Ex: 350000"
            formatThousands
            required
            helperText="Valor do imóvel em reais"
            InputProps={{
              startAdornment: 'R$'
            }}
          />

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Field.Select
                name="finalidade"
                label="Finalidade"
                required
                helperText="Tipo de negociação"
              >
                <MenuItem value="venda">Venda</MenuItem>
                <MenuItem value="aluguel">Aluguel</MenuItem>
                <MenuItem value="venda_aluguel">Venda e Aluguel</MenuItem>
              </Field.Select>
            </Grid>
            <Grid item xs={12} md={6}>
              <Field.Select
                name="tipo"
                label="Tipo de Imóvel"
                required
                helperText="Classificação do imóvel"
              >
                <MenuItem value="apartamento">Apartamento</MenuItem>
                <MenuItem value="casa">Casa</MenuItem>
                <MenuItem value="sobrado">Sobrado</MenuItem>
                <MenuItem value="cobertura">Cobertura</MenuItem>
                <MenuItem value="kitnet">Kitnet</MenuItem>
                <MenuItem value="loft">Loft</MenuItem>
                <MenuItem value="comercial">Comercial</MenuItem>
                <MenuItem value="terreno">Terreno</MenuItem>
              </Field.Select>
            </Grid>
          </Grid>

          <Grid container spacing={3}>
            <Grid item xs={12} md={3}>
              <Field.Number
                name="area"
                label="Área (m²)"
                placeholder="Ex: 85"
                formatThousands
                required
                helperText="Área útil do imóvel"
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <Field.Number
                name="quartos"
                label="Quartos"
                placeholder="Ex: 3"
                helperText="Número de quartos"
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <Field.Number
                name="banheiros"
                label="Banheiros"
                placeholder="Ex: 2"
                helperText="Número de banheiros"
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <Field.Number
                name="vagasGaragem"
                label="Vagas Garagem"
                placeholder="Ex: 1"
                helperText="Número de vagas"
              />
            </Grid>
          </Grid>

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Field.Select
                name="status"
                label="Status"
                helperText="Situação atual do imóvel"
              >
                <MenuItem value="available">Disponível</MenuItem>
                <MenuItem value="sold">Vendido</MenuItem>
              <MenuItem value="reserved">Reservado</MenuItem>
              </Field.Select>
            </Grid>
            <Grid item xs={12} md={6}>
              <Field.Select
                name="condicao"
                label="Condição"
                helperText="Estado de conservação"
              >
                <MenuItem value="novo">Novo</MenuItem>
                <MenuItem value="seminovo">Semi-novo</MenuItem>
                <MenuItem value="usado">Usado</MenuItem>
                <MenuItem value="reformado">Reformado</MenuItem>
                <MenuItem value="a_reformar">A reformar</MenuItem>
              </Field.Select>
            </Grid>
          </Grid>

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Field.Switch
                name="precoNegociavel"
                label="Preço Negociável"
                helperText="Marque se aceita negociação"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Field.Switch
                name="mobiliado"
                label="Mobiliado"
                helperText="Imóvel vem com móveis"
              />
            </Grid>
          </Grid>
        </Stack>
      </Stack>
    </Card>
  );
}