import type { IComissaoItem } from 'src/types/comissao';

import { useState, useCallback } from 'react';
import { useBoolean } from 'minimal-shared/hooks';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { Iconify } from 'src/components/iconify';

import { isComissaoTotal, isDistribuicaoInterna } from 'src/types/comissao';

// ----------------------------------------------------------------------

type Props = {
  comissao?: IComissaoItem;
};

export function ComissaoToolbarInvoiceStyle({ comissao }: Props) {
  const router = useRouter();

  const view = useBoolean();

  const [status, setStatus] = useState(comissao?.status || 'ativo');

  const handleChangeStatus = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setStatus(event.target.value as 'ativo' | 'inativo' | 'pendente');
  }, []);

  const handleEdit = useCallback(() => {
    router.push(paths.dashboard.comissoes.edit(`${comissao?.id}`));
  }, [comissao?.id, router]);

  const handleDuplicate = useCallback(() => {
    console.info('DUPLICATE', comissao?.id);
  }, [comissao?.id]);

  const handleDelete = useCallback(() => {
    console.info('DELETE', comissao?.id);
  }, [comissao?.id]);

  const handleShare = useCallback(() => {
    console.info('SHARE', comissao?.id);
  }, [comissao?.id]);

  const handlePrint = useCallback(() => {
    console.info('PRINT', comissao?.id);
  }, [comissao?.id]);

  const handleDownload = useCallback(() => {
    console.info('DOWNLOAD', comissao?.id);
  }, [comissao?.id]);

  return (
    <>
      <Stack
        spacing={3}
        direction={{ xs: 'column', md: 'row' }}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      >
        <Stack spacing={1} direction="row" sx={{ flexGrow: 1 }}>
          <Tooltip title="Editar">
            <IconButton onClick={handleEdit}>
              <Iconify icon="solar:pen-bold" />
            </IconButton>
          </Tooltip>

          <Tooltip title="Visualizar">
            <IconButton onClick={view.onTrue}>
              <Iconify icon="solar:eye-bold" />
            </IconButton>
          </Tooltip>

          <Tooltip title="Imprimir">
            <IconButton onClick={handlePrint}>
              <Iconify icon="solar:printer-minimalistic-bold" />
            </IconButton>
          </Tooltip>

          <Tooltip title="Baixar">
            <IconButton onClick={handleDownload}>
              <Iconify icon="eva:cloud-download-fill" />
            </IconButton>
          </Tooltip>

          <Tooltip title="Compartilhar">
            <IconButton onClick={handleShare}>
              <Iconify icon="solar:share-bold" />
            </IconButton>
          </Tooltip>

          <Tooltip title="Duplicar">
            <IconButton onClick={handleDuplicate}>
              <Iconify icon="solar:copy-bold" />
            </IconButton>
          </Tooltip>

          <Tooltip title="Excluir">
            <IconButton onClick={handleDelete} sx={{ color: 'error.main' }}>
              <Iconify icon="solar:trash-bin-trash-bold" />
            </IconButton>
          </Tooltip>
        </Stack>

        <TextField
          select
          fullWidth
          label="Status"
          value={status}
          onChange={handleChangeStatus}
          sx={{
            maxWidth: { md: 160 },
          }}
        >
          <MenuItem value="ativo">Ativo</MenuItem>
          <MenuItem value="inativo">Inativo</MenuItem>
          <MenuItem value="pendente">Pendente</MenuItem>
        </TextField>
      </Stack>

      <Dialog fullScreen open={view.value}>
        <DialogTitle
          sx={{
            p: (theme) => theme.spacing(3, 3, 2, 3),
          }}
        >
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Typography variant="h6">Visualizar Regra de Comissão</Typography>
            <IconButton onClick={view.onFalse}>
              <Iconify icon="mingcute:close-line" />
            </IconButton>
          </Stack>
        </DialogTitle>

        <DialogContent dividers sx={{ pt: 1, pb: 0, border: 'none' }}>
          <Box sx={{ p: 3 }}>
            <Stack spacing={3}>
              <Box>
                <Typography variant="h6" gutterBottom>
                  {comissao?.nome}
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  {comissao?.descricao}
                </Typography>
              </Box>

              <Stack spacing={2}>
                <Stack direction="row" spacing={2}>
                  <Box sx={{ minWidth: 120 }}>
                    <Typography variant="subtitle2">Tipo:</Typography>
                  </Box>
                  <Typography variant="body2">
                    {isComissaoTotal(comissao) ? 'Comissão Total' : 'Distribuição Interna'}
                  </Typography>
                </Stack>

                {isComissaoTotal(comissao) && (
                  <>
                    <Stack direction="row" spacing={2}>
                      <Box sx={{ minWidth: 120 }}>
                        <Typography variant="subtitle2">Produto:</Typography>
                      </Box>
                      <Typography variant="body2">{comissao.tipoProduto}</Typography>
                    </Stack>

                    <Stack direction="row" spacing={2}>
                      <Box sx={{ minWidth: 120 }}>
                        <Typography variant="subtitle2">% Total:</Typography>
                      </Box>
                      <Typography variant="body2">{comissao.percentualTotal}%</Typography>
                    </Stack>
                  </>
                )}

                {isDistribuicaoInterna(comissao) && (
                  <Stack direction="row" spacing={2}>
                    <Box sx={{ minWidth: 120 }}>
                      <Typography variant="subtitle2">Participantes:</Typography>
                    </Box>
                    <Typography variant="body2">{comissao.participantes?.length || 0}</Typography>
                  </Stack>
                )}

                <Stack direction="row" spacing={2}>
                  <Box sx={{ minWidth: 120 }}>
                    <Typography variant="subtitle2">Status:</Typography>
                  </Box>
                  <Typography variant="body2">{comissao?.status}</Typography>
                </Stack>
              </Stack>
            </Stack>
          </Box>
        </DialogContent>

        <DialogActions>
          <Button variant="outlined" color="inherit" onClick={view.onFalse}>
            Fechar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
