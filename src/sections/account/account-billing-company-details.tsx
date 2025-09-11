import { useState, useCallback } from 'react';
import { useBoolean, usePopover } from 'minimal-shared/hooks';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';

import { Iconify } from 'src/components/iconify';
import { CustomPopover } from 'src/components/custom-popover';

// ----------------------------------------------------------------------

type CompanyData = {
  id: string;
  name: string;
  address: string;
  cnpj: string;
  tradeName: string;
};

type Props = {
  company: CompanyData;
};

export function CompanyDetails({ company }: Props) {
  const menuActions = usePopover();
  const editForm = useBoolean();

  // Estado para os dados do formulário
  const [formData, setFormData] = useState<CompanyData>(company);

  const handleUpdateCompany = (updatedCompany: CompanyData) => {
    console.log('Dados atualizados:', updatedCompany);
    // Aqui você pode atualizar o estado ou fazer uma chamada de API para salvar os dados
  };

  const handleEdit = useCallback(() => {
    menuActions.onClose();
    setFormData(company); // Reseta o formulário com os dados atuais
    editForm.onTrue();
  }, [company, menuActions, editForm]);

  const handleClose = useCallback(() => {
    menuActions.onClose();
  }, [menuActions]);

  const handleFormChange = (field: keyof CompanyData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = () => {
    handleUpdateCompany(formData); // Chama a função de callback para atualizar os dados
    editForm.onFalse(); // Fecha o modal
  };

  const renderMenuActions = () => (
    <CustomPopover open={menuActions.open} anchorEl={menuActions.anchorEl} onClose={handleClose}>
      <MenuList>
        <MenuItem onClick={handleEdit}>
          <Iconify icon="solar:pen-bold" />
          Editar
        </MenuItem>
      </MenuList>
    </CustomPopover>
  );

  const renderEditForm = () => (
    <Dialog open={editForm.value} onClose={editForm.onFalse} fullWidth maxWidth="sm">
      <DialogTitle>Editar dados da empresa</DialogTitle>
      <DialogContent>
        <Stack spacing={3} sx={{ p: 2 }}>
          <TextField
            fullWidth
            label="Nome da empresa"
            value={formData.name}
            onChange={(e) => handleFormChange('name', e.target.value)}
          />
          <TextField
            fullWidth
            label="Endereço"
            value={formData.address}
            onChange={(e) => handleFormChange('address', e.target.value)}
          />
          <TextField
            fullWidth
            label="CNPJ"
            value={formData.cnpj}
            onChange={(e) => handleFormChange('cnpj', e.target.value)}
          />
          <TextField
            fullWidth
            label="Nome fantasia"
            value={formData.tradeName}
            onChange={(e) => handleFormChange('tradeName', e.target.value)}
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={editForm.onFalse} color="inherit">
          Cancelar
        </Button>
        <Button onClick={handleSave} variant="contained" color="primary">
          Salvar
        </Button>
      </DialogActions>
    </Dialog>
  );

  return (
    <>
      <Card>
        <CardHeader
          title="Dados da empresa"
          action={
            <IconButton
              onClick={(event: React.MouseEvent<HTMLElement>) => {
                menuActions.onOpen(event);
              }}
            >
              <Iconify icon="eva:more-vertical-fill" />
            </IconButton>
          }
        />

        <Stack spacing={1} sx={{ p: 3 }}>
          <Typography variant="subtitle1">{company.name}</Typography>
          <Typography variant="body2" color="text.secondary">
            {company.address}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {company.cnpj}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Razão Social
          </Typography>
          <Typography variant="body2">{company.tradeName}</Typography>
        </Stack>
      </Card>

      {renderMenuActions()}
      {renderEditForm()}
    </>
  );
}
