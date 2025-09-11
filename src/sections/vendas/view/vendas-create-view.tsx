import { useState } from 'react';

import Dialog from '@mui/material/Dialog';
import { useTheme } from '@mui/material/styles';
import DialogTitle from '@mui/material/DialogTitle';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { DashboardContent } from 'src/layouts/dashboard';
import { CALENDAR_COLOR_OPTIONS } from 'src/_mock/_calendar';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { CalendarForm } from '../../calendar/calendar-form';
import { VendasNewEditForm } from '../vendas-new-edit-form';

// ----------------------------------------------------------------------

export function VendasCreateView() {
  const theme = useTheme();
  const router = useRouter();
  // Removendo variáveis não utilizadas para corrigir avisos do ESLint
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [openCalendarModal, setOpenCalendarModal] = useState(false);

  const handleCloseCalendarModal = () => {
    setOpenCalendarModal(false);
  };

  const handleCreateNewAtendimento = () => {
    // Gera um ID único para o novo atendimento
    const newOrderId = `order-${Date.now()}`;
    // Redireciona para a página de detalhes da venda
    router.push(paths.dashboard.vendas.details(newOrderId));
  };

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Novo atendimento"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Vendas', href: paths.dashboard.vendas.root },
          { name: 'Novo atendimento' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <VendasNewEditForm
        onValidationChange={() => {}}
        onSubmittingChange={setIsSubmitting}
        onCreateAtendimento={handleCreateNewAtendimento}
        isCreatingAtendimento={isSubmitting}
      />

      <Dialog
        fullWidth
        maxWidth="xs"
        open={openCalendarModal}
        onClose={handleCloseCalendarModal}
        transitionDuration={{
          enter: theme.transitions.duration.shortest,
          exit: theme.transitions.duration.shortest - 80,
        }}
        PaperProps={{
          sx: {
            display: 'flex',
            overflow: 'hidden',
            flexDirection: 'column',
            '& form': {
              flex: '1 1 auto',
              display: 'flex',
              flexDirection: 'column',
              minHeight: 0,
            },
          },
        }}
      >
        <DialogTitle sx={{ minHeight: 76 }}>Criar novo atendimento</DialogTitle>

        <CalendarForm
          colorOptions={CALENDAR_COLOR_OPTIONS}
          onClose={handleCloseCalendarModal}
          redirectToOrder
        />
      </Dialog>
    </DashboardContent>
  );
}
