import type { Dayjs } from 'dayjs';

// ----------------------------------------------------------------------

export type IRecebimento = {
  id: string;
  parcela: number;
  valor: number;
  vencimento: string;
  status: 'Pendente' | 'Pago' | 'Vencido';
  dataPagamento?: string;
  formaPagamento?: string;
};

export type ICobranca = {
  id: string;
  cliente: string;
  produto: string;
  valor: number;
  vencimento: string;
  status: 'Pendente' | 'Pago' | 'Vencido';
  descricao?: string;
  dataCriacao: string;
  recebimentos: IRecebimento[];
};

export type ICobrancaTableFilterValue = string | Dayjs | null;

export type ICobrancaTableFilters = {
  name: string;
  status: string;
  startDate: Dayjs | null;
  endDate: Dayjs | null;
};
