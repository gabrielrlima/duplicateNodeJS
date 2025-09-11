import { z } from 'zod';
import React, { useState, useEffect } from 'react';

import Grid from '@mui/material/Grid2';
import CloseIcon from '@mui/icons-material/Close';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import {
  Box,
  Card,
  Stack,
  Alert,
  Button,
  styled,
  Typography,
  IconButton,
  CardContent,
} from '@mui/material';

// Componente de input escondido para upload estilizado
const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

interface ImagesFormProps {
  onComplete: () => void;
}

// Schema de validação com Zod
const imagesSchema = z.object({
  images: z
    .array(z.string())
    .min(1, 'Pelo menos uma imagem é obrigatória')
    .max(20, 'Máximo 20 imagens permitidas'),
});

const ImagesForm: React.FC<ImagesFormProps> = ({ onComplete }) => {
  const [images, setImages] = useState<string[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Validação em tempo real
  useEffect(() => {
    const result = imagesSchema.safeParse({ images });
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
  }, [images]);

  // Verificar se há imagens válidas
  const isFormValid = Object.keys(errors).length === 0 && images.length > 0;

  // Carregar imagens salvas do localStorage
  useEffect(() => {
    const savedImages = localStorage.getItem('propertyImages');
    if (savedImages) {
      setImages(JSON.parse(savedImages));
    }
  }, []);

  // Salvar imagens no localStorage
  useEffect(() => {
    localStorage.setItem('propertyImages', JSON.stringify(images));
  }, [images]);

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

  const handleRemoveImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleRemoveAllImages = () => {
    setImages([]);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const files = Array.from(event.target.files);

      // Validações de arquivo
      const validFiles = files.filter((file) => {
        // Validar tipo de arquivo
        if (!file.type.startsWith('image/')) {
          return false;
        }

        // Validar tamanho (max 10MB)
        if (file.size > 10 * 1024 * 1024) {
          return false;
        }

        return true;
      });

      if (validFiles.length !== files.length) {
        setErrors({
          images: 'Alguns arquivos foram rejeitados. Apenas imagens até 10MB são aceitas.',
        });
        return;
      }

      // Verificar limite total de imagens
      if (images.length + validFiles.length > 20) {
        setErrors({ images: 'Máximo 20 imagens permitidas' });
        return;
      }

      const newImages = validFiles.map((file) => URL.createObjectURL(file));
      setImages((prev) => [...prev, ...newImages]);

      // Limpar erros se upload for bem-sucedido
      if (errors.images) {
        setErrors({});
      }
    }
  };

  return (
    <Card>
      <CardContent>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" sx={{ mb: 1 }}>
            Destaque o Imóvel com Imagens
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Adicione fotos de qualidade para valorizar o imóvel e atrair mais interessados. Faça
            upload de imagens diretamente do seu computador.
          </Typography>

          {errors.images && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {errors.images}
            </Alert>
          )}

          <Typography variant="subtitle2" sx={{ mb: 2 }}>
            Imagens ({images.length}/20)
          </Typography>

          <Box
            sx={{
              border: '1px dashed #ccc',
              borderRadius: 1,
              p: 5,
              mb: 3,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: 250,
              backgroundColor: '#f9f9f9',
              cursor: 'pointer',
              borderColor: errors.images ? 'error.main' : '#ccc',
            }}
          >
            <Box sx={{ textAlign: 'center' }}>
              <CloudUploadIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
              <Typography variant="h6" sx={{ mb: 1 }}>
                Envie as imagens do imóvel
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Solte os arquivos ou clique aqui para navegar pelo seu computador.
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ mb: 3, display: 'block' }}>
                Formatos aceitos: JPG, PNG, GIF • Tamanho máximo: 10MB por imagem
              </Typography>
              <Button
                component="label"
                role={undefined}
                variant="contained"
                tabIndex={-1}
                startIcon={<CloudUploadIcon />}
                disabled={images.length >= 20}
                sx={{
                  bgcolor: '#06092B',
                  '&:hover': { bgcolor: '#040619' },
                }}
              >
                Enviar imagens
                <VisuallyHiddenInput
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                />
              </Button>
            </Box>
          </Box>

          {images.length > 0 && (
            <Box sx={{ mb: 3 }}>
              <Grid container spacing={2}>
                {images.map((image, index) => (
                  <Grid size={{ xs: 6, sm: 4, md: 3, lg: 2 }} key={index}>
                    <Box
                      sx={{
                        position: 'relative',
                        width: '100%',
                        paddingTop: '100%', // 1:1 Aspect Ratio
                        backgroundColor: '#eee',
                        borderRadius: 1,
                        overflow: 'hidden',
                      }}
                    >
                      <Box
                        component="img"
                        src={image}
                        alt={`Property image ${index + 1}`}
                        sx={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                        }}
                      />
                      <IconButton
                        size="small"
                        sx={{
                          position: 'absolute',
                          top: 4,
                          right: 4,
                          backgroundColor: 'rgba(0, 0, 0, 0.5)',
                          color: 'white',
                          '&:hover': {
                            backgroundColor: 'rgba(0, 0, 0, 0.7)',
                          },
                        }}
                        onClick={() => handleRemoveImage(index)}
                      >
                        <CloseIcon fontSize="small" />
                      </IconButton>
                      {index === 0 && (
                        <Box
                          sx={{
                            position: 'absolute',
                            bottom: 4,
                            left: 4,
                            backgroundColor: 'rgba(52, 168, 83, 0.9)',
                            color: 'white',
                            px: 1,
                            py: 0.5,
                            borderRadius: 1,
                            fontSize: '0.75rem',
                          }}
                        >
                          Capa
                        </Box>
                      )}
                    </Box>
                  </Grid>
                ))}
              </Grid>

              <Stack direction="row" spacing={2} sx={{ mt: 3, justifyContent: 'flex-end' }}>
                <Button variant="outlined" onClick={handleRemoveAllImages}>
                  Remover todas as imagens
                </Button>
                <Button
                  component="label"
                  variant="contained"
                  disabled={images.length >= 20}
                  sx={{
                    bgcolor: '#06092B',
                    '&:hover': { bgcolor: '#040619' },
                  }}
                  startIcon={<CloudUploadIcon />}
                >
                  Adicionar mais imagens
                  <VisuallyHiddenInput
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                  />
                </Button>
              </Stack>
            </Box>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default ImagesForm;
