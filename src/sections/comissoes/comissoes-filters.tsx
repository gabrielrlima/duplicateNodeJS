import type { IComissaoFilters } from 'src/types/comissao';
import type { UseSetStateReturn } from 'minimal-shared/hooks';

import { useCallback } from 'react';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Badge from '@mui/material/Badge';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Tooltip from '@mui/material/Tooltip';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Autocomplete from '@mui/material/Autocomplete';

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';

// ----------------------------------------------------------------------

type Props = {
  open: boolean;
  onOpen: () => void;
  onClose: () => void;
  canReset: boolean;
  onResetSearch: () => void;
  filters: UseSetStateReturn<IComissaoFilters>;
  options: {
    status: string[];
    tipo: string[];
    categoriaProduto: string[];
    tiposParticipante: string[];
  };
};

export function ComissoesFilters({
  open,
  onOpen,
  onClose,
  filters,
  canReset,
  onResetSearch,
  options,
}: Props) {
  const { state: currentFilters, setState: updateFilters } = filters;

  const handleFilterStatus = useCallback(
    (newValue: string) => {
      updateFilters({ status: newValue });
    },
    [updateFilters]
  );

  const handleFilterTipo = useCallback(
    (newValue: string[]) => {
      updateFilters({ tipo: newValue });
    },
    [updateFilters]
  );

  const handleFilterPercentualMinimo = useCallback(
    (newValue: number | null) => {
      updateFilters({ percentualMinimo: newValue });
    },
    [updateFilters]
  );

  const handleFilterPercentualMaximo = useCallback(
    (newValue: number | null) => {
      updateFilters({ percentualMaximo: newValue });
    },
    [updateFilters]
  );

  const handleFilterCategoriaProduto = useCallback(
    (newValue: string[]) => {
      updateFilters({ categoriaProduto: newValue });
    },
    [updateFilters]
  );

  const handleFilterTiposParticipante = useCallback(
    (newValue: string[]) => {
      updateFilters({ tiposParticipante: newValue });
    },
    [updateFilters]
  );

  const handleResetFilters = useCallback(() => {
    updateFilters({
      status: 'all',
      tipo: [],
      categoriaProduto: [],
      tiposParticipante: [],
      percentualMinimo: null,
      percentualMaximo: null,
    });
    onResetSearch();
  }, [updateFilters, onResetSearch]);

  const renderHead = (
    <Box display="flex" alignItems="center" sx={{ py: 2, pr: 1, pl: 2.5 }}>
      <Typography variant="h6" sx={{ flexGrow: 1 }}>
        Filtros
      </Typography>

      <Tooltip title="Resetar">
        <IconButton onClick={handleResetFilters}>
          <Badge color="error" variant="dot" invisible={!canReset}>
            <Iconify icon="solar:restart-bold" />
          </Badge>
        </IconButton>
      </Tooltip>

      <IconButton onClick={onClose}>
        <Iconify icon="mingcute:close-line" />
      </IconButton>
    </Box>
  );

  const renderStatus = (
    <Box display="flex" flexDirection="column">
      <Typography variant="subtitle2" sx={{ mb: 1 }}>
        Status
      </Typography>
      <Box gap={1} display="flex" flexWrap="wrap">
        {['all', ...options.status].map((option) => (
          <Chip
            key={option}
            label={option === 'all' ? 'Todos' : option}
            size="small"
            variant={currentFilters.status === option ? 'filled' : 'outlined'}
            onClick={() => handleFilterStatus(option)}
          />
        ))}
      </Box>
    </Box>
  );

  const renderTipo = (
    <Box display="flex" flexDirection="column">
      <Typography variant="subtitle2" sx={{ mb: 1.5 }}>
        Tipo de Comissão
      </Typography>
      <Autocomplete
        multiple
        options={options.tipo}
        value={currentFilters.tipo}
        onChange={(event, newValue) => handleFilterTipo(newValue)}
        renderInput={(params) => <TextField placeholder="Selecionar tipos" {...params} />}
        renderOption={(props, option) => (
          <li {...props} key={option}>
            {option === 'total_imobiliaria'
              ? 'Comissão Total'
              : option === 'distribuicao_interna'
                ? 'Distribuição Interna'
                : option}
          </li>
        )}
        renderTags={(selected, getTagProps) =>
          selected.map((option, index) => (
            <Chip
              {...getTagProps({ index })}
              key={option}
              label={
                option === 'total_imobiliaria'
                  ? 'Comissão Total'
                  : option === 'distribuicao_interna'
                    ? 'Distribuição Interna'
                    : option
              }
              size="small"
              variant="soft"
            />
          ))
        }
      />
    </Box>
  );

  const renderCategoriaProduto = (
    <Box display="flex" flexDirection="column">
      <Typography variant="subtitle2" sx={{ mb: 1 }}>
        Categoria de Produto
      </Typography>
      <Box gap={1} display="flex" flexWrap="wrap">
        {options.categoriaProduto.map((option) => (
          <Chip
            key={option}
            label={
              option === 'imovel'
                ? 'Imóvel'
                : option === 'terreno'
                  ? 'Terreno'
                  : option === 'empreendimento'
                    ? 'Empreendimento'
                    : option
            }
            size="small"
            variant={currentFilters.categoriaProduto.includes(option) ? 'filled' : 'outlined'}
            onClick={() => {
              const newValue = currentFilters.categoriaProduto.includes(option)
                ? currentFilters.categoriaProduto.filter((item) => item !== option)
                : [...currentFilters.categoriaProduto, option];
              handleFilterCategoriaProduto(newValue);
            }}
          />
        ))}
      </Box>
    </Box>
  );

  const renderTiposParticipante = (
    <Box display="flex" flexDirection="column">
      <Typography variant="subtitle2" sx={{ mb: 1.5 }}>
        Tipos de Participante
      </Typography>
      <Autocomplete
        multiple
        options={options.tiposParticipante}
        value={currentFilters.tiposParticipante}
        onChange={(event, newValue) => handleFilterTiposParticipante(newValue)}
        renderInput={(params) => <TextField placeholder="Selecionar participantes" {...params} />}
        renderOption={(props, option) => (
          <li {...props} key={option}>
            {option === 'imobiliaria'
              ? 'Imobiliária'
              : option === 'corretor_principal'
                ? 'Corretor Principal'
                : option === 'corretor_suporte'
                  ? 'Corretor Suporte'
                  : option === 'coordenador'
                    ? 'Coordenador'
                    : option === 'grupo'
                      ? 'Grupo'
                      : option === 'captador'
                        ? 'Captador'
                        : option}
          </li>
        )}
        renderTags={(selected, getTagProps) =>
          selected.map((option, index) => (
            <Chip
              {...getTagProps({ index })}
              key={option}
              label={
                option === 'imobiliaria'
                  ? 'Imobiliária'
                  : option === 'corretor_principal'
                    ? 'Corretor Principal'
                    : option === 'corretor_suporte'
                      ? 'Corretor Suporte'
                      : option === 'coordenador'
                        ? 'Coordenador'
                        : option === 'grupo'
                          ? 'Grupo'
                          : option === 'captador'
                            ? 'Captador'
                            : option
              }
              size="small"
              variant="soft"
            />
          ))
        }
      />
    </Box>
  );

  const renderPercentual = (
    <Box display="flex" flexDirection="column">
      <Typography variant="subtitle2" sx={{ mb: 1.5 }}>
        Faixa de Percentual (%)
      </Typography>
      <Box gap={1.5} display="flex">
        <TextField
          label="Mínimo"
          type="number"
          value={currentFilters.percentualMinimo || ''}
          onChange={(event) => {
            const value = event.target.value ? Number(event.target.value) : null;
            handleFilterPercentualMinimo(value);
          }}
          sx={{ flexGrow: 1 }}
        />
        <TextField
          label="Máximo"
          type="number"
          value={currentFilters.percentualMaximo || ''}
          onChange={(event) => {
            const value = event.target.value ? Number(event.target.value) : null;
            handleFilterPercentualMaximo(value);
          }}
          sx={{ flexGrow: 1 }}
        />
      </Box>
    </Box>
  );

  return (
    <>
      <Button
        disableRipple
        color="inherit"
        endIcon={
          <Badge color="error" variant="dot" invisible={!canReset}>
            <Iconify icon="ic:round-filter-list" />
          </Badge>
        }
        onClick={onOpen}
      >
        Filtros
      </Button>

      <Drawer
        anchor="right"
        open={open}
        onClose={onClose}
        slotProps={{
          backdrop: { invisible: true },
        }}
        PaperProps={{
          sx: { width: 320 },
        }}
      >
        {renderHead}

        <Divider />

        <Scrollbar sx={{ px: 2.5, py: 3 }}>
          <Stack spacing={3}>
            {renderStatus}
            {renderTipo}
            {renderCategoriaProduto}
            {renderTiposParticipante}
            {renderPercentual}
          </Stack>
        </Scrollbar>
      </Drawer>
    </>
  );
}
