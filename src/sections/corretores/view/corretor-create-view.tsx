import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { CorretorNewEditForm } from '../corretor-new-edit-form';

// ----------------------------------------------------------------------

export function CorretorCreateView() {
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Criar novo corretor"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Corretores', href: paths.dashboard.corretores.root },
          { name: 'Novo corretor' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <CorretorNewEditForm />
    </DashboardContent>
  );
}
