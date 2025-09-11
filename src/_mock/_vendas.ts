import { fSub, fAdd } from 'src/utils/format-time';

import { _mock } from './_mock';
import { _tags } from './assets';

const _addressBooks = Array.from({ length: 21 }, (_, index) => ({
  id: _mock.id(index),
  name: _mock.fullName(index),
  company: _mock.companyNames(index),
  phone: _mock.phoneNumber(index) || '+1 234 567 8900',
  address: _mock.fullAddress(index) || 'Default Address',
  email: _mock.email(index),
  primary: index === 0,
}));

// ----------------------------------------------------------------------

export const VENDAS_STATUS_OPTIONS = [
  { value: 'atendimento', label: 'Atendimento' },
  { value: 'visita', label: 'Visita' },
  { value: 'interesse', label: 'Interesse' },
  { value: 'proposta', label: 'Proposta' },
  { value: 'assinatura_pagamento', label: 'Pagamento' },
  { value: 'cancelado', label: 'Cancelado' },
];

export const VENDAS_SERVICE_OPTIONS = Array.from({ length: 8 }, (_, index) => ({
  id: _mock.id(index),
  name: _tags[index],
  price: _mock.number.price(index),
}));

const ITEMS = Array.from({ length: 3 }, (__, index) => {
  const total = VENDAS_SERVICE_OPTIONS[index].price * _mock.number.nativeS(index);

  return {
    id: _mock.id(index),
    total,
    title: _mock.productName(index),
    description: _mock.sentence(index),
    price: VENDAS_SERVICE_OPTIONS[index].price,
    service: VENDAS_SERVICE_OPTIONS[index].name,
    quantity: _mock.number.nativeS(index),
  };
});

const PROPERTY_NAMES = [
  'Residencial Vista Mar',
  'Condomínio Jardim das Flores',
  'Edifício Central Park',
  'Torres do Atlântico',
  'Cobertura Sunset',
  'Residencial Bela Vista',
  'Condomínio Primavera',
  'Edifício Horizonte',
  'Vila das Palmeiras',
  'Residencial Ouro Verde',
];

// IDs dos corretores para distribuir as vendas
const CORRETOR_IDS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];

export const _vendas = Array.from({ length: 20 }, (_, index) => {
  const taxes = _mock.number.price(index + 1);

  const discount = _mock.number.price(index + 2);

  const shipping = _mock.number.price(index + 3);

  const subtotal = ITEMS.reduce((accumulator, item) => accumulator + item.price * item.quantity, 0);

  const totalAmount = subtotal - shipping - discount + taxes;

  const status =
    (index % 2 && 'atendimento') ||
    (index % 3 && 'visita') ||
    (index % 4 && 'interesse') ||
    (index % 5 && 'proposta') ||
    (index % 6 && 'cancelado') ||
    'assinatura_pagamento';

  return {
    id: _mock.id(index),
    taxes,
    status,
    discount,
    shipping,
    subtotal,
    subTotalPrice: subtotal,
    totalAmount,
    items: ITEMS,
    invoiceNumber: `VND-199${index}`,
    invoiceFrom: _addressBooks[index],
    invoiceTo: _addressBooks[index + 1],
    sent: _mock.number.nativeS(index),
    createDate: new Date(fSub({ days: index })),
    dueDate: new Date(fAdd({ days: index + 15, hours: index })),
    corretorId: CORRETOR_IDS[index % CORRETOR_IDS.length],
    formData: {
      clientName: _mock.fullName(index),
      clientPhone: _mock.phoneNumber(index),
      clientEmail: _mock.email(index),
      propertyName: PROPERTY_NAMES[index % PROPERTY_NAMES.length],
      unitType: ['49 m² - 1Q', '66 m² - 1Q', '74 m² - 1Q', '83 m² - 1Q', '99 m² - 3Q'][index % 5],
      availableUnits: `Apartamento ${100 + index}`,
    },
  };
});
