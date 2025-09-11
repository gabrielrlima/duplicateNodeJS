import type { TextFieldProps } from '@mui/material/TextField';
import type { AutocompleteProps } from '@mui/material/Autocomplete';

import { Controller, useFormContext } from 'react-hook-form';

import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';

// ----------------------------------------------------------------------

export type AutocompleteBaseProps = Omit<
  AutocompleteProps<any, boolean, boolean, boolean>,
  'renderInput'
>;

export type RHFAutocompleteProps = AutocompleteBaseProps & {
  name: string;
  label?: string;
  placeholder?: string;
  helperText?: React.ReactNode;
  slotProps?: AutocompleteBaseProps['slotProps'] & {
    textfield?: TextFieldProps;
  };
};

export function RHFAutocomplete({
  name,
  label,
  slotProps,
  helperText,
  placeholder,
  ...other
}: RHFAutocompleteProps) {
  const { control, setValue } = useFormContext();

  const { textfield, ...otherSlotProps } = slotProps ?? {};

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => {
        // Se o valor atual é uma string e as opções são objetos, encontrar o objeto correspondente
        const currentValue = field.value;
        const adjustedValue =
          typeof currentValue === 'string' && other.options && other.options.length > 0
            ? other.options.find((option: any) => option?.value === currentValue) || currentValue
            : currentValue;

        return (
          <Autocomplete
            {...field}
            value={adjustedValue}
            id={`rhf-autocomplete-${name}`}
            onChange={(event, newValue) => {
              // Se newValue é um objeto com propriedade 'value', extrair apenas o valor
              const valueToSet =
                newValue && typeof newValue === 'object' && 'value' in newValue
                  ? newValue.value
                  : newValue;
              setValue(name, valueToSet, { shouldValidate: true });
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                {...textfield}
                label={label}
                placeholder={placeholder}
                error={!!error}
                helperText={error?.message ?? helperText}
                slotProps={{
                  ...textfield?.slotProps,
                  htmlInput: {
                    ...params.inputProps,
                    autoComplete: 'new-password',
                    ...textfield?.slotProps?.htmlInput,
                  },
                }}
              />
            )}
            {...other}
            {...otherSlotProps}
          />
        );
      }}
    />
  );
}
