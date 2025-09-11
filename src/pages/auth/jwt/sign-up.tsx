import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { JWTSignUpView } from 'src/sections/auth/jwt';

// ----------------------------------------------------------------------

const metadata = { title: `Cadastro | ${CONFIG.site.name}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title} </title>
      </Helmet>

      <JWTSignUpView />
    </>
  );
}