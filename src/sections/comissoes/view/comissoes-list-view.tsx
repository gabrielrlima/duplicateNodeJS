import type { IComissaoItem, IComissaoFilters } from 'src/types/comissao';

import { useState, useCallback } from 'react';
import { useBoolean, useSetState } from 'minimal-shared/hooks';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { useComissoes } from 'src/hooks/use-comissoes';

import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';
import { EmptyContent } from 'src/components/empty-content';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { isComissaoTotal, isDistribuicaoInterna } from 'src/types/comissao';

import { ComissoesList } from '../comissoes-list';
import { ComissoesSort } from '../comissoes-sort';
import { ComissoesSearch } from '../comissoes-search';
import { ComissoesFilters } from '../comissoes-filters';
import { ComissoesFiltersResult } from '../comissoes-filters-result';

// ----------------------------------------------------------------------

export default function ComissoesListView() {
  const openFilters = useBoolean();

  const [sortBy, setSortBy] = useState('latest');

  const [searchQuery, setSearchQuery] = useState('');

  // Paginação
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(9);

  const filters = useSetState<IComissaoFilters>({
    status: 'all',
    tipo: [],
    categoriaProduto: [],
    tiposParticipante: [],
    percentualMinimo: null,
    percentualMaximo: null,
  });
  const { state: currentFilters } = filters;

  // Buscar comissões da API
  const { comissoes, loading, error, refetch } = useComissoes();

  const dataFiltered = applyFilter({
    inputData: comissoes,
    filters: currentFilters,
    sortBy,
    searchQuery,
  });

  // Aplicar paginação
  const dataInPage = dataFiltered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const canReset =
    !!searchQuery ||
    currentFilters.status !== 'all' ||
    !!currentFilters.tipo.length ||
    !!currentFilters.categoriaProduto.length ||
    !!currentFilters.tiposParticipante.length ||
    currentFilters.percentualMinimo !== null ||
    currentFilters.percentualMaximo !== null;

  const notFound = !dataFiltered.length && canReset;

  // Estados de loading e erro
  const showLoading = loading && !comissoes.length;
  const showError = !!error && !loading;
  const showEmpty = !loading && !error && !dataFiltered.length && !canReset;
  const showContent = !loading && !error && dataFiltered.length > 0;

  const handleSortBy = useCallback((newValue: string) => {
    setSortBy(newValue);
  }, []);

  const handleChangePage = useCallback((event: unknown, newPage: number) => {
    setPage(newPage);
  }, []);

  const handleChangeRowsPerPage = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  }, []);

  const filterOptions = {
    status: ['ativo', 'inativo', 'pendente'],
    tipo: ['total_imobiliaria', 'distribuicao_interna'],
    categoriaProduto: ['imovel', 'terreno', 'empreendimento'],
    tiposParticipante: [
      'imobiliaria',
      'corretor_principal',
      'corretor_suporte',
      'coordenador',
      'grupo',
      'captador',
    ],
  };

  const sortOptions = [
    { value: 'latest', label: 'Mais recentes' },
    { value: 'oldest', label: 'Mais antigos' },
    { value: 'nome', label: 'Nome' },
    { value: 'percentual', label: 'Percentual' },
    { value: 'status', label: 'Status' },
  ];

  const renderFilters = () => (
    <Box
      sx={{
        gap: 3,
        display: 'flex',
        justifyContent: 'space-between',
        flexDirection: { xs: 'column', sm: 'row' },
        alignItems: { xs: 'flex-end', sm: 'center' },
      }}
    >
      <ComissoesSearch redirectPath={(id) => paths.dashboard.comissoes.details(id)} />

      <Box sx={{ gap: 1, flexShrink: 0, display: 'flex' }}>
        <ComissoesFilters
          filters={filters}
          canReset={canReset}
          open={openFilters.value}
          onOpen={openFilters.onTrue}
          onClose={openFilters.onFalse}
          onResetSearch={() => setSearchQuery('')}
          options={filterOptions}
        />

        <ComissoesSort sort={sortBy} onSort={handleSortBy} sortOptions={sortOptions} />
      </Box>
    </Box>
  );

  const renderResults = () => (
    <ComissoesFiltersResult filters={filters} totalResults={dataFiltered.length} />
  );

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Regras de Comissões"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Regras de Comissões', href: paths.dashboard.comissoes.root },
          { name: 'Lista' },
        ]}
        action={
          <Button
            component={RouterLink}
            href={paths.dashboard.comissoes.new}
            variant="contained"
            startIcon={<Iconify icon="mingcute:add-line" />}
          >
            Nova regra
          </Button>
        }
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <Stack spacing={2.5} sx={{ mb: { xs: 3, md: 5 } }}>
        {renderFilters()}
        {canReset && renderResults()}
      </Stack>

      {showLoading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
          <CircularProgress />
        </Box>
      )}

      {showError && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
          <Button onClick={refetch} sx={{ ml: 2 }}>
            Tentar novamente
          </Button>
        </Alert>
      )}

      {showEmpty && <EmptyContent filled sx={{ py: 10 }} />}

      {notFound && <EmptyContent filled sx={{ py: 10 }} />}

      {showContent && (
        <ComissoesList
          comissoes={dataInPage}
          page={page}
          count={Math.ceil(dataFiltered.length / rowsPerPage)}
          rowsPerPage={rowsPerPage}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      )}
    </DashboardContent>
  );
}

