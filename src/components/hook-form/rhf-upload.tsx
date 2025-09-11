import type { BoxProps } from '@mui/material/Box';

import { Controller, useFormContext } from 'react-hook-form';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';

import { Iconify } from '../iconify';
import { HelperText } from './help-text';
import { Upload, UploadBox, UploadAvatar } from '../upload';

import type { UploadProps } from '../upload';

// ----------------------------------------------------------------------

export type RHFUploadProps = UploadProps & {
  name: string;
  slotProps?: {
    wrapper?: BoxProps;
  };
};

export function RHFUploadAvatar({ name, slotProps, ...other }: RHFUploadProps) {
  const { control, setValue } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => {
        console.log(`🔍 [RHFUploadAvatar] Estado atual do campo '${name}':`, {
          fieldValue: field.value,
          fieldValueType: typeof field.value,
          isFile: field.value instanceof File,
          fileName: field.value instanceof File ? field.value.name : 'N/A',
          fileSize: field.value instanceof File ? field.value.size : 'N/A',
          hasError: !!error,
          errorMessage: error?.message
        });

        const onDrop = (acceptedFiles: File[]) => {
          console.log(`📁 [RHFUploadAvatar] onDrop chamado para '${name}':`, {
            acceptedFiles,
            filesCount: acceptedFiles.length,
            firstFile: acceptedFiles[0],
            firstFileName: acceptedFiles[0]?.name,
            firstFileSize: acceptedFiles[0]?.size,
            firstFileType: acceptedFiles[0]?.type
          });

          const value = acceptedFiles[0];

          if (value) {
            console.log(`✅ [RHFUploadAvatar] Definindo valor para '${name}':`, {
              file: value,
              fileName: value.name,
              fileSize: value.size,
              fileType: value.type
            });
            
            setValue(name, value, { shouldValidate: true });
            
            console.log(`🔄 [RHFUploadAvatar] setValue executado para '${name}'`);
          } else {
            console.warn(`⚠️ [RHFUploadAvatar] Nenhum arquivo válido para '${name}'`);
          }
        };

        return (
          <Box {...slotProps?.wrapper}>
            <UploadAvatar value={field.value} error={!!error} onDrop={onDrop} {...other} />

            <HelperText errorMessage={error?.message} sx={{ textAlign: 'center' }} />
          </Box>
        );
      }}
    />
  );
}

// ----------------------------------------------------------------------

export function RHFUploadBox({ name, ...other }: RHFUploadProps) {
  const { control, setValue } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => {
        const hasFile = !!field.value;
        const fileName = field.value?.name || '';

        const handleRemove = () => {
          setValue(name, null, { shouldValidate: true });
        };

        return (
          <Stack spacing={1}>
            <UploadBox
              value={field.value}
              error={!!error}
              sx={[
                hasFile && {
                  bgcolor: 'success.lighter',
                  borderColor: 'success.main',
                  color: 'success.main',
                },
              ]}
              placeholder={hasFile ? <Iconify icon="eva:checkmark-fill" width={28} /> : undefined}
              {...other}
            />

            {hasFile && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="caption" color="text.secondary" sx={{ flex: 1 }}>
                  {fileName}
                </Typography>
                <IconButton size="small" onClick={handleRemove} sx={{ color: 'error.main' }}>
                  <Iconify icon="eva:close-fill" width={16} />
                </IconButton>
              </Box>
            )}
          </Stack>
        );
      }}
    />
  );
}

// ----------------------------------------------------------------------

export function RHFUpload({ name, multiple, helperText, accept, ...other }: RHFUploadProps) {
  const { control, setValue } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => {
        const uploadProps = {
          multiple,
          accept: accept || { 'image/*': [] },
          error: !!error,
          helperText: error?.message ?? helperText,
        };

        const onDrop = (acceptedFiles: File[]) => {
          const value = multiple ? [...field.value, ...acceptedFiles] : acceptedFiles[0];

          setValue(name, value, { shouldValidate: true });
        };

        return <Upload {...uploadProps} value={field.value} onDrop={onDrop} {...other} />;
      }}
    />
  );
}
