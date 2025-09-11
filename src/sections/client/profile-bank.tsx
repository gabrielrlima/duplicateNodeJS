import type { IClientItem } from 'src/types/client';

import React, { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Select from '@mui/material/Select';
import { Typography } from '@mui/material';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';

type ProfileBankProps = {
  data: any;
  client: IClientItem;
};

const bancos = [
  'Banco do Brasil',
  'Caixa Econômica Federal',
  'Bradesco',
  'Itaú',
  'Santander',
  'Nubank',
  'Inter',
];

const tiposConta = ['Conta Corrente', 'Conta Poupança', 'Conta Salário'];

const tiposChavePix = ['CPF', 'CNPJ', 'Email', 'Telefone', 'Chave Aleatória'];

export default function ProfileBank({ data, client }: ProfileBankProps) {
  const [formData, setFormData] = useState({
    banco: '',
    tipoConta: '',
    conta: '',
    agencia: '',
    chavePix: '',
    tipoChavePix: '',
  });

  useEffect(() => {
    // Carrega os dados do mock
    if (data && data.length > 0) {
      const bankData = data[0];
      setFormData({
        banco: bankData.banco || '',
        tipoConta: bankData.tipoConta || '',
        conta: bankData.conta || '',
        agencia: bankData.agencia || '',
        chavePix: bankData.chavePix || '',
        tipoChavePix: bankData.tipoChavePix || '',
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
    console.log('Dados bancários salvos:', formData);
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
              <FormControl fullWidth variant="outlined">
                <InputLabel id="banco-label">Banco</InputLabel>
                <Select
                  labelId="banco-label"
                  id="banco"
                  name="banco"
                  value={formData.banco}
                  onChange={handleChange}
                  label="Banco"
                >
                  {bancos.map((banco) => (
                    <MenuItem key={banco} value={banco}>
                      {banco}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth variant="outlined">
                <InputLabel id="tipo-conta-label">Tipo de conta</InputLabel>
                <Select
                  labelId="tipo-conta-label"
                  id="tipoConta"
                  name="tipoConta"
                  value={formData.tipoConta}
                  onChange={handleChange}
                  label="Tipo de conta"
                >
                  {tiposConta.map((tipo) => (
                    <MenuItem key={tipo} value={tipo}>
                      {tipo}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Conta"
                name="conta"
                value={formData.conta}
                onChange={handleChange}
                placeholder="0000-0"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Agência com dígito"
                name="agencia"
                value={formData.agencia}
                onChange={handleChange}
                placeholder="000-1"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth variant="outlined">
                <InputLabel id="tipo-chave-pix-label">Tipo de chave Pix</InputLabel>
                <Select
                  labelId="tipo-chave-pix-label"
                  id="tipoChavePix"
                  name="tipoChavePix"
                  value={formData.tipoChavePix}
                  onChange={handleChange}
                  label="Tipo de chave Pix"
                >
                  {tiposChavePix.map((tipo) => (
                    <MenuItem key={tipo} value={tipo}>
                      {tipo}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Chave Pix"
                name="chavePix"
                value={formData.chavePix}
                onChange={handleChange}
                placeholder="000.000.000-00"
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
