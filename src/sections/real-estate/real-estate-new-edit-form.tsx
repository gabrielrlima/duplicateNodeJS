import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { useDropzone } from 'react-dropzone';
import { useState, useCallback } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'src/routes/hooks';

import { LoadingButton } from '@mui/lab';
import {
  Box,
  Card,
  Stack,
  Button,
  IconButton,
  Typography,
} from '@mui/material';

import { paths } from 'src/routes/paths';
import { useRealEstate } from 'src/hooks/use-real-estate';
import { useRealEstateContext } from 'src/contexts/real-estate-context';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { Form, Field } from 'src/components/hook-form';

// ----------------------------------------------------------------------

// LogoUploadProps interface removida - não utilizada

// LogoUpload component removido completamente - não utilizado

// ----------------------------------------------------------------------

const NewRealEstateSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  cnpj: z.string().min(14, 'CNPJ deve ter 14 dígitos').max(18, 'CNPJ inválido'),
  logo: z.any().optional(),
});

type NewRealEstateSchemaType = z.infer<typeof NewRealEstateSchema>;

// ----------------------------------------------------------------------

export function RealEstateNewEditForm() {
  const router = useRouter();
  const { createRealEstate } = useRealEstate();
  const { switchRealEstate } = useRealEstateContext();
  // Variáveis de logo removidas - não utilizadas

  const defaultValues: NewRealEstateSchemaType = {
    name: '',
    cnpj: '',
    logo: undefined,
  };

  const methods = useForm<NewRealEstateSchemaType>({
    mode: 'all',
    resolver: zodResolver(NewRealEstateSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    reset,
    setValue,
    formState: { isSubmitting },
  } = methods;

  // handleLogoDrop removido - não utilizado

  // handleLogoRemove removido - não utilizado

  const onSubmit = handleSubmit(async (data) => {
    try {
      const newRealEstate = await createRealEstate({
        name: data.name,
        cnpj: data.cnpj,
        // Removido: logo: logoFile,
      });
      
      if (newRealEstate) {
        toast.success('Imobiliária criada com sucesso!');
        reset();
        // Logo removal removido
        
        // Use switchRealEstate to show loading and reload page
        await switchRealEstate(newRealEstate);
        router.push(paths.dashboard.realEstate.list);
      }
    } catch (error) {
      toast.error('Erro ao criar imobiliária');
      console.error('Erro ao criar imobiliária:', error);
    }
  });

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Card sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ mb: 3 }}>
          Informações Básicas
        </Typography>

        <Stack spacing={3}>
          <Field.Text
            name="name"
            label="Nome da Imobiliária"
            placeholder="Digite o nome da imobiliária"
          />
          
          <Field.Document
            name="cnpj"
            label="CNPJ"
          />
          
          {/* Removido campo de upload de logo */}
        </Stack>
      </Card>

      <Box
        sx={{
          mt: 3,
          gap: 2,
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <Button
          color="inherit"
          size="large"
          variant="outlined"
          onClick={() => router.push(paths.dashboard.realEstate.list)}
        >
          Cancelar
        </Button>

        <LoadingButton
          type="submit"
          size="large"
          variant="contained"
          loading={isSubmitting}
        >
          Criar Imobiliária
        </LoadingButton>
      </Box>
    </Form>
  );
}