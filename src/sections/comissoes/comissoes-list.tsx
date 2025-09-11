import type { IComissaoItem } from 'src/types/comissao';

import { useCallback } from 'react';

import Box from '@mui/material/Box';
import Pagination, { paginationClasses } from '@mui/material/Pagination';

import { paths } from 'src/routes/paths';

import { ComissaoItem } from './comissao-item';

// ----------------------------------------------------------------------

type Props = {
  comissoes: IComissaoItem[];
  page?: number;
  count?: number;
  rowsPerPage?: number;
  onPageChange?: (event: unknown, newPage: number) => void;
  onRowsPerPageChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

export function ComissoesList({
  comissoes,
  page = 0,
  count = 0,
  rowsPerPage = 9,
  onPageChange,
  onRowsPerPageChange,
}: Props) {
  const handleDelete = useCallback((id: string) => {
    console.info('DELETE', id);
  }, []);

  return (
    <>
      <Box
        sx={{
          gap: 3,
          display: 'grid',
          gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
        }}
      >
        {comissoes.map((comissao) => (
          <ComissaoItem
            key={comissao.id}
            comissao={comissao}
            editHref={paths.dashboard.comissoes.edit(comissao.id)}
            detailsHref={paths.dashboard.comissoes.details(comissao.id)}
            onDelete={() => handleDelete(comissao.id)}
            comissoes={comissoes}
          />
        ))}
      </Box>

      {count > 1 && (
        <Pagination
          page={page + 1}
          count={count}
          onChange={(event, newPage) => onPageChange?.(event, newPage - 1)}
          sx={{
            mt: { xs: 8, md: 8 },
            [`& .${paginationClasses.ul}`]: { justifyContent: 'center' },
          }}
        />
      )}
    </>
  );
}
