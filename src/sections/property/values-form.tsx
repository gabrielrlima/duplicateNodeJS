import { z } from 'zod';
import React, { useState, useEffect } from 'react';

import Grid from '@mui/material/Grid2';
import {
  Box,
  Card,
  MenuItem,
  Checkbox,
  TextField,
  Typography,
  CardContent,
  InputAdornment,
  FormControlLabel,
} from '@mui/material';

interface ValuesFormProps {
  onComplete: () => void;
}

// Schema de validação com Zod
const valuesSchema = z
  .object({
    purpose: z.string().min(1, 'Finalidade é obrigatória'),
    salePrice: z.string().optional(),
    rentPrice: z.string().optional(),
    acceptsFinancing: z.string().min(1, 'Campo obrigatório'),
    acceptsExchange: z.string().min(1, 'Campo obrigatório'),
    condominiumValue: z.string().min(1, 'Valor do condomínio é obrigatório'),
    iptuValue: z.string().min(1, 'Valor do IPTU é obrigatório'),
    observations: z.string().optional(),
  })
  .refine(
    (data) => {
      // Validação customizada: pelo menos um valor deve estar preenchido
      if (data.purpose === 'venda' && !data.salePrice?.trim()) {
        return false;
      }
      if (data.purpose === 'aluguel' && !data.rentPrice?.trim()) {
        return false;
      }
      if (
        data.purpose === 'venda_aluguel' &&
        (!data.salePrice?.trim() || !data.rentPrice?.trim())
      ) {
        return false;
      }
      return true;
    },
    {
      message: 'Valores devem ser preenchidos conforme a finalidade selecionada',
      path: ['salePrice'],
    }
  );

// Tipo para os dados do formulário
type ValuesFormData = z.infer<typeof valuesSchema>;

