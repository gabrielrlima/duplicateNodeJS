import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/global-config';

import { VendasCreateView } from 'src/sections/vendas/view';

// ----------------------------------------------------------------------

const metadata = { title: `Create a new sale | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <VendasCreateView />
    </>
  );
}
