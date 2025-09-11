import type { IPropertyProprietario } from 'src/types/property';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Avatar from '@mui/material/Avatar';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';

// ----------------------------------------------------------------------

type Props = {
  owner?: IPropertyProprietario;
};

export function PropertyDetailsOwner({ owner }: Props) {
  return (
    <Card>
      <CardHeader title="Proprietário" />
      <Box sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2.5 }}>
          <Avatar alt={owner?.nome} src={owner?.avatarUrl} sx={{ width: 56, height: 56, mr: 2 }}>
            {owner?.nome?.charAt(0)?.toUpperCase()}
          </Avatar>

          <Box>
            <Typography variant="subtitle1" sx={{ mb: 0.5, fontWeight: 600 }}>
              {owner?.nome || 'Não informado'}
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              {owner?.documento || 'Não informado'}
            </Typography>
          </Box>
        </Box>

        <Box
          sx={{
            display: 'grid',
            gap: 2,
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          }}
        >
          <Box>
            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 0.5 }}>
              E-mail
            </Typography>
            <Typography variant="subtitle2">{owner?.email || 'Não informado'}</Typography>
          </Box>

          <Box>
            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 0.5 }}>
              Telefone
            </Typography>
            <Typography variant="subtitle2">{owner?.telefone || 'Não informado'}</Typography>
          </Box>
        </Box>
      </Box>
    </Card>
  );
}