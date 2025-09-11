import type { BoxProps } from '@mui/material/Box';
import type { CardProps } from '@mui/material/Card';

import { useTabs } from 'minimal-shared/hooks';

import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Card from '@mui/material/Card';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import CardHeader from '@mui/material/CardHeader';

import { fCurrency } from 'src/utils/format-number';

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { CustomTabs } from 'src/components/custom-tabs';

// ----------------------------------------------------------------------

const TABS = [
  { value: 'visit', label: 'Visita' },
  { value: 'interest', label: 'Interesse' },
  { value: 'proposal', label: 'Proposta' },
  { value: 'signature', label: 'Assinatura' },
];

// ----------------------------------------------------------------------

type Props = CardProps & {
  title?: string;
  subheader?: string;
  list: {
    id: string;
    name: string;
    date: string;
    price: number;
    agent: string;
  }[];
};

export function AppTopRelated({ title, subheader, list, sx, ...other }: Props) {
  const tabs = useTabs('visit');

  const renderTabs = () => (
    <CustomTabs
      value={tabs.value}
      onChange={tabs.onChange}
      variant="fullWidth"
      slotProps={{ tab: { px: 0 } }}
    >
      {TABS.map((tab) => (
        <Tab key={tab.value} value={tab.value} label={tab.label} />
      ))}
    </CustomTabs>
  );

  const totalValue = list.reduce((sum, item) => sum + item.price, 0);
  const activeDeals = list.length;

  return (
    <Card sx={{ ...sx, height: 'auto' }} {...other}>
      <CardHeader
        title={title}
        action={
          <IconButton>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        }
        sx={{ mb: 2 }}
      />

      {renderTabs()}

      <Scrollbar sx={{ minHeight: 200, height: 0.5, maxHeight: 260 }}>
        <Box
          sx={{
            p: 3,
            gap: 3,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {list.map((item) => (
            <Item key={item.id} item={item} />
          ))}
        </Box>
      </Scrollbar>

      <Divider />

      <Box sx={{ display: 'flex', p: 0 }}>
        <Box sx={{ flex: 1, textAlign: 'center', p: 2 }}>
          <Typography variant="subtitle2" color="text.secondary">
            Negócios ativos
          </Typography>
          <Typography variant="h4">{activeDeals}</Typography>
        </Box>

        <Divider orientation="vertical" flexItem />

        <Box sx={{ flex: 1, textAlign: 'center', p: 2 }}>
          <Typography variant="subtitle2" color="text.secondary">
            Valor do funil
          </Typography>
          <Typography variant="h4">{fCurrency(totalValue)}</Typography>
        </Box>
      </Box>
    </Card>
  );
}

// ----------------------------------------------------------------------

type ItemProps = BoxProps & {
  item: Props['list'][number];
};

function Item({ item, sx, ...other }: ItemProps) {
  return (
    <Box
      sx={[
        {
          display: 'flex',
          justifyContent: 'space-between',
          py: 1,
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...other}
    >
      <Box>
        <Typography variant="subtitle1" noWrap>
          {item.name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Visita {item.date}
        </Typography>
      </Box>

      <Box sx={{ textAlign: 'right' }}>
        <Typography variant="subtitle1">{fCurrency(item.price)}</Typography>
        <Typography variant="body2" color="text.secondary">
          {item.agent}
        </Typography>
      </Box>
    </Box>
  );
}
