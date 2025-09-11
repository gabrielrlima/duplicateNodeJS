import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/global-config';

import { EmpreendimentoListView } from 'src/sections/empreendimentos/view';

// ----------------------------------------------------------------------

const metadata = { title: `Empreendimentos | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <EmpreendimentoListView />
    </>
  );
}
