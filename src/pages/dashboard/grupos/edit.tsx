import { Helmet } from 'react-helmet-async';

import { useParams } from 'src/routes/hooks';

import { CONFIG } from 'src/global-config';
import { _grupos } from 'src/_mock/_grupos';

import { GrupoEditView } from 'src/sections/grupos/view';

// ----------------------------------------------------------------------

const metadata = { title: `Editar grupo | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  const { id = '' } = useParams();

  const currentGrupo = _grupos.find((grupo) => grupo.id === id);

  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <GrupoEditView grupo={currentGrupo} />
    </>
  );
}
