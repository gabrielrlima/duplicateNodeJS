import type { IDateValue } from './common';

// ----------------------------------------------------------------------

export type IVendasStatus =
  | 'atendimento'
  | 'visita'
  | 'interesse'
  | 'proposta'
  | 'assinatura_pagamento'
  | 'cancelado';

export type IVendasHistory = {
  orderTime: IDateValue;
  paymentTime: IDateValue;
  deliveryTime: IDateValue;
  completionTime: IDateValue;
  timeline: { title: string; time: IDateValue }[];
};

export type IVendasAddress = {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  company: string;
  primary: boolean;
};

export type IVendasItem = {
  id: string;
  title: string;
  price: number;
  total: number;
  service: string;
  quantity: number;
  description: string;
};

export type IVendasFormData = {
  clientName?: string;
  clientPhone?: string;
  clientEmail?: string;
  propertyName?: string;
  unitType?: string;
  floor?: string;
  sunPosition?: string;
  availableUnits?: string;
};

export type IVendas = {
  id: string;
  sent: number;
  taxes: number;
  status: string;
  discount: number;
  shipping: number;
  subtotal: number;
  subTotalPrice: number;
  createDate: Date;
  dueDate: Date;
  totalAmount: number;
  invoiceNumber: string;
  invoiceFrom: IVendasAddress;
  invoiceTo: IVendasAddress;
  items: IVendasItem[];
  history?: IVendasHistory;
  formData?: IVendasFormData;
  corretorId: string;
};

export type IVendasTableFilterValue = string | string[] | Date | null;

export type IVendasTableFilters = {
  name: string;
  service: string[];
  status: string;
  startDate: Date | null;
  endDate: Date | null;
};
