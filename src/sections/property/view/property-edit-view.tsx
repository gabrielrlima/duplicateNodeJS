import type { IPropertyItem } from 'src/types/property';

import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { PropertyNewEditForm } from '../property-new-edit-form';

// ----------------------------------------------------------------------

type Props = {
  property?: IPropertyItem;
};

export function PropertyEditView({ property }: Props) {
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Editar"
        backHref={paths.dashboard.property.root}
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Propriedades', href: paths.dashboard.property.root },
          { name: property?.title },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <PropertyNewEditForm currentProperty={property} />
    </DashboardContent>
  );
}
