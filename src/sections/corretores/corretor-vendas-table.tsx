import type { TableHeadCellProps } from 'src/components/table';
import type { IVendas, IVendasTableFilters } from 'src/types/vendas';

import { sumBy } from 'es-toolkit';
import { useState, useCallback } from 'react';
import { varAlpha } from 'minimal-shared/utils';
import { useBoolean, useSetState } from 'minimal-shared/hooks';

import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Card from '@mui/material/Card';
import Tabs from '@mui/material/Tabs';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import TableBody from '@mui/material/TableBody';
import { useTheme } from '@mui/material/styles';

import { fIsAfter, fIsBetween } from 'src/utils/format-time';

import { _vendas, VENDAS_SERVICE_OPTIONS } from 'src/_mock';

import { Label } from 'src/components/label';
import { toast } from 'src/components/snackbar';
import { Scrollbar } from 'src/components/scrollbar';
import { ConfirmDialog } from 'src/components/custom-dialog';
import {
  useTable,
  emptyRows,
  rowInPage,
  TableNoData,
  getComparator,
  TableEmptyRows,
  TableHeadCustom,
  TablePaginationCustom,
} from 'src/components/table';

import { VendasAnalytic } from '../vendas/vendas-analytic';
import { VendasTableRow } from '../vendas/vendas-table-row';
import { VendasTableToolbar } from '../vendas/vendas-table-toolbar';
import { VendasTableFiltersResult } from '../vendas/vendas-table-filters-result';

// ----------------------------------------------------------------------

const TABLE_HEAD: TableHeadCellProps[] = [
  { id: 'invoiceNumber', label: 'Cliente' },
  { id: 'createDate', label: 'Criado' },
  { id: 'dueDate', label: 'Ultima atualização' },
  { id: 'price', label: 'Valor' },
  { id: 'sent', label: 'Produto', align: 'center' },
  { id: 'status', label: 'Status' },
  { id: 'actions' },
];

// ----------------------------------------------------------------------

type Props = {
  corretorId: string;
};

