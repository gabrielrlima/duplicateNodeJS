import type { TextFieldProps } from '@mui/material/TextField';

import { useController, useFormContext } from 'react-hook-form';

import TextField from '@mui/material/TextField';

// ----------------------------------------------------------------------

export type RHFNumberFieldProps = TextFieldProps & {
  name: string;
  helperText?: React.ReactNode;
  formatThousands?: boolean;
};

export function RHFNumberField({
  name,
  helperText,
  type,
  formatThousands = false,
  ...other
}: RHFNumberFieldProps) {
  const { control } = useFormContext();

  const { field, fieldState: { error } } = useController({
    name,
    control,
  });

  const formatNumber = (value: string | number | undefined | null): string => {
    if (!formatThousands) return String(value || '');
    
    if (value === undefined || value === null || value === '') return '';
    
    const numValue = typeof value === 'string' ? parseFloat(value.replace(/\./g, '')) : value;
    if (isNaN(numValue) || numValue === 0) return '';
    
    return numValue.toLocaleString('pt-BR', { 
      minimumFractionDigits: 0,
      maximumFractionDigits: 0 
    });
  };

  const parseNumber = (value: string): number => {
    if (!formatThousands) return parseFloat(value) || 0;
    
    const cleanValue = value.replace(/\./g, '');
    return parseFloat(cleanValue) || 0;
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = event.target.value;
    
    if (formatThousands) {
      // Remove todos os pontos e caracteres não numéricos exceto números
      const cleanValue = inputValue.replace(/[^0-9]/g, '');
      const numericValue = parseFloat(cleanValue) || 0;
      
      // Atualiza o valor no formulário como número
      field.onChange(numericValue);
    } else {
      field.onChange(parseFloat(inputValue) || 0);
    }
  };

  const displayValue = formatThousands ? formatNumber(field.value) : (field.value ?? '');

  return (
    <TextField
      {...field}
      fullWidth
      type="text"
      value={displayValue}
      onChange={handleChange}
      error={!!error}
      helperText={error ? error?.message : helperText}
      {...other}
    />
  );
}