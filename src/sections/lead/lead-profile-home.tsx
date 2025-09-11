import type { IClientItem } from 'src/types/client';

import { useRef } from 'react';
import { varAlpha } from 'minimal-shared/utils';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid2';
import Button from '@mui/material/Button';
import Switch from '@mui/material/Switch';
import MenuItem from '@mui/material/MenuItem';
import { styled } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import FormControlLabel from '@mui/material/FormControlLabel';

import { fCurrency } from 'src/utils/format-number';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

export type IDateValue = Date | string | number | null;
// ----------------------------------------------------------------------

type Props = {
  client: IClientItem;
};

const ImageContainer = styled(Box)(({ theme }) => ({
  width: 100,
  height: 100,
  borderRadius: '50%',
  backgroundColor: varAlpha(theme.vars.palette.grey['500Channel'], 0.2),
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  margin: '0 auto',
  marginBottom: theme.spacing(1),
  position: 'relative',
}));

export function ClientProfileForm({ client }: Props) {
  const fileRef = useRef<HTMLInputElement>(null);

  const handleAttach = () => {
    if (fileRef.current) {
      fileRef.current.click();
    }
  };

  return (
    <>
      <Typography variant="h4" sx={{ my: 5 }}>
        Dados de {client.name.split(' ')[0]}
      </Typography>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ p: 3 }}>
            <Box sx={{ textAlign: 'center' }}>
              <ImageContainer onClick={handleAttach}>
                {client.avatarUrl ? (
                  <Box
                    component="img"
                    src={client.avatarUrl}
                    alt={client.name}
                    sx={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
                  />
                ) : (
                  <Iconify icon="solar:camera-bold" width={32} />
                )}

                <Box
                  sx={{
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: 'rgba(0, 0, 0, 0.3)',
                    borderRadius: '50%',
                    opacity: 0.7,
                    cursor: 'pointer',
                  }}
                >
                  <Iconify icon="solar:camera-bold" width={24} color="white" />
                </Box>
              </ImageContainer>

              <Typography variant="body2" sx={{ mt: 1, mb: 2 }}>
                Atualizar foto
              </Typography>

              <Typography variant="caption" sx={{ display: 'block', color: 'text.secondary' }}>
                Permitido *.jpeg, *.jpg, *.png, *.gif
              </Typography>

              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                Tamanho máximo de 3.1 MB
              </Typography>

              <Box sx={{ mt: 3 }}>
                <FormControlLabel
                  control={<Switch checked={!client.isVerified} />}
                  label="Privar cliente"
                  sx={{ mb: 2 }}
                />
              </Box>
            </Box>

            <input ref={fileRef} type="file" style={{ display: 'none' }} />
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 8 }}>
          <Card sx={{ p: 3 }}>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField fullWidth label="Nome" defaultValue={client.name} sx={{ mb: 3 }} />
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <TextField fullWidth label="Email" defaultValue={client.email} sx={{ mb: 3 }} />
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  label="Telefone"
                  defaultValue={client.phoneNumber}
                  sx={{ mb: 3 }}
                />
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  label="Endereço"
                  defaultValue={client.address}
                  sx={{ mb: 3 }}
                />
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  select
                  fullWidth
                  label="País"
                  defaultValue={client.country}
                  sx={{ mb: 3 }}
                >
                  <MenuItem value={client.country}>{client.country}</MenuItem>
                </TextField>
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  select
                  fullWidth
                  label="Estado"
                  defaultValue={client.state}
                  sx={{ mb: 3 }}
                >
                  <MenuItem value={client.state}>{client.state}</MenuItem>
                </TextField>
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <TextField fullWidth label="Cidade" defaultValue={client.city} sx={{ mb: 3 }} />
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <TextField fullWidth label="CEP" defaultValue={client.zipCode} sx={{ mb: 3 }} />
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  label="Profissão"
                  defaultValue={client.profession}
                  sx={{ mb: 3 }}
                />
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  label="Data de aniversário"
                  defaultValue={client.createdAt}
                  sx={{ mb: 3 }}
                />
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <TextField fullWidth label="CPF" defaultValue="000.000.000-00" sx={{ mb: 3 }} />
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <TextField fullWidth label="RG" defaultValue="00000-00" sx={{ mb: 3 }} />
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  select
                  fullWidth
                  label="Estado civil"
                  defaultValue="solteiro"
                  sx={{ mb: 3 }}
                >
                  <MenuItem value="solteiro">Solteiro</MenuItem>
                  <MenuItem value="casado">Casado</MenuItem>
                </TextField>
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  label="Nome do cônjuge"
                  defaultValue="Pedro Paulo"
                  sx={{ mb: 3 }}
                />
              </Grid>

              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  label="Renda bruta atual"
                  defaultValue={fCurrency(client.value)}
                  sx={{ mb: 3 }}
                />
              </Grid>
            </Grid>

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
              <Button variant="contained" color="primary">
                Salvar ajustes
              </Button>
            </Box>
          </Card>
        </Grid>
      </Grid>
    </>
  );
}
