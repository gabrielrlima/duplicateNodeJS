import React, { useState } from 'react';
import { Image } from '@/components/image';
import { NumericFormat } from 'react-number-format';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Step from '@mui/material/Step';
import List from '@mui/material/List';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import Radio from '@mui/material/Radio';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Switch from '@mui/material/Switch';
import Dialog from '@mui/material/Dialog';
import Stepper from '@mui/material/Stepper';
import ListItem from '@mui/material/ListItem';
import StepLabel from '@mui/material/StepLabel';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import RadioGroup from '@mui/material/RadioGroup';
import ListItemText from '@mui/material/ListItemText';
import DialogContent from '@mui/material/DialogContent';
import InputAdornment from '@mui/material/InputAdornment';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemButton from '@mui/material/ListItemButton';
import FormControlLabel from '@mui/material/FormControlLabel';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { fCurrency } from 'src/utils/format-number';

import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

// ----------------------------------------------------------------------

interface Contact {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  institution?: string;
  pixKey?: string;
  cpf?: string;
}

interface PixKeyData {
  key: string;
  type: 'cpf' | 'cnpj' | 'email' | 'phone' | 'random';
  name?: string;
}

interface TransferData {
  recipient?: Contact;
  pixKeyData?: PixKeyData;
  amount: number;
  description?: string;
  scheduledDate?: string;
  isScheduled: boolean;
  frequency?: 'mensal' | 'semanal';
  endType?: 'quantidade' | 'data';
  monthsQuantity?: number;
  endDate?: string;
}

const MOCK_CONTACTS: Contact[] = [
  {
    id: '1',
    name: 'Amiah Pruitt',
    email: 'nannie.abernathy70@yahoo.com',
    institution: 'Nubank',
    cpf: '***.***.891-***',
  },
  {
    id: '2',
    name: 'Mireya Conner',
    email: 'ashlynn.ohara62@gmail.com',
  },
  {
    id: '3',
    name: 'Lucian Obrien',
    email: 'milo.farrell@hotmail.com',
  },
  {
    id: '4',
    name: 'Deja Brady',
    email: 'violet.ratke85@yahoo.com',
  },
  {
    id: '5',
    name: 'Harrison Stein',
    email: 'letha.lubowitz4@yahoo.com',
  },
];

const steps = ['Quem vai receber?', 'Qual o valor?', 'Confirmação'];

// ----------------------------------------------------------------------

// Função para identificar o tipo da chave PIX
const identifyPixKeyType = (key: string): 'cpf' | 'cnpj' | 'email' | 'phone' | 'random' => {
  const cleanKey = key.replace(/\D/g, '');

  // CPF: 11 dígitos
  if (cleanKey.length === 11 && /^\d{11}$/.test(cleanKey)) {
    return 'cpf';
  }

  // CNPJ: 14 dígitos
  if (cleanKey.length === 14 && /^\d{14}$/.test(cleanKey)) {
    return 'cnpj';
  }

  // Email
  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(key)) {
    return 'email';
  }

  // Telefone: formato brasileiro
  if (/^(\+?55)?(\d{10,11})$/.test(cleanKey) || /^\(\d{2}\)\s?\d{4,5}-?\d{4}$/.test(key)) {
    return 'phone';
  }

  // Chave aleatória (UUID ou outras)
  return 'random';
};

// Função para formatar a chave PIX para exibição
const formatPixKey = (type: 'cpf' | 'cnpj' | 'email' | 'phone' | 'random', key: string) => {
  switch (type) {
    case 'cpf': {
      const cpf = key.replace(/\D/g, '');
      return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    }
    case 'cnpj': {
      const cnpj = key.replace(/\D/g, '');
      return cnpj.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
    }
    case 'phone': {
      const phone = key.replace(/\D/g, '');
      if (phone.length === 11) {
        return phone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
      }
      if (phone.length === 10) {
        return phone.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
      }
      return key;
    }
    default:
      return key;
  }
};

