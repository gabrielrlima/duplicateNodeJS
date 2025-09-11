import type { IChatParticipant } from 'src/types/chat';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Dialog from '@mui/material/Dialog';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import DialogContent from '@mui/material/DialogContent';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

type Props = {
  open: boolean;
  onClose: () => void;
  participant: IChatParticipant;
};

export function ChatRoomParticipantDialog({ participant, open, onClose }: Props) {
  return (
    <Dialog fullWidth maxWidth="xs" open={open} onClose={onClose}>
      <IconButton onClick={onClose} sx={{ position: 'absolute', right: 8, top: 8 }}>
        <Iconify icon="mingcute:close-line" />
      </IconButton>

      <DialogContent sx={{ py: 5, px: 3, display: 'flex' }}>
        <Avatar alt={participant.name} sx={{ width: 96, height: 96, mr: 3 }}>
          {participant.name.split(' ').length > 1
            ? `${participant.name.split(' ')[0].charAt(0)}${participant.name.split(' ')[participant.name.split(' ').length - 1].charAt(0)}`.toUpperCase()
            : participant.name.charAt(0).toUpperCase()}
        </Avatar>

        <Stack spacing={1}>
          <Typography variant="caption" sx={{ color: 'primary.main' }}>
            {participant.role}
          </Typography>

          <Typography variant="subtitle1">{participant.name}</Typography>

          <Box sx={{ display: 'flex', typography: 'caption', color: 'text.disabled' }}>
            <Iconify
              icon="mingcute:mail-fill"
              width={16}
              sx={{ flexShrink: 0, mr: 0.5, mt: '2px' }}
            />
            {participant.email}
          </Box>

          <Box sx={{ display: 'flex', typography: 'caption', color: 'text.disabled' }}>
            <Iconify
              icon="mingcute:phone-fill"
              width={16}
              sx={{ flexShrink: 0, mr: 0.5, mt: '2px' }}
            />
            {participant.phoneNumber}
          </Box>
        </Stack>
      </DialogContent>
    </Dialog>
  );
}
