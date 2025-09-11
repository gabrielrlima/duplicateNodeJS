import type { IClientItem } from 'src/types/client';

import React, { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import InputAdornment from '@mui/material/InputAdornment';

import { Iconify } from 'src/components/iconify';

type ProfileSocialMediaProps = {
  data: any;
  client: IClientItem;
};

export default function ProfileSocialMedia({ data, client }: ProfileSocialMediaProps) {
  const [formData, setFormData] = useState({
    instagram: '',
    tiktok: '',
    whatsapp: '',
  });

  useEffect(() => {
    // Carrega os dados do mock
    if (data && data.length > 0) {
      const socialData = data[0];
      setFormData({
        instagram: socialData.instagram || '',
        tiktok: socialData.tiktok || '',
        whatsapp: socialData.whatsapp || '',
      });
    }
  }, [data]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Dados de redes sociais salvos:', formData);
    // Implemente a chamada API aqui
  };

  return (
    <>
      <Typography variant="h4" sx={{ my: 5 }}>
        Dados de {client.name.split(' ')[0]}
      </Typography>
      <Card sx={{ p: 3 }}>
        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Instagram"
                name="instagram"
                value={formData.instagram}
                onChange={handleChange}
                placeholder="@username"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Iconify icon="mdi:instagram" width={24} />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="TikTok"
                name="tiktok"
                value={formData.tiktok}
                onChange={handleChange}
                placeholder="@username"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Iconify icon="ic:baseline-tiktok" width={24} />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Whatsapp"
                name="whatsapp"
                value={formData.whatsapp}
                onChange={handleChange}
                placeholder="+55 (00) 00000-0000"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Iconify icon="ic:baseline-whatsapp" width={24} />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
          </Grid>

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
            <Button
              variant="contained"
              type="submit"
              sx={{
                bgcolor: '#1e293b',
                '&:hover': { bgcolor: '#0f172a' },
              }}
            >
              Salvar ajustes
            </Button>
          </Box>
        </Box>
      </Card>
    </>
  );
}
