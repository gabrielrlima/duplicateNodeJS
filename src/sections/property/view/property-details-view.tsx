import type { IPropertyItem } from 'src/types/property';

import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid2';
import Divider from '@mui/material/Divider';

import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { PropertyDetailsInfo } from '../property-details-info';
import { PropertyDetailsOwner } from '../property-details-owner';
import { PropertyDetailsImages } from '../property-details-images';
import { PropertyDetailsToolbar } from '../property-details-toolbar';
import { PropertyDetailsLocation } from '../property-details-location';
import { PropertyDetailsFinancial } from '../property-details-financial';

// ----------------------------------------------------------------------

type Props = {
  property?: IPropertyItem;
};

export function PropertyDetailsView({ property }: Props) {
  const [status, setStatus] = useState(property?.status);

  const handleChangeStatus = useCallback((newValue: string) => {
    setStatus(newValue);
  }, []);

  return (
    <DashboardContent>
      <PropertyDetailsToolbar
        status={status}
        createdAt={property?.createdAt}
        propertyId={property?.id}
        propertyTitle={property?.titulo}
        backHref={paths.dashboard.property.root}
        onChangeStatus={handleChangeStatus}
        statusOptions={[
          { value: 'Em andamento', label: 'Em andamento' },
          { value: 'Pendente', label: 'Pendente' },
          { value: 'Vendido', label: 'Vendido' },
          { value: 'Alugado', label: 'Alugado' },
        ]}
      />

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 8 }}>
          <Box
            sx={{
              gap: 3,
              display: 'flex',
              flexDirection: { xs: 'column-reverse', md: 'column' },
            }}
          >
            <PropertyDetailsInfo
              propertyData={property}
            />

            <PropertyDetailsLocation
              propertyData={property}
            />
          </Box>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Card>
            <PropertyDetailsOwner
              owner={property?.proprietario}
            />

            <Divider sx={{ borderStyle: 'dashed' }} />
            <PropertyDetailsFinancial
              propertyData={property}
            />

            <Divider sx={{ borderStyle: 'dashed' }} />
            <PropertyDetailsImages images={property?.imagens} />
          </Card>
        </Grid>
      </Grid>
    </DashboardContent>
  );
}
