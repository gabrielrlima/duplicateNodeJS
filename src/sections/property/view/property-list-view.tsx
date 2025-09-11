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

const STATUS_OPTIONS = [
  { value: 'all', label: 'Todos' },
  { value: 'available', label: 'Disponível' },
  { value: 'reserved', label: 'Reservado' },
  { value: 'sold', label: 'Vendido' },
  { value: 'inactive', label: 'Inativo' },
];

const TABLE_HEAD: TableHeadCellProps[] = [
  { id: 'titulo', label: 'Imóvel' },
  { id: 'corretor', label: 'Corretor', width: 140 },
  { id: 'area', label: 'Área (m²)', width: 120, align: 'center' },
  { id: 'preco', label: 'Preço', width: 140 },
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
        tipo: property.type || 'apartamento',
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
        localizacao: {
          endereco: typeof property.address === 'string' ? property.address : 
                   typeof property.address === 'object' && property.address ? 
                   `${property.address.street || ''} ${property.address.number || ''}`.trim() || 'Endereço não informado' :
                   'Endereço não informado',
          complemento: property.address?.complement || '',
          bairro: property.neighborhood || property.address?.neighborhood || 'Bairro não informado',
          cidade: property.city || property.address?.city || 'Cidade não informada',
          estado: property.state || property.address?.state || 'Estado não informado',
          cep: property.cep || property.zipCode || property.address?.zipCode || 'CEP não informado',
          andar: property.address?.floor || '',
          nomeEdificio: property.address?.buildingName || '',
          coordenadas: property.latitude && property.longitude ? {
            lat: property.latitude,
            lng: property.longitude
          } : undefined
        },
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
    currentFilters.status !== 'all' ||
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

  const handleFilterStatus = useCallback(
    (event: React.SyntheticEvent, newValue: string) => {
      table.onResetPage();
      updateFilters({ status: newValue });
    },
    [updateFilters, table]
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
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: 400,
            textAlign: 'center',
          }}
        >
          <Iconify icon="eva:alert-triangle-fill" sx={{ width: 64, height: 64, color: 'error.main', mb: 2 }} />
          <Typography variant="h6" sx={{ mb: 1 }}>
            Erro ao carregar imóveis
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
            heading="Todos os imóveis"
            links={[
              { name: 'Dashboard', href: paths.dashboard.root },
              { name: 'Imóveis', href: paths.dashboard.property.root },
              { name: 'Lista de imóveis' },
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
            Novo imóvel
          </Button>
        </Stack>

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
                      ((tab.value === 'all' || tab.value === currentFilters.status) && 'filled') ||
                      'soft'
                    }
                    color={
                      (tab.value === 'available' && 'success') ||
                      (tab.value === 'reserved' && 'warning') ||
                      (tab.value === 'sold' && 'info') ||
                      (tab.value === 'inactive' && 'error') ||
                      'default'
                    }
                  >
                    {tab.value === 'all'
                      ? tableData.length
                      : tableData.filter((property) => property.status === tab.value).length}
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
                    title={noProperties ? "Nenhum imóvel registrado" : "Nenhum resultado encontrado"}
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
  comparator: (a: any, b: any) => number;
};

function applyFilter({ inputData, comparator, filters, dateError }: ApplyFilterProps) {
  const { status, name, startDate, endDate } = filters;

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

  if (status !== 'all') {
    inputData = inputData.filter((property) => property.status === status);
  }

  if (!dateError) {
    if (startDate && endDate) {
      inputData = inputData.filter((property) => fIsBetween(property.createdAt, startDate, endDate));
    }
  }

  return inputData;
}