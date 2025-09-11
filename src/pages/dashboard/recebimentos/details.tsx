import { Helmet } from 'react-helmet-async';

import { useParams } from 'src/routes/hooks';

import { CONFIG } from 'src/global-config';

import { RecebimentosDetailsView } from 'src/sections/recebimentos/view';

// ----------------------------------------------------------------------

const metadata = { title: `Detalhes do Recebimento | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  const { id = '' } = useParams();

  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <RecebimentosDetailsView id={id} />
    </>
  );
}
