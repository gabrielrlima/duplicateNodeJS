import type { UseSetStateReturn } from 'minimal-shared/hooks';
import type { IEmpreendimentoFilters } from 'src/types/empreendimento';
import type { FiltersResultProps } from 'src/components/filters-result';

import { useCallback } from 'react';

import Chip from '@mui/material/Chip';

import { chipProps, FiltersBlock, FiltersResult } from 'src/components/filters-result';

// ----------------------------------------------------------------------

type Props = FiltersResultProps & {
  filters: UseSetStateReturn<IEmpreendimentoFilters>;
};

export function EmpreendimentoFiltersResult({ filters, totalResults, sx }: Props) {
  const { state: currentFilters, setState: updateFilters, resetState: resetFilters } = filters;

  const handleRemoveTipos = useCallback(
    (inputValue: string) => {
      const newValue = currentFilters.tipos.filter((item) => item !== inputValue);
      updateFilters({ tipos: newValue });
    },
    [updateFilters, currentFilters.tipos]
  );

  const handleRemoveStatus = useCallback(() => {
    updateFilters({ status: 'all' });
  }, [updateFilters]);

  const handleRemoveCaracteristicas = useCallback(
    (inputValue: string) => {
      const newValue = currentFilters.caracteristicas.filter((item) => item !== inputValue);
      updateFilters({ caracteristicas: newValue });
    },
    [updateFilters, currentFilters.caracteristicas]
  );

  const handleRemoveCidade = useCallback(
    (inputValue: string) => {
      const newValue = currentFilters.cidade.filter((item) => item !== inputValue);
      updateFilters({ cidade: newValue });
    },
    [updateFilters, currentFilters.cidade]
  );

  const handleRemoveEstado = useCallback(
    (inputValue: string) => {
      const newValue = currentFilters.estado.filter((item) => item !== inputValue);
      updateFilters({ estado: newValue });
    },
    [updateFilters, currentFilters.estado]
  );

  const handleRemoveFaixaPreco = useCallback(
    (inputValue: string) => {
      const newValue = currentFilters.faixaPreco.filter((item) => item !== inputValue);
      updateFilters({ faixaPreco: newValue });
    },
    [updateFilters, currentFilters.faixaPreco]
  );

  const handleRemoveDiferenciaisEdificio = useCallback(
    (inputValue: string) => {
      const newValue = currentFilters.diferenciaisEdificio.filter((item) => item !== inputValue);
      updateFilters({ diferenciaisEdificio: newValue });
    },
    [updateFilters, currentFilters.diferenciaisEdificio]
  );

  const handleRemoveDiferenciaisApartamento = useCallback(
    (inputValue: string) => {
      const newValue = currentFilters.diferenciaisApartamento.filter((item) => item !== inputValue);
      updateFilters({ diferenciaisApartamento: newValue });
    },
    [updateFilters, currentFilters.diferenciaisApartamento]
  );

  const handleRemoveTipoApartamento = useCallback(
    (inputValue: string) => {
      const newValue = currentFilters.tipoApartamento.filter((item) => item !== inputValue);
      updateFilters({ tipoApartamento: newValue });
    },
    [updateFilters, currentFilters.tipoApartamento]
  );

  const handleRemoveTipoSacada = useCallback(
    (inputValue: string) => {
      const newValue = currentFilters.tipoSacada.filter((item) => item !== inputValue);
      updateFilters({ tipoSacada: newValue });
    },
    [updateFilters, currentFilters.tipoSacada]
  );

  const handleRemoveOportunidadesDisponiveis = useCallback(
    (inputValue: string) => {
      const newValue = currentFilters.oportunidadesDisponiveis.filter(
        (item) => item !== inputValue
      );
      updateFilters({ oportunidadesDisponiveis: newValue });
    },
    [updateFilters, currentFilters.oportunidadesDisponiveis]
  );

  const handleRemoveArea = useCallback(
    (field: 'areaMinima' | 'areaMaxima') => {
      updateFilters({ [field]: null });
    },
    [updateFilters]
  );

  const handleRemovePreco = useCallback(
    (field: 'precoMinimo' | 'precoMaximo') => {
      updateFilters({ [field]: null });
    },
    [updateFilters]
  );

  return (
    <FiltersResult totalResults={totalResults} onReset={() => resetFilters()} sx={sx}>
      <FiltersBlock label="Tipos:" isShow={!!currentFilters.tipos.length}>
        {currentFilters.tipos.map((item) => (
          <Chip {...chipProps} key={item} label={item} onDelete={() => handleRemoveTipos(item)} />
        ))}
      </FiltersBlock>

      <FiltersBlock label="Status:" isShow={currentFilters.status !== 'all'}>
        <Chip {...chipProps} label={currentFilters.status} onDelete={handleRemoveStatus} />
      </FiltersBlock>

      <FiltersBlock label="Características:" isShow={!!currentFilters.caracteristicas.length}>
        {currentFilters.caracteristicas.map((item) => (
          <Chip
            {...chipProps}
            key={item}
            label={item}
            onDelete={() => handleRemoveCaracteristicas(item)}
          />
        ))}
      </FiltersBlock>

      <FiltersBlock label="Cidades:" isShow={!!currentFilters.cidade.length}>
        {currentFilters.cidade.map((item) => (
          <Chip {...chipProps} key={item} label={item} onDelete={() => handleRemoveCidade(item)} />
        ))}
      </FiltersBlock>

      <FiltersBlock label="Estados:" isShow={!!currentFilters.estado.length}>
        {currentFilters.estado.map((item) => (
          <Chip {...chipProps} key={item} label={item} onDelete={() => handleRemoveEstado(item)} />
        ))}
      </FiltersBlock>

      <FiltersBlock label="Faixa de preço:" isShow={!!currentFilters.faixaPreco.length}>
        {currentFilters.faixaPreco.map((item) => (
          <Chip
            {...chipProps}
            key={item}
            label={item}
            onDelete={() => handleRemoveFaixaPreco(item)}
          />
        ))}
      </FiltersBlock>

      <FiltersBlock
        label="Diferenciais do edifício:"
        isShow={!!currentFilters.diferenciaisEdificio.length}
      >
        {currentFilters.diferenciaisEdificio.map((item) => (
          <Chip
            {...chipProps}
            key={item}
            label={item}
            onDelete={() => handleRemoveDiferenciaisEdificio(item)}
          />
        ))}
      </FiltersBlock>

      <FiltersBlock
        label="Diferenciais do apartamento:"
        isShow={!!currentFilters.diferenciaisApartamento.length}
      >
        {currentFilters.diferenciaisApartamento.map((item) => (
          <Chip
            {...chipProps}
            key={item}
            label={item}
            onDelete={() => handleRemoveDiferenciaisApartamento(item)}
          />
        ))}
      </FiltersBlock>

      <FiltersBlock label="Tipo de apartamento:" isShow={!!currentFilters.tipoApartamento.length}>
        {currentFilters.tipoApartamento.map((item) => (
          <Chip
            {...chipProps}
            key={item}
            label={item}
            onDelete={() => handleRemoveTipoApartamento(item)}
          />
        ))}
      </FiltersBlock>

      <FiltersBlock label="Tipo de sacada:" isShow={!!currentFilters.tipoSacada.length}>
        {currentFilters.tipoSacada.map((item) => (
          <Chip
            {...chipProps}
            key={item}
            label={item}
            onDelete={() => handleRemoveTipoSacada(item)}
          />
        ))}
      </FiltersBlock>

      <FiltersBlock
        label="Oportunidades disponíveis:"
        isShow={!!currentFilters.oportunidadesDisponiveis.length}
      >
        {currentFilters.oportunidadesDisponiveis.map((item) => (
          <Chip
            {...chipProps}
            key={item}
            label={item}
            onDelete={() => handleRemoveOportunidadesDisponiveis(item)}
          />
        ))}
      </FiltersBlock>

      <FiltersBlock
        label="Área:"
        isShow={currentFilters.areaMinima !== null || currentFilters.areaMaxima !== null}
      >
        {currentFilters.areaMinima !== null && (
          <Chip
            {...chipProps}
            label={`Área mín: ${currentFilters.areaMinima}m²`}
            onDelete={() => handleRemoveArea('areaMinima')}
          />
        )}
        {currentFilters.areaMaxima !== null && (
          <Chip
            {...chipProps}
            label={`Área máx: ${currentFilters.areaMaxima}m²`}
            onDelete={() => handleRemoveArea('areaMaxima')}
          />
        )}
      </FiltersBlock>

      <FiltersBlock
        label="Preço:"
        isShow={currentFilters.precoMinimo !== null || currentFilters.precoMaximo !== null}
      >
        {currentFilters.precoMinimo !== null && (
          <Chip
            {...chipProps}
            label={`Preço mín: R$ ${currentFilters.precoMinimo.toLocaleString()}`}
            onDelete={() => handleRemovePreco('precoMinimo')}
          />
        )}
        {currentFilters.precoMaximo !== null && (
          <Chip
            {...chipProps}
            label={`Preço máx: R$ ${currentFilters.precoMaximo.toLocaleString()}`}
            onDelete={() => handleRemovePreco('precoMaximo')}
          />
        )}
      </FiltersBlock>
    </FiltersResult>
  );
}
