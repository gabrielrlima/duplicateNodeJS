import type { IDateValue, ISocialLink } from './common';

// ----------------------------------------------------------------------

export type IClientTableFilters = {
  name: string;
  profession: string[];
  filterBy: string;
  startDate: string;
  endDate: string;
  status: string;
  search: string;
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

export type IClientProfileCover = {
  name: string;
  profession: string;
  coverUrl: string;
  avatarUrl: string;
};

export type IClientProfile = {
  id: string;
  profession: string;
  quote: string;
  email: string;
  school: string;
  country: string;
  company: string;
  totalFollowers: number;
  totalFollowing: number;
  socialLinks: ISocialLink;
};

export type IClientProperty = {
  id: string;
  name: string;
  city: string;
  avatarUrl: string;
  state: string;
  status: string;
};

export type IClientProfileGallery = {
  id: string;
  title: string;
  imageUrl: string;
  postedAt: IDateValue;
};

export type IClientProfileFriend = {
  id: string;
  name: string;
  profession: string;
  avatarUrl: string;
};

export type IClientProfilePost = {
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

export type IClientCard = {
  id: string;
  name: string;
  profession: string;
  coverUrl: string;
  avatarUrl: string;
  totalPosts: number;
  totalFollowers: number;
  totalFollowing: number;
};

export type IClientItem = {
  id: string;
  name: string;
  city: string;
  profession: string;
  email: string;
  state: string;
  status: string;
  address: string;
  value: number;
  product: string;
  country: string;
  zipCode: string;
  company: string;
  avatarUrl: string;
  phoneNumber: string;
  coverUrl: string;
  photoURL: string;
  isVerified: boolean;
  createdAt: IDateValue;
  updatedAt: IDateValue;
};

export type IClientAccountBillingHistory = {
  id: string;
  price: number;
  invoiceNumber: string;
  createdAt: IDateValue;
};
