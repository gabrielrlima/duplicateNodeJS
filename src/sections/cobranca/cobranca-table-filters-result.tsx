import type { StackProps } from '@mui/material/Stack';
import type { Theme, SxProps } from '@mui/material/styles';
import type { UseSetStateReturn } from 'minimal-shared/hooks';

import { useCallback } from 'react';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';

import { Iconify } from 'src/components/iconify';

import type { ICobrancaTableFilters } from './types';

// ----------------------------------------------------------------------

type Props = StackProps & {
  filters: UseSetStateReturn<ICobrancaTableFilters>;
  totalResults: number;
  sx?: SxProps<Theme>;
};

export function CobrancaTableFiltersResult({ filters, totalResults, sx, ...other }: Props) {
  const handleRemoveStatus = useCallback(() => {
    filters.setState({ status: 'todos' });
  }, [filters]);

  const handleRemoveDate = useCallback(() => {
    filters.setState({ startDate: null, endDate: null });
  }, [filters]);

  const handleRemoveKeyword = useCallback(() => {
    filters.setState({ name: '' });
  }, [filters]);

  return (
    <Stack spacing={1.5} {...other}>
      <Box sx={{ typography: 'body2' }}>
        <strong>{totalResults}</strong>
        <Box component="span" sx={{ color: 'text.secondary', ml: 0.25 }}>
          resultados encontrados
        </Box>
      </Box>

      <Stack flexGrow={1} spacing={1} direction="row" flexWrap="wrap" alignItems="center">
        {filters.state.status !== 'todos' && (
          <Block label="Status:">
            <Chip
              size="small"
              label={filters.state.status}
              onDelete={handleRemoveStatus}
              deleteIcon={<Iconify icon="mingcute:close-line" />}
            />
          </Block>
        )}

        {filters.state.startDate && filters.state.endDate && (
          <Block label="Data:">
            <Chip
              size="small"
              label={`${filters.state.startDate.format('DD/MM/YYYY')} - ${filters.state.endDate.format('DD/MM/YYYY')}`}
              onDelete={handleRemoveDate}
              deleteIcon={<Iconify icon="mingcute:close-line" />}
            />
          </Block>
        )}

        {!!filters.state.name && (
          <Block label="Palavra-chave:">
            <Chip
              size="small"
              label={filters.state.name}
              onDelete={handleRemoveKeyword}
              deleteIcon={<Iconify icon="mingcute:close-line" />}
            />
          </Block>
        )}

        <Button
          color="error"
          onClick={() =>
            filters.setState({ name: '', status: 'todos', startDate: null, endDate: null })
          }
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
    <Stack component={Paper} variant="outlined" spacing={1} direction="row" sx={{ p: 1 }}>
      <Box component="span" sx={{ typography: 'subtitle2' }}>
        {label}
      </Box>
      {children}
    </Stack>
  );
}
