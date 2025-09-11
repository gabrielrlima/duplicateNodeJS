import { useParams } from 'src/routes/hooks';

import { _comissoes } from 'src/_mock';

import { ComissoesDetailsView } from 'src/sections/comissoes/view';

// ----------------------------------------------------------------------

export default function Page() {
  const { id } = useParams();

  const comissao = _comissoes.find((item) => item.id === id);

  return <ComissoesDetailsView comissao={comissao} />;
}
