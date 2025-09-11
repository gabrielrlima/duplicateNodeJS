import type { TableHeadCellProps } from 'src/components/table';
import type { IVendas, IVendasTableFilters } from 'src/types/vendas';

import { useState, useCallback } from 'react';
import { varAlpha } from 'minimal-shared/utils';
import { useBoolean, useSetState } from 'minimal-shared/hooks';

import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Card from '@mui/material/Card';
import Tabs from '@mui/material/Tabs';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import TableBody from '@mui/material/TableBody';

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
  grupoId: string;
};

export function GrupoVendasTable({ grupoId }: Props) {
  const table = useTable({ defaultOrderBy: 'createDate' });

  const confirmDialog = useBoolean();

  // Filtrar vendas do grupo (simulando vendas dos membros do grupo)
  const [tableData, setTableData] = useState<IVendas[]>(
    _vendas.filter((venda) => {
      // Simular que algumas vendas pertencem ao grupo
      // Em um cenário real, você teria uma relação entre vendas e grupos
      const vendasDoGrupo = ['1', '2', '3', '4', '5', '6', '7', '8'];
      return vendasDoGrupo.includes(venda.id);
    })
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

  const TABS = [
    {
      value: 'all',
      label: 'Todos',
      color: 'default',
      count: tableData.length,
    },
    {
      value: 'atendimento',
      label: 'Atendimento',
      color: 'warning',
      count: getVendasLength('atendimento'),
    },
    {
      value: 'visita',
      label: 'Visita',
      color: 'info',
      count: getVendasLength('visita'),
    },
    {
      value: 'interesse',
      label: 'Interesse',
      color: 'primary',
      count: getVendasLength('interesse'),
    },
    {
      value: 'proposta',
      label: 'Proposta',
      color: 'secondary',
      count: getVendasLength('proposta'),
    },
    {
      value: 'assinatura_pagamento',
      label: 'Pagamento',
      color: 'success',
      count: getVendasLength('assinatura_pagamento'),
    },
    {
      value: 'cancelado',
      label: 'Cancelado',
      color: 'error',
      count: getVendasLength('cancelado'),
    },
  ] as const;

  const handleDeleteRow = useCallback(
    (id: string) => {
      const deleteRow = tableData.filter((row) => row.id !== id);

      toast.success('Desistencia confirmada com sucesso');

      setTableData(deleteRow);

      table.onUpdatePageDeleteRow(dataInPage.length);
    },
    [dataInPage.length, table, tableData]
  );

  const handleDeleteRows = useCallback(() => {
    const deleteRows = tableData.filter((row) => !table.selected.includes(row.id));

    toast.success('Apagado com sucesso!');

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
      <Card>
        <Tabs
          value={currentFilters.status}
          onChange={handleFilterStatus}
          sx={{
            px: 2.5,
            boxShadow: (muiTheme) =>
              `inset 0 -2px 0 0 ${varAlpha(muiTheme.vars.palette.grey['500Channel'], 0.08)}`,
          }}
        >
          {TABS.map((tab) => (
            <Tab
              key={tab.value}
              iconPosition="end"
              value={tab.value}
              label={tab.label}
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
                {dataInPage.map((row) => (
                  <VendasTableRow
                    key={row.id}
                    row={row}
                    editHref={`/dashboard/grupos/${grupoId}/vendas/${row.id}/edit`}
                    detailsHref={`/dashboard/grupos/${grupoId}/vendas/${row.id}`}
                    onDeleteRow={() => handleDeleteRow(row.id)}
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

      <ConfirmDialog
        open={confirmDialog.value}
        onClose={confirmDialog.onFalse}
        title="Excluir"
        content={
          <>
            Tem certeza que deseja excluir <strong> {table.selected.length} </strong> itens?
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
            Excluir
          </Button>
        }
      />
    </>
  );
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
        venda.invoiceTo.name.toLowerCase().indexOf(name.toLowerCase()) !== -1 ||
        venda.invoiceNumber.toLowerCase().indexOf(name.toLowerCase()) !== -1
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
