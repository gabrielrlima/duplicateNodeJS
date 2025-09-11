import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/global-config';

import { CorretorEditView } from 'src/sections/corretores/view';

// ----------------------------------------------------------------------

const metadata = { title: `Editar corretor | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <CorretorEditView />
    </>
  );
}
