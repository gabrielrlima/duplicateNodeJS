import type { TableHeadCellProps } from 'src/components/table';
import type { ICorretor, ICorretorTableFilters } from 'src/types/corretor';

// import { sumBy } from 'es-toolkit';
import { useCallback } from 'react';
import { varAlpha } from 'minimal-shared/utils';
import { useSetState } from 'minimal-shared/hooks';

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

import { useCorretores } from 'src/hooks/use-corretores';

import { DashboardContent } from 'src/layouts/dashboard';

import { Label } from 'src/components/label';
import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { EmptyContent } from 'src/components/empty-content';
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

import { CorretoresTableRow } from '../corretores-table-row';
import { CorretoresTableToolbar } from '../corretores-table-toolbar';
import { CorretoresCommissionSummary } from '../corretores-commission-summary';
import { CorretoresTableFiltersResult } from '../corretores-table-filters-result';

// ----------------------------------------------------------------------

const TABLE_HEAD: TableHeadCellProps[] = [
  { id: 'name', label: 'Nome' },
  { id: 'email', label: 'Email' },
  { id: 'phone', label: 'Telefone' },
  { id: 'lastActivity', label: 'Última Atividade' },
  { id: 'vendas', label: 'Vendas', align: 'center' },
  { id: 'status', label: 'Status' },
  { id: 'actions' },
];

// ----------------------------------------------------------------------

export function CorretoresListView() {
  // const theme = useTheme();

  const table = useTable({ defaultOrderBy: 'name' });

  const { corretores: tableData, loading, error, deleteCorretor } = useCorretores();

  const filters = useSetState<ICorretorTableFilters>({
    name: '',
    status: 'all',
    startDate: null,
    endDate: null,
  });
  const { state: currentFilters, setState: updateFilters } = filters;

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(table.order, table.orderBy),
    filters: currentFilters,
  });

  const dataInPage = rowInPage(dataFiltered, table.page, table.rowsPerPage);

  const canReset = !!currentFilters.name || currentFilters.status !== 'all';

  const notFound = (!dataFiltered.length && canReset) || !dataFiltered.length;

  // Verifica se não há corretores na API (dados vazios)
  const noCorretores = !loading && !error && !tableData.length;

  const getCorretoresLength = (status: string) =>
    tableData.filter((item) => item.status === status).length;

  // const getTotalComissao = (status: string) =>
  //   sumBy(
  //     tableData.filter((item) => item.status === status),
  //     (corretor) => corretor.comissaoTotal
  //   );

  // const getPercentByStatus = (status: string) =>
  //   (getCorretoresLength(status) / tableData.length) * 100;

  const TABS = [
    {
      value: 'all',
      label: 'Todos',
      color: 'default',
      count: tableData.length,
    },
    {
      value: 'ativo',
      label: 'Ativo',
      color: 'success',
      count: getCorretoresLength('ativo'),
    },
    {
      value: 'inativo',
      label: 'Inativo',
      color: 'error',
      count: getCorretoresLength('inativo'),
    },
    {
      value: 'ferias',
      label: 'Férias',
      color: 'warning',
      count: getCorretoresLength('ferias'),
    },
  ] as const;

  const handleDeleteRow = useCallback(
    async (id: string) => {
      try {
        await deleteCorretor(id);
        toast.success('Corretor removido com sucesso');
        table.onUpdatePageDeleteRow(dataInPage.length);
      } catch {
        toast.error('Erro ao remover corretor');
      }
    },
    [dataInPage.length, table, deleteCorretor]
  );

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
        heading="Corretores"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Corretores', href: paths.dashboard.order.root },
          { name: 'Lista' },
        ]}
        action={
          <Button
            component={RouterLink}
            href={paths.dashboard.corretores.new}
            variant="contained"
            startIcon={<Iconify icon="mingcute:add-line" />}
          >
            Novo corretor
          </Button>
        }
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      {/* Estado de loading */}
      {loading && (
        <EmptyContent
          title="Carregando corretores..."
          description="Aguarde enquanto buscamos os dados"
          sx={{ py: 10 }}
        />
      )}

      {/* Estado de erro */}
      {error && (
        <EmptyContent
          filled
          title="Erro ao carregar corretores"
          description={error}
          action={
            <Button
              variant="contained"
              onClick={() => window.location.reload()}
              startIcon={<Iconify icon="eva:refresh-fill" />}
            >
              Tentar novamente
            </Button>
          }
          sx={{ py: 10 }}
        />
      )}

      {/* Resumo de comissões - só mostra se não está carregando e não há erro */}
      {!loading && !error && (
        <CorretoresCommissionSummary corretores={tableData} sx={{ mb: 3 }} />
      )}

      {/* Estado vazio - Nenhum corretor registrado */}
      {noCorretores && (
        <EmptyContent
          filled
          title="Nenhum corretor registrado"
          description="Não há corretores cadastrados no sistema ainda"
          sx={{ py: 10 }}
        />
      )}

      {!loading && !error && !noCorretores && (
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

        <CorretoresTableToolbar filters={filters} onResetPage={table.onResetPage} />

        {canReset && (
          <CorretoresTableFiltersResult
            filters={filters}
            totalResults={dataFiltered.length}
            onResetPage={table.onResetPage}
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
                {dataFiltered
                  .slice(
                    table.page * table.rowsPerPage,
                    table.page * table.rowsPerPage + table.rowsPerPage
                  )
                  .map((row) => (
                    <CorretoresTableRow
                      key={row.id}
                      row={row}
                      onDeleteRow={() => handleDeleteRow(row.id)}
                      editHref={paths.dashboard.corretores.edit(row.id)}
                      detailsHref={paths.dashboard.corretores.details(row.id)}
                    />
                  ))}

                <TableEmptyRows
                  height={table.dense ? 56 : 56 + 20}
                  emptyRows={emptyRows(table.page, table.rowsPerPage, dataFiltered.length)}
                />

                <TableNoData notFound={notFound} title="Nenhum corretor encontrado" />
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
      )}
    </DashboardContent>
  );
}

// ----------------------------------------------------------------------

type ApplyFilterProps = {
  inputData: ICorretor[];
  filters: ICorretorTableFilters;
  comparator: (a: any, b: any) => number;
};

function applyFilter({ inputData, comparator, filters }: ApplyFilterProps) {
  const { name, status } = filters;

  const stabilizedThis = inputData.map((el, index) => [el, index] as const);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  if (name) {
    inputData = inputData.filter(
      (corretor) =>
        corretor.name.toLowerCase().indexOf(name.toLowerCase()) !== -1 ||
        corretor.email.toLowerCase().indexOf(name.toLowerCase()) !== -1
    );
  }

  if (status !== 'all') {
    inputData = inputData.filter((corretor) => corretor.status === status);
  }

  return inputData;
}
