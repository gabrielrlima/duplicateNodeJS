import { kebabCase } from 'es-toolkit';

import { _id, _postTitles } from 'src/_mock/assets';

// ----------------------------------------------------------------------

const MOCK_ID = _id[1];

const MOCK_TITLE = _postTitles[2];

const ROOTS = {
  AUTH: '/auth',
  DASHBOARD: '/dashboard',
};

// ----------------------------------------------------------------------

export const paths = {
  comingSoon: '/coming-soon',
  maintenance: '/maintenance',
  pricing: '/pricing',
  payment: '/payment',
  about: '/about-us',
  contact: '/contact-us',
  faqs: '/faqs',
  page403: '/error/403',
  page404: '/error/404',
  page500: '/error/500',
  components: '/components',
  docs: 'https://docs.minimals.cc',
  changelog: 'https://docs.minimals.cc/changelog',
  zoneStore: 'https://mui.com/store/items/zone-landing-page/',
  minimalStore: 'https://mui.com/store/items/minimal-dashboard/',
  freeUI: 'https://mui.com/store/items/minimal-dashboard-free/',
  figmaUrl: 'https://www.figma.com/design/cAPz4pYPtQEXivqe11EcDE/%5BPreview%5D-Minimal-Web.v6.0.0',
  product: {
    root: `/product`,
    checkout: `/product/checkout`,
    details: (id: string) => `/product/${id}`,
    demo: { details: `/product/${MOCK_ID}` },
  },
  post: {
    root: `/post`,
    details: (title: string) => `/post/${kebabCase(title)}`,
    demo: { details: `/post/${kebabCase(MOCK_TITLE)}` },
  },
  // AUTH
  auth: {
    signIn: `${ROOTS.AUTH}/sign-in`,
    signUp: `${ROOTS.AUTH}/sign-up`,
    resetPassword: `${ROOTS.AUTH}/reset-password`,
    updatePassword: `${ROOTS.AUTH}/update-password`,
    verify: `${ROOTS.AUTH}/verify`,
  },

  // DASHBOARD
  dashboard: {
    root: ROOTS.DASHBOARD,
    mail: `${ROOTS.DASHBOARD}/mail`,
    chat: `${ROOTS.DASHBOARD}/chat`,
    blank: `${ROOTS.DASHBOARD}/blank`,
    kanban: `${ROOTS.DASHBOARD}/kanban`,
    calendar: `${ROOTS.DASHBOARD}/calendar`,
    fileManager: `${ROOTS.DASHBOARD}/file-manager`,
    permission: `${ROOTS.DASHBOARD}/permission`,
    general: {
      app: `${ROOTS.DASHBOARD}/app`,
      ecommerce: `${ROOTS.DASHBOARD}/ecommerce`,
      analytics: `${ROOTS.DASHBOARD}/analytics`,
      banking: `${ROOTS.DASHBOARD}/banking`,
      booking: `${ROOTS.DASHBOARD}/booking`,
      file: `${ROOTS.DASHBOARD}/file`,
      course: `${ROOTS.DASHBOARD}/course`,
    },
    user: {
      root: `${ROOTS.DASHBOARD}/user`,
      new: `${ROOTS.DASHBOARD}/user/new`,
      list: `${ROOTS.DASHBOARD}/user/list`,
      cards: `${ROOTS.DASHBOARD}/user/cards`,
      profile: `${ROOTS.DASHBOARD}/user/profile`,
      account: `${ROOTS.DASHBOARD}/user/account`,
      edit: (id: string) => `${ROOTS.DASHBOARD}/user/${id}/edit`,
      demo: {
        edit: `${ROOTS.DASHBOARD}/user/${MOCK_ID}/edit`,
      },
    },
    client: {
      root: `${ROOTS.DASHBOARD}/client`,
      new: `${ROOTS.DASHBOARD}/client/new`,
      list: `${ROOTS.DASHBOARD}/client/list`,
      cards: `${ROOTS.DASHBOARD}/client/cards`,
      profile: (id: string) => `${ROOTS.DASHBOARD}/client/${id}`,
      account: `${ROOTS.DASHBOARD}/client/account`,
      edit: (id: string) => `${ROOTS.DASHBOARD}/client/${id}/edit`,
      demo: {
        edit: `${ROOTS.DASHBOARD}/client/${MOCK_ID}/edit`,
      },
    },
    property: {
      root: `${ROOTS.DASHBOARD}/property`,
      new: `${ROOTS.DASHBOARD}/property/new`,
      list: `${ROOTS.DASHBOARD}/property/list`,
      cards: `${ROOTS.DASHBOARD}/property/cards`,
      details: (id: string) => `${ROOTS.DASHBOARD}/property/${id}`,
      account: `${ROOTS.DASHBOARD}/property/account`,
      edit: (id: string) => `${ROOTS.DASHBOARD}/property/${id}/edit`,
      demo: {
        edit: `${ROOTS.DASHBOARD}/property/${MOCK_ID}/edit`,
      },
    },
    // Unified products (imóveis, terrenos, empreendimentos)
    products: {
      root: `${ROOTS.DASHBOARD}/property`,
      new: `${ROOTS.DASHBOARD}/property/new`,
      list: `${ROOTS.DASHBOARD}/property/list`,
      cards: `${ROOTS.DASHBOARD}/property/cards`,
      details: (id: string) => `${ROOTS.DASHBOARD}/property/${id}`,
      edit: (id: string) => `${ROOTS.DASHBOARD}/property/${id}/edit`,
      demo: {
        edit: `${ROOTS.DASHBOARD}/property/${MOCK_ID}/edit`,
      },
    },
    wallet: {
      root: `${ROOTS.DASHBOARD}/wallet`,
      transfer: `${ROOTS.DASHBOARD}/wallet/transfer`,
      transferCopyPaste: `${ROOTS.DASHBOARD}/wallet/transfer-copy-paste`,
    },
    lead: {
      root: `${ROOTS.DASHBOARD}/lead`,
      new: `${ROOTS.DASHBOARD}/lead/new`,
      list: `${ROOTS.DASHBOARD}/lead/list`,
      cards: `${ROOTS.DASHBOARD}/lead/cards`,
      details: (id: string) => `${ROOTS.DASHBOARD}/lead/${id}`,
      edit: (id: string) => `${ROOTS.DASHBOARD}/lead/${id}/edit`,
      demo: {
        edit: `${ROOTS.DASHBOARD}/lead/${MOCK_ID}/edit`,
      },
    },

    invoice: {
      root: `${ROOTS.DASHBOARD}/invoice`,
      new: `${ROOTS.DASHBOARD}/invoice/new`,
      details: (id: string) => `${ROOTS.DASHBOARD}/invoice/${id}`,
      edit: (id: string) => `${ROOTS.DASHBOARD}/invoice/${id}/edit`,
      demo: {
        details: `${ROOTS.DASHBOARD}/invoice/${MOCK_ID}`,
        edit: `${ROOTS.DASHBOARD}/invoice/${MOCK_ID}/edit`,
      },
    },
    vendas: {
      root: `${ROOTS.DASHBOARD}/vendas`,
      list: `${ROOTS.DASHBOARD}/vendas/list`,
      new: `${ROOTS.DASHBOARD}/vendas/new`,
      details: (id: string) => `${ROOTS.DASHBOARD}/vendas/${id}`,
      edit: (id: string) => `${ROOTS.DASHBOARD}/vendas/${id}/edit`,
      demo: {
        details: `${ROOTS.DASHBOARD}/vendas/${MOCK_ID}`,
        edit: `${ROOTS.DASHBOARD}/vendas/${MOCK_ID}/edit`,
      },
    },

    corretores: {
      root: `${ROOTS.DASHBOARD}/corretores`,
      list: `${ROOTS.DASHBOARD}/corretores/list`,
      new: `${ROOTS.DASHBOARD}/corretores/new`,
      details: (id: string) => `${ROOTS.DASHBOARD}/corretores/${id}`,
      edit: (id: string) => `${ROOTS.DASHBOARD}/corretores/${id}/edit`,
      demo: {
        details: `${ROOTS.DASHBOARD}/corretores/${MOCK_ID}`,
        edit: `${ROOTS.DASHBOARD}/corretores/${MOCK_ID}/edit`,
      },
    },
    grupos: {
      root: `${ROOTS.DASHBOARD}/grupos`,
      list: `${ROOTS.DASHBOARD}/grupos/list`,
      new: `${ROOTS.DASHBOARD}/grupos/new`,
      details: (id: string) => `${ROOTS.DASHBOARD}/grupos/${id}`,
      edit: (id: string) => `${ROOTS.DASHBOARD}/grupos/${id}/edit`,
      demo: {
        details: `${ROOTS.DASHBOARD}/grupos/${MOCK_ID}`,
        edit: `${ROOTS.DASHBOARD}/grupos/${MOCK_ID}/edit`,
      },
    },
    relatorios: {
      root: `${ROOTS.DASHBOARD}/relatorios`,
      list: `${ROOTS.DASHBOARD}/relatorios/list`,
      new: `${ROOTS.DASHBOARD}/relatorios/new`,
      vendas: `${ROOTS.DASHBOARD}/relatorios/vendas`,
      details: (id: string) => `${ROOTS.DASHBOARD}/relatorios/${id}`,
      edit: (id: string) => `${ROOTS.DASHBOARD}/relatorios/${id}/edit`,
      demo: {
        details: `${ROOTS.DASHBOARD}/relatorios/${MOCK_ID}`,
        edit: `${ROOTS.DASHBOARD}/relatorios/${MOCK_ID}/edit`,
      },
    },
    cobranca: {
      root: `${ROOTS.DASHBOARD}/cobranca`,
      list: `${ROOTS.DASHBOARD}/cobranca/list`,
      details: (id: string) => `${ROOTS.DASHBOARD}/cobranca/${id}`,
      recebimentos: (id: string) => `${ROOTS.DASHBOARD}/cobranca/${id}/recebimentos`,
      demo: {
        details: `${ROOTS.DASHBOARD}/cobranca/${MOCK_ID}`,
        recebimentos: `${ROOTS.DASHBOARD}/cobranca/${MOCK_ID}/recebimentos`,
      },
    },

    properties: {
      root: `${ROOTS.DASHBOARD}/properties`,
      new: `${ROOTS.DASHBOARD}/properties/new`,
      newSimple: `${ROOTS.DASHBOARD}/properties/new-simple`,
      list: `${ROOTS.DASHBOARD}/properties/list`,
      details: (id: string) => `${ROOTS.DASHBOARD}/properties/${id}`,
      edit: (id: string) => `${ROOTS.DASHBOARD}/properties/${id}/edit`,
      demo: {
        details: `${ROOTS.DASHBOARD}/properties/${MOCK_ID}`,
        edit: `${ROOTS.DASHBOARD}/properties/${MOCK_ID}/edit`,
      },
    },

    recebimentos: {
      root: `${ROOTS.DASHBOARD}/recebimentos`,
      details: (id: string) => `${ROOTS.DASHBOARD}/recebimentos/${id}`,
      demo: {
        details: `${ROOTS.DASHBOARD}/recebimentos/${MOCK_ID}`,
      },
    },
    post: {
      root: `${ROOTS.DASHBOARD}/post`,
      new: `${ROOTS.DASHBOARD}/post/new`,
      details: (title: string) => `${ROOTS.DASHBOARD}/post/${kebabCase(title)}`,
      edit: (title: string) => `${ROOTS.DASHBOARD}/post/${kebabCase(title)}/edit`,
      demo: {
        details: `${ROOTS.DASHBOARD}/post/${kebabCase(MOCK_TITLE)}`,
        edit: `${ROOTS.DASHBOARD}/post/${kebabCase(MOCK_TITLE)}/edit`,
      },
    },
    order: {
      root: `${ROOTS.DASHBOARD}/order`,
      details: (id: string) => `${ROOTS.DASHBOARD}/order/${id}`,
      demo: {
        details: `${ROOTS.DASHBOARD}/order/${MOCK_ID}`,
      },
    },
    job: {
      root: `${ROOTS.DASHBOARD}/job`,
      new: `${ROOTS.DASHBOARD}/job/new`,
      details: (id: string) => `${ROOTS.DASHBOARD}/job/${id}`,
      edit: (id: string) => `${ROOTS.DASHBOARD}/job/${id}/edit`,
      demo: {
        details: `${ROOTS.DASHBOARD}/job/${MOCK_ID}`,
        edit: `${ROOTS.DASHBOARD}/job/${MOCK_ID}/edit`,
      },
    },
    tour: {
      root: `${ROOTS.DASHBOARD}/tour`,
      new: `${ROOTS.DASHBOARD}/tour/new`,
      details: (id: string) => `${ROOTS.DASHBOARD}/tour/${id}`,
      edit: (id: string) => `${ROOTS.DASHBOARD}/tour/${id}/edit`,
      demo: {
        details: `${ROOTS.DASHBOARD}/tour/${MOCK_ID}`,
        edit: `${ROOTS.DASHBOARD}/tour/${MOCK_ID}/edit`,
      },
    },

    comissoes: {
      root: `${ROOTS.DASHBOARD}/comissoes`,
      list: `${ROOTS.DASHBOARD}/comissoes/list`,
      new: `${ROOTS.DASHBOARD}/comissoes/new`,
      details: (id: string) => `${ROOTS.DASHBOARD}/comissoes/${id}`,
      edit: (id: string) => `${ROOTS.DASHBOARD}/comissoes/${id}/edit`,
      demo: {
        details: `${ROOTS.DASHBOARD}/comissoes/${MOCK_ID}`,
        edit: `${ROOTS.DASHBOARD}/comissoes/${MOCK_ID}/edit`,
      },
    },
    realEstate: {
      root: `${ROOTS.DASHBOARD}/real-estate`,
      list: `${ROOTS.DASHBOARD}/real-estate/list`,
      new: `${ROOTS.DASHBOARD}/real-estate/new`,
      details: (id: string) => `${ROOTS.DASHBOARD}/real-estate/${id}`,
      edit: (id: string) => `${ROOTS.DASHBOARD}/real-estate/${id}/edit`,
      demo: {
        details: `${ROOTS.DASHBOARD}/real-estate/${MOCK_ID}`,
        edit: `${ROOTS.DASHBOARD}/real-estate/${MOCK_ID}/edit`,
      },
    },
  },
};
