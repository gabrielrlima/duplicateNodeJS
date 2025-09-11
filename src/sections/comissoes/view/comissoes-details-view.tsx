import type { IComissaoItem } from 'src/types/comissao';

import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { ComissaoDetailsClone } from '../comissao-details-clone';

// ----------------------------------------------------------------------

type Props = {
  comissao?: IComissaoItem;
};

export function ComissoesDetailsView({ comissao }: Props) {
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading={comissao?.nome}
        backHref={paths.dashboard.comissoes.root}
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Comissões', href: paths.dashboard.comissoes.root },
          { name: comissao?.nome },
        ]}
        sx={{ mb: 3 }}
      />

      <ComissaoDetailsClone comissao={comissao} />
    </DashboardContent>
  );
}
