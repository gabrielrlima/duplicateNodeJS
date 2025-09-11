import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/global-config';

import { CorretorCreateView } from 'src/sections/corretores/view';

// ----------------------------------------------------------------------

const metadata = { title: `Criar novo corretor | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <CorretorCreateView />
    </>
  );
}
