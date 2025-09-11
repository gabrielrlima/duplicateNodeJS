
import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { RealEstateNewEditForm } from '../real-estate-new-edit-form';

// ----------------------------------------------------------------------

export function RealEstateCreateView() {
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Nova Imobiliária"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Minhas Imobiliárias', href: paths.dashboard.realEstate.list },
          { name: 'Nova Imobiliária' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <RealEstateNewEditForm />
    </DashboardContent>
  );
}