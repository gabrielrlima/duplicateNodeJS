import React, { useState } from 'react';
import { Image } from '@/components/image';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Step from '@mui/material/Step';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import Radio from '@mui/material/Radio';
import Button from '@mui/material/Button';
import Switch from '@mui/material/Switch';
import Dialog from '@mui/material/Dialog';
import Stepper from '@mui/material/Stepper';
import StepLabel from '@mui/material/StepLabel';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import RadioGroup from '@mui/material/RadioGroup';
import DialogContent from '@mui/material/DialogContent';
import InputAdornment from '@mui/material/InputAdornment';
import FormControlLabel from '@mui/material/FormControlLabel';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { fCurrency } from 'src/utils/format-number';

import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

// ----------------------------------------------------------------------

interface PixCopyPasteData {
  key: string;
  type: 'cpf' | 'cnpj' | 'email' | 'phone' | 'random';
  name?: string;
  institution?: string;
  cpf?: string;
}

interface TransferData {
  pixCopyPasteData?: PixCopyPasteData;
  amount: number;
  description?: string;
  scheduledDate?: string;
  isScheduled: boolean;
  frequency?: 'mensal' | 'semanal';
  endType?: 'quantidade' | 'data';
  monthsQuantity?: number;
  endDate?: string;
}

const steps = ['Código copia e cola', 'Confirmação'];

// ----------------------------------------------------------------------

// Função para decodificar PIX copia e cola (simulação)
const decodePixCopyPaste = (pixCode: string): PixCopyPasteData | null => {
  // Simulação de decodificação do código PIX
  // Em produção, seria feita a decodificação real do código QR/copia e cola
  if (pixCode.length > 20) {
    return {
      key: 'nannie.abernathy70@yahoo.com',
      type: 'email',
      name: 'Amiah Pruitt',
      institution: 'Nubank',
      cpf: '***.***.891-***',
    };
  }
  return null;
};

// Função para extrair valor do código PIX (simulação)
const extractAmountFromPixCode = (pixCode: string): number =>
  // Simulação - em produção seria extraído do código real
  500.0;
// Função para formatar a chave PIX para exibição
const formatPixKey = (key: string, type: 'cpf' | 'cnpj' | 'email' | 'phone' | 'random'): string => {
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
      // Fallback para telefone com formato inesperado
      return phone;
    }
    default:
      return key;
  }
};

export function WalletPixCopyPasteView() {
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
  const [pixCode, setPixCode] = useState('');
  const [showPinModal, setShowPinModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showFrequencyModal, setShowFrequencyModal] = useState(false);
  const [showRecurrenceEndModal, setShowRecurrenceEndModal] = useState(false);
  const [pin, setPin] = useState(['', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [recurrenceConfigCompleted, setRecurrenceConfigCompleted] = useState(false);

  console.log(recurrenceConfigCompleted);

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handlePixCodeProcess = async () => {
    if (pixCode.trim()) {
      setIsLoading(true);

      // Simula processamento do código PIX
      setTimeout(() => {
        const decodedData = decodePixCopyPaste(pixCode.trim());
        const amount = extractAmountFromPixCode(pixCode.trim());

        if (decodedData) {
          setTransferData((prev) => ({
            ...prev,
            pixCopyPasteData: decodedData,
            amount,
          }));
          setIsLoading(false);
          handleNext();
        } else {
          setIsLoading(false);
          // Aqui você poderia mostrar um erro
        }
      }, 2000);
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

  const canProceedStep1 = pixCode.length > 0 && !isLoading;
  const isPinComplete = pin.every((digit) => digit !== '');

  // Step 1: Código copia e cola
  const renderPixCodeStep = () => (
    <Stack spacing={3}>
      <Card sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ mb: 3 }}>
          Pix copia e cola
        </Typography>

        <Box>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            Chave Pix
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={4}
            placeholder="Cole aqui o código Pix que você recebeu"
            value={pixCode}
            onChange={(e) => setPixCode(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && e.ctrlKey && pixCode.trim()) {
                handlePixCodeProcess();
              }
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start" sx={{ alignSelf: 'flex-start', mt: 1 }}>
                  <Iconify icon="eva:clipboard-fill" />
                </InputAdornment>
              ),
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                backgroundColor: 'background.paper',
                borderRadius: 2,
              },
            }}
          />
          <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
            Cole o código Pix completo que você recebeu por WhatsApp, e-mail ou outro aplicativo
          </Typography>
        </Box>

        {isLoading && (
          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Processando código Pix...
            </Typography>
            <Box
              sx={{
                width: '100%',
                height: 4,
                backgroundColor: 'action.hover',
                borderRadius: 2,
                overflow: 'hidden',
              }}
            >
              <Box
                sx={{
                  width: '30%',
                  height: '100%',
                  backgroundColor: 'primary.main',
                  borderRadius: 2,
                  animation: 'loading 1.5s ease-in-out infinite',
                }}
              />
            </Box>
          </Box>
        )}
      </Card>

      {pixCode && (
        <Alert severity="info">
          <Typography variant="body2">
            Verifique se o código foi colado corretamente antes de continuar.
          </Typography>
        </Alert>
      )}
    </Stack>
  );

  // Step 2: Confirmação
  const renderConfirmationStep = () => (
    <Stack spacing={3}>
      <Card sx={{ p: 3 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 3 }}>
          <Typography variant="h6">Você está transferindo</Typography>
          <Button
            size="small"
            startIcon={<Iconify icon="eva:edit-fill" />}
            onClick={() => setActiveStep(0)}
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

        {transferData.pixCopyPasteData && (
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
                  {transferData.pixCopyPasteData.name || 'Não informado'}
                </Typography>
              </Box>

              <Box>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                  CPF/CNPJ
                </Typography>
                <Typography variant="body2">
                  {transferData.pixCopyPasteData.cpf || '***.***.891-***'}
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
                  {formatPixKey(
                    transferData.pixCopyPasteData.key,
                    transferData.pixCopyPasteData.type
                  )}
                </Typography>
              </Box>
            </Box>

            <Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                Instituição
              </Typography>
              <Typography variant="body2">
                {transferData.pixCopyPasteData.institution || '260 - Nubank'}
              </Typography>
            </Box>
          </Stack>
        )}
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
        return renderPixCodeStep();
      case 1:
        return renderConfirmationStep();
      default:
        return null;
    }
  };

  const getStepActionButton = () => {
    const isLastStep = activeStep === steps.length - 1;

    let disabled = false;
    if (activeStep === 0) disabled = !canProceedStep1;

    return (
      <Button
        variant="contained"
        onClick={isLastStep ? handleConfirmTransfer : handlePixCodeProcess}
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
                {transferData.pixCopyPasteData?.name || 'Destinatário via PIX'}
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
        heading="Pix copia e cola"
        links={[
          { name: 'Painel', href: paths.dashboard.root },
          { name: 'Carteira da imobiliária', href: paths.dashboard.wallet.root },
          { name: 'Pix copia e cola' },
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

      <style>{`
        @keyframes loading {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(300%); }
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </DashboardContent>
  );
}
