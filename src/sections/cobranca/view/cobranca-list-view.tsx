import type { TableHeadCellProps } from 'src/components/table';

import { useState, useCallback } from 'react';
import { varAlpha } from 'minimal-shared/utils';
import { useBoolean, useSetState } from 'minimal-shared/hooks';

import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Card from '@mui/material/Card';
import Tabs from '@mui/material/Tabs';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { useTheme } from '@mui/material/styles';
import TableBody from '@mui/material/TableBody';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { fIsAfter, fIsBetween } from 'src/utils/format-time';

import { DashboardContent } from 'src/layouts/dashboard';

import { Label } from 'src/components/label';
import { toast } from 'src/components/snackbar';
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

import { CobrancaTableRow } from '../cobranca-table-row';
import { CobrancaTableToolbar } from '../cobranca-table-toolbar';
import { CobrancaReceivablesSummary } from '../cobranca-receivables-summary';
import { CobrancaTableFiltersResult } from '../cobranca-table-filters-result';

import type { ICobranca, ICobrancaTableFilters } from '../types';

// ----------------------------------------------------------------------

const TABLE_HEAD: TableHeadCellProps[] = [
  { id: 'cliente', label: 'Cliente' },
  { id: 'produto', label: 'Produto' },
  { id: 'valor', label: 'Valor' },
  { id: 'vencimento', label: 'Vencimento' },
  { id: 'recebimentos', label: 'Recebimentos' },
  { id: 'status', label: 'Status' },
  { id: '' },
];

import { _cobrancas } from 'src/_mock/_cobranca';

// Usar dados mock do arquivo _cobranca.ts
const MOCK_COBRANCAS: ICobranca[] = _cobrancas;

// ----------------------------------------------------------------------

