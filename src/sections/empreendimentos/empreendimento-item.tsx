import type { CardProps } from '@mui/material/Card';
import type { IEmpreendimentoItem } from 'src/types/empreendimento';

import { useMemo } from 'react';
import { usePopover } from 'minimal-shared/hooks';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Divider from '@mui/material/Divider';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import ListItemText from '@mui/material/ListItemText';

import { RouterLink } from 'src/routes/components';

import { fDate } from 'src/utils/format-time';
import { fCurrency } from 'src/utils/format-number';

import { Iconify } from 'src/components/iconify';
import { CustomPopover } from 'src/components/custom-popover';

// ----------------------------------------------------------------------

type Props = CardProps & {
  empreendimento: IEmpreendimentoItem;
  editHref: string;
};

export function EmpreendimentoItem({ empreendimento, editHref, sx, ...other }: Props) {
  const menuActions = usePopover();

  // Memoiza os valores para evitar recálculos a cada renderização
  const { totalUnidades, unidadesVendidas } = useMemo(() => {
    // Define número de unidades baseado no tipo de empreendimento
    const calcularUnidadesTotais = () => {
      const tipo = empreendimento.tipoEmpreendimento?.toLowerCase() || '';
      if (tipo.includes('comercial')) return Math.floor(Math.random() * 50) + 30; // 30-80 unidades
      if (tipo.includes('misto')) return Math.floor(Math.random() * 100) + 80; // 80-180 unidades
      return Math.floor(Math.random() * 120) + 60; // 60-180 unidades para residencial
    };

    // Define porcentagem de vendas baseada no status
    const calcularPorcentagemVendida = () => {
      const status = empreendimento.status?.toLowerCase() || '';
      if (status.includes('lançamento')) return Math.random() * 0.2 + 0.1; // 10-30%
      if (status.includes('construção')) return Math.random() * 0.3 + 0.4; // 40-70%
      if (status.includes('pronto')) return Math.random() * 0.2 + 0.7; // 70-90%
      if (status.includes('entregue')) return Math.random() * 0.05 + 0.95; // 95-100%
      return Math.random() * 0.3 + 0.3; // 30-60% padrão
    };

    const total = calcularUnidadesTotais();
    const percentual = calcularPorcentagemVendida();
    const vendidas = Math.floor(total * percentual);

    return { totalUnidades: total, unidadesVendidas: vendidas };
  }, [empreendimento.tipoEmpreendimento, empreendimento.status]);

  const renderMenuActions = () => (
    <CustomPopover
      open={menuActions.open}
      anchorEl={menuActions.anchorEl}
      onClose={menuActions.onClose}
      slotProps={{ arrow: { placement: 'right-top' } }}
    >
      <MenuList>
        <MenuItem
          onClick={() => {
            menuActions.onClose();
            if (empreendimento.book) {
              window.open(empreendimento.book, '_blank');
            }
          }}
          disabled={!empreendimento.book}
        >
          <Iconify icon="solar:download-bold" />
          Baixar book
        </MenuItem>

        <MenuItem component={RouterLink} href={editHref} onClick={() => menuActions.onClose()}>
          <Iconify icon="solar:pen-bold" />
          Editar
        </MenuItem>
      </MenuList>
    </CustomPopover>
  );

  return (
    <>
      <Card sx={sx} {...other}>
        <IconButton onClick={menuActions.onOpen} sx={{ position: 'absolute', top: 8, right: 8 }}>
          <Iconify icon="eva:more-vertical-fill" />
        </IconButton>

        <Box sx={{ p: 3, pb: 2 }}>
          <Typography
            variant="overline"
            sx={{
              display: 'block',
              mb: 2,
              color: 'text.secondary',
              fontWeight: 600,
              letterSpacing: 1.2,
            }}
          >
            {empreendimento.construtora?.name || 'Construtora'}
          </Typography>

          <ListItemText
            sx={{ mb: 1 }}
            primary={
              <Typography
                variant="subtitle1"
                color="inherit"
                sx={{
                  height: '2.5rem', // Altura fixa equivalente a 2 linhas
                  lineHeight: 1.25,
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {empreendimento.nome}
              </Typography>
            }
            secondary={`Iniciado em: ${fDate(empreendimento.criadoEm)}`}
            slotProps={{
              secondary: {
                sx: { mt: 1, typography: 'caption', color: 'text.secondary' },
              },
            }}
          />

          <Box
            sx={{
              gap: 0.5,
              display: 'flex',
              alignItems: 'center',
              color: 'success.main',
              typography: 'caption',
            }}
          >
            <Iconify width={16} icon="solar:cart-check-bold" />
            {`Vendidas ${unidadesVendidas} de ${totalUnidades} disponíveis`}
          </Box>
        </Box>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <Box
          sx={{
            p: 3,
            rowGap: 1.5,
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
          }}
        >
          {[
            {
              label: `${empreendimento.plantas?.length || 0} ${(empreendimento.plantas?.length || 0) === 1 ? 'planta' : 'plantas'}`,
              icon: <Iconify width={16} icon="solar:buildings-3-bold" sx={{ flexShrink: 0 }} />,
            },
            {
              label: 'Entrega 2026',
              icon: <Iconify width={16} icon="solar:clock-circle-bold" sx={{ flexShrink: 0 }} />,
            },
            {
              label: `m² ${fCurrency(8312)}`,
              icon: <Iconify width={16} icon="solar:banknote-2-bold" sx={{ flexShrink: 0 }} />,
            },
            {
              label: `${empreendimento.cidade || 'São Paulo'}, ${empreendimento.estado || 'SP'}`,
              icon: <Iconify width={16} icon="solar:map-point-bold" sx={{ flexShrink: 0 }} />,
            },
          ].map((item) => (
            <Box
              key={item.label}
              sx={{
                gap: 0.5,
                minWidth: 0,
                flexShrink: 0,
                display: 'flex',
                alignItems: 'center',
                color: 'text.secondary',
              }}
            >
              {item.icon}
              <Typography variant="caption" noWrap>
                {item.label}
              </Typography>
            </Box>
          ))}
        </Box>
      </Card>

      {renderMenuActions()}
    </>
  );
}
