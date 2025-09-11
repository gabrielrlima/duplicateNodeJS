import { z } from 'zod';
import React, { useState, useEffect } from 'react';

import Grid from '@mui/material/Grid2';
import { Box, Card, MenuItem, TextField, Typography, CardContent } from '@mui/material';

interface LocationInfoFormProps {
  onComplete: () => void;
}

// Estados brasileiros
const estadosBrasil = [
  { value: 'AC' },
  { value: 'AL' },
  { value: 'AP' },
  { value: 'AM' },
  { value: 'BA' },
  { value: 'CE' },
  { value: 'DF' },
  { value: 'ES' },
  { value: 'GO' },
  { value: 'MA' },
  { value: 'MT' },
  { value: 'MS' },
  { value: 'MG' },
  { value: 'PA' },
  { value: 'PB' },
  { value: 'PR' },
  { value: 'PE' },
  { value: 'PI' },
  { value: 'RJ' },
  { value: 'RN' },
  { value: 'RS' },
  { value: 'RO' },
  { value: 'RR' },
  { value: 'SC' },
  { value: 'SP' },
  { value: 'SE' },
  { value: 'TO' },
];

// Schema de validação com Zod
const locationSchema = z.object({
  cep: z.string().min(9, 'CEP deve ter formato 00000-000'),
  rua: z.string().min(3, 'Rua é obrigatória'),
  numero: z.string().min(1, 'Número é obrigatório'),
  bairro: z.string().min(2, 'Bairro é obrigatório'),
  cidade: z.string().min(2, 'Cidade é obrigatória'),
  estado: z.string().min(2, 'Estado é obrigatório'),
});

// Tipo para os dados do formulário
type LocationFormData = z.infer<typeof locationSchema>;

// Função para aplicar máscara no CEP
const applyCepMask = (value: string): string => {
  const numbers = value.replace(/\D/g, '');
  if (numbers.length <= 5) {
    return numbers;
  }
  return `${numbers.slice(0, 5)}-${numbers.slice(5, 8)}`;
};

// Função para permitir apenas números
const onlyNumbers = (value: string): string => value.replace(/\D/g, '');

const LocationInfoForm: React.FC<LocationInfoFormProps> = ({ onComplete }) => {
  // Estado para os dados do formulário
  const [formData, setFormData] = useState<LocationFormData>({
    cep: '',
    rua: '',
    numero: '',
    bairro: '',
    cidade: '',
    estado: '',
  });

  // Estado para os erros de validação
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Função para atualizar o estado do formulário
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    let processedValue = value;

    // Aplicar máscara no CEP
    if (name === 'cep') {
      processedValue = applyCepMask(value);
    }

    // Permitir apenas números no campo número
    if (name === 'numero') {
      processedValue = onlyNumbers(value);
    }

    setFormData((prev) => ({ ...prev, [name]: processedValue }));
  };

  // Validação em tempo real
  useEffect(() => {
    const result = locationSchema.safeParse(formData);
    if (!result.success) {
      const formattedErrors: Record<string, string> = {};
      result.error.errors.forEach((error) => {
        if (error.path[0]) {
          formattedErrors[error.path[0] as string] = error.message;
        }
      });
      setErrors(formattedErrors);
    } else {
      setErrors({});
    }
  }, [formData]);

  // Verificar se todos os campos são válidos
  const isFormValid =
    Object.keys(errors).length === 0 &&
    Object.values(formData).every((value) => value.trim() !== '');

  // Salvar dados no localStorage para persistência entre steps
  useEffect(() => {
    const savedData = localStorage.getItem('locationFormData');
    if (savedData) {
      setFormData(JSON.parse(savedData));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('locationFormData', JSON.stringify(formData));
  }, [formData]);

  // Permitir avançar apenas se o formulário for válido
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && isFormValid) {
        onComplete();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFormValid, onComplete]);

  return (
    <Card>
      <CardContent>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" sx={{ mb: 1 }}>
            Localização do imóvel
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Informe o endereço completo, incluindo CEP, rua, número, bairro, cidade e estado para
            facilitar a busca e visualização do imóvel.
          </Typography>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12 }}>
              <Box sx={{ mb: 3 }}>
                <TextField
                  fullWidth
                  name="cep"
                  label="CEP"
                  placeholder="00000-000"
                  value={formData.cep}
                  onChange={handleChange}
                  error={!!errors.cep}
                  helperText={errors.cep}
                  inputProps={{ maxLength: 9 }}
                  sx={{
                    '& .MuiOutlinedInput-root': { borderRadius: 1 },
                  }}
                />
              </Box>
            </Grid>
            <Grid size={{ xs: 12 }}>
              <Box sx={{ mb: 3 }}>
                <TextField
                  fullWidth
                  name="rua"
                  label="Rua"
                  placeholder="Ex: Avenida Paulista"
                  value={formData.rua}
                  onChange={handleChange}
                  error={!!errors.rua}
                  helperText={errors.rua}
                  sx={{
                    '& .MuiOutlinedInput-root': { borderRadius: 1 },
                  }}
                />
              </Box>
            </Grid>
            <Grid size={{ xs: 12 }}>
              <Box sx={{ mb: 3 }}>
                <TextField
                  fullWidth
                  name="numero"
                  label="Número"
                  placeholder="Ex: 1000"
                  value={formData.numero}
                  onChange={handleChange}
                  error={!!errors.numero}
                  helperText={errors.numero}
                  sx={{
                    '& .MuiOutlinedInput-root': { borderRadius: 1 },
                  }}
                />
              </Box>
            </Grid>
            <Grid size={{ xs: 12 }}>
              <Box sx={{ mb: 3 }}>
                <TextField
                  fullWidth
                  name="bairro"
                  label="Bairro"
                  placeholder="Ex: Centro"
                  value={formData.bairro}
                  onChange={handleChange}
                  error={!!errors.bairro}
                  helperText={errors.bairro}
                  sx={{
                    '& .MuiOutlinedInput-root': { borderRadius: 1 },
                  }}
                />
              </Box>
            </Grid>
            <Grid size={{ xs: 12 }}>
              <Box sx={{ mb: 3 }}>
                <TextField
                  fullWidth
                  name="cidade"
                  label="Cidade"
                  placeholder="Ex: São Paulo"
                  value={formData.cidade}
                  onChange={handleChange}
                  error={!!errors.cidade}
                  helperText={errors.cidade}
                  sx={{
                    '& .MuiOutlinedInput-root': { borderRadius: 1 },
                  }}
                />
              </Box>
            </Grid>
            <Grid size={{ xs: 12 }}>
              <Box sx={{ mb: 3 }}>
                <TextField
                  fullWidth
                  select
                  name="estado"
                  label="Estado"
                  value={formData.estado}
                  onChange={handleChange}
                  error={!!errors.estado}
                  helperText={errors.estado}
                  sx={{
                    '& .MuiOutlinedInput-root': { borderRadius: 1 },
                  }}
                >
                  {estadosBrasil.map((estado) => (
                    <MenuItem key={estado.value} value={estado.value}>
                      {estado.value}
                    </MenuItem>
                  ))}
                </TextField>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </CardContent>
    </Card>
  );
};

export default LocationInfoForm;
