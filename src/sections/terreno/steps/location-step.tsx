import { Card, Stack, Typography, Grid, MenuItem } from '@mui/material';
import { Field } from 'src/components/hook-form';

// Lista de estados brasileiros
const ESTADOS_BRASILEIROS = [
  { value: 'AC', label: 'Acre (AC)' },
  { value: 'AL', label: 'Alagoas (AL)' },
  { value: 'AP', label: 'Amapá (AP)' },
  { value: 'AM', label: 'Amazonas (AM)' },
  { value: 'BA', label: 'Bahia (BA)' },
  { value: 'CE', label: 'Ceará (CE)' },
  { value: 'DF', label: 'Distrito Federal (DF)' },
  { value: 'ES', label: 'Espírito Santo (ES)' },
  { value: 'GO', label: 'Goiás (GO)' },
  { value: 'MA', label: 'Maranhão (MA)' },
  { value: 'MT', label: 'Mato Grosso (MT)' },
  { value: 'MS', label: 'Mato Grosso do Sul (MS)' },
  { value: 'MG', label: 'Minas Gerais (MG)' },
  { value: 'PA', label: 'Pará (PA)' },
  { value: 'PB', label: 'Paraíba (PB)' },
  { value: 'PR', label: 'Paraná (PR)' },
  { value: 'PE', label: 'Pernambuco (PE)' },
  { value: 'PI', label: 'Piauí (PI)' },
  { value: 'RJ', label: 'Rio de Janeiro (RJ)' },
  { value: 'RN', label: 'Rio Grande do Norte (RN)' },
  { value: 'RS', label: 'Rio Grande do Sul (RS)' },
  { value: 'RO', label: 'Rondônia (RO)' },
  { value: 'RR', label: 'Roraima (RR)' },
  { value: 'SC', label: 'Santa Catarina (SC)' },
  { value: 'SP', label: 'São Paulo (SP)' },
  { value: 'SE', label: 'Sergipe (SE)' },
  { value: 'TO', label: 'Tocantins (TO)' }
];

export function LocationStep() {
  return (
    <Card sx={{ p: 4 }}>
      <Stack spacing={4}>
        <Stack spacing={1}>
          <Typography variant="h5" sx={{ fontWeight: 600 }}>
            Localização
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Informe o endereço completo do terreno
          </Typography>
        </Stack>

        <Stack spacing={3}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              <Field.Text
                name="endereco.rua"
                label="Rua"
                placeholder="Ex: Rua das Flores"
                required
                helperText="Nome da rua, avenida ou logradouro"
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <Field.Text
                name="endereco.numero"
                label="Número"
                placeholder="Ex: 123"
                required
                helperText="Número do imóvel"
              />
            </Grid>
          </Grid>

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Field.Text
                name="endereco.bairro"
                label="Bairro"
                placeholder="Ex: Centro"
                required
                helperText="Nome do bairro"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Field.Text
                name="endereco.cidade"
                label="Cidade"
                placeholder="Ex: São Paulo"
                required
                helperText="Nome da cidade"
              />
            </Grid>
          </Grid>

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Field.Select
                name="endereco.estado"
                label="Estado (UF)"
                placeholder="Selecione o estado"
                required
                helperText="Selecione o estado brasileiro"
              >
                <MenuItem value="" disabled>
                  Selecione o estado
                </MenuItem>
                {ESTADOS_BRASILEIROS.map((estado) => (
                  <MenuItem key={estado.value} value={estado.value}>
                    {estado.label}
                  </MenuItem>
                ))}
              </Field.Select>
            </Grid>
            <Grid item xs={12} md={6}>
              <Field.Cep
                name="endereco.cep"
                label="CEP"
                placeholder="Ex: 01234-567"
                required
                helperText="Código postal da região"
              />
            </Grid>
          </Grid>
        </Stack>
      </Stack>
    </Card>
  );
}