const ValuesForm: React.FC<ValuesFormProps> = ({ onComplete }) => {
  // Estado para os dados do formulário
  const [formData, setFormData] = useState<ValuesFormData>({
    purpose: 'venda',
    salePrice: '',
    rentPrice: '',
    acceptsFinancing: 'sim',
    acceptsExchange: 'nao',
    condominiumValue: '700,00',
    iptuValue: '700,00',
    observations: '',
  });

  // Estado para as opções adicionais
  const [additionalOptions, setAdditionalOptions] = useState<Record<string, boolean>>({
    showPriceOnConsultation: false,
    exclusiveProperty: false,
    highlightProperty: false,
  });

  // Estado para os erros de validação
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Função para atualizar o estado do formulário
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Função para atualizar o estado dos checkboxes
  const handleOptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setAdditionalOptions((prev) => ({ ...prev, [name]: checked }));
  };

  // Validação em tempo real
  useEffect(() => {
    const result = valuesSchema.safeParse(formData);
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

  // Verificar se todos os campos obrigatórios são válidos
  const isFormValid =
    Object.keys(errors).length === 0 &&
    formData.purpose.trim() !== '' &&
    formData.condominiumValue.trim() !== '' &&
    formData.iptuValue.trim() !== '';

  // Salvar dados no localStorage para persistência entre steps
  useEffect(() => {
    const savedData = localStorage.getItem('valuesFormData');
    const savedOptions = localStorage.getItem('valuesAdditionalOptions');
    if (savedData) {
      setFormData(JSON.parse(savedData));
    }
    if (savedOptions) {
      setAdditionalOptions(JSON.parse(savedOptions));
    }
    // No cleanup needed for this effect
    return undefined;
  }, []);

  useEffect(() => {
    localStorage.setItem('valuesFormData', JSON.stringify(formData));
    localStorage.setItem('valuesAdditionalOptions', JSON.stringify(additionalOptions));
  }, [formData, additionalOptions]);

  // Permitir avançar apenas se o formulário for válido
  useEffect(() => {
    if (isFormValid) {
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Enter' && isFormValid) {
          onComplete();
        }
      };

      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [isFormValid, onComplete]);

  return (
    <Card>
      <CardContent>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" sx={{ mb: 1 }}>
            Valores do Imóvel
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Defina os valores de venda ou aluguel, além de outras condições financeiras relacionadas
            ao imóvel.
          </Typography>

          <Box sx={{ mb: 3 }}>
            <TextField
              select
              fullWidth
              name="purpose"
              label="Finalidade"
              value={formData.purpose}
              onChange={handleChange}
              error={!!errors.purpose}
              helperText={errors.purpose}
              SelectProps={{
                displayEmpty: true,
                IconComponent: () => (
                  <Box component="span" sx={{ position: 'absolute', right: 14 }}>
                    ▼
                  </Box>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': { borderRadius: 1 },
              }}
            >
              <MenuItem value="venda">Venda</MenuItem>
              <MenuItem value="aluguel">Aluguel</MenuItem>
              <MenuItem value="venda_aluguel">Venda e Aluguel</MenuItem>
            </TextField>
          </Box>

          <Grid container spacing={3}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Box sx={{ mb: 3 }}>
                <TextField
                  fullWidth
                  name="salePrice"
                  label="Valor de Venda"
                  placeholder="0,00"
                  value={formData.salePrice}
                  onChange={handleChange}
                  error={
                    !!errors.salePrice &&
                    (formData.purpose === 'venda' || formData.purpose === 'venda_aluguel')
                  }
                  helperText={
                    errors.salePrice &&
                    (formData.purpose === 'venda' || formData.purpose === 'venda_aluguel')
                      ? errors.salePrice
                      : ''
                  }
                  disabled={formData.purpose === 'aluguel'}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">R$</InputAdornment>,
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': { borderRadius: 1 },
                  }}
                />
              </Box>
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Box sx={{ mb: 3 }}>
                <TextField
                  fullWidth
                  name="rentPrice"
                  label="Valor do Aluguel"
                  placeholder="0,00"
                  value={formData.rentPrice}
                  onChange={handleChange}
                  error={
                    !!errors.rentPrice &&
                    (formData.purpose === 'aluguel' || formData.purpose === 'venda_aluguel')
                  }
                  helperText={
                    errors.rentPrice &&
                    (formData.purpose === 'aluguel' || formData.purpose === 'venda_aluguel')
                      ? errors.rentPrice
                      : ''
                  }
                  disabled={formData.purpose === 'venda'}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">R$</InputAdornment>,
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': { borderRadius: 1 },
                  }}
                />
              </Box>
            </Grid>
          </Grid>

          <Box sx={{ mb: 3 }}>
            <TextField
              select
              fullWidth
              name="acceptsFinancing"
              label="Aceita Financiamento?"
              value={formData.acceptsFinancing}
              onChange={handleChange}
              error={!!errors.acceptsFinancing}
              helperText={errors.acceptsFinancing}
              SelectProps={{
                displayEmpty: true,
                IconComponent: () => (
                  <Box component="span" sx={{ position: 'absolute', right: 14 }}>
                    ▼
                  </Box>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': { borderRadius: 1 },
              }}
            >
              <MenuItem value="sim">Sim</MenuItem>
              <MenuItem value="nao">Não</MenuItem>
            </TextField>
          </Box>

          <Box sx={{ mb: 3 }}>
            <TextField
              select
              fullWidth
              name="acceptsExchange"
              label="Aceita Permuta?"
              value={formData.acceptsExchange}
              onChange={handleChange}
              error={!!errors.acceptsExchange}
              helperText={errors.acceptsExchange}
              SelectProps={{
                displayEmpty: true,
                IconComponent: () => (
                  <Box component="span" sx={{ position: 'absolute', right: 14 }}>
                    ▼
                  </Box>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': { borderRadius: 1 },
              }}
            >
              <MenuItem value="sim">Sim</MenuItem>
              <MenuItem value="nao">Não</MenuItem>
            </TextField>
          </Box>

          <Box sx={{ mb: 3 }}>
            <TextField
              fullWidth
              name="condominiumValue"
              label="Valor do Condomínio"
              placeholder="0,00"
              value={formData.condominiumValue}
              onChange={handleChange}
              error={!!errors.condominiumValue}
              helperText={errors.condominiumValue}
              InputProps={{
                startAdornment: <InputAdornment position="start">R$</InputAdornment>,
              }}
              sx={{
                '& .MuiOutlinedInput-root': { borderRadius: 1 },
              }}
            />
          </Box>

          <Box sx={{ mb: 3 }}>
            <TextField
              fullWidth
              name="iptuValue"
              label="Valor do IPTU"
              placeholder="0,00"
              value={formData.iptuValue}
              onChange={handleChange}
              error={!!errors.iptuValue}
              helperText={errors.iptuValue}
              InputProps={{
                startAdornment: <InputAdornment position="start">R$</InputAdornment>,
              }}
              sx={{
                '& .MuiOutlinedInput-root': { borderRadius: 1 },
              }}
            />
          </Box>

          <Box sx={{ mb: 3 }}>
            <TextField
              fullWidth
              name="observations"
              label="Observações sobre valores"
              multiline
              rows={4}
              placeholder="Coloque aqui informações adicionais sobre valores, condições de pagamento, etc."
              value={formData.observations}
              onChange={handleChange}
              error={!!errors.observations}
              helperText={errors.observations}
              sx={{
                '& .MuiOutlinedInput-root': { borderRadius: 1 },
              }}
            />
          </Box>

          <Typography variant="subtitle2" sx={{ mb: 2 }}>
            Opções adicionais
          </Typography>

          <Grid container spacing={2}>
            <Grid size={{ xs: 12 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={additionalOptions.showPriceOnConsultation}
                    onChange={handleOptionChange}
                    name="showPriceOnConsultation"
                  />
                }
                label="Mostrar valor sob consulta (não exibir o valor no anúncio)"
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={additionalOptions.exclusiveProperty}
                    onChange={handleOptionChange}
                    name="exclusiveProperty"
                  />
                }
                label="Imóvel com exclusividade (você é o único corretor autorizado)"
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={additionalOptions.highlightProperty}
                    onChange={handleOptionChange}
                    name="highlightProperty"
                  />
                }
                label="Destacar este imóvel nos resultados de busca"
              />
            </Grid>
          </Grid>
        </Box>
      </CardContent>
    </Card>
  );
};

export default ValuesForm;
