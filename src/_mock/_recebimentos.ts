import { _mock } from './_mock';

// ----------------------------------------------------------------------

export const RECEBIMENTOS_STATUS_OPTIONS = [
  { value: 'pending', label: 'Pendente' },
  { value: 'confirmed', label: 'Confirmado' },
  { value: 'paid', label: 'Pago' },
  { value: 'overdue', label: 'Vencido' },
  { value: 'cancelled', label: 'Cancelado' },
];

export const _recebimentos = Array.from({ length: 20 }, (_, index) => {
  const customer = {
    id: _mock.id(index),
    name: _mock.fullName(index),
    email: _mock.email(index),
    avatarUrl: _mock.image.avatar(index),
    phone: _mock.phoneNumber(index),
  };

  const property = {
    id: _mock.id(index + 20),
    name: _mock.productName(index),
    address: _mock.fullAddress(index),
    city: _mock.countryNames(index % 20),
    state: ['SP', 'RJ', 'MG', 'RS', 'PR'][index % 5],
    zipCode: `${String(Math.floor(Math.random() * 90000) + 10000)}-${String(Math.floor(Math.random() * 900) + 100)}`,
    type: ['Apartamento', 'Casa', 'Terreno', 'Comercial'][index % 4],
    rentValue: `R$ ${(1000 + index * 200).toLocaleString('pt-BR')},00`,
  };

  const payment = {
    method: ['PIX', 'Boleto', 'Cartão de Crédito', 'Transferência'][index % 4],
    reference: `REF${String(index + 1).padStart(6, '0')}`,
  };

  const history = [
    {
      type: 'payment_created',
      title: 'Recebimento criado',
      message: 'Recebimento foi criado no sistema',
      time: _mock.time(1),
      by: 'Sistema',
    },
    ...(index % 3 === 0
      ? [
          {
            type: 'payment_confirmed',
            title: 'Pagamento confirmado',
            message: 'Pagamento foi confirmado pelo cliente',
            time: _mock.time(2),
            by: customer.name,
          },
        ]
      : []),
    ...(index % 4 === 0
      ? [
          {
            type: 'payment_received',
            title: 'Pagamento realizado',
            message: 'Pagamento foi processado com sucesso',
            time: _mock.time(3),
            by: 'Sistema',
          },
        ]
      : []),
  ];

  const status =
    index % 4 === 0
      ? 'paid'
      : index % 3 === 0
        ? 'confirmed'
        : index % 5 === 0
          ? 'overdue'
          : index % 7 === 0
            ? 'cancelled'
            : 'pending';

  return {
    id: _mock.id(index),
    receiptNumber: `REC${String(index + 1).padStart(6, '0')}`,
    description: `Parcela ${(index % 12) + 1}/12 - ${property.name}`,
    amount: _mock.number.price(index) * 100,
    status,
    dueDate: _mock.time(index + 1),
    paidDate: status === 'paid' ? _mock.time(index + 2) : null,
    createdAt: _mock.time(0),
    customer,
    property,
    payment: status !== 'pending' ? payment : null,
    history,
    installment: (index % 12) + 1,
    totalInstallments: 12,
  };
});
