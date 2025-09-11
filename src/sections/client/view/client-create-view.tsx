import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { ClientNewEditForm } from '../client-new-edit-form';

// ----------------------------------------------------------------------

export function ClientCreateView() {
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Criar novo cliente"
        links={[
          { name: 'Painel', href: paths.dashboard.root },
          { name: 'Clientes', href: paths.dashboard.user.root },
          { name: 'Novo cliente' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <ClientNewEditForm />
    </DashboardContent>
  );
}
