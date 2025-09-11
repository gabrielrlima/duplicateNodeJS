import type { TableHeadCellProps } from 'src/components/table';
import type { IGrupo, IGrupoTableFilters } from 'src/types/grupo';

import { useEffect, useCallback } from 'react';
import { varAlpha } from 'minimal-shared/utils';
import { useSetState } from 'minimal-shared/hooks';

import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Tabs from '@mui/material/Tabs';
import Alert from '@mui/material/Alert';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import TableBody from '@mui/material/TableBody';
import CircularProgress from '@mui/material/CircularProgress';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { useGrupos } from 'src/hooks/use-grupos';

import { DashboardContent } from 'src/layouts/dashboard';

import { Label } from 'src/components/label';
import { Scrollbar } from 'src/components/scrollbar';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import {
  useTable,
  emptyRows,
  TableNoData,
  getComparator,
  TableEmptyRows,
  TableHeadCustom,
  TablePaginationCustom,
} from 'src/components/table';

import { GruposTableRow } from '../grupos-table-row';
import { GruposTableToolbar } from '../grupos-table-toolbar';
import { GruposCommissionSummary } from '../grupos-commission-summary';
import { GruposTableFiltersResult } from '../grupos-table-filters-result';

// ----------------------------------------------------------------------

const TABLE_HEAD: TableHeadCellProps[] = [
  { id: 'name', label: 'Nome' },
  { id: 'leader', label: 'Líder' },
  { id: 'members', label: 'Membros', align: 'center' },
  { id: 'vendas', label: 'Vendas', align: 'center' },
  { id: 'performance', label: 'Performance', align: 'center' },
  { id: 'status', label: 'Status' },
  { id: 'actions' },
];

// ----------------------------------------------------------------------

export function GruposListView() {
  const table = useTable({ defaultOrderBy: 'name' });

  const { grupos: tableData, loading, error, refetch } = useGrupos();

  useEffect(() => {
    refetch();
  }, [refetch]);

  const filters = useSetState<IGrupoTableFilters>({
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

  const canReset = !!currentFilters.name || currentFilters.status !== 'all';

  const notFound = (!dataFiltered.length && canReset) || !dataFiltered.length;

  const getGruposLength = (status: string) =>
    tableData.filter((item) => item.status === status).length;

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
      count: getGruposLength('ativo'),
    },
    {
      value: 'inativo',
      label: 'Inativo',
      color: 'error',
      count: getGruposLength('inativo'),
    },
    {
      value: 'suspenso',
      label: 'Suspenso',
      color: 'warning',
      count: getGruposLength('suspenso'),
    },
  ] as const;

  const handleFilterStatus = useCallback(
    (event: React.SyntheticEvent, newValue: string) => {
      table.onResetPage();
      updateFilters({ status: newValue });
    },
    [table, updateFilters]
  );

  // Renderizar loading
  if (loading) {
    return (
      <DashboardContent>
        <CustomBreadcrumbs
          heading="Grupos"
          links={[
            { name: 'Dashboard', href: paths.dashboard.root },
            { name: 'Grupos', href: paths.dashboard.grupos.root },
            { name: 'Lista' },
          ]}
          sx={{ mb: { xs: 3, md: 5 } }}
        />
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
          <CircularProgress size={60} />
        </Box>
      </DashboardContent>
    );
  }

  // Renderizar erro
  if (error) {
    return (
      <DashboardContent>
        <CustomBreadcrumbs
          heading="Grupos"
          links={[
            { name: 'Dashboard', href: paths.dashboard.root },
            { name: 'Grupos', href: paths.dashboard.grupos.root },
            { name: 'Lista' },
          ]}
          sx={{ mb: { xs: 3, md: 5 } }}
        />
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
          <Button onClick={refetch} sx={{ ml: 2 }} variant="outlined" size="small">
            Tentar novamente
          </Button>
        </Alert>
      </DashboardContent>
    );
  }

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Grupos"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Grupos', href: paths.dashboard.grupos.root },
          { name: 'Lista' },
        ]}
        action={
          <Button component={RouterLink} href={paths.dashboard.grupos.new} variant="contained">
            Novo grupo
          </Button>
        }
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <GruposCommissionSummary grupos={tableData} sx={{ mb: 3 }} />

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

        <GruposTableToolbar filters={filters} onResetPage={table.onResetPage} />

        {canReset && (
          <GruposTableFiltersResult
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
                    <GruposTableRow
                      key={row.id}
                      row={row}
                      editHref={paths.dashboard.grupos.edit(row.id)}
                      detailsHref={paths.dashboard.grupos.details(row.id)}
                    />
                  ))}

                <TableEmptyRows
                  height={table.dense ? 56 : 56 + 20}
                  emptyRows={emptyRows(table.page, table.rowsPerPage, dataFiltered.length)}
                />

                <TableNoData notFound={notFound} title="Nenhum grupo encontrado" />
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
  );
}

// ----------------------------------------------------------------------

type ApplyFilterProps = {
  inputData: IGrupo[];
  filters: IGrupoTableFilters;
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
      (grupo) =>
        grupo.name.toLowerCase().indexOf(name.toLowerCase()) !== -1 ||
        grupo.leader.toLowerCase().indexOf(name.toLowerCase()) !== -1 ||
        grupo.description.toLowerCase().indexOf(name.toLowerCase()) !== -1
    );
  }

  if (status !== 'all') {
    inputData = inputData.filter((grupo) => grupo.status === status);
  }

  return inputData;
}
