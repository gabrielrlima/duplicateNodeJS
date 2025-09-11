import { Helmet } from 'react-helmet-async';

import { RelatoriosListView } from 'src/sections/relatorios/view';

// ----------------------------------------------------------------------

export default function RelatoriosV4DetailsPage() {
  return (
    <>
      <Helmet>
        <title> Relatórios v4 - Detalhes</title>
      </Helmet>

      <RelatoriosListView />
    </>
  );
}
