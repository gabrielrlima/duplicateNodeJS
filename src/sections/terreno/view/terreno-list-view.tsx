/* eslint-disable */
import type { TableHeadCellProps } from 'src/components/table';
import type { ITerrenoItem, ITerrenoTableFilters } from 'src/types/terreno';

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
import { useGetTerrenos } from 'src/actions/terreno';
import { DashboardContent } from 'src/layouts/dashboard';

import { TERRENO_STATUS_OPTIONS } from 'src/_mock';
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

import { TerrenoTableRow } from '../terreno-table-row';
import { TerrenoTableToolbar } from '../terreno-table-toolbar';
import { TerrenoTableFiltersResult } from '../terreno-table-filters-result';

// ----------------------------------------------------------------------

const STATUS_OPTIONS = [
  { value: 'all', label: 'Todos' },
  { value: 'available', label: 'Disponível' },
  { value: 'reserved', label: 'Reservado' },
  { value: 'sold', label: 'Vendido' },
  { value: 'inactive', label: 'Inativo' },
];

const TABLE_HEAD: TableHeadCellProps[] = [
  { id: 'titulo', label: 'Terreno' },
  { id: 'corretor', label: 'Corretor', width: 140 },
  { id: 'area', label: 'Área (m²)', width: 120, align: 'center' },
  { id: 'preco', label: 'Preço', width: 140 },
  { id: 'status', label: 'Status', width: 110 },
  { id: '', width: 88 },
];

// ----------------------------------------------------------------------

