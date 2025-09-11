import type { StackProps } from '@mui/material/Stack';
import type { UseSetStateReturn } from 'minimal-shared/hooks';
import type { IRecebimentosTableFilters } from 'src/types/recebimentos';

import { useCallback } from 'react';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';

import { fDateRangeShortLabel } from 'src/utils/format-time';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

type Props = StackProps & {
  totalResults: number;
  onResetPage: () => void;
  filters: UseSetStateReturn<IRecebimentosTableFilters>;
};

export function RecebimentosTableFiltersResult({
  filters,
  totalResults,
  onResetPage,
  sx,
  ...other
}: Props) {
  const { state: currentFilters, setState: updateFilters } = filters;

  const handleRemoveKeyword = useCallback(() => {
    onResetPage();
    updateFilters({ name: '' });
  }, [onResetPage, updateFilters]);

  const handleRemoveStatus = useCallback(() => {
    onResetPage();
    updateFilters({ status: 'all' });
  }, [onResetPage, updateFilters]);

  const handleRemoveDate = useCallback(() => {
    onResetPage();
    updateFilters({ startDate: null, endDate: null });
  }, [onResetPage, updateFilters]);

  const handleReset = useCallback(() => {
    onResetPage();
    updateFilters({
      name: '',
      status: 'all',
      startDate: null,
      endDate: null,
    });
  }, [onResetPage, updateFilters]);

  return (
    <Stack spacing={1.5} sx={[{ p: 1 }, ...(Array.isArray(sx) ? sx : [sx])]} {...other}>
      <Box sx={{ typography: 'body2' }}>
        <strong>{totalResults}</strong>
        <Box component="span" sx={{ color: 'text.secondary', ml: 0.25 }}>
          resultados encontrados
        </Box>
      </Box>

      <Stack flexGrow={1} spacing={1} direction="row" flexWrap="wrap" alignItems="center">
        {!!currentFilters.name && (
          <Block label="Busca:">
            <Chip size="small" label={currentFilters.name} onDelete={handleRemoveKeyword} />
          </Block>
        )}

        {currentFilters.status !== 'all' && (
          <Block label="Status:">
            <Chip size="small" label={currentFilters.status} onDelete={handleRemoveStatus} />
          </Block>
        )}

        {!!currentFilters.startDate && !!currentFilters.endDate && (
          <Block label="Data:">
            <Chip
              size="small"
              label={fDateRangeShortLabel(currentFilters.startDate, currentFilters.endDate)}
              onDelete={handleRemoveDate}
            />
          </Block>
        )}

        <Button
          color="error"
          onClick={handleReset}
          startIcon={<Iconify icon="solar:trash-bin-trash-bold" />}
        >
          Limpar
        </Button>
      </Stack>
    </Stack>
  );
}

// ----------------------------------------------------------------------

type BlockProps = {
  label: string;
  children: React.ReactNode;
};

function Block({ label, children }: BlockProps) {
  return (
    <Stack
      component={Paper}
      variant="outlined"
      spacing={1}
      direction="row"
      sx={{ p: 1, borderRadius: 1, bgcolor: 'unset' }}
    >
      <Box component="span" sx={{ typography: 'subtitle2' }}>
        {label}
      </Box>

      <Stack spacing={1} direction="row" flexWrap="wrap">
        {children}
      </Stack>
    </Stack>
  );
}
