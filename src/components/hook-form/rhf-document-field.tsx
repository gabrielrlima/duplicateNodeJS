import type { TextFieldProps } from '@mui/material/TextField';

import { Controller, useFormContext } from 'react-hook-form';

import TextField from '@mui/material/TextField';

// ----------------------------------------------------------------------

export type RHFDocumentFieldProps = TextFieldProps & {
  name: string;
};

// Função para aplicar máscara de CPF
const applyCpfMask = (value: string): string => {
  const numbers = value.replace(/\D/g, '');
  return numbers
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})/, '$1-$2')
    .replace(/(-\d{2})\d+?$/, '$1');
};

// Função para aplicar máscara de CNPJ
const applyCnpjMask = (value: string): string => {
  const numbers = value.replace(/\D/g, '');
  return numbers
    .replace(/(\d{2})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1/$2')
    .replace(/(\d{4})(\d{1,2})/, '$1-$2')
    .replace(/(-\d{2})\d+?$/, '$1');
};

// Função para aplicar máscara dinâmica baseada no número de dígitos
const applyDocumentMask = (value: string): string => {
  const numbers = value.replace(/\D/g, '');
  
  // Se tem até 11 dígitos, aplica máscara de CPF
  if (numbers.length <= 11) {
    return applyCpfMask(value);
  }
  
  // Se tem mais de 11 dígitos, aplica máscara de CNPJ
  return applyCnpjMask(value);
};

export function RHFDocumentField({
  name,
  helperText,
  slotProps,
  placeholder = "000.000.000-00",
  ...other
}: RHFDocumentFieldProps) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => {
        const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
          const rawValue = event.target.value;
          const maskedValue = applyDocumentMask(rawValue);
          
          // Atualiza o placeholder dinamicamente
          const numbers = rawValue.replace(/\D/g, '');
          const newPlaceholder = numbers.length <= 11 ? "000.000.000-00" : "00.000.000/0000-00";
          
          field.onChange(maskedValue);
        };

        // Determina o placeholder baseado no valor atual
        const numbers = (field.value || '').replace(/\D/g, '');
        const currentPlaceholder = numbers.length <= 11 ? "000.000.000-00" : "00.000.000/0000-00";

        return (
          <TextField
            {...field}
            {...other}
            fullWidth
            value={field.value || ''}
            onChange={handleChange}
            error={!!error}
            helperText={error?.message ?? helperText}
            placeholder={currentPlaceholder}
            inputProps={{
              maxLength: 18, // Máximo para CNPJ formatado: 00.000.000/0000-00
              ...other.inputProps,
            }}
            slotProps={{
              ...slotProps,
            }}
          />
        );
      }}
    />
  );
}