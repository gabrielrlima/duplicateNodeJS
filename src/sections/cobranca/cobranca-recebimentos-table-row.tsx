import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';

import { Label } from 'src/components/label';

import type { IRecebimento } from './types';

// ----------------------------------------------------------------------

type Props = {
  row: IRecebimento;
  onViewRow: () => void;
};

export function CobrancaRecebimentosTableRow({ row, onViewRow }: Props) {
  const { parcela, valor, vencimento, status, dataPagamento, formaPagamento } = row;

  const renderStatus = (
    <Label
      variant="soft"
      color={
        (status === 'Pago' && 'success') ||
        (status === 'Pendente' && 'warning') ||
        (status === 'Vencido' && 'error') ||
        'default'
      }
    >
      {status}
    </Label>
  );

  return (
    <TableRow hover>
      <TableCell sx={{ whiteSpace: 'nowrap' }}>{parcela}ª parcela</TableCell>

      <TableCell>R$ {valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</TableCell>

      <TableCell>{new Date(vencimento).toLocaleDateString('pt-BR')}</TableCell>

      <TableCell>{renderStatus}</TableCell>

      <TableCell>
        {dataPagamento ? new Date(dataPagamento).toLocaleDateString('pt-BR') : '-'}
      </TableCell>

      <TableCell sx={{ whiteSpace: 'nowrap' }}>{formaPagamento || '-'}</TableCell>
    </TableRow>
  );
}
