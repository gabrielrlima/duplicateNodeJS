import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { PropertyWizardForm } from '../property-wizard-form';

// ----------------------------------------------------------------------

export function PropertyCreateView() {
  console.log('🏠🏠🏠 PropertyCreateView component loaded - CREATE VIEW ATIVO 🏠🏠🏠');
  
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Novo imóvel"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Imóveis', href: paths.dashboard.property.root },
          { name: 'Novo imóvel' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <PropertyWizardForm />
    </DashboardContent>
  );
}