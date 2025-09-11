import type { StackProps } from '@mui/material/Stack';
import type { Theme, SxProps } from '@mui/material/styles';
import type { ITerrenoTableFilters } from 'src/types/terreno';
import type { UseSetStateReturn } from 'minimal-shared/hooks';

import { useCallback } from 'react';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';

import { fDate } from 'src/utils/format-time';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

type Props = StackProps & {
  totalResults: number;
  onResetPage: () => void;
  filters: UseSetStateReturn<ITerrenoTableFilters>;
  sx?: SxProps<Theme>;
};

export function TerrenoTableFiltersResult({
  filters,
  totalResults,
  onResetPage,
  sx,
  ...other
}: Props) {
  const { state, setState } = filters;

  const handleRemoveKeyword = useCallback(() => {
    onResetPage();
    setState({ name: '' });
  }, [onResetPage, setState]);

  const handleRemoveStatus = useCallback(() => {
    onResetPage();
    setState({ status: 'all' });
  }, [onResetPage, setState]);

  const handleRemoveDate = useCallback(() => {
    onResetPage();
    setState({ startDate: null, endDate: null });
  }, [onResetPage, setState]);

  const handleReset = useCallback(() => {
    onResetPage();
    setState({
      name: '',
      status: 'all',
      startDate: null,
      endDate: null,
    });
  }, [onResetPage, setState]);

  return (
    <Stack spacing={1.5} sx={sx} {...other}>
      <Box sx={{ typography: 'body2' }}>
        <strong>{totalResults}</strong>
        <Box component="span" sx={{ color: 'text.secondary', ml: 0.25 }}>
          resultados encontrados
        </Box>
      </Box>

      <Stack flexGrow={1} spacing={1} direction="row" flexWrap="wrap" alignItems="center">
        {!!state.name && (
          <Block label="Busca:">
            <Chip size="small" label={state.name} onDelete={handleRemoveKeyword} />
          </Block>
        )}

        {state.status !== 'all' && (
          <Block label="Status:">
            <Chip
              size="small"
              label={
                state.status === 'available'
                  ? 'Disponível'
                  : state.status === 'reserved'
                    ? 'Reservado'
                    : state.status === 'sold'
                      ? 'Vendido'
                      : state.status === 'inactive'
                        ? 'Pausado'
                        : state.status
              }
              onDelete={handleRemoveStatus}
            />
          </Block>
        )}

        {!!state.startDate && !!state.endDate && (
          <Block label="Data:">
            <Chip
              size="small"
              label={`${fDate(state.startDate)} - ${fDate(state.endDate)}`}
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

type BlockProps = StackProps & {
  label: string;
};

function Block({ label, children, sx, ...other }: BlockProps) {
  return (
    <Stack
      component={Paper}
      variant="outlined"
      spacing={1}
      direction="row"
      sx={[
        {
          p: 1,
          borderRadius: 1,
          overflow: 'hidden',
          borderStyle: 'dashed',
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...other}
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
