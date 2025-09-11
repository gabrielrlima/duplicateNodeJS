import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { ComissaoNewEditForm } from '../comissao-new-edit-form';

// ----------------------------------------------------------------------

export function ComissoesCreateView() {
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Criar nova regra de comissão"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Regras de Comissões', href: paths.dashboard.comissoes.root },
          { name: 'Nova regra' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <ComissaoNewEditForm />
    </DashboardContent>
  );
}
