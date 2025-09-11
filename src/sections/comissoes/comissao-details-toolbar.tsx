import { usePopover } from 'minimal-shared/hooks';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';
import IconButton from '@mui/material/IconButton';

import { RouterLink } from 'src/routes/components';

import { Iconify } from 'src/components/iconify';
import { CustomPopover } from 'src/components/custom-popover';

// ----------------------------------------------------------------------

type Props = {
  publish: string;
  backLink: string;
  editLink: string;
  liveLink: string;
  onChangePublish: (newValue: string) => void;
  publishOptions: { value: string; label: string }[];
};

export function ComissaoDetailsToolbar({
  publish,
  backLink,
  editLink,
  liveLink,
  onChangePublish,
  publishOptions,
}: Props) {
  const popover = usePopover();

  return (
    <>
      <Stack
        spacing={1.5}
        direction="row"
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      >
        <Button
          component={RouterLink}
          href={backLink}
          startIcon={<Iconify icon="eva:arrow-ios-back-fill" width={16} />}
        >
          Voltar
        </Button>

        <Box sx={{ flexGrow: 1 }} />

        <Button
          color="inherit"
          variant="outlined"
          size="small"
          startIcon={<Iconify icon="solar:eye-bold" width={16} />}
        >
          Visualizar
        </Button>

        <Button
          component={RouterLink}
          href={editLink}
          color="inherit"
          variant="outlined"
          size="small"
          startIcon={<Iconify icon="solar:pen-bold" width={16} />}
        >
          Editar
        </Button>

        <IconButton onClick={popover.onOpen}>
          <Iconify icon="eva:more-vertical-fill" />
        </IconButton>
      </Stack>

      <CustomPopover
        open={popover.open}
        anchorEl={popover.anchorEl}
        onClose={popover.onClose}
        slotProps={{ arrow: { placement: 'right-top' } }}
      >
        <MenuList>
          {publishOptions.map((option) => (
            <MenuItem
              key={option.value}
              selected={option.value === publish}
              onClick={() => {
                popover.onClose();
                onChangePublish(option.value);
              }}
            >
              {option.value === 'Ativo' && <Iconify icon="eva:cloud-upload-fill" />}
              {option.value === 'Inativo' && <Iconify icon="eva:file-text-fill" />}
              {option.label}
            </MenuItem>
          ))}
        </MenuList>
      </CustomPopover>
    </>
  );
}
