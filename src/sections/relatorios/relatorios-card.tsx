import 'dayjs/locale/pt-br';

import type { IRelatorio } from 'src/types/relatorios';

import dayjs from 'dayjs';
import { useState } from 'react';
import relativeTime from 'dayjs/plugin/relativeTime';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { CustomPopover } from 'src/components/custom-popover';

// ----------------------------------------------------------------------

type Props = {
  report: IRelatorio;
};

dayjs.extend(relativeTime);
dayjs.locale('pt-br');

export function RelatoriosCard({ report }: Props) {
  const [openPopover, setOpenPopover] = useState<HTMLElement | null>(null);

  const handleOpenPopover = (event: React.MouseEvent<HTMLElement>) => {
    setOpenPopover(event.currentTarget);
  };

  const handleClosePopover = () => {
    setOpenPopover(null);
  };

  const handleDownload = () => {
    handleClosePopover();
  };

  const handleDuplicate = () => {
    handleClosePopover();
  };

  const handleDelete = () => {
    handleClosePopover();
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'vendas':
        return 'solar:dollar-bold-duotone';
      case 'performance':
        return 'solar:graph-new-bold-duotone';
      case 'financeiro':
        return 'solar:bill-list-bold-duotone';
      case 'geral':
        return 'solar:clipboard-text-bold-duotone';
      default:
        return 'solar:document-bold-duotone';
    }
  };

  return (
    <>
      <Card
        sx={{
          p: 3,
          height: 280,
          display: 'flex',
          flexDirection: 'column',
          bgcolor: 'background.paper',
          border: '1px solid',
          borderColor: 'grey.200',
          borderRadius: 2,
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            borderColor: 'grey.400',
            transform: 'translateY(-2px)',
            boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
          },
        }}
      >
        <Stack
          direction="row"
          alignItems="flex-start"
          justifyContent="space-between"
          sx={{ mb: 2 }}
        >
          <Avatar
            variant="rounded"
            sx={{
              width: 48,
              height: 48,
              bgcolor: 'grey.100',
              border: '1px solid',
              borderColor: 'grey.200',
            }}
          >
            <Iconify icon={getTypeIcon(report.type)} width={24} sx={{ color: 'grey.700' }} />
          </Avatar>

          <IconButton
            onClick={handleOpenPopover}
            sx={{
              color: 'grey.600',
              '&:hover': {
                bgcolor: 'grey.100',
                color: 'grey.800',
              },
            }}
          >
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </Stack>

        <Typography
          variant="h6"
          component={RouterLink}
          href={paths.dashboard.relatorios.details(report.id)}
          sx={{
            mb: 1,
            color: 'grey.900',
            textDecoration: 'none',
            fontWeight: 600,
            '&:hover': {
              color: 'grey.700',
            },
          }}
        >
          {report.name}
        </Typography>

        <Typography variant="body2" sx={{ mb: 2, flexGrow: 1, color: 'grey.600', lineHeight: 1.5 }}>
          {report.description}
        </Typography>

        <Stack spacing={1} sx={{ mb: 2 }}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Label
              sx={{
                bgcolor: 'grey.100',
                color: 'grey.800',
                border: '1px solid',
                borderColor: 'grey.200',
                fontWeight: 500,
              }}
            >
              {report.status}
            </Label>
            <Label
              sx={{
                bgcolor: 'grey.50',
                color: 'grey.700',
                border: '1px solid',
                borderColor: 'grey.200',
                fontWeight: 400,
              }}
            >
              {report.type}
            </Label>
          </Stack>
        </Stack>

        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Typography variant="caption" sx={{ color: 'grey.500', fontSize: '0.75rem' }}>
            Atualizado {dayjs(report.updatedAt).fromNow()}
          </Typography>

          <Typography variant="caption" sx={{ color: 'grey.500', fontSize: '0.75rem' }}>
            por {report.createdBy}
          </Typography>
        </Stack>

        <Stack
          direction="row"
          spacing={2}
          sx={{ mt: 2, pt: 2, borderTop: '1px solid', borderColor: 'grey.100' }}
        >
          <Typography variant="caption" sx={{ color: 'grey.600', fontWeight: 500 }}>
            Vendas: {report.metrics.totalVendas}
          </Typography>
          <Typography variant="caption" sx={{ color: 'grey.600', fontWeight: 500 }}>
            Performance: {report.metrics.performance}%
          </Typography>
        </Stack>
      </Card>

      <CustomPopover
        open={Boolean(openPopover)}
        anchorEl={openPopover}
        onClose={handleClosePopover}
        slotProps={{
          arrow: { placement: 'right-top' },
          paper: { sx: { width: 200 } },
        }}
      >
        <MenuItem onClick={handleDownload}>
          <Iconify icon="eva:download-fill" />
          Baixar
        </MenuItem>

        <MenuItem component={RouterLink} href={paths.dashboard.relatorios.edit(report.id)}>
          <Iconify icon="solar:pen-bold" />
          Editar
        </MenuItem>

        <MenuItem onClick={handleDuplicate}>
          <Iconify icon="solar:copy-bold" />
          Duplicar
        </MenuItem>

        <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
          <Iconify icon="solar:trash-bin-trash-bold" />
          Excluir
        </MenuItem>
      </CustomPopover>
    </>
  );
}
