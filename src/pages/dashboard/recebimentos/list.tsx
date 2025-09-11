import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/global-config';

import { RecebimentosListView } from 'src/sections/recebimentos/view';

// ----------------------------------------------------------------------

const metadata = { title: `Recebimentos | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <RecebimentosListView />
    </>
  );
}
