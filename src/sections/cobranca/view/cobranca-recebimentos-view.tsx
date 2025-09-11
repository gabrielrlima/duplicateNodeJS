import type { TableHeadCellProps } from 'src/components/table';

import React, { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';

import { paths } from 'src/routes/paths';
import { useRouter, useParams } from 'src/routes/hooks';

import { _cobrancas } from 'src/_mock/_cobranca';
import { DashboardContent } from 'src/layouts/dashboard';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import {
  useTable,
  emptyRows,
  TableNoData,
  getComparator,
  TableEmptyRows,
  TableHeadCustom,
  TablePaginationCustom,
} from 'src/components/table';

import { CobrancaRecebimentosTableRow } from '../cobranca-recebimentos-table-row';

import type { ICobranca, IRecebimento } from '../types';

// ----------------------------------------------------------------------

const TABLE_HEAD: TableHeadCellProps[] = [
  { id: 'parcela', label: 'Parcela' },
  { id: 'valor', label: 'Valor' },
  { id: 'vencimento', label: 'Vencimento' },
  { id: 'status', label: 'Status' },
  { id: 'dataPagamento', label: 'Data Pagamento' },
  { id: 'formaPagamento', label: 'Forma Pagamento' },
];

// ----------------------------------------------------------------------

export function CobrancaRecebimentosView() {
  const router = useRouter();
  const { id } = useParams();

  const table = useTable();

  const [tableData, setTableData] = useState<IRecebimento[]>([]);
  const [cobranca, setCobranca] = useState<ICobranca | null>(null);

  React.useEffect(() => {
    const foundCobranca = _cobrancas.find((item) => item.id === id);
    if (foundCobranca) {
      setCobranca(foundCobranca as ICobranca);
      setTableData(foundCobranca.recebimentos || []);
    }
  }, [id]);

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(table.order, table.orderBy),
  });

  const dataInPage = dataFiltered.slice(
    table.page * table.rowsPerPage,
    table.page * table.rowsPerPage + table.rowsPerPage
  );

  const canReset = false;

  const notFound = (!dataFiltered.length && canReset) || !dataFiltered.length;

  const handleViewRow = useCallback((recebimentoId: string) => {
    // Implementar visualização detalhada do recebimento se necessário
    console.log('Ver recebimento:', recebimentoId);
  }, []);

  if (!cobranca) {
    return (
      <DashboardContent>
        <Typography variant="h6">Cobrança não encontrada</Typography>
      </DashboardContent>
    );
  }

  return (
    <DashboardContent>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: { xs: 3, md: 5 } }}>
        <IconButton
          onClick={() => router.push(paths.dashboard.cobranca.root)}
          sx={{
            bgcolor: 'action.hover',
            '&:hover': { bgcolor: 'action.selected' },
          }}
        >
          <Iconify icon="eva:arrow-back-fill" />
        </IconButton>

        <Typography variant="h6">Recebimentos da Cobrança</Typography>
      </Box>

      <Card sx={{ mb: 3, p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Detalhes da Cobrança
        </Typography>
        <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: 'repeat(2, 1fr)' }}>
          <Box>
            <Typography variant="body2" color="text.secondary">
              Cliente
            </Typography>
            <Typography variant="body1">{cobranca.cliente}</Typography>
          </Box>
          <Box>
            <Typography variant="body2" color="text.secondary">
              Produto
            </Typography>
            <Typography variant="body1">{cobranca.produto}</Typography>
          </Box>
          <Box>
            <Typography variant="body2" color="text.secondary">
              Valor Total
            </Typography>
            <Typography variant="body1">
              R$ {cobranca.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </Typography>
          </Box>
          <Box>
            <Typography variant="body2" color="text.secondary">
              Status
            </Typography>
            <Label
              variant="soft"
              color={
                (cobranca.status === 'Pago' && 'success') ||
                (cobranca.status === 'Pendente' && 'warning') ||
                (cobranca.status === 'Vencido' && 'error') ||
                'default'
              }
            >
              {cobranca.status}
            </Label>
          </Box>
        </Box>
      </Card>

      <Card>
        <Scrollbar>
          <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 960 }}>
            <TableHeadCustom
              order={table.order}
              orderBy={table.orderBy}
              headCells={TABLE_HEAD}
              onSort={table.onSort}
            />

            <TableBody>
              {dataInPage.map((row) => (
                <CobrancaRecebimentosTableRow
                  key={row.id}
                  row={row}
                  onViewRow={() => handleViewRow(row.id)}
                />
              ))}

              <TableEmptyRows
                height={table.dense ? 52 : 72}
                emptyRows={emptyRows(table.page, table.rowsPerPage, dataFiltered.length)}
              />

              <TableNoData notFound={notFound} />
            </TableBody>
          </Table>
        </Scrollbar>

        <TablePaginationCustom
          count={dataFiltered.length}
          page={table.page}
          rowsPerPage={table.rowsPerPage}
          onPageChange={table.onChangePage}
          onRowsPerPageChange={table.onChangeRowsPerPage}
          dense={table.dense}
          onChangeDense={table.onChangeDense}
        />
      </Card>
    </DashboardContent>
  );
}

// ----------------------------------------------------------------------

type ApplyFilterProps = {
  inputData: IRecebimento[];
  comparator: (a: any, b: any) => number;
};

function applyFilter({ inputData, comparator }: ApplyFilterProps) {
  const stabilizedThis = inputData.map((el, index) => [el, index] as const);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  return stabilizedThis.map((el) => el[0]);
}
