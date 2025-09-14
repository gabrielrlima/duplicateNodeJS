/* eslint-disable */
import type { TableHeadCellProps } from 'src/components/table';
import type { IPropertyItem, IPropertyTableFilters } from 'src/types/property';

import { useState, useCallback, useEffect } from 'react';
import { varAlpha } from 'minimal-shared/utils';
import { useBoolean, useSetState } from 'minimal-shared/hooks';

import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import TableBody from '@mui/material/TableBody';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

import { paths } from 'src/routes/paths';
import { fIsAfter, fIsBetween } from 'src/utils/format-time';
import { useGetProperties } from 'src/actions/property';
import { DashboardContent } from 'src/layouts/dashboard';

import { Label } from 'src/components/label';
import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { EmptyContent } from 'src/components/empty-content';
import { LoadingScreen } from 'src/components/loading-screen';
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

import { PropertyTableRow } from '../property-table-row';
import { PropertyTableToolbar } from '../property-table-toolbar';
import { PropertyTableFiltersResult } from '../property-table-filters-result';

// ----------------------------------------------------------------------

// Removido STATUS_OPTIONS - mantendo apenas filtros por tipo

const TYPE_OPTIONS = [
  { value: 'all', label: 'Todos os tipos', color: 'default' },
  { value: 'imovel', label: 'Imóveis', color: 'primary' },
  { value: 'terreno', label: 'Terrenos', color: 'success' },
  { value: 'empreendimento', label: 'Empreendimentos', color: 'warning' },
];

const TABLE_HEAD: TableHeadCellProps[] = [
  { id: 'titulo', label: 'Título' },
  { id: 'localizacao', label: 'Localização', width: 180 },
  { id: 'tipo', label: 'Tipo', width: 120 },
  { id: 'status', label: 'Status', width: 110 },
  { id: '', width: 88 },
];

// ----------------------------------------------------------------------

