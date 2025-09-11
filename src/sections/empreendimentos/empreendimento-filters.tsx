import type { UseSetStateReturn } from 'minimal-shared/hooks';
import type { IEmpreendimentoFilters } from 'src/types/empreendimento';

import { useCallback } from 'react';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Badge from '@mui/material/Badge';
import Button from '@mui/material/Button';
import Drawer from '@mui/material/Drawer';
import Divider from '@mui/material/Divider';
import Tooltip from '@mui/material/Tooltip';
import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Autocomplete from '@mui/material/Autocomplete';
import FormControlLabel from '@mui/material/FormControlLabel';

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';

// ----------------------------------------------------------------------

type Props = {
  open: boolean;
  canReset: boolean;
  onOpen: () => void;
  onClose: () => void;
  onResetSearch?: () => void;
  filters: UseSetStateReturn<IEmpreendimentoFilters>;
  options: {
    tipos: string[];
    caracteristicas: string[];
    status: string[];
    faixaPreco: string[];
    diferenciaisEdificio: string[];
    diferenciaisApartamento: string[];
    tipoApartamento: string[];
    tipoSacada: string[];
    oportunidadesDisponiveis: string[];
    tiposUnidade: string[];
    beneficios: string[];
  };
};

export function EmpreendimentoFilters({
  open,
  canReset,
  onOpen,
  onClose,
  onResetSearch,
  filters,
  options,
}: Props) {
  const { state: currentFilters, setState: updateFilters, resetState: resetFilters } = filters;

  const getActiveFiltersCount = () => {
    let count = 0;
    if (currentFilters.tipos.length > 0) count++;
    if (currentFilters.status !== 'all') count++;
    if (currentFilters.caracteristicas.length > 0) count++;
    if (currentFilters.cidade.length > 0) count++;
    if (currentFilters.estado.length > 0) count++;
    if (currentFilters.diferenciaisEdificio.length > 0) count++;
    if (currentFilters.diferenciaisApartamento.length > 0) count++;
    if (currentFilters.areaMinima !== null || currentFilters.areaMaxima !== null) count++;
    if (currentFilters.precoMinimo !== null || currentFilters.precoMaximo !== null) count++;
    if (currentFilters.tipoApartamento.length > 0) count++;
    if (currentFilters.tipoSacada.length > 0) count++;
    if (currentFilters.oportunidadesDisponiveis.length > 0) count++;
    if (currentFilters.tiposUnidade.length > 0) count++;
    if (currentFilters.beneficios.length > 0) count++;
    return count;
  };

  const handleFilterStatus = useCallback(
    (newValue: string) => {
      updateFilters({ status: newValue });
    },
    [updateFilters]
  );

  const handleFilterCidade = useCallback(
    (newValue: string[]) => {
      updateFilters({ cidade: newValue });
    },
    [updateFilters]
  );

  const handleFilterEstado = useCallback(
    (newValue: string[]) => {
      updateFilters({ estado: newValue });
    },
    [updateFilters]
  );

  const handleFilterTipos = useCallback(
    (newValue: string) => {
      const checked = currentFilters.tipos.includes(newValue)
        ? currentFilters.tipos.filter((value) => value !== newValue)
        : [...currentFilters.tipos, newValue];

      updateFilters({ tipos: checked });
    },
    [updateFilters, currentFilters.tipos]
  );

  const handleFilterCaracteristicas = useCallback(
    (newValue: string) => {
      const checked = currentFilters.caracteristicas.includes(newValue)
        ? currentFilters.caracteristicas.filter((value) => value !== newValue)
        : [...currentFilters.caracteristicas, newValue];

      updateFilters({ caracteristicas: checked });
    },
    [updateFilters, currentFilters.caracteristicas]
  );

  const handleFilterTiposUnidade = useCallback(
    (newValue: string) => {
      const checked = currentFilters.tiposUnidade.includes(newValue)
        ? currentFilters.tiposUnidade.filter((value) => value !== newValue)
        : [...currentFilters.tiposUnidade, newValue];

      updateFilters({ tiposUnidade: checked });
    },
    [updateFilters, currentFilters.tiposUnidade]
  );

  const handleFilterBeneficios = useCallback(
    (newValue: string) => {
      const checked = currentFilters.beneficios.includes(newValue)
        ? currentFilters.beneficios.filter((value) => value !== newValue)
        : [...currentFilters.beneficios, newValue];

      updateFilters({ beneficios: checked });
    },
    [updateFilters, currentFilters.beneficios]
  );

  const handleFilterDiferenciaisEdificio = useCallback(
    (newValue: string) => {
      const checked = currentFilters.diferenciaisEdificio.includes(newValue)
        ? currentFilters.diferenciaisEdificio.filter((value) => value !== newValue)
        : [...currentFilters.diferenciaisEdificio, newValue];

      updateFilters({ diferenciaisEdificio: checked });
    },
    [updateFilters, currentFilters.diferenciaisEdificio]
  );

  const handleFilterDiferenciaisApartamento = useCallback(
    (newValue: string) => {
      const checked = currentFilters.diferenciaisApartamento.includes(newValue)
        ? currentFilters.diferenciaisApartamento.filter((value) => value !== newValue)
        : [...currentFilters.diferenciaisApartamento, newValue];

      updateFilters({ diferenciaisApartamento: checked });
    },
    [updateFilters, currentFilters.diferenciaisApartamento]
  );

  const handleFilterTipoApartamento = useCallback(
    (newValue: string) => {
      const checked = currentFilters.tipoApartamento.includes(newValue)
        ? currentFilters.tipoApartamento.filter((value) => value !== newValue)
        : [...currentFilters.tipoApartamento, newValue];

      updateFilters({ tipoApartamento: checked });
    },
    [updateFilters, currentFilters.tipoApartamento]
  );

  const handleFilterTipoSacada = useCallback(
    (newValue: string) => {
      const checked = currentFilters.tipoSacada.includes(newValue)
        ? currentFilters.tipoSacada.filter((value) => value !== newValue)
        : [...currentFilters.tipoSacada, newValue];

      updateFilters({ tipoSacada: checked });
    },
    [updateFilters, currentFilters.tipoSacada]
  );

  const handleFilterOportunidadesDisponiveis = useCallback(
    (newValue: string) => {
      const checked = currentFilters.oportunidadesDisponiveis.includes(newValue)
        ? currentFilters.oportunidadesDisponiveis.filter((value) => value !== newValue)
        : [...currentFilters.oportunidadesDisponiveis, newValue];

      updateFilters({ oportunidadesDisponiveis: checked });
    },
    [updateFilters, currentFilters.oportunidadesDisponiveis]
  );

  const handleFilterArea = useCallback(
    (field: 'areaMinima' | 'areaMaxima', value: string) => {
      const numValue = value === '' ? null : Number(value);
      updateFilters({ [field]: numValue });
    },
    [updateFilters]
  );

  const handleFilterPreco = useCallback(
    (field: 'precoMinimo' | 'precoMaximo', value: string) => {
      const numValue = value === '' ? null : Number(value.replace(/[^0-9]/g, ''));
      updateFilters({ [field]: numValue });
    },
    [updateFilters]
  );

  const renderHead = () => (
    <>
      <Box
        sx={{
          py: 2,
          pr: 1,
          pl: 2.5,
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Filtros
        </Typography>

        <Tooltip title="Limpar">
          <IconButton
            onClick={() => {
              resetFilters();
              onResetSearch?.();
            }}
          >
            <Badge color="error" variant="dot" invisible={!canReset}>
              <Iconify icon="solar:restart-bold" />
            </Badge>
          </IconButton>
        </Tooltip>

        <IconButton onClick={onClose}>
          <Iconify icon="mingcute:close-line" />
        </IconButton>
      </Box>

      <Divider sx={{ borderStyle: 'dashed' }} />
    </>
  );

  const renderCidadeEstado = () => (
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
      <Typography variant="subtitle2" sx={{ mb: 1.5 }}>
        Localização
      </Typography>

      <Stack spacing={2}>
        <Autocomplete
          multiple
          disableCloseOnSelect
          options={[
            'São Paulo',
            'Rio de Janeiro',
            'Belo Horizonte',
            'Brasília',
            'Salvador',
            'Fortaleza',
            'Curitiba',
            'Recife',
            'Porto Alegre',
            'Manaus',
          ]}
          value={currentFilters.cidade}
          onChange={(event, newValue) => handleFilterCidade(newValue)}
          renderInput={(params) => (
            <TextField
              {...params}
              placeholder={currentFilters.cidade.length ? '+ Cidades' : 'Selecionar cidades'}
            />
          )}
          renderOption={(props, option) => (
            <li {...props} key={option}>
              {option}
            </li>
          )}
          renderTags={(selected, getTagProps) =>
            selected.map((option, index) => (
              <Chip
                {...getTagProps({ index })}
                key={option}
                label={option}
                size="small"
                color="info"
                variant="soft"
              />
            ))
          }
        />

        <Autocomplete
          multiple
          disableCloseOnSelect
          options={[
            'SP',
            'RJ',
            'MG',
            'DF',
            'BA',
            'CE',
            'PR',
            'PE',
            'RS',
            'AM',
            'SC',
            'GO',
            'MA',
            'PB',
            'PA',
            'ES',
            'PI',
            'AL',
            'RN',
            'MT',
            'MS',
            'SE',
            'RO',
            'AC',
            'AP',
            'RR',
            'TO',
          ]}
          value={currentFilters.estado}
          onChange={(event, newValue) => handleFilterEstado(newValue)}
          renderInput={(params) => (
            <TextField
              {...params}
              placeholder={currentFilters.estado.length ? '+ Estados' : 'Selecionar estados'}
            />
          )}
          renderOption={(props, option) => (
            <li {...props} key={option}>
              {option}
            </li>
          )}
          renderTags={(selected, getTagProps) =>
            selected.map((option, index) => (
              <Chip
                {...getTagProps({ index })}
                key={option}
                label={option}
                size="small"
                color="info"
                variant="soft"
              />
            ))
          }
        />
      </Stack>
    </Box>
  );

  const renderDiferenciaisEdificio = () => (
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
      <Typography variant="subtitle2" sx={{ mb: 1 }}>
        Diferenciais do edifício
      </Typography>
      {options.diferenciaisEdificio.map((option) => (
        <FormControlLabel
          key={option}
          control={
            <Checkbox
              checked={currentFilters.diferenciaisEdificio.includes(option)}
              onClick={() => handleFilterDiferenciaisEdificio(option)}
            />
          }
          label={option}
        />
      ))}
    </Box>
  );

  const renderDiferenciaisApartamento = () => (
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
      <Typography variant="subtitle2" sx={{ mb: 1 }}>
        Diferenciais do apartamento
      </Typography>
      {options.diferenciaisApartamento.map((option) => (
        <FormControlLabel
          key={option}
          control={
            <Checkbox
              checked={currentFilters.diferenciaisApartamento.includes(option)}
              onClick={() => handleFilterDiferenciaisApartamento(option)}
            />
          }
          label={option}
        />
      ))}
    </Box>
  );

  const renderArea = () => (
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
      <Typography variant="subtitle2" sx={{ mb: 1.5 }}>
        Área
      </Typography>
      <Stack direction="row" spacing={1}>
        <TextField
          fullWidth
          label="Área mínima"
          placeholder="0 m²"
          type="number"
          value={currentFilters.areaMinima || ''}
          onChange={(e) => handleFilterArea('areaMinima', e.target.value)}
          InputProps={{
            endAdornment: (
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                m²
              </Typography>
            ),
          }}
        />
        <TextField
          fullWidth
          label="Área máxima"
          placeholder="400 m²"
          type="number"
          value={currentFilters.areaMaxima || ''}
          onChange={(e) => handleFilterArea('areaMaxima', e.target.value)}
          InputProps={{
            endAdornment: (
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                m²
              </Typography>
            ),
          }}
        />
      </Stack>
    </Box>
  );

  const renderFaixaPreco = () => (
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
      <Typography variant="subtitle2" sx={{ mb: 1.5 }}>
        Faixa de preço
      </Typography>
      <Stack direction="row" spacing={1}>
        <TextField
          fullWidth
          label="Preço Mínimo"
          placeholder="R$ 0"
          value={
            currentFilters.precoMinimo ? `R$ ${currentFilters.precoMinimo.toLocaleString()}` : ''
          }
          onChange={(e) => handleFilterPreco('precoMinimo', e.target.value)}
        />
        <TextField
          fullWidth
          label="Preço Máximo"
          placeholder="R$ 5.000.000"
          value={
            currentFilters.precoMaximo ? `R$ ${currentFilters.precoMaximo.toLocaleString()}` : ''
          }
          onChange={(e) => handleFilterPreco('precoMaximo', e.target.value)}
        />
      </Stack>
    </Box>
  );

  const renderStatusImovel = () => (
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
      <Typography variant="subtitle2" sx={{ mb: 1 }}>
        Status do imóvel
      </Typography>
      {options.status.map((option) => (
        <FormControlLabel
          key={option}
          control={
            <Checkbox
              checked={option === currentFilters.status}
              onClick={() => handleFilterStatus(option)}
            />
          }
          label={option}
          sx={{ ...(option === 'all' && { textTransform: 'capitalize' }) }}
        />
      ))}
    </Box>
  );

  const renderOportunidadesDisponiveis = () => (
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
      <Typography variant="subtitle2" sx={{ mb: 1 }}>
        Oportunidades disponíveis
      </Typography>
      {options.oportunidadesDisponiveis.map((option) => (
        <FormControlLabel
          key={option}
          control={
            <Checkbox
              checked={currentFilters.oportunidadesDisponiveis.includes(option)}
              onClick={() => handleFilterOportunidadesDisponiveis(option)}
            />
          }
          label={option}
        />
      ))}
    </Box>
  );

  const renderTipoApartamento = () => (
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
      <Typography variant="subtitle2" sx={{ mb: 1 }}>
        Tipo de apartamento
      </Typography>
      {options.tipoApartamento.map((option) => (
        <FormControlLabel
          key={option}
          control={
            <Checkbox
              checked={currentFilters.tipoApartamento.includes(option)}
              onClick={() => handleFilterTipoApartamento(option)}
            />
          }
          label={option}
        />
      ))}
    </Box>
  );

  const renderTipoSacada = () => (
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
      <Typography variant="subtitle2" sx={{ mb: 1 }}>
        Tipo de sacada (varanda)
      </Typography>
      {options.tipoSacada.map((option) => (
        <FormControlLabel
          key={option}
          control={
            <Checkbox
              checked={currentFilters.tipoSacada.includes(option)}
              onClick={() => handleFilterTipoSacada(option)}
            />
          }
          label={option}
        />
      ))}
    </Box>
  );

  const renderTipos = () => (
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
      <Typography variant="subtitle2" sx={{ mb: 1 }}>
        Tipo de empreendimento
      </Typography>
      {options.tipos.map((option) => (
        <FormControlLabel
          key={option}
          control={
            <Checkbox
              checked={currentFilters.tipos.includes(option)}
              onClick={() => handleFilterTipos(option)}
            />
          }
          label={option}
        />
      ))}
    </Box>
  );

  const renderCaracteristicas = () => (
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
      <Typography variant="subtitle2" sx={{ mb: 1 }}>
        Características
      </Typography>
      {options.caracteristicas.map((option) => (
        <FormControlLabel
          key={option}
          control={
            <Checkbox
              checked={currentFilters.caracteristicas.includes(option)}
              onClick={() => handleFilterCaracteristicas(option)}
            />
          }
          label={option}
        />
      ))}
    </Box>
  );

  const renderTiposUnidade = () => (
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
      <Typography variant="subtitle2" sx={{ mb: 1 }}>
        Tipos de unidade
      </Typography>
      {options.tiposUnidade.map((option) => (
        <FormControlLabel
          key={option}
          control={
            <Checkbox
              checked={currentFilters.tiposUnidade.includes(option)}
              onClick={() => handleFilterTiposUnidade(option)}
            />
          }
          label={option}
        />
      ))}
    </Box>
  );

  const renderBeneficios = () => (
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
      <Typography variant="subtitle2" sx={{ mb: 1 }}>
        Benefícios
      </Typography>
      {options.beneficios.map((option) => (
        <FormControlLabel
          key={option}
          control={
            <Checkbox
              checked={currentFilters.beneficios.includes(option)}
              onClick={() => handleFilterBeneficios(option)}
            />
          }
          label={option}
        />
      ))}
    </Box>
  );

  return (
    <>
      <Button
        disableRipple
        color={canReset ? 'primary' : 'inherit'}
        variant={canReset ? 'contained' : 'text'}
        endIcon={
          <Badge color="error" variant="dot" invisible={!canReset}>
            <Iconify icon="ic:round-filter-list" />
          </Badge>
        }
        onClick={onOpen}
        sx={{
          ...(canReset && {
            bgcolor: 'primary.main',
            color: 'primary.contrastText',
            '&:hover': {
              bgcolor: 'primary.dark',
            },
          }),
        }}
      >
        Filtros
        {canReset && (
          <Box
            component="span"
            sx={{
              ml: 1,
              px: 1,
              py: 0.25,
              bgcolor: 'rgba(255, 255, 255, 0.2)',
              borderRadius: 1,
              fontSize: '0.75rem',
              fontWeight: 600,
            }}
          >
            {getActiveFiltersCount()}
          </Box>
        )}
      </Button>

      <Drawer
        anchor="right"
        open={open}
        onClose={onClose}
        slotProps={{ backdrop: { invisible: true } }}
        PaperProps={{
          sx: {
            width: { xs: '100vw', sm: 320 },
            maxWidth: 320,
          },
        }}
      >
        {renderHead()}

        <Scrollbar sx={{ px: { xs: 2, sm: 2.5 }, py: { xs: 2, sm: 3 } }}>
          <Stack spacing={{ xs: 2.5, sm: 3 }}>
            {renderCidadeEstado()}
            {renderTipos()}
            {renderStatusImovel()}
            {renderFaixaPreco()}
            {renderArea()}
            {renderTiposUnidade()}
            {renderCaracteristicas()}
            {renderTipoApartamento()}
            {renderTipoSacada()}
            {renderBeneficios()}
            {renderOportunidadesDisponiveis()}
            {renderDiferenciaisEdificio()}
            {renderDiferenciaisApartamento()}
          </Stack>
        </Scrollbar>
      </Drawer>
    </>
  );
}
