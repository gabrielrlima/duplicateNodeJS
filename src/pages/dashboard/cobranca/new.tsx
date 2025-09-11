import { Helmet } from 'react-helmet-async';
import { CobrancaCreateView } from '@/sections/cobranca/view/cobranca-create-view';

import { CONFIG } from 'src/global-config';

// ----------------------------------------------------------------------

const metadata = { title: `Criar nova cobrança | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <CobrancaCreateView />
    </>
  );
}
