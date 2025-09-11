import type { UseSetStateReturn } from 'minimal-shared/hooks';
import type { SelectChangeEvent } from '@mui/material/Select';

import { useCallback } from 'react';

import Stack from '@mui/material/Stack';
import Select from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import IconButton from '@mui/material/IconButton';
import FormControl from '@mui/material/FormControl';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import { Iconify } from 'src/components/iconify';

import type { ICobrancaTableFilters } from './types';

// ----------------------------------------------------------------------

type Props = {
  filters: UseSetStateReturn<ICobrancaTableFilters>;
  dateError: boolean;
  onResetPage: () => void;
  canReset: boolean;
  onResetFilters: () => void;
};

export function CobrancaTableToolbar({
  filters,
  dateError,
  onResetPage,
  canReset,
  onResetFilters,
}: Props) {
  const handleFilterName = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      filters.setState({ name: event.target.value });
    },
    [filters]
  );

  const handleFilterStartDate = useCallback(
    (newValue: any) => {
      filters.setState({ startDate: newValue });
    },
    [filters]
  );

  const handleFilterEndDate = useCallback(
    (newValue: any) => {
      filters.setState({ endDate: newValue });
    },
    [filters]
  );

  const handleFilterStatus = useCallback(
    (event: SelectChangeEvent<string>) => {
      filters.setState({ status: event.target.value });
    },
    [filters]
  );

  return (
    <Stack
      spacing={2}
      alignItems={{ xs: 'flex-end', md: 'center' }}
      direction={{
        xs: 'column',
        md: 'row',
      }}
      sx={{
        p: 2.5,
        pr: { xs: 2.5, md: 1 },
      }}
    >
      <DatePicker
        label="Data início"
        value={filters.state.startDate}
        onChange={handleFilterStartDate}
        slotProps={{ textField: { fullWidth: true } }}
        sx={{
          maxWidth: { md: 200 },
        }}
      />

      <DatePicker
        label="Data fim"
        value={filters.state.endDate}
        onChange={handleFilterEndDate}
        slotProps={{
          textField: {
            fullWidth: true,
            error: dateError,
            helperText: dateError && 'Data fim deve ser maior que data início',
          },
        }}
        sx={{
          maxWidth: { md: 200 },
        }}
      />

      <FormControl
        sx={{
          flexShrink: 0,
          width: { xs: 1, md: 200 },
        }}
      >
        <InputLabel>Status</InputLabel>

        <Select
          value={filters.state.status}
          onChange={handleFilterStatus}
          input={<OutlinedInput label="Status" />}
          renderValue={(selected) => selected}
          sx={{ textTransform: 'capitalize' }}
        >
          {['todos', 'Pendente', 'Pago', 'Vencido'].map((option) => (
            <MenuItem key={option} value={option}>
              <Checkbox disableRipple size="small" checked={filters.state.status === option} />
              {option === 'todos' ? 'Todos' : option}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Stack direction="row" alignItems="center" spacing={2} flexGrow={1} sx={{ width: 1 }}>
        <TextField
          fullWidth
          value={filters.state.name}
          onChange={handleFilterName}
          placeholder="Buscar cliente..."
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
              </InputAdornment>
            ),
          }}
        />

        {canReset && (
          <IconButton onClick={onResetFilters}>
            <Iconify icon="solar:trash-bin-trash-bold" />
          </IconButton>
        )}
      </Stack>
    </Stack>
  );
}