export function CobrancaListView() {
  const theme = useTheme();

  const router = useRouter();

  const table = useTable({ defaultOrderBy: 'vencimento' });

  const confirmDialog = useBoolean();

  const [tableData, setTableData] = useState<ICobranca[]>(MOCK_COBRANCAS);
  const [selectedMonth, setSelectedMonth] = useState<string>(() => {
    const currentDate = new Date();
    return String(currentDate.getMonth() + 1).padStart(2, '0');
  });

  const filters = useSetState<ICobrancaTableFilters>({
    name: '',
    status: 'todos',
    startDate: null,
    endDate: null,
  });
  const { state: currentFilters } = filters;

  const dateError = fIsAfter(currentFilters.startDate, currentFilters.endDate);

  const dataFilteredByMonth =
    selectedMonth && selectedMonth !== 'todos'
      ? tableData.filter((cobranca) => {
          const vencimentoDate = new Date(cobranca.vencimento);
          const month = String(vencimentoDate.getMonth() + 1).padStart(2, '0');
          return month === selectedMonth;
        })
      : tableData;

  const dataFiltered = applyFilter({
    inputData: dataFilteredByMonth,
    comparator: getComparator(table.order, table.orderBy),
    filters: currentFilters,
    dateError,
  });

  const dataInPage = rowInPage(dataFiltered, table.page, table.rowsPerPage);

  const canReset =
    !!currentFilters.name ||
    currentFilters.status !== 'todos' ||
    (!!currentFilters.startDate && !!currentFilters.endDate);

  const notFound = (!dataFiltered.length && canReset) || !dataFiltered.length;

  const getCobrancaLength = (status: string) =>
    dataFilteredByMonth.filter((item) => item.status === status).length;

  const TABS = [
    {
      value: 'todos',
      label: 'Todas',
      color: 'default',
      count: dataFilteredByMonth.length,
    },
    {
      value: 'Pago',
      label: 'Pagas',
      color: 'success',
      count: getCobrancaLength('Pago'),
    },
    {
      value: 'Pendente',
      label: 'Pendentes',
      color: 'warning',
      count: getCobrancaLength('Pendente'),
    },
    {
      value: 'Vencido',
      label: 'Vencidas',
      color: 'error',
      count: getCobrancaLength('Vencido'),
    },
  ] as const;

  const handleDeleteRow = useCallback(
    (id: string) => {
      const deleteRow = tableData.filter((row) => row.id !== id);

      toast.success('Cobrança excluída com sucesso!');

      setTableData(deleteRow);

      table.onUpdatePageDeleteRow(dataInPage.length);
    },
    [dataInPage.length, table, tableData]
  );

  const handleDeleteRows = useCallback(() => {
    const deleteRows = tableData.filter((row) => !table.selected.includes(row.id));

    toast.success('Cobranças excluídas com sucesso!');

    setTableData(deleteRows);

    table.onUpdatePageDeleteRows(dataInPage.length, dataFiltered.length);
  }, [dataFiltered.length, dataInPage.length, table, tableData]);

  const handleFilterStatus = useCallback(
    (event: React.SyntheticEvent, newValue: string) => {
      table.onResetPage();
      filters.setState({ status: newValue });
    },
    [filters, table]
  );

  const handleResetFilters = useCallback(() => {
    table.onResetPage();
    filters.setState({
      name: '',
      status: 'todos',
      startDate: null,
      endDate: null,
    });
  }, [filters, table]);

  const renderConfirmDialog = () => (
    <ConfirmDialog
      open={confirmDialog.value}
      onClose={confirmDialog.onFalse}
      title="Excluir"
      content={
        <>
          Tem certeza que deseja excluir <strong> {table.selected.length} </strong> cobrança(s)?
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
  );

  return (
    <>
      <DashboardContent>
        <CustomBreadcrumbs
          heading="Lista de Cobranças"
          links={[
            { name: 'Dashboard', href: paths.dashboard.root },
            { name: 'Cobrança', href: paths.dashboard.cobranca.root },
            { name: 'Lista' },
          ]}
          action={
            <FormControl size="small" sx={{ minWidth: 200 }}>
              <InputLabel>Selecionar Mês</InputLabel>
              <Select
                value={selectedMonth}
                label="Selecionar Mês"
                onChange={(e) => setSelectedMonth(e.target.value)}
              >
                <MenuItem value="todos">Todos os meses</MenuItem>
                <MenuItem value="01">Janeiro</MenuItem>
                <MenuItem value="02">Fevereiro</MenuItem>
                <MenuItem value="03">Março</MenuItem>
                <MenuItem value="04">Abril</MenuItem>
                <MenuItem value="05">Maio</MenuItem>
                <MenuItem value="06">Junho</MenuItem>
                <MenuItem value="07">Julho</MenuItem>
                <MenuItem value="08">Agosto</MenuItem>
                <MenuItem value="09">Setembro</MenuItem>
                <MenuItem value="10">Outubro</MenuItem>
                <MenuItem value="11">Novembro</MenuItem>
                <MenuItem value="12">Dezembro</MenuItem>
              </Select>
            </FormControl>
          }
          sx={{ mb: { xs: 3, md: 5 } }}
        />

        <CobrancaReceivablesSummary cobrancas={dataFilteredByMonth} sx={{ mb: 3 }} />

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
                      ((tab.value === 'todos' || tab.value === currentFilters.status) &&
                        'filled') ||
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

          <CobrancaTableToolbar
            filters={filters}
            dateError={dateError}
            onResetPage={table.onResetPage}
            canReset={canReset}
            onResetFilters={handleResetFilters}
          />

          {canReset && (
            <CobrancaTableFiltersResult
              filters={filters}
              totalResults={dataFiltered.length}
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
                      <CobrancaTableRow
                        key={row.id}
                        row={row}
                        onDeleteRow={() => handleDeleteRow(row.id)}
                        onViewRow={() => router.push(paths.dashboard.cobranca.recebimentos(row.id))}
                      />
                    ))}

                  <TableEmptyRows
                    height={table.dense ? 56 : 76}
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
  dateError: boolean;
  inputData: ICobranca[];
  filters: ICobrancaTableFilters;
  comparator: (a: any, b: any) => number;
};

function applyFilter({ inputData, comparator, filters, dateError }: ApplyFilterProps) {
  const { name, status, startDate, endDate } = filters;

  const stabilizedThis = inputData.map((el, index) => [el, index] as const);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  if (name) {
    inputData = inputData.filter(
      (cobranca) => cobranca.cliente.toLowerCase().indexOf(name.toLowerCase()) !== -1
    );
  }

  if (status !== 'todos') {
    inputData = inputData.filter((cobranca) => cobranca.status === status);
  }

  if (startDate && endDate && !dateError) {
    inputData = inputData.filter((cobranca) => {
      const vencimentoDate = new Date(cobranca.vencimento);
      return fIsBetween(vencimentoDate, startDate, endDate);
    });
  }

  return inputData;
}
