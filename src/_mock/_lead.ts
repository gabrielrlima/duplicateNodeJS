import type { ILeadItem } from 'src/types/lead';

import { _mock } from './_mock';

// ----------------------------------------------------------------------

export const LEAD_STATUS_OPTIONS = [
  { value: 'ativo', label: 'Ativo' },
  { value: 'desativados', label: 'Desativado' },
  { value: 'convertido', label: 'Convertido' },
  { value: 'perdido', label: 'Perdido' },
];

export const LEAD_PRIORITY_OPTIONS = [
  { value: 'alta', label: 'Alta' },
  { value: 'media', label: 'Média' },
  { value: 'baixa', label: 'Baixa' },
];

export const LEAD_SOURCE_OPTIONS = [
  { value: 'website', label: 'Website' },
  { value: 'facebook', label: 'Facebook' },
  { value: 'google', label: 'Google Ads' },
  { value: 'indicacao', label: 'Indicação' },
  { value: 'whatsapp', label: 'WhatsApp' },
  { value: 'email', label: 'Email Marketing' },
];

export const PRODUCT_OPTIONS = [
  { value: 'Lake House', label: 'Lake House' },
  { value: 'Mountain View', label: 'Mountain View' },
  { value: 'City Loft', label: 'City Loft' },
  { value: 'Beach House', label: 'Beach House' },
  { value: 'Garden Villa', label: 'Garden Villa' },
];

export const UNIT_OPTIONS = [
  { value: '66m2, 99m2', label: '66m2, 99m2' },
  { value: '120m2, 150m2', label: '120m2, 150m2' },
  { value: '200m2+', label: '200m2+' },
];

export const BROKERS = [
  'Sem corretor',
  'Matheus Tavares',
  'Ana Silva',
  'Carlos Mendes',
  'Marina Costa',
  'João Santos',
];

export const _leadBank = [
  {
    id: '1',
    title: 'Dados Bancários',
    banco: 'Nubank',
    tipoConta: 'Conta Corrente',
    conta: '0000-0',
    agencia: '000-1',
    chavePix: '000.000.000-00',
    tipoChavePix: 'CPF',
  },
];

export const _leadAbout = {
  id: _mock.id(1),
  productInterest: 'Lake House',
  interestUnit: '66m2, 99m2',
  email: _mock.email(1),
  broker: 'Matheus Tavares',
  country: _mock.countryNames(2),
  coverUrl: _mock.image.cover(3),
  totalInteractions: _mock.number.nativeL(1),
  totalFollowUps: _mock.number.nativeL(2),
  quote: 'Procuro um imóvel com boa localização e área de lazer completa para minha família.',
  socialLinks: {
    facebook: `https://www.facebook.com/caitlyn.kerluke`,
    instagram: `https://www.instagram.com/caitlyn.kerluke`,
    linkedin: `https://www.linkedin.com/in/caitlyn.kerluke`,
    twitter: `https://www.twitter.com/caitlyn.kerluke`,
  },
};

export const _leadPropertys = Array.from({ length: 18 }, (_, index) => ({
  id: _mock.id(index),
  name: _mock.companyNames(index),
  city: _mock.countryNames(index),
  state: _mock
    .countryNames(index + 1)
    .slice(0, 2)
    .toUpperCase(),
  avatarUrl: _mock.image.travel(index),
  status:
    (index % 2 && 'Visita agendada') ||
    (index % 3 && 'Interessado') ||
    (index % 4 && 'Não qualificado') ||
    'Em análise',
}));

export const _leadContacts = Array.from({ length: 18 }, (_, index) => ({
  id: _mock.id(index),
  phoneNumber: _mock.phoneNumber(index),
  name: _mock.fullName(index),
  avatarUrl: _mock.image.avatar(index),
}));

export const _leadGallery = Array.from({ length: 12 }, (_, index) => ({
  id: _mock.id(index),
  postedAt: _mock.time(index),
  title: _mock.postTitle(index),
  imageUrl: _mock.image.cover(index),
}));

