import type { IEmpreendimentoItem } from 'src/types/empreendimento';

import Box from '@mui/material/Box';
import Pagination, { paginationClasses } from '@mui/material/Pagination';

import { paths } from 'src/routes/paths';

import { EmpreendimentoItem } from './empreendimento-item';

// ----------------------------------------------------------------------

type Props = {
  empreendimentos: IEmpreendimentoItem[];
};

export function EmpreendimentoList({ empreendimentos }: Props) {
  return (
    <>
      <Box
        gap={3}
        display="grid"
        gridTemplateColumns={{
          xs: 'repeat(1, 1fr)',
          sm: 'repeat(2, 1fr)',
          md: 'repeat(3, 1fr)',
        }}
      >
        {empreendimentos.map((empreendimento) => (
          <EmpreendimentoItem
            key={empreendimento.id}
            empreendimento={empreendimento}
            editHref={paths.dashboard.empreendimentos.edit(empreendimento.id)}
          />
        ))}
      </Box>

      {empreendimentos.length > 8 && (
        <Pagination
          count={8}
          sx={{
            mt: { xs: 8, md: 8 },
            [`& .${paginationClasses.ul}`]: { justifyContent: 'center' },
          }}
        />
      )}
    </>
  );
}
