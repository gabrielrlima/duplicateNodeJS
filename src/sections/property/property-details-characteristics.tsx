import type { CardProps } from '@mui/material/Card';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';

// ----------------------------------------------------------------------

type Props = CardProps & {
  area?: number;
  bedrooms?: number;
  bathrooms?: number;
  suites?: number;
  parkingSpaces?: number;
  floor?: string;
  elevator?: boolean;
  furnished?: boolean;
  amenities?: Record<string, boolean>;
};

export function PropertyDetailsCharacteristics({
  sx,
  area,
  bedrooms,
  bathrooms,
  suites,
  parkingSpaces,
  floor,
  elevator,
  furnished,
  amenities,
  ...other
}: Props) {
  const getAmenitiesList = () => {
    if (!amenities) return [];

    const amenityLabels: Record<string, string> = {
      varanda: 'Varanda',
      churrasqueira: 'Churrasqueira',
      piscina: 'Piscina',
      arCondicionado: 'Ar Condicionado',
      cozinhaAmericana: 'Cozinha Americana',
      jardim: 'Jardim',
      playground: 'Playground',
      piscinaCondominio: 'Piscina do Condomínio',
      churrasqueiraCondominio: 'Churrasqueira do Condomínio',
      academia: 'Academia',
      salaoFestas: 'Salão de Festas',
      lavanderia: 'Lavanderia',
      espacoGourmet: 'Espaço Gourmet',
      recepcao24h: 'Recepção 24h',
      rampasAcesso: 'Rampas de Acesso',
      salaoJogos: 'Salão de Jogos',
      quadraEsportes: 'Quadra de Esportes',
      sauna: 'Sauna',
      brinquedoteca: 'Brinquedoteca',
      corrimao: 'Corrimão',
      vagaDeficiente: 'Vaga para Deficiente',
      areaVerde: 'Área Verde',
    };

    return Object.entries(amenities)
      .filter(([_, value]) => value)
      .map(([key, _]) => amenityLabels[key] || key);
  };

  const amenitiesList = getAmenitiesList();

  return (
    <Card sx={sx} {...other}>
      <CardHeader title="Características" />

      <Box sx={{ p: 3 }}>
        <Box
          sx={{
            display: 'grid',
            gap: 2,
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            mb: 3,
          }}
        >
          <Box>
            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 0.5 }}>
              Área Total
            </Typography>
            <Typography variant="subtitle2">
              {area ? `${area.toLocaleString()} m²` : '-'}
            </Typography>
          </Box>

          <Box>
            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 0.5 }}>
              Quartos
            </Typography>
            <Typography variant="subtitle2">{bedrooms || '-'}</Typography>
          </Box>

          <Box>
            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 0.5 }}>
              Banheiros
            </Typography>
            <Typography variant="subtitle2">{bathrooms || '-'}</Typography>
          </Box>

          <Box>
            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 0.5 }}>
              Suítes
            </Typography>
            <Typography variant="subtitle2">{suites || '-'}</Typography>
          </Box>

          <Box>
            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 0.5 }}>
              Vagas de Garagem
            </Typography>
            <Typography variant="subtitle2">{parkingSpaces || '-'}</Typography>
          </Box>

          {floor && (
            <Box>
              <Typography variant="body2" sx={{ color: 'text.secondary', mb: 0.5 }}>
                Andar
              </Typography>
              <Typography variant="subtitle2">{floor}</Typography>
            </Box>
          )}

          <Box>
            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 0.5 }}>
              Elevador
            </Typography>
            <Typography variant="subtitle2">{elevator ? 'Sim' : 'Não'}</Typography>
          </Box>

          <Box>
            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 0.5 }}>
              Mobiliado
            </Typography>
            <Typography variant="subtitle2">{furnished ? 'Sim' : 'Não'}</Typography>
          </Box>
        </Box>

        {amenitiesList.length > 0 && (
          <Box>
            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1.5 }}>
              Comodidades
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {amenitiesList.map((amenity, index) => (
                <Chip key={index} label={amenity} size="small" variant="outlined" color="primary" />
              ))}
            </Box>
          </Box>
        )}
      </Box>
    </Card>
  );
}
