import type { ITerrenoItem } from 'src/types/terreno';

import { useState, useRef } from 'react';

import Box from '@mui/material/Box';
import LoadingButton from '@mui/lab/LoadingButton';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { LoadingScreen } from 'src/components/loading-screen';

import { TerrenoNewEditForm } from '../terreno-new-edit-form';

// ----------------------------------------------------------------------

type Props = {
  terreno?: ITerrenoItem | null;
  loading?: boolean;
};

export function TerrenoEditView({ terreno, loading }: Props) {
  const router = useRouter();
  const [formLoading, setFormLoading] = useState(false);
  const formRef = useRef<{
    onSave: () => void;
    onCancel: () => void;
  } | null>(null);

  if (loading) {
    return <LoadingScreen />;
  }

  const renderHeaderActions = () => (
    <Box sx={{ display: 'flex', gap: 1.5 }}>
      <LoadingButton
        color="inherit"
        variant="outlined"
        onClick={() => router.push(paths.dashboard.terrenos.root)}
      >
        Cancelar
      </LoadingButton>
      <LoadingButton
        variant="contained"
        loading={formLoading}
        onClick={() => formRef.current?.onSave()}
        startIcon={<Iconify icon="solar:save-bold" />}
      >
        Atualizar Terreno
      </LoadingButton>
    </Box>
  );

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Editar"
        backHref={paths.dashboard.terrenos.root}
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Terrenos', href: paths.dashboard.terrenos.root },
          { name: terreno?.titulo || 'Terreno' },
        ]}
        action={renderHeaderActions()}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <TerrenoNewEditForm
        currentTerreno={terreno}
        ref={formRef}
        onLoadingChange={setFormLoading}
      />
    </DashboardContent>
  );
}