// ----------------------------------------------------------------------

type ApplyFilterProps = {
  inputData: IComissaoItem[];
  filters: IComissaoFilters;
  sortBy: string;
  searchQuery: string;
};

function applyFilter({ inputData, filters, sortBy, searchQuery }: ApplyFilterProps) {
  const { status, tipo, categoriaProduto, tiposParticipante, percentualMinimo, percentualMaximo } =
    filters;

  // SEARCH
  if (searchQuery) {
    inputData = inputData.filter(
      (comissao) =>
        comissao.nome.toLowerCase().indexOf(searchQuery.toLowerCase()) !== -1 ||
        comissao.descricao.toLowerCase().indexOf(searchQuery.toLowerCase()) !== -1
    );
  }

  // FILTER
  if (status !== 'all') {
    inputData = inputData.filter((comissao) => comissao.status === status);
  }

  if (tipo.length) {
    inputData = inputData.filter((comissao) => {
      const tipoComissao = isComissaoTotal(comissao) ? 'total_imobiliaria' : 'distribuicao_interna';
      return tipo.includes(tipoComissao);
    });
  }

  // Filter by categoria de produto (apenas para comissões totais)
  if (categoriaProduto.length) {
    inputData = inputData.filter((comissao) => {
      if (isComissaoTotal(comissao)) {
        return categoriaProduto.includes(comissao.tipoProduto);
      }
      return true; // Distribuições internas não têm categoria
    });
  }

  // Filter by tipos de participante (apenas para distribuições internas)
  if (tiposParticipante.length) {
    inputData = inputData.filter((comissao) => {
      if (isDistribuicaoInterna(comissao)) {
        return (
          comissao.participantes?.some((participante) =>
            tiposParticipante.includes(participante.tipo)
          ) || false
        );
      }
      return true; // Comissões totais não têm participantes diretos
    });
  }

  if (percentualMinimo !== null) {
    inputData = inputData.filter((comissao) => {
      if (isComissaoTotal(comissao)) {
        return comissao.percentualTotal >= percentualMinimo;
      }
      // Para distribuição interna, não filtramos por percentual
      return true;
    });
  }

  if (percentualMaximo !== null) {
    inputData = inputData.filter((comissao) => {
      if (isComissaoTotal(comissao)) {
        return comissao.percentualTotal <= percentualMaximo;
      }
      // Para distribuição interna, não filtramos por percentual
      return true;
    });
  }

  // SORT BY
  if (sortBy === 'latest') {
    inputData = inputData.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  if (sortBy === 'oldest') {
    inputData = inputData.sort(
      (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );
  }

  if (sortBy === 'nome') {
    inputData = inputData.sort((a, b) => a.nome.localeCompare(b.nome));
  }

  if (sortBy === 'percentual') {
    inputData = inputData.sort((a, b) => {
      const aPercentual = isComissaoTotal(a) ? a.percentualTotal : 0;
      const bPercentual = isComissaoTotal(b) ? b.percentualTotal : 0;
      return bPercentual - aPercentual;
    });
  }

  if (sortBy === 'status') {
    inputData = inputData.sort((a, b) => a.status.localeCompare(b.status));
  }

  return inputData;
}
