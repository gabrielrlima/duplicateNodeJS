import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { EmpreendimentoNewEditForm } from '../empreendimento-new-edit-form';

// ----------------------------------------------------------------------

export function EmpreendimentoCreateView() {
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Criar novo empreendimento"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Empreendimentos', href: paths.dashboard.empreendimentos.root },
          { name: 'Novo empreendimento' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <EmpreendimentoNewEditForm />
    </DashboardContent>
  );
}
