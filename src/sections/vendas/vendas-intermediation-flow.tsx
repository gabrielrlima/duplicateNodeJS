import { useState } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Alert from '@mui/material/Alert';
import Select from '@mui/material/Select';
import Switch from '@mui/material/Switch';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import InputLabel from '@mui/material/InputLabel';
import AlertTitle from '@mui/material/AlertTitle';
import CardHeader from '@mui/material/CardHeader';
import FormControl from '@mui/material/FormControl';
import CardContent from '@mui/material/CardContent';
import FormControlLabel from '@mui/material/FormControlLabel';

import { fCurrency } from 'src/utils/format-number';

// ----------------------------------------------------------------------

type Props = {
  propertyValue?: number;
  downPayment?: number;
  downPaymentDate?: string;
};

export function VendasIntermediationFlow({
  propertyValue = 291271.75,
  downPayment = 21715.88,
  downPaymentDate = '25/02/2025',
}: Props) {
  const [isInstallmentEnabled, setIsInstallmentEnabled] = useState(true);
  const [installmentCount, setInstallmentCount] = useState(4);
  const [firstInstallmentDate, setFirstInstallmentDate] = useState('25/03/2025');
  const [paymentDate, setPaymentDate] = useState(downPaymentDate);

  const installmentValue = downPayment / installmentCount;

  return (
    <Card>
      <CardHeader title="Fluxo da intermediação" />
      <CardContent>
        <Alert severity="info" sx={{ mb: 3 }}>
          <AlertTitle>
            Valor fixo por parcela, independentemente do número de parcelas escolhido.
          </AlertTitle>
        </Alert>

        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 3, mb: 3 }}>
          <Box>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Valor do imóvel
            </Typography>
            <Typography variant="h6">{fCurrency(propertyValue)}</Typography>
          </Box>
          <Box>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Valor da entrada
            </Typography>
            <Typography variant="h6">{fCurrency(downPayment)}</Typography>
          </Box>
        </Box>

        <Box sx={{ mb: 3 }}>
          <TextField
            label="Data de pagamento da entrada"
            type="date"
            size="small"
            value={paymentDate.split('/').reverse().join('-')}
            onChange={(e) => {
              const [year, month, day] = e.target.value.split('-');
              setPaymentDate(`${day}/${month}/${year}`);
            }}
            InputLabelProps={{
              shrink: true,
            }}
            sx={{ width: '100%' }}
          />
        </Box>

        <Box sx={{ mb: 3 }}>
          <FormControlLabel
            control={
              <Switch
                checked={isInstallmentEnabled}
                onChange={(e) => setIsInstallmentEnabled(e.target.checked)}
                color="primary"
              />
            }
            label={`Parcelar o valor da entrada ${fCurrency(downPayment)}`}
          />
        </Box>

        {isInstallmentEnabled && (
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 3, mb: 3 }}>
            <FormControl size="small">
              <InputLabel>Quantidade de parcelas?</InputLabel>
              <Select
                value={installmentCount}
                label="Quantidade de parcelas?"
                onChange={(e) => setInstallmentCount(Number(e.target.value))}
              >
                <MenuItem value={2}>2 parcelas</MenuItem>
                <MenuItem value={3}>3 parcelas</MenuItem>
                <MenuItem value={4}>4 parcelas</MenuItem>
                <MenuItem value={5}>5 parcelas</MenuItem>
                <MenuItem value={6}>6 parcelas</MenuItem>
              </Select>
            </FormControl>

            <TextField
              label="Data da primeira parcela"
              type="date"
              size="small"
              value={firstInstallmentDate.split('/').reverse().join('-')}
              onChange={(e) => {
                const [year, month, day] = e.target.value.split('-');
                setFirstInstallmentDate(`${day}/${month}/${year}`);
              }}
              InputLabelProps={{
                shrink: true,
              }}
              sx={{ width: '100%' }}
            />
          </Box>
        )}

        <Box sx={{ mt: 4, pt: 3, borderTop: '1px solid', borderColor: 'divider' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="h6">Valor da intermediação</Typography>
            <Typography variant="h6">{fCurrency(downPayment)}</Typography>
          </Box>

          {isInstallmentEnabled && (
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="body1">Valor da parcela</Typography>
              <Typography variant="body1" sx={{ fontWeight: 600 }}>
                {fCurrency(installmentValue)}
              </Typography>
            </Box>
          )}
        </Box>
      </CardContent>
    </Card>
  );
}
