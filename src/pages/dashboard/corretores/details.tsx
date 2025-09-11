import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/global-config';

import { CorretorDetailsView } from 'src/sections/corretores/view';

// ----------------------------------------------------------------------

const metadata = { title: `Detalhes do corretor | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <CorretorDetailsView />
    </>
  );
}
