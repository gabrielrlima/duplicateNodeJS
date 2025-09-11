import type { IGrupo } from 'src/types/grupo';

import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { GrupoNewEditForm } from '../grupo-new-edit-form';

// ----------------------------------------------------------------------

type Props = {
  grupo?: IGrupo;
};

export function GrupoEditView({ grupo: currentGrupo }: Props) {
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Editar Grupo"
        backHref={
          currentGrupo?.id
            ? paths.dashboard.grupos.details(currentGrupo.id)
            : paths.dashboard.grupos.list
        }
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Grupos', href: paths.dashboard.grupos.root },
          { name: currentGrupo?.name },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <GrupoNewEditForm currentGrupo={currentGrupo} />
    </DashboardContent>
  );
}
