import type { IPropertyItem } from 'src/types/property';

import { toast } from 'sonner';
import { useBoolean, usePopover } from 'minimal-shared/hooks';

import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import MenuList from '@mui/material/MenuList';
import Collapse from '@mui/material/Collapse';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';

import { RouterLink } from 'src/routes/components';

import { fCurrency } from 'src/utils/format-number';

import { updatePropertyStatus } from 'src/actions/property';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { CustomPopover } from 'src/components/custom-popover';

// ----------------------------------------------------------------------

type Props = {
  row: IPropertyItem;
  detailsHref: string;
  onDeleteRow: () => void;
  onUpdateStatus?: (newStatus: string) => void;
};

export function PropertyTableRow({ row, onDeleteRow, detailsHref, onUpdateStatus }: Props) {
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
      
      await updatePropertyStatus(row.id, statusMap[newStatus] || newStatus);
      toast.success('Status atualizado com sucesso!');
      onUpdateStatus?.(newStatus);
      menuActions.onClose();
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
      toast.error('Erro ao atualizar status do imóvel');
    }
  };

  const renderPrimaryRow = () => (
    <TableRow hover>
      <TableCell>
        <Box sx={{ typography: 'body2', fontWeight: 'fontWeightMedium' }}>
          {row.titulo}
        </Box>
      </TableCell>



      <TableCell>
        <Box sx={{ typography: 'body2' }}>
          {typeof row.localizacao === 'string' ? row.localizacao : 
            (typeof row.localizacao === 'object' && row.localizacao?.bairro && row.localizacao?.cidade) ? 
              `${row.localizacao.bairro}, ${row.localizacao.cidade}` : 
              'Localização não informada'
          }
        </Box>
        <Box sx={{ typography: 'caption', color: 'text.disabled' }}>
          {typeof row.localizacao === 'object' && row.localizacao?.estado ? row.localizacao.estado : ''}
        </Box>
      </TableCell>

      <TableCell>
        <Box sx={{ typography: 'body2' }}>
          {(() => {
            const tipoMap = {
              'apartment': 'Apartamento',
              'house': 'Casa',
              'commercial': 'Comercial',
              'land': 'Terreno',
              'penthouse': 'Cobertura',
              'studio': 'Studio',
              'loft': 'Loft',
              'farm': 'Fazenda',
              'warehouse': 'Galpão',
              'office': 'Escritório',
              'empreendimento': 'Empreendimento',
              'imovel': 'Imóvel',
              'terreno': 'Terreno'
            };
            return tipoMap[row.tipo] || row.tipo || 'Não informado';
          })()} 
        </Box>
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
      <TableCell sx={{ p: 0, border: 'none' }} colSpan={5}>
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
              {row.imagens && row.imagens.length > 0 && row.imagens[0] && (
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
              )}

              {/* Informações detalhadas */}
              <Stack sx={{ flex: 1 }} spacing={1.5}>
                {/* Cabeçalho */}
                <Box>
                  <Box sx={{ typography: 'subtitle2', mb: 0.5 }}>{row.titulo}</Box>
                </Box>

                {/* Informações principais */}
                <Stack spacing={1.5}>
                  {/* Localização */}
                  <Box>
                    <Box sx={{ typography: 'caption', color: 'text.secondary', mb: 0.5 }}>
                      Localização
                    </Box>
                    <Box sx={{ typography: 'body2' }}>
                      {typeof row.localizacao === 'string' ? row.localizacao : 
                        row.localizacao?.endereco ? 
                          `${row.localizacao.endereco}, ${row.localizacao.bairro}, ${row.localizacao.cidade} - ${row.localizacao.estado}` : 
                          'Localização não informada'
                      }
                    </Box>
                  </Box>

                  {/* Características do imóvel */}
                  <Box>
                    <Box sx={{ typography: 'caption', color: 'text.secondary', mb: 0.5 }}>
                      Características
                    </Box>
                    <Box sx={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(80px, 1fr))',
                      gap: 1,
                    }}>
                      {/* Preço - sempre exibido */}
                      <Box sx={{ textAlign: 'center' }}>
                        <Box sx={{ typography: 'body2', fontWeight: 'fontWeightMedium' }}>
                          {(() => {
                            // Para empreendimentos, calcular preço médio das plantas
                            if (row.tipo === 'empreendimento') {
                              const plantas: any[] = [];
                              if (plantas && plantas.length > 0) {
                                const plantasComPreco = plantas.filter((p: any) => 
                                  (p.precoPorM2 || p.pricePerM2 || p.price_per_m2) > 0
                                );
                                if (plantasComPreco.length > 0) {
                                  const precos = plantasComPreco.map((p: any) => 
                                    p.precoPorM2 || p.pricePerM2 || p.price_per_m2
                                  );
                                  const precoMedio = precos.reduce((a: number, b: number) => a + b, 0) / precos.length;
                                  return `R$ ${Math.round(precoMedio)}/m²`;
                                }
                              }
                              return row.preco ? fCurrency(row.preco) : 'Consulte';
                            }
                            // Para outros tipos, exibir preço normal
                            return row.preco ? fCurrency(row.preco) : 'Consulte';
                          })()} 
                        </Box>
                        <Box sx={{ typography: 'caption', color: 'text.disabled' }}>Preço</Box>
                      </Box>

                      {/* Características específicas por tipo */}
                      {row.tipo === 'empreendimento' ? (
                        <>
                          {/* Quantidade de plantas */}
                          <Box sx={{ textAlign: 'center' }}>
                            <Box sx={{ typography: 'body2', fontWeight: 'fontWeightMedium' }}>
                              {(() => {
                                const plantas: any[] = [];
                                return plantas.length || 0;
                              })()}
                            </Box>
                            <Box sx={{ typography: 'caption', color: 'text.disabled' }}>Plantas</Box>
                          </Box>
                          
                          {/* Faixa de área das plantas */}
                          <Box sx={{ textAlign: 'center' }}>
                            <Box sx={{ typography: 'body2', fontWeight: 'fontWeightMedium' }}>
                              {(() => {
                                const plantas: any[] = [];
                                if (plantas && plantas.length > 0) {
                                  const areas = plantas.map((p: any) => p.area).filter((a: number) => a > 0);
                                  if (areas.length > 0) {
                                    const minArea = Math.min(...areas);
                                    const maxArea = Math.max(...areas);
                                    return minArea === maxArea ? `${minArea}m²` : `${minArea}-${maxArea}m²`;
                                  }
                                }
                                return row.area || 0;
                              })()}
                            </Box>
                            <Box sx={{ typography: 'caption', color: 'text.disabled' }}>Área</Box>
                          </Box>
                        </>
                      ) : row.tipo === 'terreno' ? (
                        <>
                          {/* Características específicas para terrenos */}
                          <Box sx={{ textAlign: 'center' }}>
                            <Box sx={{ typography: 'body2', fontWeight: 'fontWeightMedium' }}>
                              {(() => {
                                const preco = row.preco || 0;
                                const area = row.area || row.caracteristicas?.area || 0;
                                if (preco > 0 && area > 0) {
                                  const valorM2 = Math.round(preco / area);
                                  return `R$ ${valorM2}/m²`;
                                }
                                return 'N/A';
                              })()}
                            </Box>
                            <Box sx={{ typography: 'caption', color: 'text.disabled' }}>Valor/m²</Box>
                          </Box>
                          
                          <Box sx={{ textAlign: 'center' }}>
                            <Box sx={{ typography: 'body2', fontWeight: 'fontWeightMedium' }}>
                              {(() => {
                                const area = row.area || row.caracteristicas?.area || 0;
                                return area > 0 ? `${area}m²` : 'N/A';
                              })()}
                            </Box>
                            <Box sx={{ typography: 'caption', color: 'text.disabled' }}>Área</Box>
                          </Box>
                        </>
                      ) : (
                        <>
                          {/* Características tradicionais para imóveis */}
                          <Box sx={{ textAlign: 'center' }}>
                            <Box sx={{ typography: 'body2', fontWeight: 'fontWeightMedium' }}>
                              {row.caracteristicas?.quartos || 0}
                            </Box>
                            <Box sx={{ typography: 'caption', color: 'text.disabled' }}>Quartos</Box>
                          </Box>
                          <Box sx={{ textAlign: 'center' }}>
                            <Box sx={{ typography: 'body2', fontWeight: 'fontWeightMedium' }}>
                              {row.caracteristicas?.banheiros || 0}
                            </Box>
                            <Box sx={{ typography: 'caption', color: 'text.disabled' }}>Banheiros</Box>
                          </Box>
                          <Box sx={{ textAlign: 'center' }}>
                            <Box sx={{ typography: 'body2', fontWeight: 'fontWeightMedium' }}>
                              {row.caracteristicas?.vagasGaragem || 0}
                            </Box>
                            <Box sx={{ typography: 'caption', color: 'text.disabled' }}>Vagas</Box>
                          </Box>
                        </>
                      )}
                    </Box>
                  </Box>

                  {/* Descrição */}
                  {row.descricao && (
                    <Box>
                      <Box sx={{ typography: 'caption', color: 'text.secondary', mb: 0.5 }}>
                        Descrição
                      </Box>
                      <Box sx={{ typography: 'body2', color: 'text.secondary' }}>
                        {row.descricao.length > 150 
                          ? `${row.descricao.substring(0, 150)}...` 
                          : row.descricao
                        }
                      </Box>
                    </Box>
                  )}
                </Stack>

                {/* Ações */}
                <Stack direction="row" spacing={1} sx={{ pt: 1 }}>
                  <Button
                    component={RouterLink}
                    href={detailsHref}
                    size="small"
                    variant="outlined"
                    startIcon={<Iconify icon="solar:eye-bold" />}
                  >
                    Ver detalhes
                  </Button>
                </Stack>
              </Stack>
            </Box>
          </Paper>
        </Collapse>
      </TableCell>
    </TableRow>
  );

  return (
    <>
      {renderPrimaryRow()}
      {renderSecondaryRow()}

      <CustomPopover
        open={menuActions.open}
        anchorEl={menuActions.anchorEl}
        onClose={menuActions.onClose}
        slotProps={{ arrow: { placement: 'right-top' } }}
      >
        <MenuList>
          <MenuItem
            component={RouterLink}
            href={detailsHref}
            onClick={menuActions.onClose}
          >
            <Iconify icon="solar:eye-bold" />
            <ListItemText primary="Ver detalhes" />
          </MenuItem>

          <MenuItem
            component={RouterLink}
            href={`${detailsHref}/edit`}
            onClick={menuActions.onClose}
          >
            <Iconify icon="solar:pen-bold" />
            <ListItemText primary="Editar" />
          </MenuItem>

          <Divider sx={{ borderStyle: 'dashed' }} />

          <MenuItem
            onClick={() => {
              confirmDialog.onTrue();
              menuActions.onClose();
            }}
            sx={{ color: 'error.main' }}
          >
            <Iconify icon="solar:trash-bin-trash-bold" />
            <ListItemText primary="Excluir" />
          </MenuItem>
        </MenuList>
      </CustomPopover>

      <ConfirmDialog
        open={confirmDialog.value}
        onClose={confirmDialog.onFalse}
        title="Excluir imóvel"
        content="Tem certeza de que deseja excluir este imóvel?"
        action={
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              onDeleteRow();
              confirmDialog.onFalse();
            }}
          >
            Excluir
          </Button>
        }
      />
    </>
  );
}