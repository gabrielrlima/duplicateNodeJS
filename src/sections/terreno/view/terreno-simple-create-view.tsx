import { paths } from 'src/routes/paths';
import { DashboardContent } from 'src/layouts/dashboard';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { TerrenoSimpleForm } from '../terreno-simple-form';

// ----------------------------------------------------------------------

export function TerrenoSimpleCreateView() {
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Criar Terreno - Formulário Simples"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Terrenos', href: paths.dashboard.terrenos.root },
          { name: 'Criar Terreno Simples' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <TerrenoSimpleForm />
    </DashboardContent>
  );
}