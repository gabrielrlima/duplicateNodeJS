import { Helmet } from 'react-helmet-async';

import { RelatoriosListView } from 'src/sections/relatorios/view';

// ----------------------------------------------------------------------

export default function RelatoriosV4VendasPage() {
  return (
    <>
      <Helmet>
        <title>Dashboard: Relatório de Vendas</title>
      </Helmet>

      <RelatoriosListView />
    </>
  );
}
