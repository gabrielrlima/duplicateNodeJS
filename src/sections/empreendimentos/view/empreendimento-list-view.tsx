/* eslint-disable */
import type { IEmpreendimentoItem, IEmpreendimentoFilters } from 'src/types/empreendimento';

import { useState, useCallback, useEffect } from 'react';
import { useBoolean, useSetState } from 'minimal-shared/hooks';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import InputAdornment from '@mui/material/InputAdornment';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { DashboardContent } from 'src/layouts/dashboard';
import {
  EMPREENDIMENTO_TIPO_OPTIONS,
  EMPREENDIMENTO_STATUS_OPTIONS,
  EMPREENDIMENTO_BENEFICIOS_OPTIONS,
  EMPREENDIMENTO_TIPO_SACADA_OPTIONS,
  EMPREENDIMENTO_TIPOS_UNIDADE_OPTIONS,
  EMPREENDIMENTO_CARACTERISTICAS_OPTIONS,
  EMPREENDIMENTO_TIPO_APARTAMENTO_OPTIONS,
  EMPREENDIMENTO_DIFERENCIAIS_EDIFICIO_OPTIONS,
  EMPREENDIMENTO_DIFERENCIAIS_APARTAMENTO_OPTIONS,
  EMPREENDIMENTO_OPORTUNIDADES_DISPONIVEIS_OPTIONS,
} from 'src/_mock';

import { Iconify } from 'src/components/iconify';
import { EmptyContent } from 'src/components/empty-content';
import { LoadingScreen } from 'src/components/loading-screen';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { useGetEmpreendimentos } from 'src/actions/empreendimento';

import { EmpreendimentoList } from '../empreendimento-list';
import { EmpreendimentoSort } from '../empreendimento-sort';
import { EmpreendimentoFilters } from '../empreendimento-filters';
import { EmpreendimentoFiltersResult } from '../empreendimento-filters-result';

// ----------------------------------------------------------------------

