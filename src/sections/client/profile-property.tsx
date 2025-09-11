import type { CardProps } from '@mui/material/Card';
import type { IClientItem, IClientProperty } from 'src/types/client';

import { useState } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Avatar from '@mui/material/Avatar';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import FormControl from '@mui/material/FormControl';
import ListItemText from '@mui/material/ListItemText';

import { Iconify } from 'src/components/iconify';
// ----------------------------------------------------------------------
type Props = {
  property: IClientProperty[];
  client: IClientItem;
};

export function ProfileProperty({ property, client }: Props) {
  return (
    <>
      <Typography variant="h4" sx={{ my: 5 }}>
        Imóveis de {client.name.split(' ')[0]}
      </Typography>
      <Box
        sx={{
          gap: 3,
          display: 'grid',
          gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
        }}
      >
        {property.map((item) => (
          <PropertyCard key={item.id} propertyData={item} />
        ))}
      </Box>
    </>
  );
}
// ----------------------------------------------------------------------
type PropertyCardProps = CardProps & {
  propertyData: IClientProperty;
};

function PropertyCard({ propertyData: property, sx, ...other }: PropertyCardProps) {
  const [status, setStatus] = useState(property.status);

  // Função para lidar com a mudança de status
  const handleStatusChange = (event) => {
    setStatus(event.target.value);
  };

  // Determinar o estilo com base no status
  const getStatusStyle = (statusValue) => {
    switch (statusValue) {
      case 'Visita agendada':
        return {
          color: '#F5A623',
          borderColor: '#F5A623',
          // icon: 'eva:arrow-forward-fill'
        };
      case 'Comprado':
        return {
          color: '#4CAF50',
          borderColor: '#4CAF50',
          icon: '',
        };
      case 'Cancelado':
        return {
          color: '#F44336',
          borderColor: '#F44336',
          icon: '',
        };
      case 'À venda':
        return {
          color: '#2196F3',
          borderColor: '#2196F3',
          icon: '',
        };
      default:
        return {
          color: 'inherit',
          borderColor: 'divider',
          icon: '',
        };
    }
  };

  const statusStyle = getStatusStyle(status);

  // Status options para o select
  const statusOptions = ['Visita agendada', 'Comprado', 'Cancelado', 'À venda'];

  return (
    <Card
      sx={[
        (theme) => ({
          display: 'flex',
          alignItems: 'center',
          p: theme.spacing(3, 2, 3, 3),
        }),
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...other}
    >
      <Avatar
        alt={property?.name}
        src={property?.avatarUrl}
        sx={{ width: 48, height: 48, mr: 2 }}
      />
      <ListItemText
        primary={property?.name}
        secondary={
          <>
            <Iconify icon="mingcute:location-fill" width={16} sx={{ flexShrink: 0, mr: 0.5 }} />
            {property?.city}, {property?.state}
          </>
        }
        slotProps={{
          primary: { noWrap: true },
          secondary: {
            noWrap: true,
            sx: {
              mt: 0.5,
              display: 'flex',
              alignItems: 'center',
              typography: 'caption',
              color: 'text.disabled',
            },
          },
        }}
      />
      <FormControl size="small" sx={{ flexShrink: 0, ml: 1.5, minWidth: 120 }}>
        <Select
          value={status}
          onChange={handleStatusChange}
          sx={{
            height: 32,
            color: statusStyle.color,
            borderRadius: 1.5,
            borderColor: statusStyle.borderColor,
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: statusStyle.borderColor,
            },
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: statusStyle.borderColor,
            },
            '& .MuiSelect-select': {
              display: 'flex',
              alignItems: 'center',
              padding: '4px 12px',
            },
            '& .MuiSvgIcon-root': {
              color: statusStyle.color,
            },
          }}
          // IconComponent={(props) => (
          //   status === 'Visita agendada' ?
          //     <Iconify icon="eva:arrow-forward-fill" width={16} {...props} style={{ marginRight: 8 }} /> :
          //     <Iconify icon="eva:arrow-ios-downward-fill" width={16} {...props} style={{ marginRight: 8 }} />
          // )}
          MenuProps={{
            PaperProps: {
              sx: {
                '& .MuiMenuItem-root': {
                  minHeight: 36,
                },
              },
            },
          }}
        >
          {statusOptions.map((option) => {
            const optionStyle = getStatusStyle(option);
            return (
              <MenuItem
                key={option}
                value={option}
                sx={{
                  color: optionStyle.color,
                  '&.Mui-selected': {
                    backgroundColor: `${optionStyle.color}10`,
                    '&:hover': {
                      backgroundColor: `${optionStyle.color}20`,
                    },
                  },
                  '&:hover': {
                    backgroundColor: `${optionStyle.color}10`,
                  },
                }}
              >
                {option}
              </MenuItem>
            );
          })}
        </Select>
      </FormControl>
    </Card>
  );
}
