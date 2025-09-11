import type { IPropertyItem } from 'src/types/property';

import { useForm } from 'react-hook-form';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { fCurrency } from 'src/utils/format-number';

import { Form } from 'src/components/hook-form';
import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

type Props = {
  property: IPropertyItem;
  disableActions?: boolean;
};

export function PropertyDetailsSummary({ property, disableActions, ...other }: Props) {
  const router = useRouter();

  const {
    id,
    titulo: name,
    preco: value,
    tipo: type,
    area,
    status,
    // address,
    // city,
    // state,
    // cep,
    corretor: agent,
    caracteristicas,
    precoM2: pricePerSquareMeter,
    descricao: propertyDescription,
    // viewsCount,
  } = property;
  
  const favoritesCount = 2; // Valor padrão
  const propertyCondition = caracteristicas?.condicao || 'novo';

  const defaultValues = {
    id,
    name,
    value,
    type,
    area,
    status,
  };

  const methods = useForm<typeof defaultValues>({
    defaultValues,
  });

  const { handleSubmit } = methods;

  const onSubmit = handleSubmit(async (data) => {
    console.info('DATA', JSON.stringify(data, null, 2));
    try {
      // Lógica para processar os dados
      router.push(paths.dashboard.property.root);
    } catch (error) {
      console.error(error);
    }
  });

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Stack spacing={3} sx={{ pt: 3 }} {...other}>
        {/* Status */}
        <Chip
          label={status}
          size="small"
          sx={{
            alignSelf: 'flex-start',
            bgcolor: 'warning.lighter',
            color: 'warning.dark',
            fontWeight: 600,
            borderRadius: 1,
            px: 1,
          }}
        />

        {/* Código do imóvel */}
        <Typography variant="body2" sx={{ color: 'info.main', fontWeight: 600 }}>
          IMV-{String(id).padStart(4, '0')}
        </Typography>

        {/* Título */}
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
          {name}
        </Typography>

        {/* Interessados */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Iconify
            icon="solar:home-bold"
            width={16}
            sx={{ color: 'success.main', transform: 'rotate(45deg)' }}
          />
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {favoritesCount || 2} Interessados recentemente
          </Typography>
        </Box>

        {/* Preços */}
        <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 2, mb: 3 }}>
          <Typography variant="h6" sx={{ color: 'text.secondary' }}>
            R$ {((pricePerSquareMeter || value / area) / 1000).toFixed(3).replace('.', ',')}
            <Typography component="span" variant="body2" sx={{ ml: 0.5 }}>
              m2
            </Typography>
          </Typography>
          <Typography variant="h4" sx={{ fontWeight: 700, color: 'text.primary' }}>
            {fCurrency(value)}
          </Typography>
        </Box>

        {/* Informações do imóvel */}
        <Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="body1" sx={{ color: 'text.primary', fontWeight: 500 }}>
              Tipo
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 600 }}>
              {type}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
            <Typography variant="body1" sx={{ color: 'text.primary', fontWeight: 500 }}>
              Condições
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 600 }}>
              {propertyCondition || 'Novo'}
            </Typography>
          </Box>
        </Box>

        {/* Descrição */}
        <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.6, mb: 3 }}>
          {propertyDescription ||
            `Imóvel aconchegante para alugar com 2 quartos e 1 banheiro no total. é ideal para quem procura conforto e comodidade. O condomínio é bem equipado com diversas instalações, apropriado para quem busca lazer sem sair de casa e fica localizado em Av...`}
        </Typography>

        {/* Agente */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
          <Avatar sx={{ width: 48, height: 48 }}>
            {agent?.charAt(0) || 'M'}
          </Avatar>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 0.5 }}>
              {agent || 'Matheus Vieira Tavares'}
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              {'(62) 0 0000-0000'}
            </Typography>
          </Box>
          <Button
            variant="text"
            endIcon={<Iconify icon="eva:arrow-ios-forward-fill" width={16} />}
            sx={{
              color: 'text.primary',
              fontWeight: 600,
              '&:hover': { bgcolor: 'transparent' },
            }}
          >
            Ver perfil
          </Button>
        </Box>

        {/* Botão Agendar Visita */}
        <Button
          fullWidth
          size="large"
          variant="contained"
          disabled={disableActions}
          startIcon={<Iconify icon="solar:star-bold" width={20} />}
          sx={{
            bgcolor: 'warning.main',
            color: 'common.white',
            fontWeight: 600,
            py: 2,
            '&:hover': {
              bgcolor: 'warning.dark',
            },
          }}
        >
          Agendar visita
        </Button>
      </Stack>
    </Form>
  );
}
