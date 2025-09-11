import { Helmet } from 'react-helmet-async';

import { RelatoriosListView } from 'src/sections/relatorios/view';

// ----------------------------------------------------------------------

export default function RelatoriosV4EditPage() {
  return (
    <>
      <Helmet>
        <title> Relatórios v4 - Editar</title>
      </Helmet>

      <RelatoriosListView />
    </>
  );
}
