import type { TableHeadCellProps } from 'src/components/table';
import type { IClientItem, IClientTableFilters } from 'src/types/client';

import { useState, useCallback } from 'react';
import { varAlpha } from 'minimal-shared/utils';
import { useBoolean, useSetState } from 'minimal-shared/hooks';

import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import TableBody from '@mui/material/TableBody';
import IconButton from '@mui/material/IconButton';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { _clientList } from 'src/_mock/_client';
import { DashboardContent } from 'src/layouts/dashboard';

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
  TableSelectedAction,
  TablePaginationCustom,
} from 'src/components/table';

import { ClientTableRow } from '../client-table-row';
import { ClientTableToolbar } from '../client-table-toolbar';
import { ClientTableFiltersResult } from '../client-table-filters-result';

// ----------------------------------------------------------------------

const STATUS_OPTIONS = [
  { value: 'todos', label: 'Todos' },
  { value: 'vendido', label: 'Vendas' },
  { value: 'em andamento', label: 'Em andamento' },
  { value: 'vencendo', label: 'Vencendo' },
  { value: 'prospecto', label: 'Prospecto' },
  { value: 'desatualizado', label: 'Desatualizados' },
];

const TABLE_HEAD: TableHeadCellProps[] = [
  { id: 'name', label: 'Cliente', width: 300 },
  { id: 'phoneNumber', label: 'Criado em' },
  { id: 'company', label: 'Última atualização' },
  { id: 'profession', label: 'Valor' },
  { id: 'product', label: 'Produto' },
  { id: 'status', label: 'Status' },
  { id: 'actions' },
];

// ----------------------------------------------------------------------

