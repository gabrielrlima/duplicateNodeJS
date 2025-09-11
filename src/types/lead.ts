import type { IDateValue, ISocialLink } from './common';

// ----------------------------------------------------------------------

export type ILeadTableFilters = {
  name: string;
  product: string[];
  filterBy: string;
  startDate: string;
  endDate: string;
  status: string;
  search: string;
  broker: string;
};

export interface IBankData {
  id: string;
  title: string;
  banco: string;
  tipoConta: string;
  conta: string;
  agencia: string;
  chavePix: string;
  tipoChavePix: string;
}

export type ILeadProfileCover = {
  name: string;
  phoneNumber: string;
  coverUrl: string;
  avatarUrl: string;
};

export type ILeadProfile = {
  id: string;
  productInterest: string;
  interestUnit: string;
  quote: string;
  email: string;
  broker: string;
  country: string;
  company: string;
  totalInteractions: number;
  totalFollowUps: number;
  socialLinks: ISocialLink;
};

export type ILeadProperty = {
  id: string;
  name: string;
  city: string;
  avatarUrl: string;
  state: string;
  status: string;
};

export type ILeadProfileGallery = {
  id: string;
  title: string;
  imageUrl: string;
  postedAt: IDateValue;
};

export type ILeadProfileContact = {
  id: string;
  name: string;
  phoneNumber: string;
  avatarUrl: string;
};

export type ILeadProfileInteraction = {
  id: string;
  media: string;
  message: string;
  createdAt: IDateValue;
  personLikes: { name: string; avatarUrl: string }[];
  comments: {
    id: string;
    message: string;
    createdAt: IDateValue;
    author: { id: string; name: string; avatarUrl: string };
  }[];
};

export type ILeadCard = {
  id: string;
  name: string;
  phoneNumber: string;
  coverUrl: string;
  avatarUrl: string;
  totalInteractions: number;
  totalFollowUps: number;
  totalViews: number;
};

export type ILeadItem = {
  id: string;
  name: string;
  city: string;
  productInterest: string;
  email: string;
  state: string;
  status: string;
  address: string;
  interestUnit: string;
  broker: string;
  country: string;
  zipCode: string;
  avatarUrl: string;
  phoneNumber: string;
  coverUrl: string;
  photoURL: string;
  isVerified: boolean;
  privateLead: boolean;
  source: string; // origem do lead
  priority: 'alta' | 'media' | 'baixa';
  lastContact: IDateValue;
  nextFollowUp: IDateValue;
  createdAt: IDateValue;
  updatedAt: IDateValue;
  company: string;
};

export type ILeadAccountBillingHistory = {
  id: string;
  price: number;
  invoiceNumber: string;
  createdAt: IDateValue;
};
