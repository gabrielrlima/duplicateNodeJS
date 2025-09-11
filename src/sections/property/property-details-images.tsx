import Box from '@mui/material/Box';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';

import { Image } from 'src/components/image';
import { Lightbox, useLightBox } from 'src/components/lightbox';

// ----------------------------------------------------------------------

type Props = {
  images?: string[];
};

export function PropertyDetailsImages({ images = [] }: Props) {
  const slides = images.map((img) => ({ src: img }));

  const lightbox = useLightBox(slides);

  if (images.length === 0) {
    return (
      <>
        <CardHeader title="Imagens" />
        <Box sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Nenhuma imagem disponível
          </Typography>
        </Box>
      </>
    );
  }

  return (
    <>
      <CardHeader
        title="Imagens"
        subheader={`${images.length} ${images.length === 1 ? 'imagem' : 'imagens'}`}
      />

      <Box sx={{ p: 3 }}>
        <Box
          sx={{
            display: 'grid',
            gap: 1,
            gridTemplateColumns: {
              xs: 'repeat(2, 1fr)',
              sm: 'repeat(3, 1fr)',
              md: 'repeat(4, 1fr)',
            },
          }}
        >
          {images.map((image, index) => (
            <Box
              key={index}
              sx={{
                position: 'relative',
                paddingTop: '75%',
                cursor: 'pointer',
                borderRadius: 1,
                overflow: 'hidden',
                '&:hover': {
                  opacity: 0.8,
                },
              }}
              onClick={() => lightbox.onOpen(image)}
            >
              <Image
                alt={`Imagem ${index + 1}`}
                src={image}
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: 1,
                  height: 1,
                  objectFit: 'cover',
                }}
              />
            </Box>
          ))}
        </Box>
      </Box>

      <Lightbox
        index={lightbox.selected}
        slides={slides}
        open={lightbox.open}
        close={lightbox.onClose}
      />
    </>
  );
}
