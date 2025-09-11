import { useState } from 'react';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Select from '@mui/material/Select';
import { Typography } from '@mui/material';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

interface Props {
  currentReport?: any;
}

export function RelatoriosV4NewEditForm({ currentReport }: Props) {
  const [formData, setFormData] = useState({
    name: currentReport?.name || '',
    description: currentReport?.description || '',
    type: currentReport?.type || 'vendas',
    status: currentReport?.status || 'ativo',
  });

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    // Handle form submission
  };

  return (
    <Box>
      <Stack spacing={3}>
        <TextField
          label="Nome do Relatório"
          value={formData.name}
          onChange={(e) => handleChange('name', e.target.value)}
          fullWidth
        />

        <TextField
          label="Descrição"
          value={formData.description}
          onChange={(e) => handleChange('description', e.target.value)}
          multiline
          rows={4}
          fullWidth
        />

        <FormControl fullWidth>
          <InputLabel>Tipo de Relatório</InputLabel>
          <Select
            value={formData.type}
            label="Tipo de Relatório"
            onChange={(e) => handleChange('type', e.target.value)}
          >
            <MenuItem value="vendas">Vendas</MenuItem>
            <MenuItem value="comissionamento">Comissionamento</MenuItem>
            <MenuItem value="performance">Performance</MenuItem>
            <MenuItem value="analitico">Analítico</MenuItem>
          </Select>
        </FormControl>

        <FormControl fullWidth>
          <InputLabel>Status</InputLabel>
          <Select
            value={formData.status}
            label="Status"
            onChange={(e) => handleChange('status', e.target.value)}
          >
            <MenuItem value="ativo">Ativo</MenuItem>
            <MenuItem value="desativados">Desativado</MenuItem>
            <MenuItem value="arquivado">Arquivado</MenuItem>
          </Select>
        </FormControl>

        <Box
          sx={{
            p: 3,
            border: '1px dashed',
            borderColor: 'divider',
            borderRadius: 1,
            textAlign: 'center',
          }}
        >
          <Typography variant="body2" color="text.secondary">
            Configurações avançadas do relatório serão adicionadas aqui
          </Typography>
        </Box>

        <Stack direction="row" spacing={2} justifyContent="flex-end">
          <Button
            variant="contained"
            onClick={handleSubmit}
            startIcon={<Iconify icon="solar:save-bold" />}
          >
            {currentReport ? 'Salvar Alterações' : 'Criar Relatório'}
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}
