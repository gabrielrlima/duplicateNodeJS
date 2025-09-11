import type { IComissaoItem } from 'src/types/comissao';

import { useBoolean } from 'minimal-shared/hooks';

import Button from '@mui/material/Button';

import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { ComissaoNewEditForm } from '../comissao-new-edit-form';

// ----------------------------------------------------------------------

type Props = {
  comissao?: IComissaoItem;
};

export function ComissoesEditView({ comissao }: Props) {
  const confirmDialog = useBoolean();

  const handleDelete = () => {
    // Aqui você pode implementar a lógica de exclusão
    console.log('Excluindo regra de comissão:', comissao?.id);
    confirmDialog.onFalse();
  };

  const renderConfirmDialog = () => (
    <ConfirmDialog
      open={confirmDialog.value}
      onClose={confirmDialog.onFalse}
      title="Excluir regra de comissão"
      content="Tem certeza que deseja excluir esta regra de comissão? Esta ação não pode ser desfeita."
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
          links={[
            { name: 'Dashboard', href: paths.dashboard.root },
            { name: 'Regras de Comissões', href: paths.dashboard.comissoes.root },
            { name: comissao?.nome },
          ]}
          action={
            <Button
              color="error"
              variant="contained"
              startIcon={<Iconify icon="solar:trash-bin-trash-bold" />}
              onClick={confirmDialog.onTrue}
            >
              Excluir
            </Button>
          }
          sx={{ mb: { xs: 3, md: 5 } }}
        />

        <ComissaoNewEditForm currentComissao={comissao} />
      </DashboardContent>

      {renderConfirmDialog()}
    </>
  );
}
