import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { PropertySimpleForm } from '../property-simple-form';

// ----------------------------------------------------------------------

export function PropertySimpleCreateView() {
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Criar Produto - Formulário Simples"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Produtos', href: paths.dashboard.property.root },
          { name: 'Criar Produto Simples' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <PropertySimpleForm />
    </DashboardContent>
  );
}