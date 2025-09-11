import { Helmet } from 'react-helmet-async';

import { useParams } from 'src/routes/hooks';

import { CONFIG } from 'src/global-config';
import { _empreendimentos } from 'src/_mock/_empreendimento';

import { EmpreendimentoDetailsView } from 'src/sections/empreendimentos/view';

// ----------------------------------------------------------------------

const metadata = { title: `Detalhes do empreendimento | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  const { id = '' } = useParams();

  const empreendimento = _empreendimentos.find((item) => item.id === id);
  const empreendimentoError = !empreendimento;

  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <EmpreendimentoDetailsView
        empreendimento={empreendimento}
        loading={false}
        error={empreendimentoError}
      />
    </>
  );
}
