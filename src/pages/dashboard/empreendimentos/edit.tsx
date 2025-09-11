import { Helmet } from 'react-helmet-async';

import { useParams } from 'src/routes/hooks';

import { CONFIG } from 'src/global-config';
import { _empreendimentos } from 'src/_mock/_empreendimento';

import { EmpreendimentoEditView } from 'src/sections/empreendimentos/view';

// ----------------------------------------------------------------------

const metadata = { title: `Editar empreendimento | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  const { id = '' } = useParams();

  const currentEmpreendimento = _empreendimentos.find((empreendimento) => empreendimento.id === id);

  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <EmpreendimentoEditView empreendimento={currentEmpreendimento} />
    </>
  );
}
