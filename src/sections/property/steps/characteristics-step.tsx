import { Card, Stack, Typography, Grid, MenuItem, FormControlLabel, Checkbox, FormGroup } from '@mui/material';
import { Field } from 'src/components/hook-form';
import { useFormContext } from 'react-hook-form';

export function CharacteristicsStep() {
  const { watch, setValue } = useFormContext();
  const comodidades = watch('comodidades') || {};

  const handleComodidadeChange = (comodidade: string, checked: boolean) => {
    setValue(`comodidades.${comodidade}`, checked);
  };

  return (
    <Card sx={{ p: 4 }}>
      <Stack spacing={4}>
        <Stack spacing={1}>
          <Typography variant="h5" sx={{ fontWeight: 600 }}>
            Características
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Detalhe as características específicas do imóvel
          </Typography>
        </Stack>

        <Stack spacing={3}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Field.Number
                name="suites"
                label="Suítes"
                placeholder="Ex: 1"
                helperText="Número de suítes"
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <Field.Text
                name="anoConstucao"
                label="Ano de Construção"
                placeholder="Ex: 2020"
                helperText="Ano que foi construído"
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <Field.Select
                name="condicaoImovel"
                label="Condição do Imóvel"
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
            <Grid item xs={12} md={4}>
              <Field.Switch
                name="elevador"
                label="Elevador"
                helperText="Prédio possui elevador"
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <Field.Switch
                name="sacada"
                label="Sacada/Varanda"
                helperText="Possui sacada ou varanda"
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <Field.Switch
                name="temDocumentacao"
                label="Documentação Regular"
                helperText="Possui documentação regularizada"
              />
            </Grid>
          </Grid>

          <Typography variant="h6" sx={{ mt: 3, mb: 2 }}>
            Comodidades do Imóvel
          </Typography>
          
          <FormGroup>
            <Grid container spacing={2}>
              {[
                { key: 'arCondicionado', label: 'Ar Condicionado' },
                { key: 'aquecimento', label: 'Aquecimento' },
                { key: 'churrasqueira', label: 'Churrasqueira' },
                { key: 'lareira', label: 'Lareira' },
                { key: 'jardim', label: 'Jardim' },
                { key: 'quintal', label: 'Quintal' },
                { key: 'areaServico', label: 'Área de Serviço' },
                { key: 'despensa', label: 'Despensa' },
                { key: 'closet', label: 'Closet' },
                { key: 'escritorio', label: 'Escritório' },
                { key: 'lavabo', label: 'Lavabo' },
                { key: 'dependenciaEmpregada', label: 'Dependência de Empregada' }
              ].map((item) => (
                <Grid item xs={12} sm={6} md={4} key={item.key}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={comodidades[item.key] || false}
                        onChange={(e) => handleComodidadeChange(item.key, e.target.checked)}
                      />
                    }
                    label={item.label}
                  />
                </Grid>
              ))}
            </Grid>
          </FormGroup>

          <Typography variant="h6" sx={{ mt: 3, mb: 2 }}>
            Comodidades do Condomínio
          </Typography>
          
          <FormGroup>
            <Grid container spacing={2}>
              {[
                { key: 'piscina', label: 'Piscina' },
                { key: 'academia', label: 'Academia' },
                { key: 'salaFestas', label: 'Salão de Festas' },
                { key: 'playground', label: 'Playground' },
                { key: 'quadraEsportes', label: 'Quadra de Esportes' },
                { key: 'sauna', label: 'Sauna' },
                { key: 'salaoJogos', label: 'Salão de Jogos' },
                { key: 'jardimComum', label: 'Jardim Comum' },
                { key: 'portaria24h', label: 'Portaria 24h' },
                { key: 'seguranca', label: 'Segurança' },
                { key: 'interfone', label: 'Interfone' },
                { key: 'circuitoFechado', label: 'Circuito Fechado' }
              ].map((item) => (
                <Grid item xs={12} sm={6} md={4} key={item.key}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={comodidades[`condominio_${item.key}`] || false}
                        onChange={(e) => handleComodidadeChange(`condominio_${item.key}`, e.target.checked)}
                      />
                    }
                    label={item.label}
                  />
                </Grid>
              ))}
            </Grid>
          </FormGroup>
        </Stack>
      </Stack>
    </Card>
  );
}