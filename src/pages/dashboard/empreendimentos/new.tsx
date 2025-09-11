import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/global-config';

import { EmpreendimentoCreateView } from 'src/sections/empreendimentos/view';

// ----------------------------------------------------------------------

const metadata = { title: `Criar novo empreendimento | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <EmpreendimentoCreateView />
    </>
  );
}
