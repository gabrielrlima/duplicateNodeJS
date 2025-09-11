import type { IComissaoItem } from 'src/types/comissao';

import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

type Props = {
  comissao?: IComissaoItem;
  currentStatus: string;
  statusOptions: { value: string; label: string }[];
  onChangeStatus: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

export function ComissaoToolbarClone({
  comissao,
  currentStatus,
  statusOptions,
  onChangeStatus,
}: Props) {
  return (
    <Box
      sx={{
        gap: 3,
        display: 'flex',
        mb: { xs: 3, md: 5 },
        flexDirection: { xs: 'column', sm: 'row' },
        alignItems: { xs: 'flex-end', sm: 'center' },
      }}
    >
      <Box
        sx={{
          gap: 1,
          width: 1,
          flexGrow: 1,
          display: 'flex',
          justifyContent: 'flex-end',
        }}
      >
        <Tooltip title="Editar">
          <IconButton
            component={RouterLink}
            href={paths.dashboard.comissoes.edit(`${comissao?.id}`)}
            sx={{ color: 'text.secondary' }}
          >
            <Iconify icon="solar:pen-bold" />
          </IconButton>
        </Tooltip>

        <Tooltip title="Imprimir">
          <IconButton sx={{ color: 'text.secondary' }}>
            <Iconify icon="solar:printer-minimalistic-bold" />
          </IconButton>
        </Tooltip>
      </Box>

      <TextField
        fullWidth
        select
        label="Status"
        value={currentStatus}
        onChange={onChangeStatus}
        sx={{ maxWidth: 160 }}
        slotProps={{
          htmlInput: { id: 'status-select' },
          inputLabel: { htmlFor: 'status-select' },
        }}
      >
        {statusOptions.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </TextField>
    </Box>
  );
}
