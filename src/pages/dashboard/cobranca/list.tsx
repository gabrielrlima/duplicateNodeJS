import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/global-config';

import { CobrancaListView } from 'src/sections/cobranca/view';

// ----------------------------------------------------------------------

const metadata = { title: `Cobrança lista | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <CobrancaListView />
    </>
  );
}
