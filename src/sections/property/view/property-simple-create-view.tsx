import { paths } from 'src/routes/paths';
import { DashboardContent } from 'src/layouts/dashboard';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { PropertySimpleForm } from '../property-simple-form';

// ----------------------------------------------------------------------

export function PropertySimpleCreateView() {
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Criar Imóvel - Formulário Simples"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Imóveis', href: paths.dashboard.property.root },
          { name: 'Criar Imóvel Simples' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <PropertySimpleForm />
    </DashboardContent>
  );
}