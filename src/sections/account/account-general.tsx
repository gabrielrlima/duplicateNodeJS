import { useForm } from 'react-hook-form';
import { useMemo, useState, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid2';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';

import { fData } from 'src/utils/format-number';

import { z as zod } from 'src/lib/zod-config';
import axios, { endpoints } from 'src/lib/axios';

import { toast } from 'src/components/snackbar';
import { Form, Field, schemaHelper } from 'src/components/hook-form';

import { useAuthContext } from 'src/auth/hooks';

// Schema de validação
export type UpdateUserSchemaType = zod.infer<typeof UpdateUserSchema>;

export const UpdateUserSchema = zod.object({
  displayName: zod.string().min(1, { message: 'Nome é obrigatório!' }),
  lastName: zod.string().min(1, { message: 'Sobrenome é obrigatório!' }),
  email: zod
    .string()
    .min(1, { message: 'Email é obrigatório!' })
    .email({ message: 'Email deve ser um endereço válido!' }),
  photoURL: schemaHelper.file({ required: false }).optional(),
});

// Componente
export function AccountGeneral() {
  const { user, checkUserSession } = useAuthContext();

  // Debug: Log dos dados do usuário com nova estrutura simplificada
  console.log('🔍 AccountGeneral - Dados do usuário (nova estrutura):', {
    user,
    timestamp: new Date().toISOString(),
  });

  const currentUser: UpdateUserSchemaType = useMemo(
    () => ({
      displayName: user?.firstName || 'Root User',
      lastName: user?.lastName || '',
      email: user?.email || 'root@root.com',
      photoURL: user?.photoURL,
    }),
    [user]
  );

  // Debug: Log dos valores mapeados da nova estrutura
  console.log('📋 AccountGeneral - Valores mapeados (nova estrutura):', {
    displayName: currentUser.displayName,
    email: currentUser.email,
  });

  const defaultValues: UpdateUserSchemaType = {
    displayName: '',
    lastName: '',
    email: '',
    photoURL: null,
  };

  const methods = useForm<UpdateUserSchemaType>({
    mode: 'all',
    resolver: zodResolver(UpdateUserSchema),
    defaultValues,
    values: currentUser,
  });

  const {
    handleSubmit,
    watch,
    reset,
    formState: { isSubmitting },
  } = methods;

  // Estado para rastrear se houve mudanças no formulário
  const [hasChanges, setHasChanges] = useState(false);
  const [forceRenderKey, setForceRenderKey] = useState(0);
  const [isUpdatingContext, setIsUpdatingContext] = useState(false);

  // Função para comparar valores do formulário
  const compareFormValues = (
    current: UpdateUserSchemaType,
    initial: UpdateUserSchemaType
  ): boolean => {
    // Comparar campos de texto (excluindo email que é readonly)
    const textFields: (keyof UpdateUserSchemaType)[] = [
      'displayName',
      'lastName',
    ];

    for (const field of textFields) {
      if (current[field] !== initial[field]) {
        return true;
      }
    }

    // Comparar photoURL (pode ser File ou string)
    const currentPhoto = current.photoURL;
    const initialPhoto = initial.photoURL;

    // Se há uma nova foto (File), considera como mudança
    if (currentPhoto instanceof File) {
      return true;
    }

    // Se as URLs são diferentes, considera como mudança
    if (currentPhoto !== initialPhoto) {
      return true;
    }

    return false;
  };

  // Atualiza o formulário quando o usuário muda no contexto
  useEffect(() => {
    if (user && !isUpdatingContext) {
      const userData = {
        displayName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        photoURL: user.photoURL,
      };
      
      console.log('🔄 [AccountGeneral] Atualizando formulário com dados do contexto:', {
        userData,
        previousUser: user,
        isUpdatingContext,
        timestamp: new Date().toISOString()
      });
      
      reset(userData);
      setHasChanges(false);
      
      // Verificar se o reset foi bem-sucedido
      setTimeout(() => {
        const currentValues = watch();
        console.log('✅ [AccountGeneral] Verificação pós-reset:', {
          currentValues,
          expectedValues: userData,
          valuesMatch: JSON.stringify(currentValues) === JSON.stringify(userData)
        });
      }, 100);
    }
  }, [user, reset, isUpdatingContext, watch]);

  // Monitorar mudanças no formulário em tempo real
  useEffect(() => {
    const subscription = watch((value) => {
      const hasFormChanges = compareFormValues(value as UpdateUserSchemaType, currentUser);
      
      // Log detalhado do photoURL
      const photoURL = value?.photoURL;
      console.log('📸 [AccountGeneral] Estado do photoURL no watch:', {
        photoURL,
        photoURLType: typeof photoURL,
        isFile: photoURL instanceof File,
        fileName: photoURL instanceof File ? photoURL.name : 'N/A',
        fileSize: photoURL instanceof File ? photoURL.size : 'N/A',
        fileType: photoURL instanceof File ? photoURL.type : 'N/A'
      });
      
      console.log('🔍 [AccountGeneral] Verificando mudanças:', {
        hasFormChanges,
        currentFormValues: value,
        currentUserData: currentUser,
        timestamp: new Date().toISOString()
      });
      setHasChanges(hasFormChanges);
    });

    return () => subscription.unsubscribe();
  }, [watch, currentUser]);

  const onSubmit = handleSubmit(async (data) => {
    const startTime = Date.now();
    console.log('🚀 [AccountGeneral] Iniciando processo de atualização:', {
      data,
      currentUser: user,
      timestamp: new Date().toISOString()
    });
    
    try {
      setIsUpdatingContext(true);
      setHasChanges(false);
      
      console.log('📤 [AccountGeneral] Enviando dados para o backend...');
      
      // Sempre usar FormData para consistência com o backend
      console.log('📤 [AccountGeneral] Preparando FormData para envio...');
      
      const formData = new FormData();
      
      // Sempre adicionar campos obrigatórios
      formData.append('firstName', data.displayName || '');
      formData.append('lastName', data.lastName || '');
      
      console.log('📝 [AccountGeneral] Campos obrigatórios adicionados:', {
        displayName: data.displayName
      });
      
      // Verificar se há arquivo de foto para upload
      const hasPhotoFile = data.photoURL instanceof File;
      
      console.log('🔍 [AccountGeneral] Verificando tipo de photoURL:', {
        hasPhotoFile,
        photoURLType: typeof data.photoURL,
        photoURLConstructor: data.photoURL?.constructor?.name,
        photoURLSize: data.photoURL instanceof File ? data.photoURL.size : 'N/A',
        photoURLName: data.photoURL instanceof File ? data.photoURL.name : 'N/A',
        photoURLValue: data.photoURL,
        isFile: data.photoURL instanceof File,
        isString: typeof data.photoURL === 'string',
        isNull: data.photoURL === null,
        isUndefined: data.photoURL === undefined
      });
      
      // Adicionar arquivo se presente
      if (hasPhotoFile && data.photoURL instanceof File) {
        console.log('📎 [AccountGeneral] Adicionando arquivo:', {
          fileName: data.photoURL.name,
          fileSize: data.photoURL.size,
          fileType: data.photoURL.type
        });
        formData.append('photoURL', data.photoURL);
      }
      
      console.log('📤 [AccountGeneral] Enviando FormData...');
      
      // 🔧 SOLUÇÃO TEMPORÁRIA: Usar JSON para campos de texto devido a problema no servidor PHP
      if (hasPhotoFile) {
        console.log('📤 [AccountGeneral] Enviando com arquivo via FormData...');
        
        // Usar FormData apenas quando há arquivo
        const response = await axios.patch(endpoints.user.update, formData, {
          headers: {
            // Não definir Content-Type para FormData
          },
        });
        
        console.log('✅ [AccountGeneral] Upload com arquivo bem-sucedido:', response.data);
      } else {
        console.log('📤 [AccountGeneral] Enviando sem arquivo via JSON...');
        
        // Usar JSON quando não há arquivo (solução temporária)
        const jsonData = {
          firstName: data.displayName || '',
          lastName: data.lastName || '',
          // Preservar photoURL atual se não há nova foto
          photoURL: user?.photoURL || null
        };
        
        console.log('📋 [AccountGeneral] Dados JSON enviados:', jsonData);
        
        const response = await axios.patch(endpoints.user.update, jsonData);
        
        console.log('✅ [AccountGeneral] Atualização via JSON bem-sucedida:', response.data);
      }
      console.log('✅ [AccountGeneral] Backend respondeu com sucesso');
      
      toast.success('Perfil atualizado com sucesso!');
      
      // Separar a atualização da sessão em um bloco try-catch independente
      try {
        // Força atualização do contexto do usuário
        console.log('🔄 [AccountGeneral] Atualizando sessão do usuário...');
        const sessionStart = Date.now();
        await checkUserSession();
        console.log('✅ [AccountGeneral] Sessão atualizada em:', Date.now() - sessionStart + 'ms');
        
        // Aguarda um pouco mais para garantir que o contexto foi atualizado
        console.log('⏳ [AccountGeneral] Aguardando sincronização do contexto...');
        await new Promise(resolve => setTimeout(resolve, 500));
        
        console.log('📊 [AccountGeneral] Dados do usuário após atualização:', {
          user,
          hasUserData: !!user,
          userKeys: user ? Object.keys(user) : [],
          timestamp: new Date().toISOString()
        });
      } catch (sessionError) {
        console.warn('⚠️ [AccountGeneral] Erro ao atualizar sessão (perfil foi salvo):', sessionError);
        // Não propagar o erro - o perfil foi atualizado com sucesso
      }
      
      // Força re-render da interface
      console.log('🔄 [AccountGeneral] Forçando re-render da interface...');
      setForceRenderKey(prev => prev + 1);
      
      // Permite que o useEffect atualize o formulário
      console.log('🔓 [AccountGeneral] Liberando atualização do contexto...');
      setIsUpdatingContext(false);
      
      const totalTime = Date.now() - startTime;
      console.log('🎉 [AccountGeneral] Processo completo em:', totalTime + 'ms');
      
    } catch (error) {
      console.error('❌ [AccountGeneral] Erro ao atualizar perfil:', error);
      
      // Verificar se o erro é da requisição de atualização ou do checkUserSession
      if (error?.response?.status) {
        // Erro da API de atualização
        toast.error(`Erro ao atualizar perfil: ${error.response.data?.message || 'Tente novamente.'}`);
      } else if (error?.message?.includes('checkUserSession') || error?.message?.includes('auth')) {
        // Erro relacionado à autenticação - não mostrar como erro de perfil
        console.warn('⚠️ [AccountGeneral] Erro de autenticação durante atualização, mas perfil pode ter sido salvo');
        toast.success('Perfil atualizado! Faça login novamente se necessário.');
      } else {
        // Outros erros
        toast.error('Erro ao atualizar perfil. Tente novamente.');
      }
      
      setIsUpdatingContext(false);
    }
  });

  return (
    <Form key={forceRenderKey} methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ pt: 10, pb: 5, px: 3, textAlign: 'center' }}>
            <Field.UploadAvatar
              name="photoURL"
              maxSize={2097152}
              helperText={
                <Typography
                  variant="caption"
                  sx={{
                    mt: 3,
                    mx: 'auto',
                    display: 'block',
                    textAlign: 'center',
                    color: 'text.disabled',
                  }}
                >
                  Permitido *.jpeg, *.jpg, *.png, *.gif
                  <br /> Tamanho máximo de {fData(2097152)}
                </Typography>
              }
            />

            {/* <Field.Switch name="isPublic" labelPlacement="start" label="Perfil público" sx={{ mt: 5 }} /> */}
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 8 }}>
          <Card sx={{ p: 3 }}>
            <Box
              sx={{
                rowGap: 3,
                columnGap: 2,
                display: 'grid',
                gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' },
              }}
            >
              <Field.Text name="displayName" label="Nome" />
              <Field.Text name="lastName" label="Sobrenome" />
              <Field.Text name="email" label="Email" disabled sx={{ gridColumn: { xs: '1', sm: '1 / -1' } }} />
            </Box>

            <Stack spacing={3} sx={{ mt: 3, alignItems: 'flex-end' }}>
              <LoadingButton
                type="submit"
                variant="contained"
                loading={isSubmitting}
                disabled={!hasChanges || isSubmitting}
                sx={{
                  minWidth: 140,
                  transition: 'all 0.3s ease',
                }}
              >
                {isSubmitting ? 'Salvando...' : 'Salvar ajustes'}
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </Form>
  );
}