export function EmpreendimentoListView() {
  const openFilters = useBoolean();

  const [sortBy, setSortBy] = useState('latest');

  const [searchQuery, setSearchQuery] = useState('');

  const { empreendimentos, empreendimentosLoading: isLoading, empreendimentosError: error } = useGetEmpreendimentos();
  const [tableData, setTableData] = useState<IEmpreendimentoItem[]>([]);

  const filters = useSetState<IEmpreendimentoFilters>({
    tipos: [],
    status: 'all',
    caracteristicas: [],
    cidade: [],
    estado: [],
    faixaPreco: [],
    diferenciaisEdificio: [],
    diferenciaisApartamento: [],
    areaMinima: null,
    areaMaxima: null,
    precoMinimo: null,
    precoMaximo: null,
    tipoApartamento: [],
    tipoSacada: [],
    oportunidadesDisponiveis: [],
    tiposUnidade: [],
    beneficios: [],
  });
  const { state: currentFilters } = filters;

  // Atualizar tableData quando empreendimentos forem carregados
  useEffect(() => {
    if (empreendimentos && empreendimentos.length > 0) {
      // Mapear dados da API para o formato esperado pelo componente
      const mappedEmpreendimentos = empreendimentos.map((empreendimento: any) => ({
        id: empreendimento.id,
        nome: empreendimento.name || 'Empreendimento sem nome',
        titulo: empreendimento.name || 'Empreendimento sem título',
        descricao: empreendimento.description || 'Sem descrição',
        book: empreendimento.media?.brochure || '',
        avatar: empreendimento.media?.images?.[0] || '',
        publish: empreendimento.createdAt || new Date().toISOString(),
        status: empreendimento.status === 'planning' ? 'planejamento' : empreendimento.status === 'construction' ? 'construcao' : empreendimento.status === 'completed' ? 'concluido' : empreendimento.status === 'delivered' ? 'entregue' : 'inativo',
        caracteristicas: [
          ...(empreendimento.amenities?.pool ? ['Piscina'] : []),
          ...(empreendimento.amenities?.gym ? ['Academia'] : []),
          ...(empreendimento.amenities?.playground ? ['Playground'] : []),
          ...(empreendimento.amenities?.partyRoom ? ['Salão de festas'] : []),
          ...(empreendimento.amenities?.barbecueArea ? ['Churrasqueira'] : []),
          ...(empreendimento.amenities?.garden ? ['Jardim'] : []),
          ...(empreendimento.amenities?.security ? ['Segurança'] : []),
        ],
        totalVisualizacoes: empreendimento.stats?.views || 0,
        tipoEmpreendimento: empreendimento.type === 'residential' ? 'residencial' : empreendimento.type === 'commercial' ? 'comercial' : empreendimento.type === 'mixed' ? 'misto' : 'industrial',
        preco: {
          type: 'venda',
          valor: empreendimento.pricing?.averagePrice || 0,
          negociavel: true,
        },
        beneficios: empreendimento.pricing?.financing?.governmentPrograms || [],
        cidade: empreendimento.location?.city || 'Não informado',
        estado: empreendimento.location?.state || 'Não informado',
        diferenciaisEdificio: [
          ...(empreendimento.amenities?.concierge ? ['Portaria 24h'] : []),
          ...(empreendimento.amenities?.security ? ['Segurança'] : []),
          ...(empreendimento.amenities?.elevators ? ['Elevadores'] : []),
        ],
        diferenciaisApartamento: [
          ...(empreendimento.amenities?.airConditioner ? ['Ar condicionado'] : []),
          ...(empreendimento.amenities?.balcony ? ['Sacada'] : []),
        ],
        tipoApartamento: ['Padrão'],
        tipoSacada: ['Comum'],
        oportunidadesDisponiveis: ['Disponível'],
        construtora: {
          name: empreendimento.developer?.name || 'Não informado',
          logo: '',
          phoneNumber: empreendimento.developer?.phone || '',
          fullAddress: empreendimento.location?.address || 'Não informado',
        },
        criadoEm: empreendimento.createdAt,
        tiposUnidade: ['Apartamento'],
        cronogramaEntrega: [`${empreendimento.timeline?.constructionProgress || 0}% concluído`],
        dataEntrega: empreendimento.timeline?.deliveryDate,
        interessados: [],
        plantas: [],
      }));
      setTableData(mappedEmpreendimentos);
    } else {
      setTableData([]);
    }
  }, [empreendimentos]);

  const dataFiltered = applyFilter({
    inputData: tableData,
    filters: currentFilters,
    sortBy,
    searchQuery,
  });

  const canReset =
    !!searchQuery ||
    !!currentFilters.tipos.length ||
    currentFilters.status !== 'all' ||
    !!currentFilters.caracteristicas.length ||
    !!currentFilters.cidade.length ||
    !!currentFilters.estado.length ||
    !!currentFilters.faixaPreco.length ||
    !!currentFilters.diferenciaisEdificio.length ||
    !!currentFilters.diferenciaisApartamento.length ||
    currentFilters.areaMinima !== null ||
    currentFilters.areaMaxima !== null ||
    currentFilters.precoMinimo !== null ||
    currentFilters.precoMaximo !== null ||
    !!currentFilters.tipoApartamento.length ||
    !!currentFilters.tipoSacada.length ||
    !!currentFilters.oportunidadesDisponiveis.length ||
    !!currentFilters.tiposUnidade.length ||
    !!currentFilters.beneficios.length;

  const notFound = !dataFiltered.length && canReset;
  const noEmpreendimentos = !tableData.length && !isLoading && !error;

  const handleSortBy = useCallback((newValue: string) => {
    setSortBy(newValue);
  }, []);

  const filterOptions = {
    tipos: EMPREENDIMENTO_TIPO_OPTIONS.map((option) => option.value),
    caracteristicas: EMPREENDIMENTO_CARACTERISTICAS_OPTIONS,
    status: EMPREENDIMENTO_STATUS_OPTIONS.map((option) => option.value),
    faixaPreco: [
      'Até R$ 300.000',
      'R$ 300.000 - R$ 500.000',
      'R$ 500.000 - R$ 1.000.000',
      'Acima de R$ 1.000.000',
    ],
    diferenciaisEdificio: EMPREENDIMENTO_DIFERENCIAIS_EDIFICIO_OPTIONS,
    diferenciaisApartamento: EMPREENDIMENTO_DIFERENCIAIS_APARTAMENTO_OPTIONS,
    tipoApartamento: EMPREENDIMENTO_TIPO_APARTAMENTO_OPTIONS,
    tipoSacada: EMPREENDIMENTO_TIPO_SACADA_OPTIONS,
    oportunidadesDisponiveis: EMPREENDIMENTO_OPORTUNIDADES_DISPONIVEIS_OPTIONS,
    tiposUnidade: EMPREENDIMENTO_TIPOS_UNIDADE_OPTIONS.map((option) => option.value),
    beneficios: EMPREENDIMENTO_BENEFICIOS_OPTIONS.map((option) => option.value),
  };

  const sortOptions = [
    { value: 'latest', label: 'Mais recentes' },
    { value: 'oldest', label: 'Mais antigos' },
    { value: 'nome', label: 'Nome' },
    { value: 'mais-barato', label: 'Mais barato' },
    { value: 'mais-caro', label: 'Mais caro' },
    { value: 'cidade', label: 'Cidade' },
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
      <TextField
        placeholder="Pesquisar empreendimentos..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        sx={{ width: { xs: 1, sm: 260 } }}
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <Iconify icon="eva:search-fill" sx={{ ml: 1, color: 'text.disabled' }} />
              </InputAdornment>
            ),
          },
        }}
      />

      <Box sx={{ gap: 1, flexShrink: 0, display: 'flex' }}>
        <EmpreendimentoFilters
          filters={filters}
          canReset={canReset}
          open={openFilters.value}
          onOpen={openFilters.onTrue}
          onClose={openFilters.onFalse}
          onResetSearch={() => setSearchQuery('')}
          options={filterOptions}
        />

        <EmpreendimentoSort sort={sortBy} onSort={handleSortBy} sortOptions={sortOptions} />
      </Box>
    </Box>
  );

  const renderResults = () => (
    <EmpreendimentoFiltersResult filters={filters} totalResults={dataFiltered.length} />
  );

  // Tratamento de loading
  if (isLoading) {
    return (
      <DashboardContent>
        <LoadingScreen />
      </DashboardContent>
    );
  }

  // Tratamento de erro
  if (error) {
    return (
      <DashboardContent>
        <Typography variant="h6" color="error" sx={{ textAlign: 'center', py: 5 }}>
          Erro ao carregar empreendimentos: {error.message}
        </Typography>
      </DashboardContent>
    );
  }

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Todos os empreendimentos"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Empreendimentos', href: paths.dashboard.empreendimentos.root },
          { name: 'Lista' },
        ]}
        action={
          <Button
            component={RouterLink}
            href={paths.dashboard.empreendimentos.new}
            variant="contained"
            startIcon={<Iconify icon="mingcute:add-line" />}
          >
            Novo empreendimento
          </Button>
        }
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <Stack spacing={2.5} sx={{ mb: { xs: 3, md: 5 } }}>
        {renderFilters()}
        {canReset && renderResults()}
      </Stack>

      {(notFound || noEmpreendimentos) && (
        <EmptyContent
          filled
          title="Nenhum empreendimento registrado"
          description="Não há empreendimentos cadastrados no sistema ainda."
          sx={{ py: 10 }}
        />
      )}

      {!notFound && !noEmpreendimentos && <EmpreendimentoList empreendimentos={dataFiltered} />}
    </DashboardContent>
  );
}

