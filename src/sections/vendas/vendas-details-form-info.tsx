import type { CardProps } from '@mui/material/Card';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

type FormData = {
  clientName?: string;
  clientPhone?: string;
  clientEmail?: string;
  propertyName?: string;
  unitType?: string;
  floor?: string;
  sunPosition?: string;
  availableUnits?: string;
};

type Props = CardProps & {
  formData?: FormData;
};

export function VendasDetailsFormInfo({ formData, sx, ...other }: Props) {
  if (!formData) {
    return (
      <Card sx={sx} {...other}>
        <CardHeader title="Informações do atendimento" />
        <Box sx={{ p: 3 }}>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Informações do formulário não disponíveis
          </Typography>
        </Box>
      </Card>
    );
  }

  const renderClientInfo = () => (
    <Box sx={{ p: 3 }}>
      <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
        <Iconify icon="solar:user-bold" width={20} />
        Informações do Cliente
      </Typography>

      <Stack spacing={2}>
        {formData.clientName && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="body2" sx={{ color: 'text.secondary', minWidth: 80 }}>
              Nome:
            </Typography>
            <Typography variant="body2">{formData.clientName}</Typography>
          </Box>
        )}

        {formData.clientPhone && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="body2" sx={{ color: 'text.secondary', minWidth: 80 }}>
              Telefone:
            </Typography>
            <Typography variant="body2">{formData.clientPhone}</Typography>
          </Box>
        )}

        {formData.clientEmail && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="body2" sx={{ color: 'text.secondary', minWidth: 80 }}>
              E-mail:
            </Typography>
            <Typography variant="body2">{formData.clientEmail}</Typography>
          </Box>
        )}
      </Stack>
    </Box>
  );

  const renderPropertyInfo = () => (
    <Box sx={{ p: 3 }}>
      <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
        <Iconify icon="solar:home-bold" width={20} />
        Informações do Imóvel
      </Typography>

      <Stack spacing={2}>
        {formData.propertyName && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="body2" sx={{ color: 'text.secondary', minWidth: 120 }}>
              Imóvel:
            </Typography>
            <Typography variant="body2">{formData.propertyName}</Typography>
          </Box>
        )}

        {formData.unitType && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="body2" sx={{ color: 'text.secondary', minWidth: 120 }}>
              Unidade:
            </Typography>
            <Chip label={formData.unitType} size="small" color="primary" variant="outlined" />
          </Box>
        )}

        {formData.availableUnits && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="body2" sx={{ color: 'text.secondary', minWidth: 120 }}>
              Unidade escolhida:
            </Typography>
            <Typography variant="body2">{formData.availableUnits}</Typography>
          </Box>
        )}
      </Stack>
    </Box>
  );

  return (
    <Card sx={sx} {...other}>
      <CardHeader
        title="Informações do atendimento"
        subheader="Dados coletados no formulário de criação"
      />

      {(formData.clientName || formData.clientPhone || formData.clientEmail) && (
        <>
          {renderClientInfo()}
          <Divider sx={{ borderStyle: 'dashed' }} />
        </>
      )}

      {(formData.propertyName ||
        formData.unitType ||
        formData.floor ||
        formData.sunPosition ||
        formData.availableUnits) &&
        renderPropertyInfo()}
    </Card>
  );
}
