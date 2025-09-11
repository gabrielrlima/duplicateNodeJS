import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import PropertyStepperRedesigned from '../property-stepper-redesigned';

// ----------------------------------------------------------------------

export function PropertyCreateRedesignedView() {
  return (
    <DashboardContent maxWidth="xl">
      <CustomBreadcrumbs
        heading="Cadastro Inteligente de Imóvel"
        links={[
          { name: 'Painel', href: paths.dashboard.root },
          { name: 'Imóveis', href: paths.dashboard.property.root },
          { name: 'Nova Arquitetura de Cadastro' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <PropertyStepperRedesigned />
    </DashboardContent>
  );
}
