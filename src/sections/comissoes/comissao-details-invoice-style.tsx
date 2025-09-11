import type { IComissaoItem } from 'src/types/comissao';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import TableRow from '@mui/material/TableRow';
import TableHead from '@mui/material/TableHead';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';

import { fDate } from 'src/utils/format-time';

import { Label } from 'src/components/label';
import { Scrollbar } from 'src/components/scrollbar';

import { isComissaoTotal, isDistribuicaoInterna } from 'src/types/comissao';

import { ComissaoToolbarInvoiceStyle } from './comissao-toolbar-invoice-style';

// ----------------------------------------------------------------------

type Props = {
  comissao?: IComissaoItem;
};

export function ComissaoDetailsInvoiceStyle({ comissao }: Props) {
  const theme = useTheme();

  const renderHeader = (
    <Stack
      spacing={3}
      direction={{ xs: 'column', md: 'row' }}
      sx={{
        p: 5,
      }}
    >
      <Stack sx={{ width: 1 }}>
        <Typography variant="h6" sx={{ mt: 1, mb: 1 }}>
          {comissao?.nome}
        </Typography>

        <Stack direction="row" divider={<Box sx={{ width: 2, height: 16, bgcolor: 'divider' }} />}>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Tipo: {isComissaoTotal(comissao) ? 'Comissão Total' : 'Distribuição Interna'}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Produto: {isComissaoTotal(comissao) ? comissao.tipoProduto : 'N/A'}
          </Typography>
        </Stack>
      </Stack>

      <Stack sx={{ width: 1 }}>
        <Stack direction="row" sx={{ typography: 'body2' }}>
          <Box component="span" sx={{ color: 'text.disabled', flexGrow: 1 }}>
            Status
          </Box>
          <Label
            variant="soft"
            color={
              (comissao?.status === 'ativo' && 'success') ||
              (comissao?.status === 'inativo' && 'error') ||
              'default'
            }
          >
            {comissao?.status}
          </Label>
        </Stack>

        <Stack direction="row" sx={{ typography: 'body2', mt: 1 }}>
          <Box component="span" sx={{ color: 'text.disabled', flexGrow: 1 }}>
            Data de Criação
          </Box>
          {comissao?.createdAt && fDate(comissao.createdAt)}
        </Stack>

        <Stack direction="row" sx={{ typography: 'body2', mt: 1 }}>
          <Box component="span" sx={{ color: 'text.disabled', flexGrow: 1 }}>
            Última Atualização
          </Box>
          {comissao?.updatedAt && fDate(comissao.updatedAt)}
        </Stack>
      </Stack>
    </Stack>
  );

  const renderTotal = (
    <Stack
      spacing={2}
      alignItems="flex-end"
      sx={{ mt: 3, textAlign: 'right', typography: 'body2' }}
    >
      {isComissaoTotal(comissao) && (
        <Stack direction="row" sx={{ typography: 'subtitle1' }}>
          <Box>Percentual Total:</Box>
          <Box sx={{ width: 160 }}>{comissao.percentualTotal}%</Box>
        </Stack>
      )}

      {isDistribuicaoInterna(comissao) && (
        <Stack direction="row" sx={{ typography: 'subtitle1' }}>
          <Box>Total de Participantes:</Box>
          <Box sx={{ width: 160 }}>{comissao.participantes?.length || 0}</Box>
        </Stack>
      )}
    </Stack>
  );

  const renderList = (
    <TableContainer sx={{ overflow: 'unset', mt: 5 }}>
      <Scrollbar>
        <Table sx={{ minWidth: 960 }}>
          <TableHead>
            <TableRow>
              <TableCell width={40}>#</TableCell>
              <TableCell sx={{ typography: 'subtitle2' }}>Tipo de Participante</TableCell>
              <TableCell>Descrição</TableCell>
              <TableCell align="right">Percentual (%)</TableCell>
              <TableCell align="right">Status</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {isDistribuicaoInterna(comissao) &&
              comissao.participantes?.map((participante, index) => (
                <TableRow key={index}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>
                    <Box sx={{ maxWidth: 560 }}>
                      <Typography variant="subtitle2">{participante.tipo}</Typography>
                      <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
                        {participante.fixo ? 'Fixo' : 'Variável'} -{' '}
                        {participante.obrigatorio ? 'Obrigatório' : 'Opcional'}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>Participante da distribuição interna</TableCell>
                  <TableCell align="right">{participante.percentual}%</TableCell>
                  <TableCell align="right">
                    <Label variant="soft" color={participante.ativo ? 'success' : 'error'}>
                      {participante.ativo ? 'Ativo' : 'Inativo'}
                    </Label>
                  </TableCell>
                </TableRow>
              ))}

            {isComissaoTotal(comissao) && (
              <TableRow>
                <TableCell>1</TableCell>
                <TableCell>
                  <Box sx={{ maxWidth: 560 }}>
                    <Typography variant="subtitle2">Comissão Total</Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
                      Percentual total da imobiliária
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>Comissão total sobre {comissao.tipoProduto}</TableCell>
                <TableCell align="right">{comissao.percentualTotal}%</TableCell>
                <TableCell align="right">
                  <Label
                    variant="soft"
                    color={
                      (comissao.status === 'ativo' && 'success') ||
                      (comissao.status === 'inativo' && 'error') ||
                      'default'
                    }
                  >
                    {comissao.status}
                  </Label>
                </TableCell>
              </TableRow>
            )}

            {(!isDistribuicaoInterna(comissao) || !comissao.participantes?.length) &&
              isDistribuicaoInterna(comissao) && (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 3 }}>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      Nenhum participante cadastrado
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
          </TableBody>
        </Table>
      </Scrollbar>
    </TableContainer>
  );

  const renderFooter = (
    <Stack
      spacing={2}
      direction={{ xs: 'column', md: 'row' }}
      sx={{ mt: 5, pt: 3, borderTop: `dashed 2px ${theme.vars.palette.background.neutral}` }}
    >
      <Stack sx={{ width: 1 }}>
        <Typography variant="subtitle2" sx={{ mb: 1 }}>
          OBSERVAÇÕES
        </Typography>
        <Typography variant="body2">
          {comissao?.descricao ||
            'Esta regra de comissão será aplicada automaticamente conforme os critérios definidos.'}
        </Typography>
      </Stack>

      <Stack sx={{ width: 1 }}>
        <Typography variant="subtitle2" sx={{ mb: 1 }}>
          INFORMAÇÕES ADICIONAIS
        </Typography>
        <Typography variant="body2">
          • Tipo:{' '}
          {isComissaoTotal(comissao) ? 'Comissão Total da Imobiliária' : 'Distribuição Interna'}
        </Typography>
        {isComissaoTotal(comissao) && (
          <Typography variant="body2">• Produto: {comissao.tipoProduto}</Typography>
        )}
        <Typography variant="body2">• Status atual: {comissao?.status || 'ativo'}</Typography>
      </Stack>
    </Stack>
  );

  return (
    <>
      <ComissaoToolbarInvoiceStyle comissao={comissao} />

      <Card sx={{ pt: 5, px: 5 }}>
        {renderHeader}

        <Divider sx={{ borderStyle: 'dashed' }} />

        {renderList}

        {renderTotal}

        {renderFooter}
      </Card>
    </>
  );
}
