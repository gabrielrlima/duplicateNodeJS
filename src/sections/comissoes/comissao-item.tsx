import type { CardProps } from '@mui/material/Card';
import type { IComissaoItem } from 'src/types/comissao';

import { usePopover } from 'minimal-shared/hooks';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import Divider from '@mui/material/Divider';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import ListItemText from '@mui/material/ListItemText';

import { RouterLink } from 'src/routes/components';

import { fDate } from 'src/utils/format-time';
import { fPercent } from 'src/utils/format-number';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { CustomPopover } from 'src/components/custom-popover';

import { isComissaoTotal } from 'src/types/comissao';

// ----------------------------------------------------------------------

type Props = CardProps & {
  comissao: IComissaoItem;
  editHref: string;
  detailsHref: string;
  onDelete: () => void;
  comissoes?: IComissaoItem[];
};

export function ComissaoItem({
  comissao,
  editHref,
  detailsHref,
  onDelete,
  comissoes,
  sx,
  ...other
}: Props) {
  const menuActions = usePopover();

  const renderMenuActions = () => (
    <CustomPopover
      open={menuActions.open}
      anchorEl={menuActions.anchorEl}
      onClose={menuActions.onClose}
      slotProps={{ arrow: { placement: 'right-top' } }}
    >
      <MenuList>
        <li>
          <MenuItem component={RouterLink} href={detailsHref} onClick={() => menuActions.onClose()}>
            <Iconify icon="solar:eye-bold" />
            Visualizar
          </MenuItem>
        </li>

        <li>
          <MenuItem component={RouterLink} href={editHref} onClick={() => menuActions.onClose()}>
            <Iconify icon="solar:pen-bold" />
            Editar
          </MenuItem>
        </li>

        <MenuItem
          onClick={() => {
            menuActions.onClose();
            onDelete();
          }}
          sx={{ color: 'error.main' }}
        >
          <Iconify icon="solar:trash-bin-trash-bold" />
          Excluir
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
          <Box sx={{ mb: 2 }}>
            <Label
              variant="soft"
              color={(comissao.status === 'ativo' && 'success') || 'default'}
              sx={{
                textTransform: 'capitalize',
                fontSize: '0.75rem',
                fontWeight: 600,
              }}
            >
              {comissao.status}
            </Label>
          </Box>

          <ListItemText
            sx={{ mb: 1 }}
            primary={
              <Link component={RouterLink} href={detailsHref} color="inherit">
                {comissao.nome}
              </Link>
            }
            secondary={comissao.descricao || `Criado em: ${fDate(comissao.createdAt)}`}
            slotProps={{
              primary: {
                sx: {
                  typography: 'subtitle1',
                  minHeight: '2.5em',
                  lineHeight: 1.25,
                  display: 'flex',
                  alignItems: 'flex-start',
                },
              },
              secondary: {
                sx: {
                  mt: 1,
                  typography: 'caption',
                  color: 'text.disabled',
                  minHeight: '2.4em',
                  lineHeight: 1.2,
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                },
              },
            }}
          />
        </Box>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <Box
          sx={{
            p: 3,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Box
            sx={{
              gap: 0.5,
              display: 'flex',
              alignItems: 'center',
              color: 'text.disabled',
            }}
          >
            <Iconify width={16} icon="solar:tag-bold" sx={{ flexShrink: 0, color: 'info.main' }} />
            <Typography variant="caption" noWrap>
              {(() => {
                // Se for comissão total, usar tipoProduto diretamente
                if (isComissaoTotal(comissao)) {
                  switch (comissao.tipoProduto) {
                    case 'imovel':
                      return 'Imóvel';
                    case 'terreno':
                      return 'Terreno';
                    case 'empreendimento':
                      return 'Empreendimento';
                    default:
                      return 'Produto';
                  }
                }

                // Para distribuições internas, buscar o tipo da comissão total relacionada
                const comissaoTotal = comissoes?.find(
                  (c) => isComissaoTotal(c) && c.id === comissao.comissaoTotalId
                );

                if (comissaoTotal && isComissaoTotal(comissaoTotal)) {
                  switch (comissaoTotal.tipoProduto) {
                    case 'imovel':
                      return 'Imóvel';
                    case 'terreno':
                      return 'Terreno';
                    case 'empreendimento':
                      return 'Empreendimento';
                    default:
                      return 'Produto';
                  }
                }

                return 'Produto';
              })()}
            </Typography>
          </Box>

          <Box
            sx={{
              gap: 0.5,
              display: 'flex',
              alignItems: 'center',
              color: 'text.disabled',
            }}
          >
            <Iconify
              width={16}
              icon="solar:percent-bold"
              sx={{ flexShrink: 0, color: 'success.main' }}
            />
            <Typography variant="caption" noWrap>
              {isComissaoTotal(comissao) ? fPercent(comissao.percentualTotal || 0) : fPercent(0)}
            </Typography>
          </Box>
        </Box>
      </Card>

      {renderMenuActions()}
    </>
  );
}
