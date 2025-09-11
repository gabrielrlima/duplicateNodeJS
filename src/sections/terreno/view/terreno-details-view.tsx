import type { ITerrenoItem } from 'src/types/terreno';

import { useState, useCallback, useEffect } from 'react';
import { toast } from 'sonner';

import { updateTerrenoStatus } from 'src/actions/terreno';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid2';
import Divider from '@mui/material/Divider';

import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';
import { TERRENO_STATUS_OPTIONS } from 'src/_mock/_terreno';

import { TerrenoDetailsInfo } from '../terreno-details-info';
import { TerrenoDetailsOwner } from '../terreno-details-owner';
import { TerrenoDetailsImages } from '../terreno-details-images';
import { TerrenoDetailsToolbar } from '../terreno-details-toolbar';
import { TerrenoDetailsLocation } from '../terreno-details-location';
import { TerrenoDetailsFinancial } from '../terreno-details-financial';
import { TerrenoDetailsCharacteristics } from '../terreno-details-characteristics';

// ----------------------------------------------------------------------

type Props = {
  terreno?: ITerrenoItem;
};

export function TerrenoDetailsView({ terreno }: Props) {
  const [status, setStatus] = useState(terreno?.status);

  // Sincronizar o estado local com mudanças no prop terreno
  useEffect(() => {
    setStatus(terreno?.status);
  }, [terreno?.status]);

  const handleChangeStatus = useCallback(async (newValue: string) => {
    if (!terreno?.id) {
      toast.error('ID do terreno não encontrado');
      return;
    }

    try {
      // Mapear valores em português para inglês (backend)
      const statusMap: { [key: string]: string } = {
        'disponivel': 'available',
        'reservado': 'reserved',
        'vendido': 'sold',
        'suspenso': 'inactive'
      };
      
      const mappedStatus = statusMap[newValue] || newValue;
      
      await updateTerrenoStatus(terreno.id, mappedStatus);
      setStatus(mappedStatus);
      toast.success('Status atualizado com sucesso!');
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
      toast.error('Erro ao atualizar status do terreno');
    }
  }, [terreno?.id]);

  return (
    <DashboardContent>
      <TerrenoDetailsToolbar
        status={status}
        createdAt={terreno?.createdAt}
        terrenoId={terreno?.id || ''}
        terrenoCode={terreno?.codigo}
        backHref={paths.dashboard.terrenos.root}
        onChangeStatus={handleChangeStatus}
        statusOptions={TERRENO_STATUS_OPTIONS}
      />

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 8 }}>
          <Box
            sx={{ gap: 3, display: 'flex', flexDirection: { xs: 'column-reverse', md: 'column' } }}
          >
            <TerrenoDetailsInfo
              title={terreno?.titulo}
              area={terreno?.area}
              price={terreno?.preco}
              description={terreno?.descricao}
            />

            <TerrenoDetailsCharacteristics
              area={terreno?.area}
              dimensions={terreno?.dimensoes || terreno?.caracteristicas?.formato}
              topography={terreno?.caracteristicas?.topografia}
              access={terreno?.caracteristicas?.acesso}
            />

            <TerrenoDetailsLocation
              address={terreno?.localizacao?.endereco}
              city={terreno?.localizacao?.cidade}
              state={terreno?.localizacao?.estado}
              zipCode={terreno?.localizacao?.cep}
              coordinates={terreno?.localizacao?.coordenadas}
            />
          </Box>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Card>
            <TerrenoDetailsOwner
              owner={{
                name: terreno?.proprietario?.nome || '',
                email: terreno?.proprietario?.email || '',
                phone: terreno?.proprietario?.telefone || '',
                avatarUrl: terreno?.proprietario?.avatarUrl || '',
                document: terreno?.proprietario?.documento || '',
              }}
            />

            <Divider sx={{ borderStyle: 'dashed' }} />
            <TerrenoDetailsFinancial
              price={terreno?.preco}
              pricePerSqm={terreno?.precoM2}
              taxes={undefined}
              documentation={terreno?.caracteristicas?.documentacao}
              priceNegotiable={terreno?.preco_negociavel}
              ituAnual={terreno?.itu_anual}
            />

            <Divider sx={{ borderStyle: 'dashed' }} />
            <TerrenoDetailsImages images={terreno?.imagens} />
          </Card>
        </Grid>
      </Grid>
    </DashboardContent>
  );
}
