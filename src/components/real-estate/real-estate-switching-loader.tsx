import type { Theme, SxProps } from '@mui/material/styles';

import Box from '@mui/material/Box';
import Backdrop from '@mui/material/Backdrop';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';

// ----------------------------------------------------------------------

export type RealEstateSwitchingLoaderProps = {
  open: boolean;
  sx?: SxProps<Theme>;
};

export function RealEstateSwitchingLoader({ open, sx }: RealEstateSwitchingLoaderProps) {
  return (
    <Backdrop
      open={open}
      sx={[
        {
          zIndex: (theme) => theme.zIndex.modal + 1,
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          backdropFilter: 'blur(6px)',
          WebkitBackdropFilter: 'blur(6px)',
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 3,
        }}
      >
        <CircularProgress
          size={60}
          thickness={4}
          sx={{
            color: 'primary.main',
            '& .MuiCircularProgress-circle': {
              strokeLinecap: 'round',
            },
          }}
        />
        
        <Box sx={{ textAlign: 'center' }}>
          <Typography
            variant="h6"
            sx={{
              color: 'common.white',
              fontWeight: 600,
              mb: 1,
            }}
          >
            Trocando imobiliária...
          </Typography>
          
          <Typography
            variant="body2"
            sx={{
              color: 'grey.300',
              opacity: 0.8,
            }}
          >
            Aguarde enquanto carregamos os dados
          </Typography>
        </Box>
      </Box>
    </Backdrop>
  );
}