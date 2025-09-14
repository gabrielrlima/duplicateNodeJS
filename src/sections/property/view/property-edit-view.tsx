import type { IPropertyItem } from 'src/types/property';

import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { PropertySingleForm } from '../property-single-form';

// ----------------------------------------------------------------------

type Props = {
  property?: IPropertyItem;
};

export function PropertyEditView({ property }: Props) {
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Editar Produto"
        backHref={paths.dashboard.property.root}
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Produtos', href: paths.dashboard.property.root },
          { name: 'Editar Produto' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <PropertySingleForm currentProperty={property} />
    </DashboardContent>
  );
}
