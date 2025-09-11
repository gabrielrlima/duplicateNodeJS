import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { LeadNewEditForm } from '../lead-new-edit-form';

// ----------------------------------------------------------------------

export function LeadCreateView() {
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Adicionar novo lead"
        links={[
          { name: 'Painel', href: paths.dashboard.root },
          { name: 'Leads', href: paths.dashboard.lead.list },
          { name: 'Novo lead' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <LeadNewEditForm />
    </DashboardContent>
  );
}
