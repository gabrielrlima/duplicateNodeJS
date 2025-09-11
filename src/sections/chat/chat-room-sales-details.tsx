import { useBoolean } from 'minimal-shared/hooks';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Collapse from '@mui/material/Collapse';
import ListItemText from '@mui/material/ListItemText';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';

import { CollapseButton } from './styles';

// ----------------------------------------------------------------------

type SalesDetail = {
  label: string;
  value: string;
  icon?: string;
  color?: 'default' | 'primary' | 'secondary' | 'info' | 'success' | 'warning' | 'error';
};

type Props = {
  salesDetails?: SalesDetail[];
};

export function ChatRoomSalesDetails({ salesDetails = [] }: Props) {
  const collapse = useBoolean(true);

  const defaultSalesDetails: SalesDetail[] = [
    {
      label: 'Imóvel',
      value: 'Residencial Jardim das Flores',
      icon: 'solar:buildings-bold',
      color: 'info',
    },
    {
      label: 'Valor do m²',
      value: 'R$ 8.500,00',
      icon: 'solar:home-bold',
      color: 'success',
    },
    {
      label: 'Minha comissão',
      value: '5,5%',
      icon: 'solar:dollar-minimalistic-bold',
      color: 'warning',
    },
    {
      label: 'Corretor Responsável',
      value: 'João Silva',
      icon: 'solar:user-bold',
      color: 'default',
    },
  ];

  const detailsToShow = salesDetails.length > 0 ? salesDetails : defaultSalesDetails;

  const renderList = () =>
    detailsToShow.map((detail, index) => (
      <Box key={index} sx={{ gap: 1.5, display: 'flex', alignItems: 'center' }}>
        {detail.icon && (
          <Box
            sx={{
              width: 40,
              height: 40,
              display: 'flex',
              borderRadius: 1,
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: 'background.neutral',
            }}
          >
            <Iconify icon={detail.icon} width={24} />
          </Box>
        )}

        <Box sx={{ flexGrow: 1 }}>
          <ListItemText
            primary={detail.label}
            secondary={
              <Label variant="soft" color={detail.color || 'default'}>
                {detail.value}
              </Label>
            }
            slotProps={{
              primary: {
                noWrap: true,
                sx: { typography: 'body2', fontWeight: 'fontWeightMedium' },
              },
              secondary: {
                sx: { mt: 0.5 },
              },
            }}
          />
        </Box>
      </Box>
    ));

  return (
    <>
      <CollapseButton
        selected={collapse.value}
        disabled={!detailsToShow.length}
        onClick={collapse.onToggle}
      >
        {`Detalhes da Venda (${detailsToShow.length})`}
      </CollapseButton>

      {!!detailsToShow.length && (
        <Collapse in={collapse.value}>
          <Stack spacing={2} sx={{ p: 2 }}>
            {renderList()}
          </Stack>
        </Collapse>
      )}
    </>
  );
}
