import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/global-config';

import { VendasListView } from 'src/sections/vendas/view';

// ----------------------------------------------------------------------

const metadata = { title: `Vendas list | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <VendasListView />
    </>
  );
}
