import type { SWRConfiguration } from 'swr';
import type { IChatMessage, IChatParticipant, IChatConversation } from 'src/types/chat';

import { useMemo } from 'react';
import { keyBy } from 'es-toolkit';
import useSWR, { mutate } from 'swr';

import axios, { fetcher, endpoints } from 'src/lib/axios';
import { CHAT_PARTICIPANTS, CHAT_CONVERSATIONS, createVendaConversation } from 'src/_mock/_chat';

import { useAuthContext } from 'src/auth/hooks';

// ----------------------------------------------------------------------

const enableServer = false;

const CHART_ENDPOINT = endpoints.chat;

const swrOptions: SWRConfiguration = {
  revalidateIfStale: enableServer,
  revalidateOnFocus: enableServer,
  revalidateOnReconnect: enableServer,
};

// ----------------------------------------------------------------------

type ContactsData = {
  contacts: IChatParticipant[];
};

export function useGetContacts() {
  const url = enableServer ? [CHART_ENDPOINT, { params: { endpoint: 'contacts' } }] : null;

  const { data, isLoading, error, isValidating } = useSWR<ContactsData>(url, fetcher, swrOptions);

  const memoizedValue = useMemo(
    () => ({
      contacts: enableServer ? data?.contacts || [] : CHAT_PARTICIPANTS,
      contactsLoading: enableServer ? isLoading : false,
      contactsError: enableServer ? error : null,
      contactsValidating: enableServer ? isValidating : false,
      contactsEmpty: enableServer ? !isLoading && !isValidating && !data?.contacts.length : false,
    }),
    [data?.contacts, error, isLoading, isValidating]
  );

  return memoizedValue;
}

// ----------------------------------------------------------------------

type ConversationsData = {
  conversations: IChatConversation[];
};

export function useGetConversations() {
  const url = enableServer ? [CHART_ENDPOINT, { params: { endpoint: 'conversations' } }] : null;

  const { data, isLoading, error, isValidating } = useSWR<ConversationsData>(
    url,
    fetcher,
    swrOptions
  );

  const memoizedValue = useMemo(() => {
    const conversations = enableServer ? data?.conversations || [] : CHAT_CONVERSATIONS;
    const byId = conversations.length ? keyBy(conversations, (option) => option.id) : {};
    const allIds = Object.keys(byId);

    return {
      conversations: { byId, allIds },
      conversationsLoading: enableServer ? isLoading : false,
      conversationsError: enableServer ? error : null,
      conversationsValidating: enableServer ? isValidating : false,
      conversationsEmpty: enableServer ? !isLoading && !isValidating && !allIds.length : false,
    };
  }, [data?.conversations, error, isLoading, isValidating]);

  return memoizedValue;
}

// ----------------------------------------------------------------------

type ConversationData = {
  conversation: IChatConversation;
};

export function useGetConversation(conversationId: string) {
  const { user } = useAuthContext();
  const url =
    conversationId && enableServer
      ? [CHART_ENDPOINT, { params: { conversationId, endpoint: 'conversation' } }]
      : null;

  const { data, isLoading, error, isValidating } = useSWR<ConversationData>(
    url,
    fetcher,
    swrOptions
  );

  const memoizedValue = useMemo(() => {
    let conversation;

    if (enableServer) {
      conversation = data?.conversation;
    } else {
      // Verifica se é uma conversa de venda (formato: venda-{vendaId})
      if (conversationId.startsWith('venda-')) {
        const vendaId = conversationId.replace('venda-', '');
        const userName = user?.displayName || user?.name || 'Corretor';
        const currentUserId = user?.id;

        // Dados padrão do cliente para novos atendimentos
        const clientData = {
          name: 'João Silva',
          email: 'joao.silva@email.com',
          phone: '(11) 99999-9999',
        };

        conversation = createVendaConversation(vendaId, userName, clientData, currentUserId);
      } else {
        conversation = CHAT_CONVERSATIONS.find((conv) => conv.id === conversationId);
      }
    }

    return {
      conversation,
      conversationLoading: enableServer ? isLoading : false,
      conversationError: enableServer ? error : null,
      conversationValidating: enableServer ? isValidating : false,
      conversationEmpty: enableServer
        ? !isLoading && !isValidating && !data?.conversation
        : !conversation,
    };
  }, [conversationId, data?.conversation, error, isLoading, isValidating, user]);

  return memoizedValue;
}

// ----------------------------------------------------------------------

export async function sendMessage(conversationId: string, messageData: IChatMessage) {
  const conversationsUrl = [CHART_ENDPOINT, { params: { endpoint: 'conversations' } }];

  const conversationUrl = [
    CHART_ENDPOINT,
    { params: { conversationId, endpoint: 'conversation' } },
  ];

  /**
   * Work on server
   */
  if (enableServer) {
    const data = { conversationId, messageData };
    await axios.put(CHART_ENDPOINT, data);
  }

  /**
   * Work in local
   */
  mutate(
    conversationUrl,
    (currentData) => {
      const currentConversation: IChatConversation = currentData.conversation;

      const conversation = {
        ...currentConversation,
        messages: [...currentConversation.messages, messageData],
      };

      return { ...currentData, conversation };
    },
    false
  );

  mutate(
    conversationsUrl,
    (currentData) => {
      const currentConversations: IChatConversation[] = currentData.conversations;

      const conversations: IChatConversation[] = currentConversations.map(
        (conversation: IChatConversation) =>
          conversation.id === conversationId
            ? { ...conversation, messages: [...conversation.messages, messageData] }
            : conversation
      );

      return { ...currentData, conversations };
    },
    false
  );
}

// ----------------------------------------------------------------------

export async function createConversation(conversationData: IChatConversation) {
  const url = [CHART_ENDPOINT, { params: { endpoint: 'conversations' } }];

  /**
   * Work on server
   */
  const data = { conversationData };
  const res = await axios.post(CHART_ENDPOINT, data);

  /**
   * Work in local
   */

  mutate(
    url,
    (currentData) => {
      const currentConversations: IChatConversation[] = currentData.conversations;

      const conversations: IChatConversation[] = [...currentConversations, conversationData];

      return { ...currentData, conversations };
    },
    false
  );

  return res.data;
}

// ----------------------------------------------------------------------

export async function clickConversation(conversationId: string) {
  /**
   * Work on server
   */
  if (enableServer) {
    await axios.get(CHART_ENDPOINT, { params: { conversationId, endpoint: 'mark-as-seen' } });
  }

  /**
   * Work in local
   */

  mutate(
    [CHART_ENDPOINT, { params: { endpoint: 'conversations' } }],
    (currentData) => {
      const currentConversations: IChatConversation[] = currentData.conversations;

      const conversations = currentConversations.map((conversation: IChatConversation) =>
        conversation.id === conversationId ? { ...conversation, unreadCount: 0 } : conversation
      );

      return { ...currentData, conversations };
    },
    false
  );
}
