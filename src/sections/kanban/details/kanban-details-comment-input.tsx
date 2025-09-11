import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import InputBase from '@mui/material/InputBase';
import IconButton from '@mui/material/IconButton';

import { getInitials } from 'src/utils/get-initials';

import { Iconify } from 'src/components/iconify';

import { useAuthContext } from 'src/auth/hooks';

// ----------------------------------------------------------------------

export function KanbanDetailsCommentInput() {
  const { user } = useAuthContext();
  
  // Determina se deve mostrar a foto ou as iniciais
  const shouldShowPhoto = user?.photoURL && user.photoURL.trim() !== '';
  const initials = getInitials(user?.displayName || '', user?.lastName);

  return (
    <Box
      sx={{
        py: 3,
        gap: 2,
        px: 2.5,
        display: 'flex',
      }}
    >
      <Avatar 
        src={shouldShowPhoto ? user?.photoURL : undefined} 
        alt={user?.displayName}
      >
        {initials}
      </Avatar>

      <Paper variant="outlined" sx={{ p: 1, flexGrow: 1, bgcolor: 'transparent' }}>
        <InputBase fullWidth multiline rows={2} placeholder="Type a message" sx={{ px: 1 }} />

        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box sx={{ flexGrow: 1, display: 'flex' }}>
            <IconButton>
              <Iconify icon="solar:gallery-add-bold" />
            </IconButton>

            <IconButton>
              <Iconify icon="eva:attach-2-fill" />
            </IconButton>
          </Box>

          <Button variant="contained">Comment</Button>
        </Box>
      </Paper>
    </Box>
  );
}
