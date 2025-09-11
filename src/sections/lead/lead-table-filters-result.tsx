import type { ILeadTableFilters } from '@/types/lead';
import type { UseSetStateReturn } from 'minimal-shared/hooks';
import type { FiltersResultProps } from 'src/components/filters-result';

import { useCallback } from 'react';

import Chip from '@mui/material/Chip';

import { chipProps, FiltersBlock, FiltersResult } from 'src/components/filters-result';

// ----------------------------------------------------------------------

type Props = FiltersResultProps & {
  onResetPage: () => void;
  filters: UseSetStateReturn<ILeadTableFilters>;
};

export function LeadTableFiltersResult({ filters, onResetPage, totalResults, sx }: Props) {
  const { state: currentFilters, setState: updateFilters, resetState: resetFilters } = filters;

  const handleRemoveSearch = useCallback(() => {
    onResetPage();
    updateFilters({ search: '' });
  }, [onResetPage, updateFilters]);

  const handleRemoveStatus = useCallback(() => {
    onResetPage();
    updateFilters({ status: 'todos' });
  }, [onResetPage, updateFilters]);

  const handleRemoveFilterBy = useCallback(() => {
    onResetPage();
    updateFilters({ filterBy: 'name' });
  }, [onResetPage, updateFilters]);

  const handleRemoveStartDate = useCallback(() => {
    onResetPage();
    updateFilters({ startDate: '' });
  }, [onResetPage, updateFilters]);

  const handleRemoveEndDate = useCallback(() => {
    onResetPage();
    updateFilters({ endDate: '' });
  }, [onResetPage, updateFilters]);

  const handleReset = useCallback(() => {
    onResetPage();
    resetFilters();
  }, [onResetPage, resetFilters]);

  const getFilterByLabel = (value: string) => {
    const labels: Record<string, string> = {
      name: 'Nome',
      phoneNumber: 'Telefone',
      email: 'Email',
      company: 'Empresa',
      product: 'Produto',
    };
    return labels[value] || value;
  };

  return (
    <FiltersResult totalResults={totalResults} onReset={handleReset} sx={sx}>
      <FiltersBlock label="Filtrar por:" isShow={currentFilters.filterBy !== 'name'}>
        <Chip
          {...chipProps}
          label={getFilterByLabel(currentFilters.filterBy || 'name')}
          onDelete={handleRemoveFilterBy}
          sx={{ textTransform: 'capitalize' }}
        />
      </FiltersBlock>

      <FiltersBlock label="Status:" isShow={currentFilters.status !== 'todos'}>
        <Chip
          {...chipProps}
          label={currentFilters.status}
          onDelete={handleRemoveStatus}
          sx={{ textTransform: 'capitalize' }}
        />
      </FiltersBlock>

      <FiltersBlock label="Pesquisa:" isShow={!!currentFilters.search}>
        <Chip {...chipProps} label={currentFilters.search} onDelete={handleRemoveSearch} />
      </FiltersBlock>

      <FiltersBlock label="Data inicial:" isShow={!!currentFilters.startDate}>
        <Chip {...chipProps} label={currentFilters.startDate} onDelete={handleRemoveStartDate} />
      </FiltersBlock>

      <FiltersBlock label="Data final:" isShow={!!currentFilters.endDate}>
        <Chip {...chipProps} label={currentFilters.endDate} onDelete={handleRemoveEndDate} />
      </FiltersBlock>
    </FiltersResult>
  );
}
