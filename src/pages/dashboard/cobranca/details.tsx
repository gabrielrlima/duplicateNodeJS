import { Helmet } from 'react-helmet-async';

import { useParams } from 'src/routes/hooks';

import { _cobrancas } from 'src/_mock';
import { CONFIG } from 'src/global-config';

import { CobrancaDetailsView } from 'src/sections/cobranca/view';

// ----------------------------------------------------------------------

const metadata = { title: `Detalhes da cobrança | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  const { id = '' } = useParams();

  const currentCobranca = _cobrancas.find((cobranca) => cobranca.id === id);

  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <CobrancaDetailsView cobranca={currentCobranca} />
    </>
  );
}