// ----------------------------------------------------------------------

type ApplyFilterProps = {
  inputData: IEmpreendimentoItem[];
  filters: IEmpreendimentoFilters;
  sortBy: string;
  searchQuery: string;
};

function applyFilter({ inputData, filters, sortBy, searchQuery }: ApplyFilterProps) {
  const { tipos, status } = filters;

  // Search filter
  if (searchQuery) {
    inputData = inputData.filter(
      (empreendimento) =>
        empreendimento.titulo.toLowerCase().includes(searchQuery.toLowerCase()) ||
        empreendimento.nome.toLowerCase().includes(searchQuery.toLowerCase()) ||
        empreendimento.cidade.toLowerCase().includes(searchQuery.toLowerCase()) ||
        empreendimento.estado.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  // Filters
  if (tipos.length) {
    inputData = inputData.filter((empreendimento) =>
      tipos.includes(empreendimento.tipoEmpreendimento)
    );
  }

  if (status !== 'all') {
    inputData = inputData.filter((empreendimento) => empreendimento.status === status);
  }

  // Filter by características
  if (filters.caracteristicas.length) {
    inputData = inputData.filter((empreendimento) =>
      filters.caracteristicas.some((caracteristica) =>
        empreendimento.caracteristicas.includes(caracteristica)
      )
    );
  }

  // Filter by tipos de unidade
  if (filters.tiposUnidade.length) {
    inputData = inputData.filter((empreendimento) =>
      filters.tiposUnidade.some((tipo) => empreendimento.tiposUnidade.includes(tipo))
    );
  }

  // Filter by benefícios
  if (filters.beneficios.length) {
    inputData = inputData.filter((empreendimento) =>
      filters.beneficios.some((beneficio) => empreendimento.beneficios.includes(beneficio))
    );
  }

  // Sorting
  inputData = inputData.sort((a, b) => {
    switch (sortBy) {
      case 'latest':
        return new Date(b.criadoEm || '').getTime() - new Date(a.criadoEm || '').getTime();
      case 'oldest':
        return new Date(a.criadoEm || '').getTime() - new Date(b.criadoEm || '').getTime();
      case 'nome':
        return a.nome.localeCompare(b.nome);
      case 'mais-barato':
        return (a.preco?.valor || 0) - (b.preco?.valor || 0);
      case 'mais-caro':
        return (b.preco?.valor || 0) - (a.preco?.valor || 0);
      case 'cidade':
        return a.cidade.localeCompare(b.cidade);
      case 'status':
        return a.status.localeCompare(b.status);
      default:
        return 0;
    }
  });

  return inputData;
}
