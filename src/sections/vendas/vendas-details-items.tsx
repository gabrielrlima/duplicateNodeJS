import type { CardProps } from '@mui/material/Card';
import type { IVendas, IVendasFormData } from 'src/types/vendas';

// import Box from '@mui/material/Box';
import Card from '@mui/material/Card';

// import { fCurrency } from 'src/utils/format-number';

// ----------------------------------------------------------------------

type Props = CardProps & {
  taxes?: number;
  shipping?: number;
  discount?: number;
  subtotal?: number;
  totalAmount?: number;
  items?: IVendas['items'];
  status?: string;
  formData?: IVendasFormData;
};

export function VendasDetailsItems({
  sx,
  taxes,
  shipping,
  discount,
  subtotal,
  items = [],
  totalAmount,
  status,
  formData,
  ...other
}: Props) {
  // const renderTotal = () => (
  //   <Box
  //     sx={{
  //       p: 3,
  //       gap: 2,
  //       display: 'flex',
  //       textAlign: 'right',
  //       typography: 'body2',
  //       alignItems: 'flex-end',
  //       flexDirection: 'column',
  //     }}
  //   >
  //     <Box sx={{ display: 'flex' }}>
  //       <Box sx={{ color: 'text.secondary' }}>Subtotal</Box>
  //       <Box sx={{ width: 160, typography: 'subtitle2' }}>{fCurrency(subtotal) || '-'}</Box>
  //     </Box>

  //     <Box sx={{ display: 'flex' }}>
  //       <Box sx={{ color: 'text.secondary' }}>Entrega</Box>
  //       <Box sx={{ width: 160, ...(shipping && { color: 'error.main' }) }}>
  //         {shipping ? `- ${fCurrency(shipping)}` : '-'}
  //       </Box>
  //     </Box>

  //     <Box sx={{ display: 'flex' }}>
  //       <Box sx={{ color: 'text.secondary' }}>Desconto</Box>
  //       <Box sx={{ width: 160, ...(discount && { color: 'error.main' }) }}>
  //         {discount ? `- ${fCurrency(discount)}` : '-'}
  //       </Box>
  //     </Box>

  //     <Box sx={{ display: 'flex' }}>
  //       <Box sx={{ color: 'text.secondary' }}>Impostos</Box>
  //       <Box sx={{ width: 160 }}>{taxes ? fCurrency(taxes) : '-'}</Box>
  //     </Box>

  //     <Box sx={{ display: 'flex', typography: 'subtitle1' }}>
  //       <div>Total</div>
  //       <Box sx={{ width: 160 }}>{fCurrency(totalAmount) || '-'}</Box>
  //     </Box>
  //   </Box>
  // );

  return <Card sx={sx} {...other} />;
}