// Função para obter o nome do tipo da chave
const getPixKeyTypeName = (type: 'cpf' | 'cnpj' | 'email' | 'phone' | 'random'): string => {
  const types = {
    cpf: 'CPF',
    cnpj: 'CNPJ',
    email: 'E-mail',
    phone: 'Telefone',
    random: 'Chave aleatória',
  };
  return types[type];
};

export function WalletTransferView() {
  const router = useRouter();
  const [activeStep, setActiveStep] = useState(0);
  const [transferData, setTransferData] = useState<TransferData>({
    amount: 0,
    isScheduled: false,
    scheduledDate: 'Hoje',
    frequency: 'mensal',
    endType: 'quantidade',
    monthsQuantity: 12,
    endDate: '31/12/2025',
  });
  const [pixKey, setPixKey] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showPinModal, setShowPinModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showFrequencyModal, setShowFrequencyModal] = useState(false);
  const [showRecurrenceEndModal, setShowRecurrenceEndModal] = useState(false);
  const [pin, setPin] = useState(['', '', '', '']);
  const [isEditing, setIsEditing] = useState(false);
  const [recurrenceConfigCompleted, setRecurrenceConfigCompleted] = useState(false);

  console.log(recurrenceConfigCompleted);

  const availableBalance = 36963899.0;

  const filteredContacts = MOCK_CONTACTS.filter(
    (contact) =>
      contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleSelectContact = (contact: Contact) => {
    setTransferData((prev) => ({
      ...prev,
      recipient: contact,
      pixKeyData: undefined,
    }));
    handleNext();
  };

  const handlePixKeySelect = () => {
    if (pixKey.trim()) {
      const keyType = identifyPixKeyType(pixKey.trim());
      const pixKeyData: PixKeyData = {
        key: pixKey.trim(),
        type: keyType,
      };

      setTransferData((prev) => ({
        ...prev,
        pixKeyData,
        recipient: undefined,
      }));
      handleNext();
    }
  };

  const handleConfirmTransfer = () => {
    setShowPinModal(true);
  };

  const handlePinChange = (index: number, value: string) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newPin = [...pin];
      newPin[index] = value;
      setPin(newPin);

      if (value && index < 3) {
        const nextInput = document.getElementById(`pin-${index + 1}`);
        nextInput?.focus();
      }
    }
  };

  const handleConfirmPin = () => {
    const pinValue = pin.join('');
    if (pinValue.length === 4) {
      setShowPinModal(false);
      setShowSuccessModal(true);
    }
  };

  const handleCloseSuccess = () => {
    setShowSuccessModal(false);
    router.push(paths.dashboard.wallet.root);
  };

  const handleRepeatTransferChange = (checked: boolean) => {
    if (checked) {
      setShowFrequencyModal(true);
    } else {
      setTransferData((prev) => ({ ...prev, isScheduled: false }));
      setRecurrenceConfigCompleted(false);
    }
  };

  const handleFrequencyConfirm = () => {
    setShowFrequencyModal(false);
    setShowRecurrenceEndModal(true);
  };

  const handleRecurrenceEndConfirm = () => {
    setShowRecurrenceEndModal(false);
    setTransferData((prev) => ({ ...prev, isScheduled: true }));
    setRecurrenceConfigCompleted(true);
  };

  const handleFrequencyModalClose = () => {
    setShowFrequencyModal(false);
    setTransferData((prev) => ({ ...prev, isScheduled: false }));
    setRecurrenceConfigCompleted(false);
  };

  const handleRecurrenceEndModalClose = () => {
    setShowRecurrenceEndModal(false);
    setTransferData((prev) => ({ ...prev, isScheduled: false }));
    setRecurrenceConfigCompleted(false);
  };

  const canProceedStep1 = transferData.recipient || transferData.pixKeyData || pixKey.length > 0;
  const canProceedStep2 = transferData.amount > 0 && transferData.amount <= availableBalance;
  const isPinComplete = pin.every((digit) => digit !== '');

  const handleAmountChange = (value) => {
    const limitedValue = Math.min(value, availableBalance);
    setTransferData((prev) => ({ ...prev, amount: limitedValue }));
  };

  // Step 1: Quem vai receber
  const renderRecipientStep = () => (
    <Stack spacing={3}>
      <Card sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ mb: 3 }}>
          Quem vai receber?
        </Typography>

        <Box>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            Chave Pix
          </Typography>
          <TextField
            fullWidth
            placeholder="Insira a chave (CPF, CNPJ, e-mail, celular, chave aleatória) ou Pix copia e cola"
            value={pixKey}
            onChange={(e) => {
              setPixKey(e.target.value);
              setSearchQuery(e.target.value);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && pixKey.trim()) {
                handlePixKeySelect();
              }
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Iconify icon="eva:search-fill" />
                </InputAdornment>
              ),
              endAdornment: pixKey.trim() && (
                <InputAdornment position="end">
                  <IconButton onClick={handlePixKeySelect}>
                    <Iconify icon="eva:arrow-ios-forward-fill" />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
            Você também pode buscar pelo nome de um contato
          </Typography>
        </Box>
      </Card>

      <Card sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ mb: 1 }}>
          Todos os contatos
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Você possui {filteredContacts.length} contatos
        </Typography>

        {filteredContacts.length > 0 ? (
          <List>
            {filteredContacts.map((contact) => (
              <ListItem key={contact.id} disablePadding>
                <ListItemButton
                  onClick={() => handleSelectContact(contact)}
                  sx={{
                    borderRadius: 1,
                    '&:hover': {
                      backgroundColor: 'action.hover',
                    },
                  }}
                >
                  <ListItemAvatar>
                    <Avatar
                      sx={{
                        bgcolor: 'primary.main',
                        width: 40,
                        height: 40,
                      }}
                    >
                      {contact.name.charAt(0).toUpperCase()}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={contact.name}
                    secondary={contact.email}
                    primaryTypographyProps={{
                      fontWeight: 500,
                    }}
                  />
                  <IconButton
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                  >
                    <Iconify icon="eva:more-vertical-fill" />
                  </IconButton>
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        ) : (
          <Box sx={{ textAlign: 'center', py: 3 }}>
            <Typography variant="body2" color="text.secondary">
              {searchQuery ? 'Nenhum contato encontrado' : 'Nenhum contato encontrado'}
            </Typography>
            {pixKey.trim() && !filteredContacts.length && (
              <Button
                variant="outlined"
                onClick={handlePixKeySelect}
                sx={{ mt: 2 }}
                startIcon={<Iconify icon="eva:plus-fill" />}
              >
                Usar chave PIX: {pixKey}
              </Button>
            )}
          </Box>
        )}
      </Card>
    </Stack>
  );

  // Step 2: Qual o valor
  const renderAmountStep = () => (
    <Stack spacing={3}>
      <Alert severity="info">
        Transferências acima de R$ 10.000,00 no período noturno só são permitidas para contatos
        seguros. Para os demais, agende a transferência.
      </Alert>
      <Card sx={{ p: 3 }}>
        <Stack spacing={3}>
          <Typography variant="h6">Qual o valor?</Typography>
          <Box
            sx={{
              minHeight: '80px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
            }}
          >
            {isEditing ? (
              <NumericFormat
                customInput={TextField}
                value={transferData.amount || ''}
                onValueChange={(values) => {
                  const inputValue = parseFloat(values.value) || 0;
                  handleAmountChange(inputValue);
                }}
                onBlur={() => setIsEditing(false)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    setIsEditing(false);
                  }
                }}
                autoFocus
                variant="standard"
                thousandSeparator="."
                decimalSeparator=","
                decimalScale={2}
                fixedDecimalScale
                allowNegative={false}
                isAllowed={(values) => {
                  const { floatValue } = values;
                  return !floatValue || floatValue <= availableBalance;
                }}
                InputProps={{
                  startAdornment: <InputAdornment position="start">R$</InputAdornment>,
                  disableUnderline: true,
                  sx: {
                    fontSize: '2.125rem',
                    fontWeight: 400,
                    lineHeight: 1.2,
                    '& input': {
                      padding: 0,
                      height: 'auto',
                    },
                  },
                }}
                sx={{
                  '& .MuiInputBase-root': {
                    fontSize: '2.125rem',
                    fontWeight: 400,
                    lineHeight: 1.2,
                  },
                }}
              />
            ) : (
              <Typography
                variant="h3"
                sx={{
                  fontWeight: 400,
                  cursor: 'pointer',
                  padding: '4px 8px',
                  borderRadius: 1,
                  transition: 'background-color 0.2s',
                  '&:hover': {
                    backgroundColor: 'action.hover',
                  },
                }}
                onClick={() => setIsEditing(true)}
              >
                R$ {transferData.amount.toFixed(2).replace('.', ',')}
              </Typography>
            )}
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Saldo disponível: {fCurrency(availableBalance)}
            </Typography>
          </Box>
        </Stack>
      </Card>
      <Card sx={{ p: 3 }}>
        <Typography variant="subtitle2" sx={{ mb: 2 }}>
          Quem vai receber
        </Typography>
        {transferData.recipient ? (
          <Stack direction="row" alignItems="center" spacing={2}>
            <Avatar sx={{ bgcolor: 'primary.main' }}>
              {transferData.recipient.name.charAt(0)}
            </Avatar>
            <Box>
              <Typography variant="body2" fontWeight={600}>
                {transferData.recipient.name}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {transferData.recipient.email}
              </Typography>
              <Typography variant="caption" color="text.secondary" display="block">
                Nubank | 0001 | 45548309-0
              </Typography>
            </Box>
          </Stack>
        ) : transferData.pixKeyData ? (
          <Stack direction="row" alignItems="center" spacing={2}>
            <Avatar sx={{ bgcolor: 'secondary.main' }}>
              <Iconify icon="eva:credit-card-fill" />
            </Avatar>
            <Box>
              <Typography variant="body2" fontWeight={600}>
                {getPixKeyTypeName(transferData.pixKeyData.type)}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {formatPixKey(transferData.pixKeyData.type, transferData.pixKeyData.key)}
              </Typography>
              <Typography variant="caption" color="text.secondary" display="block">
                Chave PIX
              </Typography>
            </Box>
          </Stack>
        ) : null}
      </Card>
    </Stack>
  );

  // Step 3: Confirmação
  const renderConfirmationStep = () => (
    <Stack spacing={3}>
      <Card sx={{ p: 3 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 3 }}>
          <Typography variant="h6">Você está transferindo</Typography>
          <Button
            size="small"
            startIcon={<Iconify icon="eva:edit-fill" />}
            onClick={() => setActiveStep(1)}
          >
            Editar
          </Button>
        </Stack>

        <Stack spacing={3}>
          <Box>
            <Stack direction="row" justifyContent="space-between" sx={{ mb: 1 }}>
              <Typography variant="body2" color="text.secondary">
                Valor
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Data do pagamento
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Transferência
              </Typography>
            </Stack>
            <Stack direction="row" justifyContent="space-between">
              <Typography variant="h6">{fCurrency(transferData.amount)}</Typography>
              <Typography variant="body2">{transferData.scheduledDate}</Typography>
              <Typography variant="body2">Pix</Typography>
            </Stack>
          </Box>

          <FormControlLabel
            control={
              <Switch
                checked={transferData.isScheduled}
                onChange={(e) => handleRepeatTransferChange(e.target.checked)}
              />
            }
            label="Repetir transferência"
          />
        </Stack>
      </Card>

      <Card sx={{ p: 3 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
          <Typography variant="subtitle2">Quem vai receber</Typography>
          <Button
            size="small"
            startIcon={<Iconify icon="eva:edit-fill" />}
            onClick={() => setActiveStep(0)}
          >
            Editar
          </Button>
        </Stack>

        {transferData.recipient ? (
          <Stack spacing={2}>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: {
                  xs: '1fr',
                  sm: 'auto 1fr auto',
                },
                gap: 2,
                alignItems: 'center',
              }}
            >
              <Box sx={{ gridColumn: { xs: '1', sm: '1 / -1' } }}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                  Nome
                </Typography>
                <Typography variant="body2" fontWeight={600}>
                  {transferData.recipient.name}
                </Typography>
              </Box>

              <Box>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                  CPF/CNPJ
                </Typography>
                <Typography variant="body2">
                  {transferData.recipient.cpf || '***.***.891-***'}
                </Typography>
              </Box>

              <Box sx={{ textAlign: { xs: 'left', sm: 'right' } }}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                  Chave
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    wordBreak: 'break-all',
                    fontSize: { xs: '0.875rem', sm: '0.875rem' },
                  }}
                >
                  {transferData.recipient.email}
                </Typography>
              </Box>
            </Box>

            <Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                Instituição
              </Typography>
              <Typography variant="body2">
                {transferData.recipient.institution || '260 - Nubank'}
              </Typography>
            </Box>
          </Stack>
        ) : transferData.pixKeyData ? (
          <Stack spacing={2}>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: {
                  xs: '1fr',
                  sm: 'auto 1fr auto',
                },
                gap: 2,
                alignItems: 'center',
              }}
            >
              <Box sx={{ gridColumn: { xs: '1', sm: '1 / -1' } }}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                  Tipo da chave
                </Typography>
                <Typography variant="body2" fontWeight={600}>
                  {getPixKeyTypeName(transferData.pixKeyData.type)}
                </Typography>
              </Box>

              <Box>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                  Chave PIX
                </Typography>
                <Typography variant="body2">
                  {formatPixKey(transferData.pixKeyData.type, transferData.pixKeyData.key)}
                </Typography>
              </Box>

              <Box sx={{ textAlign: { xs: 'left', sm: 'right' } }}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                  Instituição
                </Typography>
                <Typography variant="body2">PIX</Typography>
              </Box>
            </Box>
          </Stack>
        ) : null}
      </Card>

      <TextField
        fullWidth
        multiline
        rows={3}
        placeholder="Adicionar mensagem"
        value={transferData.description || ''}
        onChange={(e) => setTransferData((prev) => ({ ...prev, description: e.target.value }))}
        sx={{
          '& .MuiOutlinedInput-root': {
            backgroundColor: 'background.paper',
            borderRadius: 2,
          },
        }}
      />
    </Stack>
  );

  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return renderRecipientStep();
      case 1:
        return renderAmountStep();
      case 2:
        return renderConfirmationStep();
      default:
        return null;
    }
  };

  const getStepActionButton = () => {
    const isLastStep = activeStep === steps.length - 1;

    let disabled = false;
    if (activeStep === 0) disabled = !canProceedStep1;
    if (activeStep === 1) disabled = !canProceedStep2;

    return (
      <Button
        variant="contained"
        onClick={isLastStep ? handleConfirmTransfer : handleNext}
        disabled={disabled}
        sx={{
          bgcolor: '#06092B',
          '&:hover': { bgcolor: '#040619' },
          minWidth: 120,
        }}
      >
        {isLastStep ? 'Transferir' : 'Continuar'}
      </Button>
    );
  };

  // Modal de Frequência
  const renderFrequencyModal = () => (
    <Dialog open={showFrequencyModal} onClose={handleFrequencyModalClose} maxWidth="xs" fullWidth>
      <DialogContent sx={{ p: 0 }}>
        <Box sx={{ p: 3, borderBottom: '1px solid', borderColor: 'divider', position: 'relative' }}>
          <IconButton
            onClick={handleFrequencyModalClose}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <Iconify icon="eva:close-fill" />
          </IconButton>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Frequência do pagamento
          </Typography>
        </Box>

        <Box sx={{ p: 3, bgcolor: 'background.neutral' }}>
          <Typography variant="body1" color="text.primary" sx={{ mb: 3 }}>
            Selecione a frequência em que o pagamento deverá ser realizado.
          </Typography>

          <RadioGroup
            value={transferData.frequency}
            onChange={(e) =>
              setTransferData((prev) => ({
                ...prev,
                frequency: e.target.value as 'mensal' | 'semanal',
              }))
            }
          >
            <FormControlLabel value="mensal" control={<Radio />} label="Mensal" sx={{ mb: 2 }} />
            <FormControlLabel value="semanal" control={<Radio />} label="Semanal" />
          </RadioGroup>
        </Box>

        <Stack
          direction="row"
          spacing={2}
          sx={{ p: 3, borderTop: '1px solid', borderColor: 'divider' }}
        >
          <Button variant="outlined" onClick={handleFrequencyModalClose} fullWidth>
            Fechar
          </Button>
          <Button
            variant="contained"
            onClick={handleFrequencyConfirm}
            fullWidth
            sx={{
              bgcolor: '#06092B',
              '&:hover': { bgcolor: '#040619' },
            }}
          >
            Continuar
          </Button>
        </Stack>
      </DialogContent>
    </Dialog>
  );

  // Modal de Fim do Pagamento Recorrente
  const renderRecurrenceEndModal = () => (
    <Dialog
      open={showRecurrenceEndModal}
      onClose={handleRecurrenceEndModalClose}
      maxWidth="xs"
      fullWidth
    >
      <DialogContent sx={{ p: 0 }}>
        <Box sx={{ p: 3, borderBottom: '1px solid', borderColor: 'divider', position: 'relative' }}>
          <IconButton
            onClick={handleRecurrenceEndModalClose}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <Iconify icon="eva:close-fill" />
          </IconButton>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Fim do pagamento recorrente
          </Typography>
        </Box>

        <Box sx={{ p: 3, bgcolor: 'background.neutral' }}>
          <Typography variant="body1" color="text.primary" sx={{ mb: 3 }}>
            Adicione a quantidade de pagamentos ou a data que a recorrência deve terminar
          </Typography>

          <RadioGroup
            value={transferData.endType}
            onChange={(e) =>
              setTransferData((prev) => ({
                ...prev,
                endType: e.target.value as 'quantidade' | 'data',
              }))
            }
          >
            <FormControlLabel
              value="quantidade"
              control={<Radio />}
              label="Quantidade de meses"
              sx={{ mb: 2 }}
            />
            {transferData.endType === 'quantidade' && (
              <Box sx={{ ml: 4, mb: 2 }}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  Quantidade
                </Typography>
                <TextField
                  type="number"
                  value={transferData.monthsQuantity}
                  onChange={(e) =>
                    setTransferData((prev) => ({
                      ...prev,
                      monthsQuantity: parseInt(e.target.value) || 12,
                    }))
                  }
                  size="small"
                  sx={{ width: 100 }}
                  inputProps={{ min: 1, max: 120 }}
                />
              </Box>
            )}

            <FormControlLabel value="data" control={<Radio />} label="Data limite" />
            {transferData.endType === 'data' && (
              <Box sx={{ ml: 4, mb: 2 }}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  Data limite
                </Typography>
                <TextField
                  type="date"
                  value={transferData.endDate?.split('/').reverse().join('-') || '2025-12-31'}
                  onChange={(e) => {
                    const date = new Date(e.target.value);
                    const formattedDate = date.toLocaleDateString('pt-BR');
                    setTransferData((prev) => ({ ...prev, endDate: formattedDate }));
                  }}
                  size="small"
                  InputLabelProps={{ shrink: true }}
                />
              </Box>
            )}
          </RadioGroup>
        </Box>

        <Stack
          direction="row"
          spacing={2}
          sx={{ p: 3, borderTop: '1px solid', borderColor: 'divider' }}
        >
          <Button variant="outlined" onClick={handleRecurrenceEndModalClose} fullWidth>
            Voltar
          </Button>
          <Button
            variant="contained"
            onClick={handleRecurrenceEndConfirm}
            fullWidth
            sx={{
              bgcolor: '#06092B',
              '&:hover': { bgcolor: '#040619' },
            }}
          >
            Continuar
          </Button>
        </Stack>
      </DialogContent>
    </Dialog>
  );

  // Modal PIN
  const renderPinModal = () => (
    <Dialog open={showPinModal} onClose={() => setShowPinModal(false)} maxWidth="xs" fullWidth>
      <DialogContent sx={{ textAlign: 'start', p: 0 }}>
        <Box sx={{ p: 3 }}>
          <IconButton
            onClick={() => setShowPinModal(false)}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <Iconify icon="eva:close-fill" />
          </IconButton>

          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Digite seu PIN
          </Typography>
        </Box>
        <Box sx={{ bgcolor: 'background.neutral', borderRadius: 0, p: 3 }}>
          <Typography variant="body1" color="text.primary" sx={{ mb: 4 }}>
            Por favor, insira sua senha de 4 dígitos para confirmar a transação.
          </Typography>

          {/* PIN Display */}
          <Stack
            direction="row"
            spacing={2}
            justifyContent="center"
            sx={{ mb: 4, justifyContent: 'space-between' }}
          >
            {pin.map((digit, index) => (
              <Box
                key={index}
                sx={{
                  width: 80,
                  height: 110,
                  border: '2px solid',
                  borderColor: 'divider',
                  borderRadius: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  bgcolor: 'background.default',
                  animation: 'pulse 1s infinite',
                }}
              >
                {digit ? (
                  <Typography variant="h5" sx={{ fontWeight: 600 }}>
                    *
                  </Typography>
                ) : (
                  <Typography variant="h5" sx={{ fontWeight: 300, color: 'text.disabled' }}>
                    ---
                  </Typography>
                )}
              </Box>
            ))}
          </Stack>

          {/* Keypad */}
          <Box sx={{ mx: 'auto' }}>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: 2,
                mb: 2,
              }}
            >
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((number) => (
                <Button
                  key={number}
                  variant="contained"
                  onClick={() => {
                    const nextEmptyIndex = pin.findIndex((digit) => digit === '');
                    if (nextEmptyIndex !== -1) {
                      handlePinChange(nextEmptyIndex, number.toString());
                    }
                  }}
                  sx={{
                    height: 56,
                    fontSize: '1.25rem',
                    fontWeight: 600,
                    color: 'text.primary',
                    bgcolor: '#FFAB00',
                    '&:hover': { bgcolor: '#E67700' },
                  }}
                >
                  {number}
                </Button>
              ))}
            </Box>

            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr 1fr',
                gap: 2,
                alignItems: 'center',
              }}
            >
              <Box /> {/* Empty space */}
              <Button
                variant="contained"
                onClick={() => {
                  const nextEmptyIndex = pin.findIndex((digit) => digit === '');
                  if (nextEmptyIndex !== -1) {
                    handlePinChange(nextEmptyIndex, '0');
                  }
                }}
                sx={{
                  height: 56,
                  fontSize: '1.25rem',
                  fontWeight: 600,
                  color: 'text.primary',
                  bgcolor: '#FFAB00',
                  '&:hover': { bgcolor: '#E67700' },
                }}
              >
                0
              </Button>
              <IconButton
                onClick={() => setPin(['', '', '', ''])}
                sx={{
                  bgcolor: 'action.hover',
                  '&:hover': { bgcolor: 'action.selected' },
                  height: '100%',
                  width: '100%',
                  borderRadius: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Box
                  sx={{
                    bgcolor: 'common.black',
                    color: 'common.white',
                    borderRadius: '50%',
                    width: 24,
                    height: 24,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Iconify icon="eva:close-fill" width={16} height={16} />
                </Box>
              </IconButton>
            </Box>
          </Box>
        </Box>

        {/* Action Buttons */}
        <Stack direction="row" spacing={2} sx={{ p: 3 }}>
          <Button variant="outlined" onClick={() => setShowPinModal(false)} fullWidth>
            Cancelar
          </Button>
          <Button
            variant="contained"
            onClick={handleConfirmPin}
            disabled={!isPinComplete}
            fullWidth
            sx={{
              bgcolor: '#06092B',
              '&:hover': { bgcolor: '#040619' },
            }}
          >
            Confirmar
          </Button>
        </Stack>
      </DialogContent>
    </Dialog>
  );

  // Modal Success
  const renderSuccessModal = () => (
    <Dialog open={showSuccessModal} onClose={handleCloseSuccess} maxWidth="sm" fullWidth>
      <DialogContent sx={{ textAlign: 'start', p: 3 }}>
        <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
          Transferência concluída
        </Typography>

        <Box sx={{ textAlign: 'center' }}>
          {/* Success Icon */}
          <Image
            src="/assets/icons/utils/ic-success.svg"
            alt="Success"
            sx={{ width: 80, height: 80, mx: 'auto', mb: 3 }}
          />

          <Typography variant="body1" sx={{ mb: 4 }}>
            Sua transferência de <strong>{fCurrency(transferData.amount)}</strong> foi realizada com
            sucesso!
          </Typography>
        </Box>

        {/* Transfer Details */}
        <Box sx={{ bgcolor: 'background.neutral', borderRadius: 2, p: 2, mb: 3 }}>
          <Stack spacing={2}>
            <Stack direction="row" justifyContent="space-between">
              <Typography variant="body2" color="text.secondary">
                Valor
              </Typography>
              <Typography variant="body2" fontWeight={600}>
                {fCurrency(transferData.amount)}
              </Typography>
            </Stack>
            <Stack direction="row" justifyContent="space-between">
              <Typography variant="body2" color="text.secondary">
                Nome
              </Typography>
              <Typography variant="body2" fontWeight={600}>
                {transferData.recipient?.name ||
                  transferData.pixKeyData?.name ||
                  'Destinatário via PIX'}
              </Typography>
            </Stack>
            <Stack direction="row" justifyContent="space-between">
              <Typography variant="body2" color="text.secondary">
                Data
              </Typography>
              <Typography variant="body2" fontWeight={600}>
                {new Date().toLocaleDateString('pt-BR')} 10:00
              </Typography>
            </Stack>
            {transferData.isScheduled && (
              <Stack direction="row" justifyContent="space-between">
                <Typography variant="body2" color="text.secondary">
                  Recorrência
                </Typography>
                <Typography variant="body2" fontWeight={600}>
                  {transferData.frequency === 'mensal' ? 'Mensal' : 'Semanal'}
                </Typography>
              </Stack>
            )}
          </Stack>
        </Box>

        {/* Action Buttons */}
        <Stack direction="row" spacing={2}>
          <Button variant="outlined" onClick={handleCloseSuccess} fullWidth>
            Fechar
          </Button>
          <Button
            variant="contained"
            onClick={() => {
              console.log('Baixar comprovante');
            }}
            fullWidth
            sx={{
              bgcolor: '#06092B',
              '&:hover': { bgcolor: '#040619' },
            }}
          >
            Baixar comprovante em PDF
          </Button>
        </Stack>
      </DialogContent>
    </Dialog>
  );

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Transferir"
        links={[
          { name: 'Painel', href: paths.dashboard.root },
          { name: 'Carteira da imobiliária', href: paths.dashboard.wallet.root },
          { name: 'Transferir' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <Box sx={{ width: '100%' }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
          <Stepper activeStep={activeStep} alternativeLabel sx={{ width: '100%' }}>
            {steps.map((label, index) => (
              <Step key={label}>
                <StepLabel
                  StepIconProps={{
                    sx: {
                      '&.Mui-active': {
                        color: '#34A853',
                      },
                      '&.Mui-completed': {
                        color: '#34A853',
                      },
                    },
                  }}
                >
                  <Typography
                    variant="caption"
                    color={index <= activeStep ? 'primary' : 'text.secondary'}
                  >
                    {label}
                  </Typography>
                </StepLabel>
              </Step>
            ))}
          </Stepper>
        </Box>

        <Box sx={{ mx: 'auto' }}>{renderStepContent()}</Box>

        <Box sx={{ mx: 'auto' }}>
          <Stack direction="row" justifyContent="end" sx={{ mt: 4, gap: 2 }}>
            <Button
              variant="outlined"
              onClick={
                activeStep === 0 ? () => router.push(paths.dashboard.wallet.root) : handleBack
              }
              sx={{ minWidth: 120 }}
            >
              {activeStep === 0 ? 'Voltar' : 'Voltar'}
            </Button>

            {getStepActionButton()}
          </Stack>
        </Box>
      </Box>

      {/* Modais */}
      {renderFrequencyModal()}
      {renderRecurrenceEndModal()}
      {renderPinModal()}
      {renderSuccessModal()}
    </DashboardContent>
  );
}
