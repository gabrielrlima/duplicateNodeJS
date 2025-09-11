import type { IEmpreendimentoItem } from 'src/types/empreendimento';

import { useBoolean } from 'minimal-shared/hooks';

import Button from '@mui/material/Button';

import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { EmpreendimentoNewEditForm } from '../empreendimento-new-edit-form';

// ----------------------------------------------------------------------

type Props = {
  empreendimento?: IEmpreendimentoItem;
};

export function EmpreendimentoEditView({ empreendimento }: Props) {
  const confirmDialog = useBoolean();

  const handleDelete = () => {
    // Aqui você pode implementar a lógica de exclusão
    console.log('Excluindo empreendimento:', empreendimento?.id);
    confirmDialog.onFalse();
  };

  const renderConfirmDialog = () => (
    <ConfirmDialog
      open={confirmDialog.value}
      onClose={confirmDialog.onFalse}
      title="Excluir empreendimento"
      content="Tem certeza que deseja excluir este empreendimento? Esta ação não pode ser desfeita."
      action={
        <Button variant="contained" color="error" onClick={handleDelete}>
          Excluir
        </Button>
      }
    />
  );

  return (
    <>
      <DashboardContent>
        <CustomBreadcrumbs
          heading="Editar"
          backHref={paths.dashboard.empreendimentos.root}
          links={[
            { name: 'Dashboard', href: paths.dashboard.root },
            { name: 'Empreendimentos', href: paths.dashboard.empreendimentos.root },
            { name: empreendimento?.nome },
          ]}
          action={
            <Button
              variant="outlined"
              color="error"
              startIcon={<Iconify icon="solar:trash-bin-trash-bold" />}
              onClick={confirmDialog.onTrue}
            >
              Excluir
            </Button>
          }
          sx={{ mb: { xs: 3, md: 5 } }}
        />

        <EmpreendimentoNewEditForm currentEmpreendimento={empreendimento} />
      </DashboardContent>

      {renderConfirmDialog()}
    </>
  );
}
