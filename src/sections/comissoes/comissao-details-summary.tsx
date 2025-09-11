import type { IComissaoItem } from 'src/types/comissao';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import ListItemText from '@mui/material/ListItemText';

import { fDateTime } from 'src/utils/format-time';

import { Iconify } from 'src/components/iconify';

import { isComissaoTotal } from 'src/types/comissao';

// ----------------------------------------------------------------------

type Props = {
  comissao?: IComissaoItem;
  summary: {
    title: string;
    description: string;
    icon: string;
  }[];
};

export function ComissaoDetailsSummary({ comissao, summary }: Props) {
  const renderSummary = (
    <Card>
      <CardHeader title="Resumo" />
      <Stack spacing={1.5} sx={{ p: 3 }}>
        {summary.map((item) => (
          <Stack key={item.title} spacing={1.5} direction="row">
            <Avatar
              variant="rounded"
              sx={{
                p: 1,
                width: 48,
                height: 48,
                bgcolor: 'background.neutral',
              }}
            >
              <Iconify icon={item.icon} width={24} />
            </Avatar>
            <ListItemText
              primary={item.title}
              secondary={item.description}
              primaryTypographyProps={{ typography: 'subtitle2' }}
              secondaryTypographyProps={{
                mt: 0.5,
                component: 'span',
                typography: 'caption',
                color: 'text.disabled',
              }}
            />
          </Stack>
        ))}
      </Stack>
    </Card>
  );

  const renderDetails = (
    <Card>
      <CardHeader title="Detalhes" />
      <Stack spacing={1.5} sx={{ p: 3 }}>
        <Stack direction="row">
          <Typography variant="body2" sx={{ color: 'text.secondary', flexGrow: 1 }}>
            Tipo
          </Typography>
          <Typography variant="body2">
            {isComissaoTotal(comissao) ? 'Comissão Total' : 'Distribuição Interna'}
          </Typography>
        </Stack>

        {isComissaoTotal(comissao) && (
          <>
            <Stack direction="row">
              <Typography variant="body2" sx={{ color: 'text.secondary', flexGrow: 1 }}>
                Percentual Total
              </Typography>
              <Typography variant="body2">{comissao.percentualTotal}%</Typography>
            </Stack>

            <Stack direction="row">
              <Typography variant="body2" sx={{ color: 'text.secondary', flexGrow: 1 }}>
                Tipo de Produto
              </Typography>
              <Typography variant="body2">
                {comissao.tipoProduto.charAt(0).toUpperCase() + comissao.tipoProduto.slice(1)}
              </Typography>
            </Stack>
          </>
        )}

        <Stack direction="row">
          <Typography variant="body2" sx={{ color: 'text.secondary', flexGrow: 1 }}>
            Status
          </Typography>
          <Typography variant="body2">{comissao?.status}</Typography>
        </Stack>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <Stack direction="row">
          <Typography variant="body2" sx={{ color: 'text.secondary', flexGrow: 1 }}>
            Criado em
          </Typography>
          <Typography variant="body2">{fDateTime(comissao?.createdAt)}</Typography>
        </Stack>

        <Stack direction="row">
          <Typography variant="body2" sx={{ color: 'text.secondary', flexGrow: 1 }}>
            Atualizado em
          </Typography>
          <Typography variant="body2">{fDateTime(comissao?.updatedAt)}</Typography>
        </Stack>
      </Stack>
    </Card>
  );

  // Condições removidas da nova estrutura de comissões
  const renderConditions = null;

  return (
    <Stack spacing={3}>
      {renderSummary}
      {renderDetails}
      {renderConditions}
    </Stack>
  );
}