export function TerrenoListView() {
  const table = useTable({ defaultOrderBy: 'titulo' });





  const { terrenos, terrenosLoading: isLoading, terrenosError: error } = useGetTerrenos();
  const [tableData, setTableData] = useState<ITerrenoItem[]>([]);

  // Atualizar tableData quando terrenos forem carregados
  useEffect(() => {
    if (terrenos && terrenos.length > 0) {
      // Mapear dados da API para o formato esperado pelo componente
      const mappedTerrenos = terrenos.map((terreno: any, index: number) => ({
        id: terreno.id,
        codigo: `TER-${(terreno.id || `${index}`).toString().slice(-4).padStart(4, '0')}`,
        titulo: terreno.name || terreno.title || 'Terreno sem título',
        descricao: terreno.description || terreno.terrainDescription || 'Sem descrição',
        area: terreno.totalArea || 0,
        preco: terreno.value || terreno.salePrice || 0,
        precoM2: terreno.pricePerSquareMeter || (terreno.value && terreno.totalArea ? Math.round(terreno.value / terreno.totalArea) : 0),
        status: terreno.status || 'available',
        tipo: terreno.type === 'residential' ? 'residencial' : terreno.type === 'commercial' ? 'comercial' : terreno.type === 'industrial' ? 'industrial' : 'rural',
        createdAt: terreno.createdAt,
        updatedAt: terreno.updatedAt,
        localizacao: {
          endereco: typeof terreno.address === 'string' ? terreno.address : 
                   typeof terreno.address === 'object' && terreno.address ? 
                   `${terreno.address.street || ''} ${terreno.address.number || ''}`.trim() || 'Endereço não informado' :
                   'Endereço não informado',
          bairro: terreno.neighborhood || terreno.address?.neighborhood || 'Bairro não informado',
          cidade: terreno.city || terreno.address?.city || 'Cidade não informada',
          estado: terreno.state || terreno.address?.state || 'Estado não informado',
          cep: terreno.cep || terreno.zipCode || terreno.address?.zipCode || 'CEP não informado',
          coordenadas: terreno.latitude && terreno.longitude ? {
            lat: terreno.latitude,
            lng: terreno.longitude
          } : undefined
        },
        proprietario: {
          id: terreno.ownerId || '',
          nome: terreno.owner?.name || 'Proprietário não informado',
          email: terreno.owner?.email || '',
          telefone: terreno.owner?.phone || '',
          avatarUrl: terreno.owner?.avatarUrl || '',
          documento: terreno.owner?.document || ''
        },
        caracteristicas: {
          area: terreno.totalArea || 0,
          formato: 'Não informado',
          topografia: terreno.topography === 'flat' ? 'plano' : 
                     terreno.topography === 'sloped' ? 'aclive' : 
                     terreno.topography === 'irregular' ? 'irregular' : 
                     terreno.topography || 'plano',
          acesso: terreno.accessType === 'paved' ? 'asfalto' : 
                 terreno.accessType === 'dirt' ? 'terra' : 
                 terreno.accessType || 'asfalto',
          documentacao: terreno.hasDocumentation ? 'Completa' : 'Incompleta'
        },
        imagens: terreno.images || [],
        destaque: terreno.highlightProperty || false,
        negociavel: terreno.acceptsFinancing || false,
        observacoes: terreno.description || '',
        corretor: !terreno.broker ? 'Sem corretor' : terreno.broker
      }));
      setTableData(mappedTerrenos);
    } else if (!isLoading && (!terrenos || terrenos.length === 0)) {
      // Limpar dados quando não há terrenos
      setTableData([]);
    }
  }, [terrenos, isLoading]);

  const filters = useSetState<ITerrenoTableFilters>({
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

  // Verificar se não há terrenos na API (dados vazios)
  const noTerrenos = tableData.length === 0 && !isLoading && !error;
  
  // Verificar se não há resultados após filtros
  const noResults = !dataFiltered.length && canReset;
  
  // Condição para mostrar empty state na tabela
  const notFound = noTerrenos || noResults;

  const handleDeleteRow = useCallback(
    (id: string) => {
      const deleteRow = tableData.filter((row) => row.id !== id);

      toast.success('Terreno removido com sucesso!');

      setTableData(deleteRow);

      table.onUpdatePageDeleteRow(dataInPage.length);
    },
    [dataInPage.length, table, tableData]
  );

  const handleUpdateStatus = useCallback(
    (id: string, newStatus: string) => {
      // Mapear os valores de status do TerrenoTableRow para os valores corretos
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
            Erro ao carregar terrenos
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {error.message || 'Ocorreu um erro inesperado'}
          </Typography>
        </Box>
      </DashboardContent>
    );
  }

  // Remover o empty state separado - agora será exibido dentro da tabela

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
            heading="Todos os terrenos"
            links={[
              { name: 'Dashboard', href: paths.dashboard.root },
              { name: 'Terrenos', href: paths.dashboard.terrenos.root },
              { name: 'Lista de terrenos' },
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
            href={paths.dashboard.terrenos.new}
            sx={{
              fontSize: { xs: '0.875rem', md: '1rem' },
              width: { xs: '100%', sm: 'auto' },
            }}
          >
            Novo terreno
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
                      : tableData.filter((terreno) => terreno.status === tab.value).length}
                  </Label>
                }
              />
            ))}
          </Tabs>

          <TerrenoTableToolbar
            filters={filters}
            onResetPage={table.onResetPage}
            dateError={dateError}
          />

          {canReset && (
            <TerrenoTableFiltersResult
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
                      <TerrenoTableRow
                        key={row.id}
                        row={row}
                        onDeleteRow={() => handleDeleteRow(row.id)}
                        onUpdateStatus={(newStatus) => handleUpdateStatus(row.id, newStatus)}
                        detailsHref={paths.dashboard.terrenos.details(row.id)}
                      />
                    ))}

                  <TableEmptyRows
                    height={table.dense ? 56 : 56 + 20}
                    emptyRows={emptyRows(table.page, table.rowsPerPage, dataFiltered.length)}
                  />

                  <TableNoData 
                    notFound={notFound} 
                    title={noTerrenos ? "Nenhum terreno registrado" : "Nenhum resultado encontrado"}
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
  inputData: ITerrenoItem[];
  filters: ITerrenoTableFilters;
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
    inputData = inputData.filter((terreno) => terreno.status === status);
  }

  if (!dateError) {
    if (startDate && endDate) {
      inputData = inputData.filter((terreno) => fIsBetween(terreno.createdAt, startDate, endDate));
    }
  }

  return inputData;
}