export function PropertyListView() {
  const table = useTable({ defaultOrderBy: 'titulo' });

  const { properties, propertiesLoading: isLoading, propertiesError: error } = useGetProperties();
  const [tableData, setTableData] = useState<IPropertyItem[]>([]);

  // Atualizar tableData quando properties forem carregados
  useEffect(() => {
    if (properties && properties.length > 0) {
      // Mapear dados da API para o formato esperado pelo componente
      const mappedProperties = properties.map((property: any, index: number) => ({
        id: property.id,
        codigo: `IMO-${(property.id || `${index}`).toString().slice(-4).padStart(4, '0')}`,
        titulo: property.name || property.title || 'Imóvel sem título',
        descricao: property.description || 'Sem descrição',
        area: property.totalArea || 0,
        preco: property.value || property.salePrice || 0,
        precoM2: property.pricePerSquareMeter || (property.value && property.totalArea ? Math.round(property.value / property.totalArea) : 0),
        finalidade: property.purpose || 'venda',
        status: property.status || 'available',
        tipo: property.tipo || property.type || 'imovel',
        condicao: property.condition || 'usado',
        quartos: property.bedrooms || 0,
        banheiros: property.bathrooms || 0,
        suites: property.suites || 0,
        vagasGaragem: property.parkingSpaces || 0,
        mobiliado: property.furnished || false,
        anoConstucao: property.yearBuilt || '',
        elevador: property.elevator || false,
        sacada: property.balcony || false,
        posicaoSolar: property.sunPosition || '',
        createdAt: property.createdAt,
        updatedAt: property.updatedAt,
        localizacao: property.address || 'Localização não informada',
        proprietario: {
          id: property.ownerId || '',
          nome: property.owner?.name || 'Proprietário não informado',
          email: property.owner?.email || '',
          telefone: property.owner?.phone || '',
          avatarUrl: property.owner?.avatarUrl || '',
          documento: property.owner?.document || ''
        },
        caracteristicas: {
          area: property.totalArea || 0,
          quartos: property.bedrooms || 0,
          banheiros: property.bathrooms || 0,
          suites: property.suites || 0,
          vagasGaragem: property.parkingSpaces || 0,
          anoConstucao: property.yearBuilt || '',
          elevador: property.elevator || false,
          sacada: property.balcony || false,
          mobiliado: property.furnished || false,
          condicao: property.condition || 'usado',
          documentacao: property.hasDocumentation ? 'Completa' : 'Incompleta'
        },
        valores: {
          valorVenda: property.salePrice || 0,
          valorAluguel: property.rentPrice || 0,
          valorCondominio: property.condominiumFee || 0,
          valorIPTU: property.propertyTax || 0,
          aceitaFinanciamento: property.acceptsFinancing || false
        },
        imagens: property.images || [],
        destaque: property.highlightProperty || false,
        negociavel: property.acceptsFinancing || false,
        observacoes: property.description || '',
        corretor: !property.broker ? 'Sem corretor' : property.broker
      }));
      setTableData(mappedProperties);
    } else if (!isLoading && (!properties || properties.length === 0)) {
      // Limpar dados quando não há properties
      setTableData([]);
    }
  }, [properties, isLoading]);

  const filters = useSetState<IPropertyTableFilters>({
    name: '',
    status: 'all',
    startDate: null,
    endDate: null,
  });
  
  const [typeFilter, setTypeFilter] = useState('all');
  const { state: currentFilters, setState: updateFilters } = filters;

  const dateError = fIsAfter(currentFilters.startDate, currentFilters.endDate);

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(table.order, table.orderBy),
    filters: currentFilters,
    typeFilter,
    dateError,
  });

  const dataInPage = rowInPage(dataFiltered, table.page, table.rowsPerPage);

  const canReset =
    !!currentFilters.name ||
    typeFilter !== 'all' ||
    (!!currentFilters.startDate && !!currentFilters.endDate);

  // Verificar se não há properties na API (dados vazios)
  const noProperties = tableData.length === 0 && !isLoading && !error;
  
  // Verificar se não há resultados após filtros
  const noResults = !dataFiltered.length && canReset;
  
  // Condição para mostrar empty state na tabela
  const notFound = noProperties || noResults;

  const handleDeleteRow = useCallback(
    (id: string) => {
      const deleteRow = tableData.filter((row) => row.id !== id);

      toast.success('Imóvel removido com sucesso!');

      setTableData(deleteRow);

      table.onUpdatePageDeleteRow(dataInPage.length);
    },
    [dataInPage.length, table, tableData]
  );

  const handleUpdateStatus = useCallback(
    (id: string, newStatus: string) => {
      // Mapear os valores de status do PropertyTableRow para os valores corretos
      const statusMap: { [key: string]: string } = {
        'disponivel': 'available',
        'reservado': 'reserved', 
        'vendido': 'sold',
        'suspenso': 'inactive'
      };
      
      const mappedStatus = statusMap[newStatus] || newStatus;
      
      const updatedData = tableData.map((row) => 
        row.id === id ? { ...row, status: mappedStatus } : row
      );
      setTableData(updatedData);
    },
    [tableData]
  );

  // Removido handleFilterStatus - mantendo apenas filtros por tipo
  
  const handleFilterType = useCallback(
    (event: React.SyntheticEvent, newValue: string) => {
      table.onResetPage();
      setTypeFilter(newValue);
    },
    [table]
  );

  // Loading state
  if (isLoading) {
    return <LoadingScreen />;
  }

  // Error state
  if (error) {
    return (
      <DashboardContent>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            minHeight: 400,
            textAlign: 'center',
          }}
        >
          <Iconify icon="eva:alert-triangle-fill" sx={{ width: 64, height: 64, color: 'error.main', mb: 2 }} />
          <Typography variant="h6" sx={{ mb: 1 }}>
            Erro ao carregar produtos
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {error.message || 'Ocorreu um erro inesperado'}
          </Typography>
        </Box>
      </DashboardContent>
    );
  }

  return (
    <>
      <DashboardContent>
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          alignItems={{ xs: 'flex-start', sm: 'center' }}
          justifyContent="space-between"
          spacing={{ xs: 2, sm: 0 }}
          sx={{ mb: { xs: 3, md: 5 } }}
        >
          <CustomBreadcrumbs
            heading="Todos os produtos"
            links={[
              { name: 'Dashboard', href: paths.dashboard.root },
              { name: 'Produtos', href: paths.dashboard.property.root },
              { name: 'Lista de produtos' },
            ]}
            sx={{
              '.MuiTypography-h4': {
                fontSize: { xs: '1.25rem', md: '1.5rem' },
              },
            }}
          />
          <Button
            variant="contained"
            startIcon={<Iconify icon="eva:plus-fill" />}
            href={paths.dashboard.property.new}
            sx={{
              fontSize: { xs: '0.875rem', md: '1rem' },
              width: { xs: '100%', sm: 'auto' },
            }}
          >
            Novo produto
          </Button>
        </Stack>

        <Card>
          <Tabs
            value={typeFilter}
            onChange={handleFilterType}
            sx={[
              (theme) => ({
                px: 2.5,
                boxShadow: `inset 0 -2px 0 0 ${varAlpha(theme.vars.palette.grey['500Channel'], 0.08)}`,
              }),
            ]}
          >
            {TYPE_OPTIONS.map((tab) => (
              <Tab
                key={tab.value}
                iconPosition="end"
                value={tab.value}
                label={tab.label}
                icon={
                  <Label
                    variant={
                      ((tab.value === 'all' || tab.value === typeFilter) && 'filled') ||
                      'soft'
                    }
                    color={(tab.color as any) || 'default'}
                  >
                    {tab.value === 'all'
                      ? tableData.length
                      : tableData.filter((property) => property.tipo === tab.value).length}
                  </Label>
                }
              />
            ))}
          </Tabs>

          <PropertyTableToolbar
            filters={filters}
            onResetPage={table.onResetPage}
            dateError={dateError}
          />

          {canReset && (
            <PropertyTableFiltersResult
              filters={filters}
              totalResults={dataFiltered.length}
              onResetPage={table.onResetPage}
              sx={{ p: 2.5, pt: 0 }}
            />
          )}

          <Box sx={{ position: 'relative' }}>
            <Scrollbar sx={{ minHeight: 444 }}>
              <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 960 }}>
                <TableHeadCustom
                  order={table.order}
                  orderBy={table.orderBy}
                  headCells={TABLE_HEAD}
                  rowCount={dataFiltered.length}
                  numSelected={0}
                  onSort={table.onSort}
                />

                <TableBody>
                  {dataFiltered
                    .slice(
                      table.page * table.rowsPerPage,
                      table.page * table.rowsPerPage + table.rowsPerPage
                    )
                    .map((row) => (
                      <PropertyTableRow
                        key={row.id}
                        row={row}
                        onDeleteRow={() => handleDeleteRow(row.id)}
                        onUpdateStatus={(newStatus) => handleUpdateStatus(row.id, newStatus)}
                        detailsHref={paths.dashboard.property.details(row.id)}
                      />
                    ))}

                  <TableEmptyRows
                    height={table.dense ? 56 : 56 + 20}
                    emptyRows={emptyRows(table.page, table.rowsPerPage, dataFiltered.length)}
                  />

                  <TableNoData 
                    notFound={notFound} 
                    title={noProperties ? "Nenhum produto registrado" : "Nenhum resultado encontrado"}
                  />
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
    </>
  );
}

// ----------------------------------------------------------------------

type ApplyFilterProps = {
  dateError: boolean;
  inputData: IPropertyItem[];
  filters: IPropertyTableFilters;
  typeFilter: string;
  comparator: (a: any, b: any) => number;
};

function applyFilter({ inputData, comparator, filters, typeFilter, dateError }: ApplyFilterProps) {
  const { name, startDate, endDate } = filters;

  const stabilizedThis = inputData.map((el, index) => [el, index] as const);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  if (name) {
    inputData = inputData.filter(({ codigo, titulo, proprietario }) =>
      [codigo, titulo, proprietario.nome, proprietario.email].some((field) =>
        field?.toLowerCase().includes(name.toLowerCase())
      )
    );
  }
  
  if (typeFilter !== 'all') {
    inputData = inputData.filter((property) => property.tipo === typeFilter);
  }

  if (!dateError) {
    if (startDate && endDate) {
      inputData = inputData.filter((property) => fIsBetween(property.createdAt, startDate, endDate));
    }
  }

  return inputData;
}