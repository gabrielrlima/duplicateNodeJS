import { Helmet } from 'react-helmet-async';

import { CobrancaRecebimentosView } from 'src/sections/cobranca/view/cobranca-recebimentos-view';

import { CONFIG } from '../../../config-global';

// ----------------------------------------------------------------------

const metadata = { title: `Recebimentos - ${CONFIG.site.name}` };

export default function CobrancaRecebimentosPage() {
  return (
    <>
      <Helmet>
        <title> {metadata.title} </title>
      </Helmet>

      <CobrancaRecebimentosView />
    </>
  );
}
