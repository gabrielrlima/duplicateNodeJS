import type { UseSetStateReturn } from 'minimal-shared/hooks';
import type { FiltersResultProps } from 'src/components/filters-result';
import type { IEmpreendimentoTableFilters } from 'src/types/empreendimento';

import { useCallback } from 'react';
import { upperFirst } from 'es-toolkit';

import Chip from '@mui/material/Chip';

import { chipProps, FiltersBlock, FiltersResult } from 'src/components/filters-result';

// ----------------------------------------------------------------------

type Props = FiltersResultProps & {
  filters: UseSetStateReturn<IEmpreendimentoTableFilters>;
};

export function EmpreendimentoTableFiltersResult({ filters, totalResults, sx }: Props) {
  const { state: currentFilters, setState: updateFilters, resetState: resetFilters } = filters;

  const handleRemoveTipos = useCallback(
    (inputValue: string) => {
      const newValue = currentFilters.tipos.filter((item) => item !== inputValue);

      updateFilters({ tipos: newValue });
    },
    [updateFilters, currentFilters.tipos]
  );

  const handleRemoveStatus = useCallback(
    (inputValue: string) => {
      const newValue = currentFilters.status.filter((item) => item !== inputValue);

      updateFilters({ status: newValue });
    },
    [updateFilters, currentFilters.status]
  );

  return (
    <FiltersResult totalResults={totalResults} onReset={() => resetFilters()} sx={sx}>
      <FiltersBlock label="Tipo:" isShow={!!currentFilters.tipos.length}>
        {currentFilters.tipos.map((item) => (
          <Chip
            {...chipProps}
            key={item}
            label={upperFirst(item)}
            onDelete={() => handleRemoveTipos(item)}
          />
        ))}
      </FiltersBlock>

      <FiltersBlock label="Status:" isShow={!!currentFilters.status.length}>
        {currentFilters.status.map((item) => (
          <Chip
            {...chipProps}
            key={item}
            label={upperFirst(item)}
            onDelete={() => handleRemoveStatus(item)}
          />
        ))}
      </FiltersBlock>
    </FiltersResult>
  );
}
