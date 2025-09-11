import { paths } from 'src/routes/paths';
import { useParams } from 'src/routes/hooks';

import { useCorretor } from 'src/hooks/use-corretores';

import { DashboardContent } from 'src/layouts/dashboard';

import { EmptyContent } from 'src/components/empty-content';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { CorretorNewEditForm } from '../corretor-new-edit-form';

// ----------------------------------------------------------------------

export function CorretorEditView() {
  // const router = useRouter();
  const { id } = useParams();

  const { corretor: currentCorretor, loading, error } = useCorretor(id!);

  if (loading) {
    return (
      <DashboardContent>
        <EmptyContent
          title="Carregando corretor..."
          description="Aguarde enquanto buscamos os dados"
          sx={{ py: 10 }}
        />
      </DashboardContent>
    );
  }

  if (error || !currentCorretor) {
    return (
      <DashboardContent>
        <EmptyContent
          filled
          title="Corretor não encontrado"
          description={error || "O corretor solicitado não foi encontrado"}
          sx={{ py: 10 }}
        />
      </DashboardContent>
    );
  }

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Editar corretor"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Corretores', href: paths.dashboard.corretores.root },
          {
            name: currentCorretor.name,
            href: paths.dashboard.corretores.details(currentCorretor.id),
          },
          { name: 'Editar' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <CorretorNewEditForm currentCorretor={currentCorretor} />
    </DashboardContent>
  );
}
