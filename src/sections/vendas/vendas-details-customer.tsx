import type { IVendas } from 'src/types/vendas';

import { useState } from 'react';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Divider from '@mui/material/Divider';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';

// ----------------------------------------------------------------------

type Props = {
  customer: IVendas['invoiceTo'];
  onDesistir?: () => void;
  hideDesistirButton?: boolean;
  status?: string;
};

export function VendasDetailsCustomer({
  customer,
  onDesistir,
  hideDesistirButton = false,
  status,
}: Props) {
  const [openModal, setOpenModal] = useState(false);

  const handleDesistir = () => {
    setOpenModal(true);
  };

  const handleConfirmDesistir = () => {
    setOpenModal(false);
    onDesistir?.();
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };
  if (!customer) {
    return (
      <Card>
        <CardHeader title="Detalhes do cliente" />
        <Box sx={{ p: 3 }}>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Dados do cliente não disponíveis
          </Typography>
        </Box>
      </Card>
    );
  }

  const renderCustomer = (
    <>
      <CardHeader
        title="Detalhes do cliente"
        action={
          !hideDesistirButton && (
            <Button
              size="small"
              color="error"
              onClick={handleDesistir}
              sx={{ textTransform: 'capitalize' }}
            >
              Desistiu
            </Button>
          )
        }
      />
      <Box
        sx={{
          gap: 2,
          display: 'flex',
          pt: 3,
          pb: 2.5,
          px: 3,
          alignItems: 'center',
        }}
      >
        <Avatar alt={customer.name} sx={{ width: 48, height: 48 }}>
          {customer.name.charAt(0).toUpperCase()}
        </Avatar>

        <div>
          <Typography variant="subtitle2">{customer.name}</Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            <Link color="inherit">{customer.email}</Link>
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Telefone: {customer.phone}
          </Typography>
        </div>
      </Box>
    </>
  );

  return (
    <>
      <Card>
        {renderCustomer}
        <Divider sx={{ borderStyle: 'dashed' }} />
      </Card>

      <Dialog open={openModal} onClose={handleCloseModal} maxWidth="sm" fullWidth>
        <DialogTitle>Confirmar Desistência</DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Tem certeza que deseja marcar este atendimento como desistente?
          </Typography>
          <Typography variant="body2" color="text.secondary">
            <strong>Atenção:</strong> Esta ação não poderá ser desfeita. O atendimento passará para
            o status &quot;Cancelado&quot; e não será mais possível alterar o status.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal} color="inherit">
            Cancelar
          </Button>
          <Button onClick={handleConfirmDesistir} color="error" variant="contained">
            Confirmar Desistência
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
