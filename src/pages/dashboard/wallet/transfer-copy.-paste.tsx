import { Helmet } from 'react-helmet-async';
import { WalletPixCopyPasteView } from '@/sections/wallet/view/wallet-copy-paste-transfer-view';

import { CONFIG } from 'src/global-config';

// ----------------------------------------------------------------------

const metadata = { title: `Transferência copia e cola | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <WalletPixCopyPasteView />
    </>
  );
}
