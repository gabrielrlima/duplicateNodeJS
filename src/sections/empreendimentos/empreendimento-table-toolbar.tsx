import type { SelectChangeEvent } from '@mui/material/Select';
import type { UseSetStateReturn } from 'minimal-shared/hooks';
import type { IEmpreendimentoTableFilters } from 'src/types/empreendimento';

import { useState, useCallback } from 'react';
import { varAlpha } from 'minimal-shared/utils';
import { usePopover } from 'minimal-shared/hooks';

import Select from '@mui/material/Select';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import Checkbox from '@mui/material/Checkbox';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import OutlinedInput from '@mui/material/OutlinedInput';

import { Iconify } from 'src/components/iconify';
import { CustomPopover } from 'src/components/custom-popover';

// ----------------------------------------------------------------------

type Props = {
  filters: UseSetStateReturn<IEmpreendimentoTableFilters>;
  options: {
    tipos: { value: string; label: string }[];
    status: { value: string; label: string }[];
  };
};

export function EmpreendimentoTableToolbar({ filters, options }: Props) {
  const menuActions = usePopover();

  const { state: currentFilters, setState: updateFilters } = filters;

  const [tipos, setTipos] = useState(currentFilters.tipos);
  const [status, setStatus] = useState(currentFilters.status);

  const handleChangeTipos = useCallback((event: SelectChangeEvent<string[]>) => {
    const {
      target: { value },
    } = event;

    setTipos(typeof value === 'string' ? value.split(',') : value);
  }, []);

  const handleChangeStatus = useCallback((event: SelectChangeEvent<string[]>) => {
    const {
      target: { value },
    } = event;

    setStatus(typeof value === 'string' ? value.split(',') : value);
  }, []);

  const handleFilterTipos = useCallback(() => {
    updateFilters({ tipos });
  }, [updateFilters, tipos]);

  const handleFilterStatus = useCallback(() => {
    updateFilters({ status });
  }, [status, updateFilters]);

  const renderMenuActions = () => (
    <CustomPopover
      open={menuActions.open}
      anchorEl={menuActions.anchorEl}
      onClose={menuActions.onClose}
      slotProps={{ arrow: { placement: 'right-top' } }}
    >
      <MenuList>
        <MenuItem onClick={() => menuActions.onClose()}>
          <Iconify icon="solar:printer-minimalistic-bold" />
          Imprimir
        </MenuItem>

        <MenuItem onClick={() => menuActions.onClose()}>
          <Iconify icon="solar:import-bold" />
          Importar
        </MenuItem>

        <MenuItem onClick={() => menuActions.onClose()}>
          <Iconify icon="solar:export-bold" />
          Exportar
        </MenuItem>
      </MenuList>
    </CustomPopover>
  );

  return (
    <>
      <FormControl sx={{ flexShrink: 0, width: { xs: 1, md: 200 } }}>
        <InputLabel htmlFor="filter-tipos-select">Tipo</InputLabel>

        <Select
          multiple
          value={tipos}
          onChange={handleChangeTipos}
          onClose={handleFilterTipos}
          input={<OutlinedInput label="Tipo" />}
          renderValue={(selected) => selected.map((value) => value).join(', ')}
          inputProps={{ id: 'filter-tipos-select' }}
          sx={{ textTransform: 'capitalize' }}
        >
          {options.tipos.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              <Checkbox disableRipple size="small" checked={tipos.includes(option.value)} />
              {option.label}
            </MenuItem>
          ))}
          <MenuItem
            onClick={handleFilterTipos}
            sx={[
              (theme) => ({
                justifyContent: 'center',
                fontWeight: theme.typography.button,
                bgcolor: varAlpha(theme.vars.palette.grey['500Channel'], 0.08),
                border: `solid 1px ${varAlpha(theme.vars.palette.grey['500Channel'], 0.16)}`,
              }),
            ]}
          >
            Aplicar
          </MenuItem>
        </Select>
      </FormControl>

      <FormControl sx={{ flexShrink: 0, width: { xs: 1, md: 200 } }}>
        <InputLabel htmlFor="filter-status-select">Status</InputLabel>
        <Select
          multiple
          value={status}
          onChange={handleChangeStatus}
          onClose={handleFilterStatus}
          input={<OutlinedInput label="Status" />}
          renderValue={(selected) => selected.map((value) => value).join(', ')}
          inputProps={{ id: 'filter-status-select' }}
          sx={{ textTransform: 'capitalize' }}
        >
          {options.status.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              <Checkbox disableRipple size="small" checked={status.includes(option.value)} />
              {option.label}
            </MenuItem>
          ))}

          <MenuItem
            disableGutters
            disableTouchRipple
            onClick={handleFilterStatus}
            sx={[
              (theme) => ({
                justifyContent: 'center',
                fontWeight: theme.typography.button,
                bgcolor: varAlpha(theme.vars.palette.grey['500Channel'], 0.08),
                border: `solid 1px ${varAlpha(theme.vars.palette.grey['500Channel'], 0.16)}`,
              }),
            ]}
          >
            Aplicar
          </MenuItem>
        </Select>
      </FormControl>

      {renderMenuActions()}
    </>
  );
}
