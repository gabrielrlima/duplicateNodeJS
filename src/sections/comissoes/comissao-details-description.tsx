import type { IComissaoItem } from 'src/types/comissao';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { Markdown } from 'src/components/markdown';

import { isComissaoTotal } from 'src/types/comissao';

// ----------------------------------------------------------------------

type Props = {
  comissao?: IComissaoItem;
};

export function ComissaoDetailsDescription({ comissao }: Props) {
  return (
    <Stack spacing={3}>
      <Typography variant="h4">{comissao?.nome}</Typography>

      <Stack spacing={2} direction="row" alignItems="center" flexWrap="wrap">
        <Chip
          variant="soft"
          label={isComissaoTotal(comissao) ? 'Comissão Total' : 'Distribuição Interna'}
          color="primary"
          size="small"
        />

        {isComissaoTotal(comissao) && (
          <Chip
            variant="soft"
            label={`${comissao.percentualTotal}%`}
            color="secondary"
            size="small"
          />
        )}

        <Chip
          variant="soft"
          label={comissao?.status}
          color={comissao?.status === 'ativo' ? 'success' : 'default'}
          size="small"
        />

        <Chip
          variant="soft"
          label={isComissaoTotal(comissao) ? comissao.tipoProduto : 'Distribuição'}
          color="info"
          size="small"
        />
      </Stack>

      <Typography variant="h6">Descrição</Typography>

      <Box sx={{ color: 'text.secondary' }}>
        <Markdown content={comissao?.descricao || ''} />
      </Box>

      {/* Condições removidas da nova estrutura de comissões */}
    </Stack>
  );
}
