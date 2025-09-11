import type { IDatePickerControl } from 'src/types/common';
import type { UseSetStateReturn } from 'minimal-shared/hooks';
import type { IRecebimentosTableFilters } from 'src/types/recebimentos';

import { useCallback } from 'react';
import { usePopover } from 'minimal-shared/hooks';

import Box from '@mui/material/Box';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { formHelperTextClasses } from '@mui/material/FormHelperText';

import { Iconify } from 'src/components/iconify';
import { CustomPopover } from 'src/components/custom-popover';

// ----------------------------------------------------------------------

type Props = {
  dateError: boolean;
  onResetPage: () => void;
  filters: UseSetStateReturn<IRecebimentosTableFilters>;
};

export function RecebimentosTableToolbar({ filters, onResetPage, dateError }: Props) {
  const menuActions = usePopover();

  const { state: currentFilters, setState: updateFilters } = filters;

  const handleFilterName = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      onResetPage();
      updateFilters({ name: event.target.value });
    },
    [onResetPage, updateFilters]
  );

  const handleFilterStartDate = useCallback(
    (newValue: IDatePickerControl) => {
      onResetPage();
      updateFilters({ startDate: newValue });
    },
    [onResetPage, updateFilters]
  );

  const handleFilterEndDate = useCallback(
    (newValue: IDatePickerControl) => {
      onResetPage();
      updateFilters({ endDate: newValue });
    },
    [onResetPage, updateFilters]
  );

  return (
    <>
      <Box
        sx={[
          (theme) => ({
            p: 2.5,
            pr: { xs: 2.5, md: 1 },
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            alignItems: { xs: 'flex-end', md: 'center' },
            columnGap: 2,
            rowGap: 1.5,
          }),
        ]}
      >
        <Box
          sx={[
            {
              display: 'flex',
              alignItems: 'center',
              columnGap: 2,
              rowGap: 1.5,
              flexDirection: { xs: 'column', sm: 'row' },
              width: { xs: 1, md: 1 },
            },
          ]}
        >
          <TextField
            fullWidth
            value={currentFilters.name}
            onChange={handleFilterName}
            placeholder="Buscar cliente ou número do recebimento..."
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
                </InputAdornment>
              ),
            }}
          />

          <DatePicker
            label="Data inicial"
            value={currentFilters.startDate}
            onChange={handleFilterStartDate}
            slotProps={{
              textField: {
                fullWidth: true,
              },
            }}
            sx={{ minWidth: { md: 180 } }}
          />

          <DatePicker
            label="Data final"
            value={currentFilters.endDate}
            onChange={handleFilterEndDate}
            slotProps={{
              textField: {
                fullWidth: true,
                error: dateError,
                helperText: dateError && 'A data final deve ser posterior à data inicial',
              },
            }}
            sx={[
              {
                minWidth: { md: 180 },
                [`& .${formHelperTextClasses.root}`]: {
                  position: { md: 'absolute' },
                  bottom: { md: -40 },
                },
              },
            ]}
          />
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
          <IconButton onClick={menuActions.onOpen}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </Box>
      </Box>

      <CustomPopover
        open={menuActions.open}
        anchorEl={menuActions.anchorEl}
        onClose={menuActions.onClose}
        slotProps={{ arrow: { placement: 'right-top' } }}
      >
        <MenuList>
          <MenuItem
            onClick={() => {
              menuActions.onClose();
            }}
          >
            <Iconify icon="solar:printer-minimalistic-bold" />
            Imprimir
          </MenuItem>

          <MenuItem
            onClick={() => {
              menuActions.onClose();
            }}
          >
            <Iconify icon="solar:import-bold" />
            Importar
          </MenuItem>

          <MenuItem
            onClick={() => {
              menuActions.onClose();
            }}
          >
            <Iconify icon="solar:export-bold" />
            Exportar
          </MenuItem>
        </MenuList>
      </CustomPopover>
    </>
  );
}
