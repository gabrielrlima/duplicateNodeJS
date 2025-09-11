import { Helmet } from 'react-helmet-async';
import { TerrenoSimpleCreateView } from 'src/sections/terreno/view/terreno-simple-create-view';

// ----------------------------------------------------------------------

const metadata = { title: `Criar Terreno Simples | Dashboard` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <TerrenoSimpleCreateView />
    </>
  );
}