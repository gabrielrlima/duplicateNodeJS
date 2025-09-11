import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/global-config';

import { VendasDetailsView } from 'src/sections/vendas/view';

// ----------------------------------------------------------------------

const metadata = { title: `Vendas details | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <VendasDetailsView />
    </>
  );
}
