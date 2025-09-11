import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Avatar from '@mui/material/Avatar';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';

import { Scrollbar } from 'src/components/scrollbar';

// ----------------------------------------------------------------------

type Props = {
  title?: string;
  list: {
    id: string;
    name: string;
    date: string;
    price: string;
    agent: string;
    coverUrl: string;
  }[];
  sx?: any;
};

export function LatestSales({ title = 'Últimas vendas', list, sx, ...other }: Props) {
  return (
    <Card sx={{ ...sx }} {...other}>
      <CardHeader
        title={
          <Typography variant="h5" sx={{ fontWeight: 600, fontSize: 28 }}>
            {title}
          </Typography>
        }
        sx={{ pb: 0, px: 3, pt: 3 }}
      />

      <Scrollbar sx={{ height: 'calc(100% - 80px)' }}>
        <Box
          sx={{
            p: 3,
            gap: 3,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {list.map((item) => (
            <SaleItem key={item.id} item={item} />
          ))}
        </Box>
      </Scrollbar>
    </Card>
  );
}

// ----------------------------------------------------------------------

type SaleItemProps = {
  item: Props['list'][number];
  sx?: any;
};

function SaleItem({ item, sx }: SaleItemProps) {
  return (
    <Box
      sx={[
        {
          gap: 2,
          display: 'flex',
          alignItems: 'flex-start',
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      <Avatar
        variant="rounded"
        alt={item.name}
        src={item.coverUrl}
        sx={{
          width: 50,
          height: 50,
          flexShrink: 0,
          borderRadius: 1,
        }}
      />

      <Box
        sx={{
          gap: 0.5,
          minWidth: 0,
          display: 'flex',
          flex: '1 1 auto',
          flexDirection: 'column',
        }}
      >
        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
          {item.name} - {item.date}
        </Typography>

        <Typography variant="body1" sx={{ color: 'text.primary', fontWeight: 500 }}>
          {item.price} | {item.agent}
        </Typography>
      </Box>
    </Box>
  );
}
