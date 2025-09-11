import type { TableHeadCellProps } from 'src/components/table';
import type { IVendas, IVendasTableFilters } from 'src/types/vendas';

import { sumBy } from 'es-toolkit';
import { useState, useCallback } from 'react';
import { varAlpha } from 'minimal-shared/utils';
import { useBoolean, useSetState } from 'minimal-shared/hooks';

import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import TableBody from '@mui/material/TableBody';
// import { useTheme } from '@mui/material/styles';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { fIsAfter, fIsBetween } from 'src/utils/format-time';

import { DashboardContent } from 'src/layouts/dashboard';
import { _vendas, VENDAS_SERVICE_OPTIONS } from 'src/_mock';

import { Label } from 'src/components/label';
import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
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

import { VendasAnalytic } from './vendas-analytic';
import { VendasTableRow } from './vendas-table-row';
import { VendasTableToolbar } from './vendas-table-toolbar';
import { VendasTableFiltersResult } from './vendas-table-filters-result';

// ----------------------------------------------------------------------

const TABLE_HEAD: TableHeadCellProps[] = [
  { id: 'invoiceNumber', label: 'Customer' },
  { id: 'createDate', label: 'Create' },
  { id: 'dueDate', label: 'Due' },
  { id: 'price', label: 'Amount' },
  { id: 'sent', label: 'Sent', align: 'center' },
  { id: 'status', label: 'Status' },
  { id: 'actions' },
];

// ----------------------------------------------------------------------

export function VendasListView() {
  // const theme = useTheme();

  const table = useTable({ defaultOrderBy: 'createDate' });

  const confirmDialog = useBoolean();

  const [tableData, setTableData] = useState<IVendas[]>(_vendas);

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

  // const getTotalAmount = (status: string) =>
  //   sumBy(
  //     tableData.filter((item) => item.status === status),
  //     (venda) => venda.totalAmount
  //   );

  // const getPercentByStatus = (status: string) =>
  //   (getVendasLength(status) / tableData.length) * 100;

  const TABS = [
    {
      value: 'all',
      label: 'All',
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
      value: 'draft',
      label: 'Draft',
      color: 'default' as const,
      count: getVendasLength('draft'),
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

  // const handleEditRow = useCallback((id: string) => {
  //   console.log('Edit row', id);
  // }, []);

  // const handleViewRow = useCallback((id: string) => {
  //   console.log('View row', id);
  // }, []);

  const handleFilterStatus = useCallback(
    (event: React.SyntheticEvent, newValue: string) => {
      table.onResetPage();
      updateFilters({ status: newValue });
    },
    [table, updateFilters]
  );

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="List"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Vendas', href: paths.dashboard.vendas.root },
          { name: 'List' },
        ]}
        action={
          <Button
            component={RouterLink}
            href={paths.dashboard.vendas.new}
            variant="contained"
            startIcon={<Iconify icon="mingcute:add-line" />}
          >
            New venda
          </Button>
        }
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <Card>
        <Tabs
          value={currentFilters.status}
          onChange={handleFilterStatus}
          sx={{
            px: 2.5,
            boxShadow: (themeParam) =>
              `inset 0 -2px 0 0 ${varAlpha(themeParam.vars.palette.grey['500Channel'], 0.08)}`,
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

        <VendasAnalytic
          title="Total"
          total={tableData.length}
          percent={100}
          price={sumBy(tableData, (venda) => venda.totalAmount)}
          icon="solar:bill-list-bold-duotone"
          color="info"
        />

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
          <Scrollbar>
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
                    onDeleteRow={() => handleDeleteRow(row.id)}
                    editHref={
                      paths.dashboard.vendas?.edit?.(row.id) || `/dashboard/vendas/${row.id}/edit`
                    }
                    detailsHref={
                      paths.dashboard.vendas?.details?.(row.id) || `/dashboard/vendas/${row.id}`
                    }
                  />
                ))}

                <TableEmptyRows
                  height={table.dense ? 56 : 76}
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
    </DashboardContent>
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
