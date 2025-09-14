import type { TextFieldProps } from '@mui/material/TextField';

import { useState } from 'react';
import { useController, useFormContext } from 'react-hook-form';

import TextField from '@mui/material/TextField';

// ----------------------------------------------------------------------

export type RHFNumberFieldProps = TextFieldProps & {
  name: string;
  helperText?: React.ReactNode;
  formatThousands?: boolean;
  formatCurrency?: boolean;
};

export function RHFNumberField({
  name,
  helperText,
  type,
  formatThousands = false,
  formatCurrency = false,
  ...other
}: RHFNumberFieldProps) {
  const { control } = useFormContext();
  const [isFocused, setIsFocused] = useState(false);
  const [inputValue, setInputValue] = useState('');

  const { field, fieldState: { error } } = useController({
    name,
    control,
  });

  const formatNumber = (value: string | number | undefined | null): string => {
    if (!formatThousands && !formatCurrency) return String(value || '');
    
    if (value === undefined || value === null || value === '') return '';
    
    const numValue = typeof value === 'string' ? parseFloat(value.replace(/[^0-9,]/g, '').replace(',', '.')) : value;
    if (isNaN(numValue) || numValue === 0) return '';
    
    if (formatCurrency) {
      return numValue.toLocaleString('pt-BR', { 
        style: 'currency',
        currency: 'BRL',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2 
      });
    }
    
    return numValue.toLocaleString('pt-BR', { 
      minimumFractionDigits: 0,
      maximumFractionDigits: 0 
    });
  };

  const parseNumber = (value: string): number => {
    if (!formatThousands && !formatCurrency) return parseFloat(value) || 0;
    
    // Remove símbolos de moeda e espaços, mantém apenas números, pontos e vírgulas
    const cleanValue = value.replace(/[R$\s]/g, '')
                           .replace(/\./g, '') // Remove pontos (separadores de milhares)
                           .replace(',', '.'); // Converte vírgula para ponto decimal
    return parseFloat(cleanValue) || 0;
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    
    if (formatThousands || formatCurrency) {
      // Durante a digitação, permite entrada livre mas filtra caracteres inválidos
      let cleanValue = newValue.replace(/[R$\s]/g, '');
      cleanValue = cleanValue.replace(/[^0-9,.]/g, '');
      
      // Atualiza o valor de input para exibição durante digitação
      setInputValue(cleanValue);
      
      // Converte para número para o formulário
      if (!cleanValue || cleanValue === ',' || cleanValue === '.') {
        field.onChange(0);
        return;
      }
      
      const numericValue = parseFloat(
        cleanValue
          .replace(/\./g, '') // Remove pontos (separadores de milhares)
          .replace(',', '.') // Converte vírgula para ponto decimal
      ) || 0;
      
      field.onChange(numericValue);
    } else {
      setInputValue(newValue);
      field.onChange(parseFloat(newValue) || 0);
    }
  };

  const handleFocus = () => {
    setIsFocused(true);
    // Quando ganha foco, mostra o valor numérico para edição
    if (formatThousands || formatCurrency && field.value) {
      setInputValue(String(field.value).replace('.', ','));
    }
  };

  const handleBlur = () => {
    setIsFocused(false);
    // Quando perde foco, limpa o valor de input para mostrar formatado
    setInputValue('');
  };

  // Determina o valor a ser exibido: durante foco mostra valor de digitação, fora de foco mostra formatado
  const getDisplayValue = () => {
    if (isFocused && (formatThousands || formatCurrency)) {
      return inputValue;
    }
    return (formatThousands || formatCurrency) ? formatNumber(field.value) : (field.value ?? '');
  };

  return (
    <TextField
      {...field}
      fullWidth
      type="text"
      value={getDisplayValue()}
      onChange={handleChange}
      onFocus={handleFocus}
      onBlur={handleBlur}
      error={!!error}
      helperText={error ? error?.message : helperText}
      {...other}
    />
  );
}