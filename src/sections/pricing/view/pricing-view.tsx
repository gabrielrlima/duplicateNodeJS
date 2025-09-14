import Box from '@mui/material/Box';
import Switch from '@mui/material/Switch';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { _pricingPlans } from 'src/_mock';

import { PricingCard } from '../pricing-card';

// ----------------------------------------------------------------------

// SVG removido conforme solicitado

// ----------------------------------------------------------------------

export function PricingView() {
  return (
    <Container sx={{ pt: { xs: 3, md: 5 }, pb: 10 }}>
      <Typography variant="h3" align="center" sx={{ mb: 2 }}>
        Flexible plans for your
        <br /> {`community's size and needs`}
      </Typography>

      <Typography align="center" sx={{ color: 'text.secondary' }}>
        Choose your plan and make modern online conversation magic
      </Typography>

      <Box sx={{ mt: 9, mb: 5, position: 'relative' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Typography variant="overline">MONTHLY</Typography>

          <Switch
            sx={{ mx: 1 }}
            inputProps={{
              id: 'yearly-pricing-switch',
              'aria-label': 'Yearly pricing switch',
            }}
          />

          <Box sx={{ position: 'relative' }}>
            <Box
              sx={{
                left: 12,
                bottom: 12,
                display: 'flex',
                position: 'absolute',
              }}
            >
              {/* Ícone removido */}
               <Box
                 component="span"
                 sx={{ whiteSpace: 'nowrap', color: 'success.main', typography: 'overline' }}
               >
                 save 10%
               </Box>
            </Box>

            <Typography variant="overline">YEARLY</Typography>
          </Box>
        </Box>
      </Box>

      <Box
        sx={{
          display: 'grid',
          gap: { xs: 3, md: 0 },
          alignItems: { md: 'center' },
          gridTemplateColumns: { md: 'repeat(3, 1fr)' },
        }}
      >
        {_pricingPlans.map((card, index) => (
          <PricingCard key={card.subscription} card={card} index={index} />
        ))}
      </Box>
    </Container>
  );
}
