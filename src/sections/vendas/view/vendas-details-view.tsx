import type { IChatParticipant } from 'src/types/chat';

import { useState, useEffect, useCallback, startTransition } from 'react';

import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

import { paths } from 'src/routes/paths';
import { useRouter, useParams } from 'src/routes/hooks';

import { CONFIG } from 'src/global-config';
import { useGetVenda } from 'src/actions/vendas';
import { DashboardContent } from 'src/layouts/dashboard';
import { useGetContacts, useGetConversation } from 'src/actions/chat';

import { Iconify } from 'src/components/iconify';
import { EmptyContent } from 'src/components/empty-content';

import { useAuthContext } from 'src/auth/hooks';

// ChatNav removido - não é mais necessário
import { ChatLayout } from '../../chat/layout';
import { ChatRoom } from '../../chat/chat-room';
import { ChatMessageList } from '../../chat/chat-message-list';
import { ChatMessageInput } from '../../chat/chat-message-input';
import { ChatHeaderDetail } from '../../chat/chat-header-detail';
import { ChatHeaderCompose } from '../../chat/chat-header-compose';
import { useCollapseNav } from '../../chat/hooks/use-collapse-nav';

// ----------------------------------------------------------------------

export function VendasDetailsView() {
  const router = useRouter();
  const { id: vendaId = '' } = useParams();

  const { user } = useAuthContext();

  const { contacts } = useGetContacts();
  const { venda } = useGetVenda(vendaId);

  // Cria automaticamente uma conversa específica para esta venda
  const selectedConversationId = `venda-${vendaId}`;

  // Não é mais necessário selecionar conversa manualmente
  // Cada venda tem sua própria conversa automática com a IA

  const { conversation, conversationError, conversationLoading } =
    useGetConversation(selectedConversationId);

  const roomNav = useCollapseNav();
  // conversationsNav removido - não é mais necessário

  const [recipients, setRecipients] = useState<IChatParticipant[]>([]);
  const [localParticipants, setLocalParticipants] = useState<IChatParticipant[]>([]);

  useEffect(() => {
    if (!selectedConversationId) {
      startTransition(() => {
        router.push(paths.dashboard.chat);
      });
    }
  }, [conversationError, router, selectedConversationId]);

  // Atualiza os participantes locais quando a conversa carrega
  useEffect(() => {
    if (conversation?.participants) {
      // Inclui todos os participantes, incluindo o usuário logado
      setLocalParticipants(conversation.participants);
    }
  }, [conversation?.participants, user?.id]);

  const handleAddRecipients = useCallback((selected: IChatParticipant[]) => {
    setRecipients(selected);
  }, []);

  const handleAddParticipant = useCallback((newParticipant: IChatParticipant) => {
    setLocalParticipants((prev) => {
      // Verifica se o participante já existe
      const exists = prev.some(
        (p) => p.id === newParticipant.id || p.email === newParticipant.email
      );
      if (exists) {
        return prev;
      }
      return [...prev, newParticipant];
    });
  }, []);

  const handleRemoveParticipant = useCallback((participantId: string) => {
    setLocalParticipants((prev) => prev.filter((p) => p.id !== participantId));
  }, []);

  // Filtra participantes apenas para o header (remove IA Assistente)
  const filteredParticipantsForHeader: IChatParticipant[] = localParticipants.filter(
    (participant) => participant.role !== 'IA Assistente'
  );

  // Para as mensagens, mantém todos os participantes para resolver nomes corretamente
  const allParticipants: IChatParticipant[] = localParticipants;

  const hasConversation = selectedConversationId && conversation;

  return (
    <DashboardContent
      maxWidth={false}
      sx={{ display: 'flex', flex: '1 1 auto', flexDirection: 'column' }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: { xs: 3, md: 5 } }}>
        <IconButton
          onClick={() => router.push(paths.dashboard.vendas.root)}
          sx={{
            bgcolor: 'action.hover',
            '&:hover': { bgcolor: 'action.selected' },
          }}
        >
          <Iconify icon="eva:arrow-back-fill" />
        </IconButton>

        <Typography variant="h4">
          Atendimento - {venda?.invoiceTo?.name || 'Cliente'} #{' '}
          {venda?.invoiceNumber || `VND-${String(vendaId).padStart(4, '0')}`}
        </Typography>
      </Box>

      <ChatLayout
        slots={{
          header: hasConversation ? (
            <ChatHeaderDetail
              collapseNav={roomNav}
              participants={filteredParticipantsForHeader}
              loading={conversationLoading}
              vendaStatus={venda?.status}
              onAddParticipant={handleAddParticipant}
              onRemoveParticipant={handleRemoveParticipant}
            />
          ) : (
            <ChatHeaderCompose contacts={contacts} onAddRecipients={handleAddRecipients} />
          ),
          // Removido ChatNav - cada venda tem conversa única com IA
          nav: null,
          main: (
            <>
              {selectedConversationId ? (
                conversationError ? (
                  <EmptyContent
                    title={conversationError.message}
                    imgUrl={`${CONFIG.assetsDir}/assets/icons/empty/ic-chat-empty.svg`}
                  />
                ) : (
                  <ChatMessageList
                    messages={conversation?.messages ?? []}
                    participants={allParticipants}
                    loading={conversationLoading}
                  />
                )
              ) : (
                <EmptyContent
                  title="Good morning!"
                  description="Write something awesome..."
                  imgUrl={`${CONFIG.assetsDir}/assets/icons/empty/ic-chat-active.svg`}
                />
              )}

              <ChatMessageInput
                recipients={recipients}
                onAddRecipients={handleAddRecipients}
                selectedConversationId={selectedConversationId}
                disabled={!recipients.length && !selectedConversationId}
              />
            </>
          ),
          details: hasConversation && (
            <ChatRoom
              collapseNav={roomNav}
              participants={filteredParticipantsForHeader}
              loading={conversationLoading}
              messages={conversation?.messages ?? []}
            />
          ),
        }}
      />
    </DashboardContent>
  );
}
