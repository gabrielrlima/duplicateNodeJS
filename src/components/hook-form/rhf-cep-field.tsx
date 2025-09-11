import { forwardRef } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

import TextField, { TextFieldProps } from '@mui/material/TextField';

// ----------------------------------------------------------------------

export type RHFCepFieldProps = TextFieldProps & {
  name: string;
};

// Função para aplicar máscara de CEP
const applyCepMask = (value: string): string => {
  // Remove tudo que não é dígito
  const cleanValue = value.replace(/\D/g, '');
  
  // Aplica a máscara 12345-678
  if (cleanValue.length <= 5) {
    return cleanValue;
  }
  
  return `${cleanValue.slice(0, 5)}-${cleanValue.slice(5, 8)}`;
};

// Função para remover máscara (manter apenas números)
const removeCepMask = (value: string): string => {
  return value.replace(/\D/g, '');
};

export const RHFCepField = forwardRef<HTMLDivElement, RHFCepFieldProps>(
  ({ name, helperText, type, ...other }, ref) => {
    const { control } = useFormContext();

    return (
      <Controller
        name={name}
        control={control}
        render={({ field, fieldState: { error } }) => {
          const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
            const { value } = event.target;
            const maskedValue = applyCepMask(value);
            
            // Limita a 9 caracteres (12345-678)
            if (maskedValue.length <= 9) {
              // Armazena apenas números no formulário
              const cleanValue = removeCepMask(maskedValue);
              field.onChange(cleanValue);
            }
          };

          return (
            <TextField
              {...field}
              fullWidth
              type={type}
              value={applyCepMask(field.value || '')}
              onChange={handleChange}
              error={!!error}
              helperText={error ? error?.message : helperText}
              {...other}
              ref={ref}
              inputProps={{
                ...other.inputProps,
                maxLength: 9,
              }}
            />
          );
        }}
      />
    );
  }
);

RHFCepField.displayName = 'RHFCepField';