export function CorretorVendasTable({ corretorId }: Props) {
  const theme = useTheme();

  const table = useTable({ defaultOrderBy: 'createDate' });

  const confirmDialog = useBoolean();

  const [tableData, setTableData] = useState<IVendas[]>(
    _vendas.filter((venda) => venda.corretorId === corretorId)
  );

  const filters = useSetState<IVendasTableFilters>({
    name: '',
    service: [],
    status: 'all',
    startDate: null,
    endDate: null,
  });
  const { state: currentFilters, setState: updateFilters } = filters;

  const dateError = fIsAfter(currentFilters.startDate, currentFilters.endDate);

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(table.order, table.orderBy),
    filters: currentFilters,
    dateError,
  });

  const dataInPage = rowInPage(dataFiltered, table.page, table.rowsPerPage);

  const canReset =
    !!currentFilters.name ||
    currentFilters.service.length > 0 ||
    currentFilters.status !== 'all' ||
    (!!currentFilters.startDate && !!currentFilters.endDate);

  const notFound = (!dataFiltered.length && canReset) || !dataFiltered.length;

  const getVendasLength = (status: string) =>
    tableData.filter((item) => item.status === status).length;

  const getTotalAmount = (status: string) =>
    sumBy(
      tableData.filter((item) => item.status === status),
      (venda) => venda.totalAmount
    );

  const getPercentByStatus = (status: string) => (getVendasLength(status) / tableData.length) * 100;

  const TABS = [
    {
      value: 'all',
      label: 'Todos',
      color: 'default' as const,
      count: tableData.length,
    },
    {
      value: 'atendimento',
      label: 'Atendimento',
      color: 'warning' as const,
      count: getVendasLength('atendimento'),
    },
    {
      value: 'visita',
      label: 'Visita',
      color: 'info' as const,
      count: getVendasLength('visita'),
    },
    {
      value: 'interesse',
      label: 'Interesse',
      color: 'primary' as const,
      count: getVendasLength('interesse'),
    },
    {
      value: 'proposta',
      label: 'Proposta',
      color: 'secondary' as const,
      count: getVendasLength('proposta'),
    },
    {
      value: 'assinatura_pagamento',
      label: 'Pagamento',
      color: 'success' as const,
      count: getVendasLength('assinatura_pagamento'),
    },
    {
      value: 'cancelado',
      label: 'Cancelado',
      color: 'error' as const,
      count: getVendasLength('cancelado'),
    },
  ];

  const handleDeleteRow = useCallback(
    (id: string) => {
      const deleteRow = tableData.filter((row) => row.id !== id);

      toast.success('Delete success!');

      setTableData(deleteRow);

      table.onUpdatePageDeleteRow(dataInPage.length);
    },
    [dataInPage.length, table, tableData]
  );

  const handleDeleteRows = useCallback(() => {
    const deleteRows = tableData.filter((row) => !table.selected.includes(row.id));

    toast.success('Delete success!');

    setTableData(deleteRows);

    table.onUpdatePageDeleteRows(dataInPage.length, dataFiltered.length);
  }, [dataFiltered.length, dataInPage.length, table, tableData]);

  const handleFilterStatus = useCallback(
    (event: React.SyntheticEvent, newValue: string) => {
      table.onResetPage();
      updateFilters({ status: newValue });
    },
    [table, updateFilters]
  );

  return (
    <>
      <Card sx={{ mb: { xs: 3, md: 5 } }}>
        <Scrollbar sx={{ minHeight: 108 }}>
          <Stack
            divider={<Divider orientation="vertical" flexItem sx={{ borderStyle: 'dashed' }} />}
            sx={{ py: 2, flexDirection: 'row' }}
          >
            <VendasAnalytic
              title="Todos"
              total={tableData.length}
              percent={100}
              price={sumBy(tableData, (venda) => venda.totalAmount)}
              icon="solar:bill-list-bold-duotone"
              color={theme.vars.palette.info.main}
            />

            <VendasAnalytic
              title="Atendimento"
              total={getVendasLength('atendimento')}
              percent={getPercentByStatus('atendimento')}
              price={getTotalAmount('atendimento')}
              icon="solar:user-speak-bold-duotone"
              color={theme.vars.palette.warning.main}
            />

            <VendasAnalytic
              title="Visita"
              total={getVendasLength('visita')}
              percent={getPercentByStatus('visita')}
              price={getTotalAmount('visita')}
              icon="solar:home-bold-duotone"
              color={theme.vars.palette.info.main}
            />

            <VendasAnalytic
              title="Interesse"
              total={getVendasLength('interesse')}
              percent={getPercentByStatus('interesse')}
              price={getTotalAmount('interesse')}
              icon="solar:heart-bold-duotone"
              color={theme.vars.palette.primary.main}
            />

            <VendasAnalytic
              title="Proposta"
              total={getVendasLength('proposta')}
              percent={getPercentByStatus('proposta')}
              price={getTotalAmount('proposta')}
              icon="solar:document-text-bold-duotone"
              color={theme.vars.palette.secondary.main}
            />

            <VendasAnalytic
              title="Pagamento"
              total={getVendasLength('assinatura_pagamento')}
              percent={getPercentByStatus('assinatura_pagamento')}
              price={getTotalAmount('assinatura_pagamento')}
              icon="solar:file-check-bold-duotone"
              color={theme.vars.palette.success.main}
            />

            <VendasAnalytic
              title="Cancelado"
              total={getVendasLength('cancelado')}
              percent={getPercentByStatus('cancelado')}
              price={getTotalAmount('cancelado')}
              icon="solar:close-circle-bold-duotone"
              color={theme.vars.palette.error.main}
            />
          </Stack>
        </Scrollbar>
      </Card>

      <Card>
        <Tabs
          value={currentFilters.status}
          onChange={handleFilterStatus}
          sx={{
            px: 2.5,
            boxShadow: `inset 0 -2px 0 0 ${varAlpha(theme.vars.palette.grey['500Channel'], 0.08)}`,
          }}
        >
          {TABS.map((tab) => (
            <Tab
              key={tab.value}
              value={tab.value}
              label={tab.label}
              iconPosition="end"
              icon={
                <Label
                  variant={
                    ((tab.value === 'all' || tab.value === currentFilters.status) && 'filled') ||
                    'soft'
                  }
                  color={tab.color}
                >
                  {tab.count}
                </Label>
              }
            />
          ))}
        </Tabs>

        <VendasTableToolbar
          filters={filters}
          onResetPage={table.onResetPage}
          dateError={dateError}
          options={{
            services: VENDAS_SERVICE_OPTIONS.map((option) => option.name),
          }}
        />

        {canReset && (
          <VendasTableFiltersResult
            filters={filters}
            totalResults={dataFiltered.length}
            onResetPage={table.onResetPage}
            sx={{ p: 2.5, pt: 0 }}
          />
        )}

        <Box sx={{ position: 'relative' }}>
          <Scrollbar sx={{ minHeight: 444 }}>
            <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 800 }}>
              <TableHeadCustom
                order={table.order}
                orderBy={table.orderBy}
                headCells={TABLE_HEAD}
                onSort={table.onSort}
              />

              <TableBody>
                {dataFiltered
                  .slice(
                    table.page * table.rowsPerPage,
                    table.page * table.rowsPerPage + table.rowsPerPage
                  )
                  .map((row) => (
                    <VendasTableRow
                      key={row.id}
                      row={row}
                      onDeleteRow={() => handleDeleteRow(row.id)}
                      editHref={`/dashboard/vendas/${row.id}/edit`}
                      detailsHref={`/dashboard/vendas/${row.id}`}
                    />
                  ))}

                <TableEmptyRows
                  height={table.dense ? 56 : 56 + 20}
                  emptyRows={emptyRows(table.page, table.rowsPerPage, dataFiltered.length)}
                />

                <TableNoData notFound={notFound} title="Nenhuma opção para o filtro selecionado" />
              </TableBody>
            </Table>
          </Scrollbar>
        </Box>

        <TablePaginationCustom
          page={table.page}
          dense={table.dense}
          count={dataFiltered.length}
          rowsPerPage={table.rowsPerPage}
          onPageChange={table.onChangePage}
          onChangeDense={table.onChangeDense}
          onRowsPerPageChange={table.onChangeRowsPerPage}
        />
      </Card>

      {renderConfirmDialog()}
    </>
  );

  function renderConfirmDialog() {
    return (
      <ConfirmDialog
        open={confirmDialog.value}
        onClose={confirmDialog.onFalse}
        title="Delete"
        content={
          <>
            Are you sure want to delete <strong> {table.selected.length} </strong> items?
          </>
        }
        action={
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              handleDeleteRows();
              confirmDialog.onFalse();
            }}
          >
            Delete
          </Button>
        }
      />
    );
  }
}

// ----------------------------------------------------------------------

type ApplyFilterProps = {
  dateError: boolean;
  inputData: IVendas[];
  filters: IVendasTableFilters;
  comparator: (a: any, b: any) => number;
};

function applyFilter({ inputData, comparator, filters, dateError }: ApplyFilterProps) {
  const { name, status, service, startDate, endDate } = filters;

  const stabilizedThis = inputData.map((el, index) => [el, index] as const);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  if (name) {
    inputData = inputData.filter(
      (venda) =>
        venda.invoiceNumber.toLowerCase().indexOf(name.toLowerCase()) !== -1 ||
        venda.invoiceTo.name.toLowerCase().indexOf(name.toLowerCase()) !== -1
    );
  }

  if (status !== 'all') {
    inputData = inputData.filter((venda) => venda.status === status);
  }

  if (service.length) {
    inputData = inputData.filter((venda) =>
      venda.items.some((filterItem) => service.includes(filterItem.service))
    );
  }

  if (!dateError) {
    if (startDate && endDate) {
      inputData = inputData.filter((venda) => fIsBetween(venda.createDate, startDate, endDate));
    }
  }

  return inputData;
}
