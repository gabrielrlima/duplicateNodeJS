import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { GrupoNewEditForm } from '../grupo-new-edit-form';

// ----------------------------------------------------------------------

export function GrupoCreateView() {
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Criar Novo Grupo"
        backHref={paths.dashboard.grupos.list}
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Grupos', href: paths.dashboard.grupos.root },
          { name: 'Novo Grupo' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <GrupoNewEditForm />
    </DashboardContent>
  );
}
