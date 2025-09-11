import type { SWRConfiguration } from 'swr';
import type { IVendas, IVendasFormData } from 'src/types/vendas';

import useSWR from 'swr';
import { useMemo } from 'react';

import { fetcher } from 'src/lib/axios';
import { _vendas } from 'src/_mock/_vendas';

// ----------------------------------------------------------------------

const swrOptions: SWRConfiguration = {
  revalidateIfStale: false,
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
};

// ----------------------------------------------------------------------

type VendasData = {
  vendas: IVendas[];
};

export function useGetVendas() {
  const url = '/api/vendas';

  const { data, isLoading, error, isValidating } = useSWR<VendasData>(url, fetcher, swrOptions);

  const memoizedValue = useMemo(
    () => ({
      vendas: data?.vendas || _vendas,
      vendasLoading: isLoading,
      vendasError: error,
      vendasValidating: isValidating,
      vendasEmpty: !isLoading && !isValidating && !data?.vendas.length,
    }),
    [data?.vendas, error, isLoading, isValidating]
  );

  return memoizedValue;
}

// ----------------------------------------------------------------------

type VendaData = {
  venda: IVendas;
};

export function useGetVenda(vendaId: string) {
  // Temporariamente desabilitado para usar apenas dados mock
  // const url = vendaId ? ['/api/vendas/details', { params: { vendaId } }] : '';
  const url = null; // Desabilita a requisição HTTP

  const { data, isLoading, error, isValidating } = useSWR<VendaData>(url, fetcher, swrOptions);

  // Fallback para dados mock se não houver endpoint configurado
  const mockVenda = useMemo(() => {
    if (!vendaId) return null;

    let foundVenda: IVendas | undefined = _vendas.find((venda) => venda.id === vendaId);

    // Se não encontrar a venda (novo atendimento), cria dados padrão
    if (!foundVenda) {
      const defaultFormData: IVendasFormData = {
        clientName: 'João Silva',
        clientPhone: '(11) 99999-9999',
        clientEmail: 'joao.silva@email.com',
        propertyName: 'Cobertura Sunset - 4',
        unitType: '66 m² - 1 Q',
        availableUnits: 'Apartamento 305',
      };

      foundVenda = {
        id: vendaId,
        sent: 0,
        taxes: 0,
        status: 'atendimento',
        discount: 0,
        shipping: 0,
        subtotal: 0,
        subTotalPrice: 0,
        createDate: new Date(),
        dueDate: new Date(),
        totalAmount: 0,
        invoiceNumber: `INV-${vendaId}`,
        corretorId: '1',
        invoiceFrom: {
          id: 'from-1',
          name: 'Empresa',
          email: 'empresa@email.com',
          phone: '(11) 99999-9999',
          address: 'Endereço da empresa',
          company: 'Empresa Ltda',
          primary: true,
        },
        invoiceTo: {
          id: 'to-1',
          name: 'Cliente',
          email: 'cliente@email.com',
          phone: '(11) 88888-8888',
          address: 'Endereço do cliente',
          company: 'Cliente Ltda',
          primary: false,
        },
        items: [],
        history: {
          orderTime: new Date().toISOString(),
          paymentTime: new Date().toISOString(),
          deliveryTime: new Date().toISOString(),
          completionTime: new Date().toISOString(),
          timeline: [
            {
              title: 'Atendimento criado',
              time: new Date().toISOString(),
            },
          ],
        },
        formData: defaultFormData,
      };
    }

    return foundVenda;
  }, [vendaId]);

  const memoizedValue = useMemo(
    () => ({
      venda: data?.venda || mockVenda,
      vendaLoading: isLoading,
      vendaError: error,
      vendaValidating: isValidating,
    }),
    [data?.venda, mockVenda, error, isLoading, isValidating]
  );

  return memoizedValue;
}
