import type { IDateValue, IDatePickerControl } from './common';

// ----------------------------------------------------------------------

export type IRecebimentosTableFilters = {
  name: string;
  status: string;
  endDate: IDatePickerControl;
  startDate: IDatePickerControl;
};

export type IRecebimentosHistory = {
  type: string;
  title: string;
  message: string;
  time: IDateValue;
  by: string;
};

export type IRecebimentosPayment = {
  method: string;
  reference: string;
};

export type IRecebimentosCustomer = {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  phone: string;
};

export type IRecebimentosProperty = {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  type: string;
  rentValue: string;
};

export type IRecebimentosItem = {
  id: string;
  status: string;
  amount: number;
  dueDate: IDateValue;
  paidDate?: IDateValue;
  receiptNumber: string;
  description: string;
  createdAt: IDateValue;
  history: IRecebimentosHistory[];
  payment?: IRecebimentosPayment;
  customer: IRecebimentosCustomer;
  property: IRecebimentosProperty;
  installment: number;
  totalInstallments: number;
};