export const _leadInteractions = Array.from({ length: 3 }, (_, index) => ({
  id: _mock.id(index),
  createdAt: _mock.time(index),
  media: _mock.image.travel(index + 1),
  message: _mock.sentence(index),
  personLikes: Array.from({ length: 20 }, (__, personIndex) => ({
    name: _mock.fullName(personIndex),
    avatarUrl: _mock.image.avatar(personIndex + 2),
  })),
  comments: (index === 2 && []) || [
    {
      id: _mock.id(7),
      author: {
        id: _mock.id(8),
        avatarUrl: _mock.image.avatar(index + 5),
        name: _mock.fullName(index + 5),
      },
      createdAt: _mock.time(2),
      message: 'Preciso de mais informações sobre o imóvel',
    },
    {
      id: _mock.id(9),
      author: {
        id: _mock.id(10),
        avatarUrl: _mock.image.avatar(index + 6),
        name: _mock.fullName(index + 6),
      },
      createdAt: _mock.time(3),
      message: 'Gostaria de agendar uma visita para o próximo fim de semana.',
    },
  ],
}));

export const _leadCards = Array.from({ length: 21 }, (_, index) => ({
  id: _mock.id(index),
  phoneNumber: _mock.phoneNumber(index),
  name: _mock.fullName(index),
  coverUrl: _mock.image.cover(index),
  avatarUrl: _mock.image.avatar(index),
  totalInteractions: _mock.number.nativeL(index),
  totalViews: _mock.number.nativeL(index + 2),
  totalFollowUps: _mock.number.nativeL(index + 1),
}));

export const _leadPayment = Array.from({ length: 3 }, (_, index) => ({
  id: _mock.id(index),
  cardNumber: ['**** **** **** 1234', '**** **** **** 5678', '**** **** **** 7878'][index],
  cardType: ['mastercard', 'visa', 'visa'][index],
  primary: index === 1,
}));

export const _leadSocialMedia = [
  {
    id: '1',
    instagram: '@lead_exemplo',
    tiktok: '@lead_tiktok',
    whatsapp: '+55 (62) 99999-9999',
  },
];

export const _leadAddressBook = Array.from({ length: 4 }, (_, index) => ({
  id: _mock.id(index),
  primary: index === 0,
  name: _mock.fullName(index),
  phoneNumber: _mock.phoneNumber(index),
  fullAddress: _mock.fullAddress(index),
  addressType: (index === 0 && 'Home') || 'Office',
}));

export const _leadInvoices = Array.from({ length: 10 }, (_, index) => ({
  id: _mock.id(index),
  invoiceNumber: `INV-199${index}`,
  createdAt: _mock.time(index),
  price: _mock.number.price(index),
}));

export const _leadPlans = [
  { subscription: 'basic', price: 0, primary: false },
  { subscription: 'starter', price: 4.99, primary: true },
  { subscription: 'premium', price: 9.99, primary: false },
];

export const _leadList: ILeadItem[] = Array.from({ length: 20 }, (_, index) => ({
  id: _mock.id(index),
  zipCode: '85807',
  state: 'Goiás',
  city: 'Goiânia',
  productInterest: PRODUCT_OPTIONS[index % PRODUCT_OPTIONS.length].value,
  email: _mock.email(index),
  address: _mock.fullAddress(index),
  name: _mock.fullName(index),
  isVerified: _mock.boolean(index),
  interestUnit: UNIT_OPTIONS[index % UNIT_OPTIONS.length].value,
  country: 'Brasil',
  coverUrl: _mock.image.cover(3),
  photoURL: _mock.image.avatar(index),
  avatarUrl: _mock.image.avatar(index),
  phoneNumber: _mock.phoneNumber(index),
  broker: BROKERS[index % BROKERS.length],
  source: LEAD_SOURCE_OPTIONS[index % LEAD_SOURCE_OPTIONS.length].value,
  priority: LEAD_PRIORITY_OPTIONS[index % LEAD_PRIORITY_OPTIONS.length].value as
    | 'alta'
    | 'media'
    | 'baixa',
  status:
    (index % 2 && 'ativo') ||
    (index % 3 && 'desativados') ||
    (index % 4 && 'convertido') ||
    'ativo',
  createdAt: _mock.time(index),
  updatedAt: _mock.time(index + 1),
  lastContact: _mock.time(index + 2),
  nextFollowUp: _mock.time(index + 3),
  privateLead: _mock.boolean(index + 5), // mock boolean value
  company: _mock.companyNames(index), // mock company name
}));
