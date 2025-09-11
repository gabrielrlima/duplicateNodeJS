import type { DialogProps } from '@mui/material/Dialog';

import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { useDropzone } from 'react-dropzone';
import { useState, useCallback } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';

import { LoadingButton } from '@mui/lab';
import {
  Box,
  Stack,
  Button,
  Dialog,
  IconButton,
  Typography,
  DialogTitle,
  DialogActions,
  DialogContent,
} from '@mui/material';

import { useRealEstate } from 'src/hooks/use-real-estate';

import { useRealEstateContext } from 'src/contexts/real-estate-context';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { Form, RHFTextField, Field } from 'src/components/hook-form';

interface LogoUploadProps {
  logoFile: File | null;
  logoPreview: string | null;
  onDrop: (acceptedFiles: File[]) => void;
  onRemove: () => void;
}

function LogoUpload({ logoFile, logoPreview, onDrop, onRemove }: LogoUploadProps) {
  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    multiple: false,
    maxSize: 3145728, // 3MB
    accept: { 'image/*': [] },
    onDrop,
  });

  return (
    <Box
      {...getRootProps()}
      sx={[
        (theme) => ({
          width: 1,
          height: 160,
          borderRadius: 1.5,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: `1px dashed ${theme.vars.palette.divider}`,
          bgcolor: theme.vars.palette.background.neutral,
          transition: theme.transitions.create(['opacity', 'border-color']),
          ...(isDragActive && {
            opacity: 0.72,
            borderColor: theme.vars.palette.primary.main,
          }),
          ...(isDragReject && {
            borderColor: theme.vars.palette.error.main,
          }),
          '&:hover': {
            borderColor: theme.vars.palette.primary.main,
            bgcolor: theme.vars.palette.background.paper,
          },
        }),
      ]}
    >
      <input {...getInputProps()} />
      
      {logoPreview ? (
        <Box
          sx={{
            width: 1,
            height: 1,
            position: 'relative',
            borderRadius: 1.5,
            overflow: 'hidden',
          }}
        >
          <img
            src={logoPreview}
            alt="Logo da Imobiliária"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              padding: 16,
            }}
          />
          <Box
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              zIndex: 1,
            }}
          >
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                onRemove();
              }}
              sx={{
                bgcolor: 'error.main',
                color: 'common.white',
                '&:hover': { bgcolor: 'error.dark' },
              }}
            >
              <Iconify icon="eva:close-fill" width={16} />
            </IconButton>
          </Box>
        </Box>
      ) : (
        <Stack spacing={1} alignItems="center">
          <Iconify icon="solar:camera-add-bold" width={32} />
          <Typography variant="caption" textAlign="center" color="text.secondary">
            Arraste ou clique para fazer upload da logo
          </Typography>
        </Stack>
      )}
    </Box>
  );
}

// ----------------------------------------------------------------------

const AddRealEstateSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  cnpj: z.string().min(14, 'CNPJ deve ter 14 dígitos').max(18, 'CNPJ inválido'),
  logo: z.any().optional(),
});

type AddRealEstateData = z.infer<typeof AddRealEstateSchema>;

// ----------------------------------------------------------------------

type AddRealEstateDialogProps = DialogProps & {
  onClose: () => void;
};

export function AddRealEstateDialog({ onClose, ...other }: AddRealEstateDialogProps) {
  const { createRealEstate } = useRealEstate();
  const { switchRealEstate } = useRealEstateContext();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string>('');

  const methods = useForm<AddRealEstateData>({
    resolver: zodResolver(AddRealEstateSchema),
    defaultValues: {
      name: '',
      cnpj: '',
    },
  });

  const { handleSubmit, reset, setValue } = methods;

  const handleLogoDrop = (files: File[]) => {
    const file = files[0];
    if (file) {
      setLogoFile(file);
      setLogoPreview(URL.createObjectURL(file));
      setValue('logo', file, { shouldValidate: true });
    }
  };

  const handleLogoRemove = () => {
    setLogoFile(null);
    setLogoPreview('');
    setValue('logo', undefined);
  };

  const handleCancel = useCallback(() => {
    reset();
    handleLogoRemove();
    onClose();
  }, [reset, onClose]);

  const onSubmit = handleSubmit(async (data) => {
    setIsSubmitting(true);
    try {
      const newRealEstate = await createRealEstate({
        name: data.name,
        cnpj: data.cnpj,
        logo: logoFile,
      });
      
      // Select the new real estate with loading transition
      if (newRealEstate) {
        toast.success('Imobiliária criada com sucesso!');
        reset();
        handleLogoRemove();
        onClose();
        
        // Use switchRealEstate to show loading and reload page
        await switchRealEstate(newRealEstate);
      }
    } catch (error) {
      toast.error('Erro ao criar imobiliária');
      console.error('Erro ao criar imobiliária:', error);
    } finally {
      setIsSubmitting(false);
    }
  });

  return (
    <Dialog maxWidth="sm" fullWidth {...other}>
      <DialogTitle>Adicionar Nova Imobiliária</DialogTitle>

      <Form methods={methods} onSubmit={onSubmit}>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 1 }}>
            <RHFTextField name="name" label="Nome da Imobiliária" fullWidth />
            <Field.Document name="cnpj" label="CNPJ" />
            
            <Box>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Logo da Imobiliária
              </Typography>
              <LogoUpload
                logoFile={logoFile}
                logoPreview={logoPreview}
                onDrop={handleLogoDrop}
                onRemove={handleLogoRemove}
              />
            </Box>
          </Stack>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleCancel}>Cancelar</Button>
          <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
            Criar Imobiliária
          </LoadingButton>
        </DialogActions>
      </Form>
    </Dialog>
  );
}