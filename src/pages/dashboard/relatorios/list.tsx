import { Helmet } from 'react-helmet-async';

import { RelatoriosListView } from 'src/sections/relatorios/view';

// ----------------------------------------------------------------------

export default function RelatoriosV4ListPage() {
  return (
    <>
      <Helmet>
        <title> Relatórios v4 - Lista</title>
      </Helmet>

      <RelatoriosListView />
    </>
  );
}
