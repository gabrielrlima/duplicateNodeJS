import { fSub, fAdd } from 'src/utils/format-time';

import { _mock } from './_mock';

// ----------------------------------------------------------------------

export const COBRANCA_STATUS_OPTIONS = [
  { value: 'Pago', label: 'Pago' },
  { value: 'Pendente', label: 'Pendente' },
  { value: 'Vencido', label: 'Vencido' },
];

const PRODUTOS_MOCK = [
  'Apartamento 2 quartos - Centro',
  'Casa 3 quartos - Jardim América',
  'Sala comercial - Centro',
  'Cobertura 4 quartos - Bela Vista',
  'Apartamento 1 quarto - Vila Madalena',
  'Casa 4 quartos - Morumbi',
  'Loft - Vila Olímpia',
  'Apartamento 3 quartos - Ipanema',
  'Casa 2 quartos - Copacabana',
  'Sala comercial - Faria Lima',
];

export const _cobrancas = Array.from({ length: 20 }, (_, index) => {
  const status =
    (index % 2 && 'Pago') ||
    (index % 3 && 'Pendente') ||
    ('Vencido' as 'Pago' | 'Pendente' | 'Vencido');

  const isOverdue = status === 'Vencido';
  const isPaid = status === 'Pago';

  const vencimento = isPaid
    ? fSub({ days: _mock.number.nativeS(index) + 1 })
    : isOverdue
      ? fSub({ days: _mock.number.nativeS(index) + 10 })
      : fAdd({ days: _mock.number.nativeS(index) + 5 });

  const valorTotal = _mock.number.price(index);
  const numParcelas = Math.floor(Math.random() * 6) + 1; // 1 a 6 parcelas
  const valorParcela = valorTotal / numParcelas;

  // Gerar recebimentos/parcelas
  const recebimentos = Array.from({ length: numParcelas }, (__, parcelaIndex) => {
    const statusParcela =
      parcelaIndex === 0
        ? status
        : ((Math.random() > 0.5 ? 'Pago' : Math.random() > 0.5 ? 'Pendente' : 'Vencido') as
            | 'Pago'
            | 'Pendente'
            | 'Vencido');

    const vencimentoParcela = fAdd({
      days: _mock.number.nativeS(index) + parcelaIndex * 30,
    }).split('T')[0];

    return {
      id: `${_mock.id(index)}-${parcelaIndex + 1}`,
      parcela: parcelaIndex + 1,
      valor: valorParcela,
      vencimento: vencimentoParcela,
      status: statusParcela,
      dataPagamento:
        statusParcela === 'Pago'
          ? fSub({ days: Math.floor(Math.random() * 5) }).split('T')[0]
          : undefined,
      formaPagamento:
        statusParcela === 'Pago'
          ? ['PIX', 'Cartão de Crédito', 'Boleto', 'Transferência'][Math.floor(Math.random() * 4)]
          : undefined,
    };
  });

  return {
    id: _mock.id(index),
    cliente: _mock.fullName(index),
    produto: PRODUTOS_MOCK[index % PRODUTOS_MOCK.length],
    valor: valorTotal,
    vencimento: vencimento.split('T')[0],
    status,
    descricao: `Cobrança referente ao ${_mock.sentence(index)}`,
    dataCriacao: fSub({ days: _mock.number.nativeS(index) + 30 }).split('T')[0],
    email: _mock.email(index),
    telefone: _mock.phoneNumber(index),
    recebimentos,
  };
});
