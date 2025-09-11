import { m } from 'framer-motion';

import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { RouterLink } from 'src/routes/components';

import { SimpleLayout } from 'src/layouts/simple';
import { PageNotFoundIllustration } from 'src/assets/illustrations';

import { varBounce, MotionContainer } from 'src/components/animate';
// ----------------------------------------------------------------------
export function NotFoundView() {
  return (
    <SimpleLayout
      slotProps={{
        content: { compact: true },
      }}
    >
      <Container component={MotionContainer} maxWidth="sm" sx={{ textAlign: 'center' }}>
        <m.div variants={varBounce('in')}>
          <Typography variant="h3" sx={{ mb: 3, fontWeight: 700 }}>
            Desculpe, página não encontrada!
          </Typography>
        </m.div>

        <m.div variants={varBounce('in')}>
          <PageNotFoundIllustration sx={{ height: 260, my: { xs: 3, sm: 6 } }} />
        </m.div>

        <m.div variants={varBounce('in')}>
          <Typography sx={{ color: 'text.secondary', mb: 5, mx: 'auto', maxWidth: '480px' }}>
            Desculpe, não conseguimos encontrar a página que você está procurando. Talvez você tenha
            digitado incorretamente a URL? Verifique se a escrita está correta.
          </Typography>
        </m.div>

        <Button
          component={RouterLink}
          href="/"
          size="large"
          variant="contained"
          sx={{
            minWidth: '220px',
            fontWeight: 600,
            py: 1.2,
          }}
        >
          Ir para a página inicial
        </Button>
      </Container>
    </SimpleLayout>
  );
}
