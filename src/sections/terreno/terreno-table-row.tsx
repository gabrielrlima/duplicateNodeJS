import type { ITerrenoItem } from 'src/types/terreno';

import { useBoolean, usePopover } from 'minimal-shared/hooks';
import { toast } from 'sonner';

import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import MenuList from '@mui/material/MenuList';
import Collapse from '@mui/material/Collapse';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';

import { RouterLink } from 'src/routes/components';

import { fCurrency } from 'src/utils/format-number';
import { fDate, fTime } from 'src/utils/format-time';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { CustomPopover } from 'src/components/custom-popover';
import { updateTerrenoStatus } from 'src/actions/terreno';

// ----------------------------------------------------------------------

type Props = {
  row: ITerrenoItem;
  detailsHref: string;
  onDeleteRow: () => void;
  onUpdateStatus?: (newStatus: string) => void;
};

export function TerrenoTableRow({ row, onDeleteRow, detailsHref, onUpdateStatus }: Props) {
  const confirmDialog = useBoolean();
  const menuActions = usePopover();
  const collapseRow = useBoolean();

  const handleUpdateStatus = async (newStatus: string) => {
    try {
      const statusMap = {
        'disponivel': 'available',
        'reservado': 'reserved', 
        'vendido': 'sold',
        'suspenso': 'inactive'
      };
      
      await updateTerrenoStatus(row.id, statusMap[newStatus] || newStatus);
      toast.success('Status atualizado com sucesso!');
      onUpdateStatus?.(newStatus);
      menuActions.onClose();
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
      toast.error('Erro ao atualizar status do terreno');
    }
  };

  const renderPrimaryRow = () => (
    <TableRow hover>

      <TableCell>
        <Stack sx={{ typography: 'body2', alignItems: 'flex-start' }}>
          <Box component="span" sx={{ fontWeight: 'fontWeightMedium' }}>
            {row.titulo}
          </Box>

          <Box component="span" sx={{ color: 'text.disabled' }}>
            {row.localizacao.bairro}, {row.localizacao.cidade}
          </Box>
        </Stack>
      </TableCell>

      <TableCell>
        <Box sx={{ typography: 'body2' }}>
          {row.corretor || 'Sem corretor'}
        </Box>
      </TableCell>

      <TableCell align="center">
        <Box sx={{ typography: 'body2' }}>{row.area.toLocaleString('pt-BR')} m²</Box>
        <Box sx={{ typography: 'caption', color: 'text.disabled' }}>
          {fCurrency(row.precoM2)}/m²
        </Box>
      </TableCell>

      <TableCell>
        <Box sx={{ typography: 'body2', fontWeight: 'fontWeightMedium' }}>
          {fCurrency(row.preco)}
        </Box>
        {row.negociavel && (
          <Box sx={{ typography: 'caption', color: 'warning.main' }}>Negociável</Box>
        )}
      </TableCell>

      <TableCell>
        <Label
          variant="soft"
          color={
            (row.status === 'available' && 'success') ||
            (row.status === 'reserved' && 'warning') ||
            (row.status === 'sold' && 'info') ||
            (row.status === 'inactive' && 'default') ||
            'default'
          }
        >
          {row.status === 'available' && 'Disponível'}
          {row.status === 'reserved' && 'Reservado'}
          {row.status === 'sold' && 'Vendido'}
          {row.status === 'inactive' && 'Inativo'}
        </Label>
      </TableCell>

      <TableCell align="right" sx={{ px: 1, whiteSpace: 'nowrap' }}>
        <IconButton
          color={collapseRow.value ? 'inherit' : 'default'}
          onClick={collapseRow.onToggle}
          sx={{ ...(collapseRow.value && { bgcolor: 'action.hover' }) }}
        >
          <Iconify icon="eva:arrow-ios-downward-fill" />
        </IconButton>

        <IconButton color={menuActions.open ? 'inherit' : 'default'} onClick={menuActions.onOpen}>
          <Iconify icon="eva:more-vertical-fill" />
        </IconButton>
      </TableCell>
    </TableRow>
  );

  const renderSecondaryRow = () => (
    <TableRow>
      <TableCell sx={{ p: 0, border: 'none' }} colSpan={6}>
        <Collapse
          in={collapseRow.value}
          timeout="auto"
          unmountOnExit
          sx={{ bgcolor: 'background.neutral' }}
        >
          <Paper sx={{ m: 1.5 }}>
            <Box
              sx={(theme) => ({
                display: 'flex',
                alignItems: 'flex-start',
                p: theme.spacing(2),
                gap: 2,
              })}
            >
              {/* Imagem principal */}
              {row.imagens && row.imagens.length > 0 && row.imagens[0] ? (
                <Box
                  component="img"
                  src={row.imagens[0]}
                  alt={row.titulo}
                  sx={{
                    width: 120,
                    height: 80,
                    borderRadius: 1,
                    objectFit: 'cover',
                    flexShrink: 0,
                  }}
                />
              ) : (
                <Box
                  sx={{
                    width: 120,
                    height: 80,
                    borderRadius: 1,
                    flexShrink: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'column',
                    bgcolor: 'background.neutral',
                    border: '1px dashed',
                    borderColor: 'divider',
                    gap: 0.5,
                  }}
                >
                  <Iconify icon="solar:image-bold" width={24} sx={{ color: 'text.disabled' }} />
                  <Box sx={{ typography: 'caption', color: 'text.disabled' }}>Sem imagem</Box>
                </Box>
              )}

              {/* Informações detalhadas */}
              <Stack sx={{ flex: 1 }} spacing={1.5}>
                {/* Cabeçalho */}
                <Box>
                  <Box sx={{ typography: 'subtitle2', mb: 0.5 }}>{row.titulo}</Box>
                </Box>

                {/* Informações principais */}
                <Stack spacing={1.5}>
                  {/* Grid com Localização e Proprietário lado a lado */}
                  <Box sx={{
                    display: 'grid',
                    gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                    gap: 2
                  }}>
                    {/* Localização */}
                    <Box>
                      <Box sx={{ 
                        typography: 'caption', 
                        color: 'text.disabled', 
                        mb: 0.5, 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: 0.5,
                        textTransform: 'uppercase',
                        letterSpacing: 0.5
                      }}>
                        <Iconify icon="eva:pin-fill" width={12} />
                        Localização
                      </Box>
                      <Box sx={{ 
                        display: 'flex', 
                        flexWrap: 'wrap', 
                        gap: 1, 
                        alignItems: 'center' 
                      }}>
                        <Box sx={{ typography: 'body2', fontWeight: 500 }}>
                          {row.localizacao.endereco}
                        </Box>
                        <Box sx={{ typography: 'body2', color: 'text.secondary' }}>
                          {row.localizacao.bairro} • {row.localizacao.cidade} • {row.localizacao.estado}
                        </Box>
                        <Box sx={{ typography: 'caption', color: 'text.disabled' }}>
                          {row.localizacao.cep}
                        </Box>
                      </Box>
                    </Box>


                  </Box>

                  {/* Descrição */}
                  {row.descricao && (
                    <Box>
                      <Box sx={{ 
                        typography: 'caption', 
                        color: 'text.disabled', 
                        mb: 0.5, 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: 0.5,
                        textTransform: 'uppercase',
                        letterSpacing: 0.5
                      }}>
                        <Iconify icon="solar:document-text-bold" width={12} />
                        Descrição
                      </Box>
                      <Box sx={{ 
                        typography: 'body2', 
                        color: 'text.secondary',
                        fontStyle: 'italic',
                        p: 1,
                        bgcolor: 'background.neutral',
                        borderRadius: 1
                      }}>
                        {row.descricao}
                      </Box>
                    </Box>
                  )}
                </Stack>
              </Stack>
            </Box>
          </Paper>
        </Collapse>
      </TableCell>
    </TableRow>
  );

  const renderMenuActions = () => (
    <CustomPopover
      open={menuActions.open}
      anchorEl={menuActions.anchorEl}
      onClose={menuActions.onClose}
      slotProps={{ arrow: { placement: 'right-top' } }}
    >
      <MenuList>
        {/* Status Actions */}
        <MenuItem
          onClick={row.status === 'available' ? undefined : () => handleUpdateStatus('available')}
          disabled={row.status === 'available'}
        >
          <Iconify icon="solar:check-circle-bold" sx={{ color: 'success.main' }} />
          Marcar como Disponível
        </MenuItem>
        
        <MenuItem
          onClick={row.status === 'reserved' ? undefined : () => handleUpdateStatus('reservado')}
          disabled={row.status === 'reserved'}
        >
          <Iconify icon="solar:clock-circle-bold" sx={{ color: 'warning.main' }} />
          Marcar como Reservado
        </MenuItem>
        
        <MenuItem
          onClick={row.status === 'sold' ? undefined : () => handleUpdateStatus('vendido')}
          disabled={row.status === 'sold'}
        >
          <Iconify icon="solar:dollar-minimalistic-bold" sx={{ color: 'info.main' }} />
          Marcar como Vendido
        </MenuItem>
        
        <MenuItem
          onClick={row.status === 'inactive' ? undefined : () => handleUpdateStatus('suspenso')}
          disabled={row.status === 'inactive'}
        >
          <Iconify icon="solar:pause-circle-bold" sx={{ color: 'text.disabled' }} />
          Marcar como Inativo
        </MenuItem>

        <Divider sx={{ my: 1 }} />

        {/* Other Actions */}
        <li>
          <MenuItem component={RouterLink} href={detailsHref} onClick={() => menuActions.onClose()}>
            <Iconify icon="solar:eye-bold" />
            Visualizar
          </MenuItem>
        </li>

        <li>
          <MenuItem
            component={RouterLink}
            href={`${detailsHref}/edit`}
            onClick={() => menuActions.onClose()}
          >
            <Iconify icon="solar:pen-bold" />
            Editar
          </MenuItem>
        </li>

        <Divider sx={{ my: 1 }} />

        <MenuItem
          onClick={() => {
            confirmDialog.onTrue();
            menuActions.onClose();
          }}
          sx={{ color: 'error.main' }}
        >
          <Iconify icon="solar:trash-bin-trash-bold" />
          Remover
        </MenuItem>
      </MenuList>
    </CustomPopover>
  );

  const renderConfirmDialog = () => (
    <ConfirmDialog
      open={confirmDialog.value}
      onClose={confirmDialog.onFalse}
      title="Remover terreno"
      content="Tem certeza que deseja remover este terreno?"
      action={
        <Button variant="contained" color="error" onClick={onDeleteRow}>
          Remover
        </Button>
      }
    />
  );

  return (
    <>
      {renderPrimaryRow()}
      {renderSecondaryRow()}
      {renderMenuActions()}
      {renderConfirmDialog()}
    </>
  );
}
