import type { TableHeadCellProps } from 'src/components/table';
import type { ILeadItem, ILeadTableFilters } from 'src/types/lead';

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

import { _leadList } from 'src/_mock/_lead';
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

import { LeadTableRow } from '../lead-table-row';
import { LeadTableToolbar } from '../lead-table-toolbar';
import { LeadTableFiltersResult } from '../lead-table-filters-result';

// ----------------------------------------------------------------------

const STATUS_OPTIONS = [
  { value: 'todos', label: 'Todos' },
  { value: 'ativo', label: 'Ativos' },
  { value: 'desativados', label: 'Desativado' },
];

const TABLE_HEAD: TableHeadCellProps[] = [
  { id: 'name', label: 'Nome', width: 300 },
  { id: 'email', label: 'E-mail' },
  { id: 'product', label: 'Produto' },
  { id: 'broker', label: 'Corretor' },
  { id: 'status', label: 'Status' },
  { id: '' },
];

// ----------------------------------------------------------------------

export function LeadListView() {
  const table = useTable();

  const confirmDialog = useBoolean();

  const [tableData, setTableData] = useState<ILeadItem[]>(_leadList);

  const filters = useSetState<ILeadTableFilters>({
    name: '',
    status: 'todos',
    product: [],
    filterBy: 'name',
    startDate: '',
    endDate: '',
    search: '',
    broker: '',
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
    currentFilters.product.length > 0 ||
    currentFilters.status !== 'todos' ||
    !!currentFilters.search ||
    !!currentFilters.broker;

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
          Você tem certeza que deseja apagar os <strong> {table.selected.length} </strong> leads?
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
          heading="Meus leads"
          links={[
            { name: 'Painel', href: paths.dashboard.root },
            { name: 'Leads', href: paths.dashboard.lead.list },
            { name: 'Meus Leads' },
          ]}
          action={
            <Button
              component={RouterLink}
              href={paths.dashboard.lead.new}
              variant="contained"
              startIcon={<Iconify icon="mingcute:add-line" />}
            >
              Novo lead
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
                      (tab.value === 'ativo' && 'success') ||
                      (tab.value === 'desativados' && 'default') ||
                      'default'
                    }
                  >
                    {tab.value === 'todos'
                      ? tableData.length
                      : tableData.filter((lead) => lead.status === tab.value).length}
                  </Label>
                }
              />
            ))}
          </Tabs>

          <LeadTableToolbar
            filters={filters}
            onResetPage={table.onResetPage}
            options={{
              filterOptions: ['name', 'phoneNumber', 'email', 'productInterest', 'broker'],
            }}
          />

          {canReset && (
            <LeadTableFiltersResult
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
                      <LeadTableRow
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
  inputData: ILeadItem[];
  filters: ILeadTableFilters;
  comparator: (a: any, b: any) => number;
};

function applyFilter({ inputData, comparator, filters }: ApplyFilterProps) {
  const { name, status, product, filterBy, search, startDate, endDate, broker } = filters;

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
    filteredData = filteredData.filter((lead) => {
      const value = lead[filterBy as keyof ILeadItem]?.toString().toLowerCase() || '';
      return value.includes(search.toLowerCase());
    });
  }

  // Apply name filter (if still needed separately)
  if (name) {
    filteredData = filteredData.filter((lead) =>
      lead.name.toLowerCase().includes(name.toLowerCase())
    );
  }

  // Apply status filter
  if (status !== 'todos') {
    filteredData = filteredData.filter((lead) => lead.status === status);
  }

  // Apply product filter
  if (product.length) {
    filteredData = filteredData.filter((lead) => product.includes(lead.productInterest));
  }

  // Apply broker filter
  if (broker) {
    filteredData = filteredData.filter((lead) => lead.broker === broker);
  }

  // Apply date range filter (assuming createdAt is used)
  if (startDate) {
    filteredData = filteredData.filter((lead) => new Date(lead.createdAt) >= new Date(startDate));
  }
  if (endDate) {
    filteredData = filteredData.filter((lead) => new Date(lead.createdAt) <= new Date(endDate));
  }

  return filteredData;
}
