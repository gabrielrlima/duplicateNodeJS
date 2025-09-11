import type { StackProps } from '@mui/material/Stack';
import type { IComissaoFilters } from 'src/types/comissao';
import type { UseSetStateReturn } from 'minimal-shared/hooks';

import { useCallback } from 'react';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

type Props = StackProps & {
  totalResults: number;
  filters: UseSetStateReturn<IComissaoFilters>;
};

export function ComissoesFiltersResult({ filters, totalResults, ...other }: Props) {
  const { state: currentFilters, setState: updateFilters } = filters;

  const handleRemoveStatus = useCallback(() => {
    updateFilters({ status: 'all' });
  }, [updateFilters]);

  const handleRemoveTipo = useCallback(
    (inputValue: string) => {
      const newValue = currentFilters.tipo.filter((item) => item !== inputValue);
      updateFilters({ tipo: newValue });
    },
    [currentFilters.tipo, updateFilters]
  );

  const handleRemovePercentualMinimo = useCallback(() => {
    updateFilters({ percentualMinimo: null });
  }, [updateFilters]);

  const handleRemovePercentualMaximo = useCallback(() => {
    updateFilters({ percentualMaximo: null });
  }, [updateFilters]);

  const handleReset = useCallback(() => {
    updateFilters({
      status: 'all',
      tipo: [],
      percentualMinimo: null,
      percentualMaximo: null,
    });
  }, [updateFilters]);

  return (
    <Stack spacing={1.5} {...other}>
      <Box sx={{ typography: 'body2' }}>
        <strong>{totalResults}</strong>
        <Box component="span" sx={{ color: 'text.secondary', ml: 0.25 }}>
          resultados encontrados
        </Box>
      </Box>

      <Stack flexGrow={1} spacing={1} direction="row" flexWrap="wrap" alignItems="center">
        {currentFilters.status !== 'all' && (
          <Block label="Status:">
            <Chip size="small" label={currentFilters.status} onDelete={handleRemoveStatus} />
          </Block>
        )}

        {!!currentFilters.tipo.length && (
          <Block label="Tipo:">
            {currentFilters.tipo.map((item) => (
              <Chip key={item} label={item} size="small" onDelete={() => handleRemoveTipo(item)} />
            ))}
          </Block>
        )}

        {currentFilters.percentualMinimo !== null && (
          <Block label="Percentual mín.:">
            <Chip
              size="small"
              label={`${currentFilters.percentualMinimo}%`}
              onDelete={handleRemovePercentualMinimo}
            />
          </Block>
        )}

        {currentFilters.percentualMaximo !== null && (
          <Block label="Percentual máx.:">
            <Chip
              size="small"
              label={`${currentFilters.percentualMaximo}%`}
              onDelete={handleRemovePercentualMaximo}
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
      sx={{
        p: 1,
        borderRadius: 1,
        overflow: 'hidden',
        borderStyle: 'dashed',
        ...sx,
      }}
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