export function ClientListView() {
  const table = useTable();

  const confirmDialog = useBoolean();

  const [tableData, setTableData] = useState<IClientItem[]>(_clientList);

  const filters = useSetState<IClientTableFilters>({
    name: '',
    status: 'todos',
    profession: [],
    filterBy: 'name', // Default to 'name'
    startDate: '',
    endDate: '',
    search: '',
  });
  const { state: currentFilters, setState: updateFilters } = filters;

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(table.order, table.orderBy),
    filters: currentFilters,
  });

  const dataInPage = rowInPage(dataFiltered, table.page, table.rowsPerPage);

  const canReset =
    !!currentFilters.name ||
    currentFilters.profession.length > 0 ||
    currentFilters.status !== 'todos' ||
    !!currentFilters.search;

  const notFound = (!dataFiltered.length && canReset) || !dataFiltered.length;

  const handleDeleteRow = useCallback(
    (id: string) => {
      const deleteRow = tableData.filter((row) => row.id !== id);

      toast.success('Apagado com sucesso!');

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
    [updateFilters, table]
  );

  const renderConfirmDialog = () => (
    <ConfirmDialog
      open={confirmDialog.value}
      onClose={confirmDialog.onFalse}
      title="Apagar"
      content={
        <>
          Você tem certeza que deseja apagar os <strong> {table.selected.length} </strong> clientes?
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
          Apagar
        </Button>
      }
    />
  );

  return (
    <>
      <DashboardContent>
        <CustomBreadcrumbs
          heading="Meus clientes"
          links={[
            { name: 'Painel', href: paths.dashboard.root },
            { name: 'Clientes', href: paths.dashboard.client.root },
            { name: 'Meus Clientes' },
          ]}
          action={
            <Button
              component={RouterLink}
              href={paths.dashboard.client.new}
              variant="contained"
              startIcon={<Iconify icon="mingcute:add-line" />}
            >
              Novo cliente
            </Button>
          }
          sx={{ mb: { xs: 3, md: 5 } }}
        />

        <Card>
          <Tabs
            value={currentFilters.status}
            onChange={handleFilterStatus}
            sx={[
              (theme) => ({
                px: 2.5,
                boxShadow: `inset 0 -2px 0 0 ${varAlpha(theme.vars.palette.grey['500Channel'], 0.08)}`,
              }),
            ]}
          >
            {STATUS_OPTIONS.map((tab) => (
              <Tab
                key={tab.value}
                iconPosition="end"
                value={tab.value}
                label={tab.label}
                icon={
                  <Label
                    variant={
                      ((tab.value === 'todos' || tab.value === currentFilters.status) &&
                        'filled') ||
                      'soft'
                    }
                    color={
                      (tab.value === 'vendido' && 'success') ||
                      (tab.value === 'em andamento' && 'warning') ||
                      (tab.value === 'vencendo' && 'error') ||
                      (tab.value === 'prospectos' && 'info') ||
                      'default'
                    }
                  >
                    {['active', 'em andamento', 'vencendo', 'desatualizado'].includes(tab.value)
                      ? tableData.filter((client) => client.status === tab.value).length
                      : tableData.length}
                  </Label>
                }
              />
            ))}
          </Tabs>

          <ClientTableToolbar
            filters={filters}
            onResetPage={table.onResetPage}
            options={{
              filterOptions: ['name', 'phoneNumber', 'email', 'company', 'product'],
            }}
          />

          {canReset && (
            <ClientTableFiltersResult
              filters={filters}
              totalResults={dataFiltered.length}
              onResetPage={table.onResetPage}
              sx={{ p: 2.5, pt: 0 }}
            />
          )}

          <Box sx={{ position: 'relative' }}>
            <TableSelectedAction
              dense={table.dense}
              numSelected={table.selected.length}
              rowCount={dataFiltered.length}
              onSelectAllRows={(checked) =>
                table.onSelectAllRows(
                  checked,
                  dataFiltered.map((row) => row.id)
                )
              }
              action={
                <Tooltip title="Apagar">
                  <IconButton color="primary" onClick={confirmDialog.onTrue}>
                    <Iconify icon="solar:trash-bin-trash-bold" />
                  </IconButton>
                </Tooltip>
              }
            />

            <Scrollbar>
              <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 960 }}>
                <TableHeadCustom
                  order={table.order}
                  orderBy={table.orderBy}
                  headCells={TABLE_HEAD}
                  rowCount={dataFiltered.length}
                  numSelected={table.selected.length}
                  onSort={table.onSort}
                  onSelectAllRows={(checked) =>
                    table.onSelectAllRows(
                      checked,
                      dataFiltered.map((row) => row.id)
                    )
                  }
                />

                <TableBody>
                  {dataFiltered
                    .slice(
                      table.page * table.rowsPerPage,
                      table.page * table.rowsPerPage + table.rowsPerPage
                    )
                    .map((row) => (
                      <ClientTableRow
                        key={row.id}
                        row={row}
                        selected={table.selected.includes(row.id)}
                        onSelectRow={() => table.onSelectRow(row.id)}
                        onDeleteRow={() => handleDeleteRow(row.id)}
                        editHref={paths.dashboard.client.edit(row.id)}
                      />
                    ))}

                  <TableEmptyRows
                    height={table.dense ? 56 : 56 + 20}
                    emptyRows={emptyRows(table.page, table.rowsPerPage, dataFiltered.length)}
                  />

                  <TableNoData notFound={notFound} />
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
      </DashboardContent>

      {renderConfirmDialog()}
    </>
  );
}

// ----------------------------------------------------------------------

type ApplyFilterProps = {
  inputData: IClientItem[];
  filters: IClientTableFilters;
  comparator: (a: any, b: any) => number;
};

function applyFilter({ inputData, comparator, filters }: ApplyFilterProps) {
  const { name, status, profession, filterBy, search, startDate, endDate } = filters;

  let filteredData = [...inputData];

  // Sorting
  const stabilizedThis = filteredData.map((el, index) => [el, index] as const);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  filteredData = stabilizedThis.map((el) => el[0]);

  // Apply search filter based on selected attribute (filterBy)
  if (search && filterBy) {
    filteredData = filteredData.filter((client) => {
      const value = client[filterBy as keyof IClientItem]?.toString().toLowerCase() || '';
      return value.includes(search.toLowerCase());
    });
  }

  // Apply name filter (if still needed separately)
  if (name) {
    filteredData = filteredData.filter((client) =>
      client.name.toLowerCase().includes(name.toLowerCase())
    );
  }

  // Apply status filter
  if (status !== 'todos') {
    filteredData = filteredData.filter((client) => client.status === status);
  }

  // Apply profession filter
  if (profession.length) {
    filteredData = filteredData.filter((client) => profession.includes(client.profession));
  }

  // Apply date range filter (assuming createdAt is used)
  if (startDate) {
    filteredData = filteredData.filter(
      (client) => new Date(client.createdAt) >= new Date(startDate)
    );
  }
  if (endDate) {
    filteredData = filteredData.filter((client) => new Date(client.createdAt) <= new Date(endDate));
  }

  return filteredData;
}
