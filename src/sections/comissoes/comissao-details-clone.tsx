import type { IComissaoItem } from 'src/types/comissao';

import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import TableRow from '@mui/material/TableRow';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import Typography from '@mui/material/Typography';

import { fDate } from 'src/utils/format-time';

import { Label } from 'src/components/label';
import { Scrollbar } from 'src/components/scrollbar';

import { ComissaoToolbarClone } from './comissao-toolbar-clone';

// ----------------------------------------------------------------------

type Props = {
  comissao?: IComissaoItem;
};

const COMISSAO_STATUS_OPTIONS = [
  { value: 'ativo', label: 'Ativo' },
  { value: 'inativo', label: 'Inativo' },
];

export function ComissaoDetailsClone({ comissao }: Props) {
  const [currentStatus, setCurrentStatus] = useState(comissao?.status);

  const handleChangeStatus = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentStatus(event.target.value as 'ativo' | 'inativo');
  }, []);

  // Função para obter o percentual principal para exibição
  const getMainPercentage = () => {
    if ('percentualTotal' in comissao!) {
      return comissao.percentualTotal;
    }
    // Para distribuição interna, vamos usar um percentual fixo de exemplo
    return 5; // Conforme mostrado no Figma
  };

  // Função para obter os participantes formatados conforme o Figma
  const getParticipantes = () => {
    const participantesPadrao = [
      { nome: 'Imobiliária', percentual: 10 },
      { nome: 'Corretor Principal', percentual: 50 },
      { nome: 'Corretor Suporte', percentual: 20 },
      { nome: 'Coordenador', percentual: 5 },
      { nome: 'Grupo', percentual: 5 },
      { nome: 'Captador', percentual: 10 },
    ];

    if ('participantes' in comissao! && comissao.participantes) {
      return comissao.participantes.map((p, index) => ({
        nome: p.tipo,
        percentual: p.percentual,
      }));
    }

    return participantesPadrao;
  };

  const renderParticipantesTable = () => {
    const participantes = getParticipantes();

    return (
      <Box sx={{ mt: 4 }}>
        <Scrollbar>
          <Table sx={{ minWidth: 600 }}>
            <TableHead>
              <TableRow sx={{ bgcolor: 'grey.50' }}>
                <TableCell width={60} sx={{ typography: 'subtitle2', color: 'text.secondary' }}>
                  #
                </TableCell>
                <TableCell sx={{ typography: 'subtitle2', color: 'text.secondary' }}>
                  Participantes
                </TableCell>
                <TableCell align="right" sx={{ typography: 'subtitle2', color: 'text.secondary' }}>
                  Divisão do prêmio
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {participantes.map((participante, index) => (
                <TableRow key={index} sx={{ '&:nth-of-type(even)': { bgcolor: 'grey.50' } }}>
                  <TableCell sx={{ typography: 'body2', color: 'text.secondary' }}>
                    {index + 1}
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {participante.nome}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {participante.percentual}%
                    </Typography>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Scrollbar>
      </Box>
    );
  };

  return (
    <>
      <ComissaoToolbarClone
        comissao={comissao}
        currentStatus={currentStatus || ''}
        onChangeStatus={handleChangeStatus}
        statusOptions={COMISSAO_STATUS_OPTIONS}
      />

      <Card sx={{ p: 4 }}>
        {/* Seção principal com percentual destacado e status */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            mb: 4,
          }}
        >
          {/* Percentual destacado à esquerda */}
          <Box>
            <Typography
              variant="h1"
              sx={{
                fontSize: { xs: '4rem', md: '6rem' },
                fontWeight: 700,
                color: 'text.primary',
                lineHeight: 1,
              }}
            >
              {getMainPercentage()}%
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: 'text.secondary',
                mt: 1,
                fontSize: '0.875rem',
              }}
            >
              Comissão sobre a venda
            </Typography>
          </Box>

          {/* Status e título à direita */}
          <Box sx={{ textAlign: 'right', flex: 1, ml: 4 }}>
            <Label
              variant="soft"
              color={currentStatus === 'ativo' ? 'success' : 'error'}
              sx={{ mb: 2, fontSize: '0.875rem', px: 2, py: 0.5 }}
            >
              {currentStatus === 'ativo' ? 'Ativo' : 'Inativo'}
            </Label>
            <Typography variant="h5" sx={{ fontWeight: 600, mt: 1 }}>
              {comissao?.nome || 'Comissão sobre a venda'}
            </Typography>
          </Box>
        </Box>

        {/* Seção de descrição */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
            Descrição
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {comissao?.descricao ||
              "Regra de comissão aplicada às vendas do empreendimento Space d'Italia, válida para corretores e parceiros cadastrados."}
          </Typography>
        </Box>

        {/* Seção de datas */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
            gap: 3,
            mb: 4,
          }}
        >
          <Box>
            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
              Criado em
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              {comissao?.createdAt ? fDate(comissao.createdAt) : '01 Jul 2025'}
            </Typography>
          </Box>
          <Box>
            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
              Última atualização
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              {comissao?.updatedAt ? fDate(comissao.updatedAt) : '01 Jul 2025'}
            </Typography>
          </Box>
        </Box>

        {/* Tabela de participantes */}
        {renderParticipantesTable()}
      </Card>
    </>
  );
}
