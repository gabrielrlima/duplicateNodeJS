import type { IconButtonProps } from '@mui/material/IconButton';

import { m } from 'framer-motion';

import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';

import { getInitials } from 'src/utils/get-initials';

import { varTap, varHover, AnimateBorder, transitionTap } from 'src/components/animate';

// ----------------------------------------------------------------------

export type AccountButtonProps = IconButtonProps & {
  photoURL?: string;
  displayName: string;
  lastName?: string;
};

export function AccountButton({ photoURL, displayName, lastName, sx, ...other }: AccountButtonProps) {
  // Determina se deve mostrar a foto ou as iniciais
  const shouldShowPhoto = photoURL && photoURL.trim() !== '';
  const initials = getInitials(displayName, lastName);
  
  return (
    <IconButton
      component={m.button}
      whileTap={varTap(0.96)}
      whileHover={varHover(1.04)}
      transition={transitionTap()}
      aria-label="Account button"
      sx={[{ p: 0 }, ...(Array.isArray(sx) ? sx : [sx])]}
      {...other}
    >
      <AnimateBorder
        sx={{ p: '3px', borderRadius: '50%', width: 40, height: 40 }}
        slotProps={{
          primaryBorder: { size: 60, width: '1px', sx: { color: 'primary.main' } },
          secondaryBorder: { sx: { color: 'warning.main' } },
        }}
      >
        <Avatar 
          src={shouldShowPhoto ? photoURL : undefined} 
          alt={displayName} 
          sx={{ width: 1, height: 1 }}
        >
          {initials}
        </Avatar>
      </AnimateBorder>
    </IconButton>
  );
}
