import type { UseSetStateReturn } from 'minimal-shared/hooks';
import type { IPropertyTableFilters } from 'src/types/property';

import { useCallback } from 'react';

import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

type Props = {
  dateError: boolean;
  onResetPage: () => void;
  filters: UseSetStateReturn<IPropertyTableFilters>;
};

export function PropertyTableToolbar({ filters, onResetPage, dateError }: Props) {
  const { state, setState } = filters;

  const handleFilterName = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      onResetPage();
      setState({ name: event.target.value });
    },
    [onResetPage, setState]
  );

  const handleFilterStartDate = useCallback(
    (newValue: any) => {
      onResetPage();
      setState({ startDate: newValue });
    },
    [onResetPage, setState]
  );

  const handleFilterEndDate = useCallback(
    (newValue: any) => {
      onResetPage();
      setState({ endDate: newValue });
    },
    [onResetPage, setState]
  );

  return (
    <Stack
      spacing={2}
      alignItems={{ xs: 'flex-end', md: 'center' }}
      direction={{ xs: 'column', md: 'row' }}
      sx={{ p: 2.5, pr: { xs: 2.5, md: 1 } }}
    >
      <Stack direction="row" alignItems="center" spacing={2} flexGrow={1} sx={{ width: 1 }}>
        <TextField
          fullWidth
          value={state.name}
          onChange={handleFilterName}
          placeholder="Buscar imóvel..."
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
              </InputAdornment>
            ),
          }}
        />

        <DatePicker
          label="Data inicial"
          value={state.startDate}
          onChange={handleFilterStartDate}
          slotProps={{
            textField: {
              fullWidth: true,
            },
          }}
          sx={{ maxWidth: { md: 200 } }}
        />

        <DatePicker
          label="Data final"
          value={state.endDate}
          onChange={handleFilterEndDate}
          slotProps={{
            textField: {
              fullWidth: true,
              error: dateError,
              helperText: dateError ? 'A data final deve ser posterior à data inicial' : null,
            },
          }}
          sx={{ maxWidth: { md: 200 } }}
        />
      </Stack>
    </Stack>
  );
}
