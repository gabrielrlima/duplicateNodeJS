import { z as zod } from 'zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';

import { Form, Field } from 'src/components/hook-form';

import type { PlantaItemType } from './planta-item';

// ----------------------------------------------------------------------

export type NewPlantaSchemaType = zod.infer<typeof NewPlantaSchema>;

export const NewPlantaSchema = zod.object({
  area: zod.coerce.number({
    required_error: 'Área é obrigatória',
    invalid_type_error: 'Área deve ser um número',
  }).positive({ message: 'Área deve ser maior que 0' }),
  precoPorM2: zod.coerce.number({
    required_error: 'Preço por m² é obrigatório',
    invalid_type_error: 'Preço por m² deve ser um número',
  }).positive({ message: 'Preço por m² deve ser maior que 0' }),
  descricao: zod.string().optional(),
});

// ----------------------------------------------------------------------

type Props = {
  open: boolean;
  onClose: () => void;
  onCreate: (planta: PlantaItemType) => void;
  currentPlanta?: PlantaItemType | null;
};

export function PlantaNewForm({ open, onClose, onCreate, currentPlanta }: Props) {
  const isEdit = !!currentPlanta;

  const defaultValues: NewPlantaSchemaType = {
    area: currentPlanta?.area || 0,
    precoPorM2: currentPlanta?.precoPorM2 || 0,
    descricao: currentPlanta?.descricao || '',
  };

  const methods = useForm<NewPlantaSchemaType>({
    mode: 'all',
    resolver: zodResolver(NewPlantaSchema),
    defaultValues,
  });

  // Reset form when currentPlanta changes or dialog opens
  useEffect(() => {
    if (open) {
      const newDefaultValues: NewPlantaSchemaType = {
        area: currentPlanta?.area || 0,
        precoPorM2: currentPlanta?.precoPorM2 || 0,
        descricao: currentPlanta?.descricao || '',
      };
      methods.reset(newDefaultValues);
    }
  }, [open, currentPlanta, methods]);

  const {
    handleSubmit,
    watch,
    formState: { isSubmitting },
  } = methods;

  const watchedArea = watch('area');
  const watchedPrecoPorM2 = watch('precoPorM2');
  const precoTotal = (watchedArea || 0) * (watchedPrecoPorM2 || 0);

  const onSubmit = handleSubmit(async (data) => {
    try {
      console.log('🌱 PLANTA FORM - Submetendo dados:', data);
      console.log('🌱 PLANTA FORM - Modo:', isEdit ? 'EDIÇÃO' : 'CRIAÇÃO');
      console.log('🌱 PLANTA FORM - Timestamp:', new Date().toISOString());
      
      const plantaData: PlantaItemType = {
        id: currentPlanta?.id || `planta-${Date.now()}`,
        area: data.area,
        precoPorM2: data.precoPorM2,
        descricao: data.descricao,
      };
      
      console.log('🌱 PLANTA FORM - Dados da planta criados:', plantaData);
      console.log('🌱 PLANTA FORM - Chamando onCreate...');
      
      onCreate(plantaData);
      
      console.log('✅ PLANTA FORM - onCreate executado com sucesso');
      
      // 🔄 COMPORTAMENTO DEFINITIVO: Modal SEMPRE permanece aberto para permitir múltiplas adições
      console.log('🌱 PLANTA FORM - MODAL PERMANECE ABERTO - Limpando formulário para próxima planta...');
      console.log('🚫 PLANTA FORM - NUNCA FECHA AUTOMATICAMENTE - Usuário controla fechamento');
      
      methods.reset({
        area: 0,
        precoPorM2: 0,
        descricao: '',
      });
      
      // Focar no primeiro campo para facilitar a próxima entrada
      setTimeout(() => {
        const areaField = document.querySelector('input[name="area"]') as HTMLInputElement;
        if (areaField) {
          areaField.focus();
          areaField.select();
          console.log('🎯 PLANTA FORM - Foco definido no campo área');
        }
      }, 100);
      
      console.log('✅ PLANTA FORM - Modal permanece aberto para adicionar mais plantas');
      console.log('✅ PLANTA FORM - Operação concluída com sucesso - MODAL NÃO FECHA');
    } catch (error) {
      console.error('❌ PLANTA FORM - Erro ao submeter:', error);
      throw error; // Re-throw para não mascarar o erro
    }
  });

  return (
    <Dialog fullWidth maxWidth="sm" open={open} onClose={onClose}>
      <Form methods={methods} onSubmit={onSubmit}>
        <DialogTitle>
          {isEdit ? 'Editar Planta' : 'Nova Planta'}
        </DialogTitle>

        <DialogContent dividers sx={{ pt: 3 }}>
          <Stack spacing={3}>
            <Box
              sx={{
                rowGap: 3,
                columnGap: 2,
                display: 'grid',
                gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' },
              }}
            >
              <Field.Text 
                name="area" 
                label="Área (m²)" 
                type="number"
                helperText="Área da planta em metros quadrados"
              />

              <Field.Text 
                name="precoPorM2" 
                label="Preço por m²" 
                type="number"
                helperText="Valor por metro quadrado"
                slotProps={{
                  input: {
                    startAdornment: 'R$',
                  },
                }}
              />
            </Box>

            <Field.Text 
              name="descricao" 
              label="Descrição (opcional)" 
              multiline
              rows={3}
              placeholder="Ex: Apartamento com 2 quartos, sala, cozinha e banheiro..."
              helperText="Descreva as características principais desta planta"
            />



            {/* Resumo do preço */}
            {precoTotal > 0 && (
              <Box
                sx={{
                  p: 2,
                  borderRadius: 1,
                  bgcolor: 'background.neutral',
                  border: (theme) => `1px solid ${theme.vars.palette.divider}`,
                }}
              >
                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                  Resumo do Preço
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  {watchedArea || 0}m² × R$ {(watchedPrecoPorM2 || 0).toLocaleString('pt-BR', {
                    minimumFractionDigits: 2,
                  })}/m²
                </Typography>
                <Typography variant="h6" sx={{ color: 'primary.main', mt: 0.5 }}>
                  Total: R$ {(precoTotal || 0).toLocaleString('pt-BR', {
                    minimumFractionDigits: 2,
                  })}
                </Typography>
              </Box>
            )}
          </Stack>
        </DialogContent>

        <DialogActions>
          <Button color="inherit" variant="outlined" onClick={onClose}>
            Concluir Adições
          </Button>

          <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
            {isEdit ? 'Salvar e Continuar' : 'Adicionar Planta'}
          </LoadingButton>
        </DialogActions>
      </Form>
    </Dialog>
  );
}