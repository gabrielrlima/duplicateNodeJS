import { Helmet } from 'react-helmet-async';

import { RelatoriosListView } from 'src/sections/relatorios/view';

// ----------------------------------------------------------------------

export default function RelatoriosV4CreatePage() {
  return (
    <>
      <Helmet>
        <title> Relatórios v4 - Novo</title>
      </Helmet>

      <RelatoriosListView />
    </>
  );
}
