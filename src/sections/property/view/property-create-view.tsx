import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { PropertySingleForm } from '../property-single-form';

// ----------------------------------------------------------------------

export function PropertyCreateView() {
  console.log('🏠🏠🏠 PropertyCreateView component loaded - SINGLE FORM ATIVO 🏠🏠🏠');
  
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Novo produto"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Produtos', href: paths.dashboard.property.root },
          { name: 'Novo produto' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <PropertySingleForm />
    </DashboardContent>
  );
}