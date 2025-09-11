import { useState } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';

// ----------------------------------------------------------------------

type Props = {
  onChangeStatus: (newValue: string) => void;
};

type InterestOption = {
  id: string;
  label: string;
  color: 'inherit' | 'warning' | 'success';
};

const INTEREST_OPTIONS: InterestOption[] = [
  { id: 'nao_sei', label: 'Não sei dizer', color: 'inherit' },
  { id: 'nao_gostou', label: 'Ele não gostou', color: 'warning' },
  { id: 'em_duvida', label: 'Ele ficou em dúvida', color: 'inherit' },
  { id: 'quer_comprar', label: 'Ele quer comprar', color: 'success' },
];

export function VendasInterestClassification({ onChangeStatus }: Props) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const handleOptionSelect = (optionId: string) => {
    setSelectedOption(optionId);
    // Apenas para fins informativos, não altera o status
  };

  return (
    <Card sx={{ width: '100%' }}>
      <CardContent>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Como você classificaria o nível de interesse do cliente?
        </Typography>

        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', width: '100%' }}>
          {INTEREST_OPTIONS.map((option) => (
            <Button
              key={option.id}
              variant={selectedOption === option.id ? 'contained' : 'outlined'}
              color={selectedOption === option.id ? option.color : 'inherit'}
              onClick={() => handleOptionSelect(option.id)}
              sx={{
                textTransform: 'none',
                flex: 1,
                minWidth: 'fit-content',
              }}
            >
              {option.label}
            </Button>
          ))}
        </Box>
      </CardContent>
    </Card>
  );
}
