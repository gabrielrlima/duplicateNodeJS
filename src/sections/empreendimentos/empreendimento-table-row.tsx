import type { GridCellParams } from '@mui/x-data-grid';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Avatar from '@mui/material/Avatar';
import ListItemText from '@mui/material/ListItemText';

import { RouterLink } from 'src/routes/components';

import { fCurrency } from 'src/utils/format-number';
import { fDate, fTime } from 'src/utils/format-time';

import { Label } from 'src/components/label';

// ----------------------------------------------------------------------

type ParamsProps = {
  params: GridCellParams;
};

export function RenderCellPreco({ params }: ParamsProps) {
  return fCurrency(params.row.precoMinimo);
}

export function RenderCellStatus({ params }: ParamsProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Disponível':
        return 'success';
      case 'Em construção':
        return 'warning';
      case 'Vendido':
        return 'error';
      default:
        return 'default';
    }
  };

  return (
    <Label variant="soft" color={getStatusColor(params.row.status)}>
      {params.row.status}
    </Label>
  );
}

export function RenderCellCriadoEm({ params }: ParamsProps) {
  return (
    <Box sx={{ gap: 0.5, display: 'flex', flexDirection: 'column' }}>
      <span>{fDate(params.row.criadoEm)}</span>
      <Box component="span" sx={{ typography: 'caption', color: 'text.secondary' }}>
        {fTime(params.row.criadoEm)}
      </Box>
    </Box>
  );
}

export function RenderCellTipo({ params }: ParamsProps) {
  return (
    <Label variant="soft" color="info">
      {params.row.tipoEmpreendimento}
    </Label>
  );
}

export function RenderCellLocalizacao({ params }: ParamsProps) {
  return (
    <Box sx={{ gap: 0.5, display: 'flex', flexDirection: 'column' }}>
      <span>{params.row.cidade}</span>
      <Box component="span" sx={{ typography: 'caption', color: 'text.secondary' }}>
        {params.row.estado}
      </Box>
    </Box>
  );
}

export function RenderCellEmpreendimento({ params, href }: ParamsProps & { href: string }) {
  return (
    <Box
      sx={{
        py: 2,
        gap: 2,
        width: 1,
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <Avatar
        alt={params.row.nome}
        src={params.row.imagemPrincipal}
        variant="rounded"
        sx={{ width: 64, height: 64 }}
      />

      <ListItemText
        primary={
          <Link component={RouterLink} href={href} color="inherit">
            {params.row.nome}
          </Link>
        }
        secondary={params.row.descricao}
        slotProps={{
          primary: { noWrap: true },
          secondary: { sx: { color: 'text.disabled' }, noWrap: true },
        }}
      />
    </Box>
  );
}
