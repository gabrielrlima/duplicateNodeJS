import type { IRecebimentosCustomer } from 'src/types/recebimentos';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

type Props = {
  customer?: IRecebimentosCustomer;
};

export function RecebimentosDetailsCustomer({ customer }: Props) {
  return (
    <>
      <CardHeader title="Cliente" />

      <Stack direction="row" sx={{ p: 3 }}>
        <Avatar
          alt={customer?.name}
          src={customer?.avatarUrl}
          sx={{ width: 48, height: 48, mr: 2 }}
        />

        <Stack spacing={0.5} alignItems="flex-start" sx={{ typography: 'body2' }}>
          <Typography variant="subtitle2">{customer?.name}</Typography>

          <Box sx={{ color: 'text.secondary' }}>{customer?.email}</Box>

          <Box sx={{ color: 'text.secondary' }}>
            <Box component="span" sx={{ color: 'text.primary', mr: 0.25 }}>
              Tel:
            </Box>
            {customer?.phone}
          </Box>

          <Stack direction="row" alignItems="center" sx={{ color: 'text.secondary' }}>
            <Iconify icon="mingcute:location-fill" width={16} sx={{ mr: 0.5 }} />
            <Link color="inherit" variant="body2">
              Ver perfil completo
            </Link>
          </Stack>
        </Stack>
      </Stack>
    </>
  );
}
