import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { TerrenoWizardForm } from '../terreno-wizard-form';

// ----------------------------------------------------------------------

export function TerrenoCreateView() {
  console.log('🏠🏠🏠 TerrenoCreateView component loaded - CREATE VIEW ATIVO 🏠🏠🏠');
  
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Novo terreno"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Terrenos', href: paths.dashboard.terrenos.root },
          { name: 'Novo terreno' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <TerrenoWizardForm />
    </DashboardContent>
  );
}
