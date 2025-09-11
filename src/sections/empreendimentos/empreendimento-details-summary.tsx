import type { IEmpreendimentoItem } from 'src/types/empreendimento';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';

import { fDate } from 'src/utils/format-time';
import { fCurrency } from 'src/utils/format-number';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

type Props = {
  empreendimento: IEmpreendimentoItem;
};

export function EmpreendimentoDetailsSummary({ empreendimento }: Props) {
  const {
    nome,
    titulo,
    status,
    preco,
    cidade,
    estado,
    tipoEmpreendimento,
    construtora,
    criadoEm,
    plantas,
    beneficios,
    diferenciaisEdificio,
    diferenciaisApartamento,
  } = empreendimento;

  const renderPrice = () => (
    <Box sx={{ typography: 'h5' }}>
      {preco?.valor ? (
        <>
          {fCurrency(preco.valor)}
          {preco.negociavel && (
            <Typography variant="caption" sx={{ ml: 1, color: 'text.secondary' }}>
              (Negociável)
            </Typography>
          )}
        </>
      ) : (
        'Consulte valores'
      )}
    </Box>
  );

  const renderStatus = () => (
    <Label
      variant="soft"
      color={
        (status === 'Lançamento' && 'info') ||
        (status === 'Em construção' && 'warning') ||
        (status === 'Pronto para morar' && 'success') ||
        'default'
      }
    >
      {status}
    </Label>
  );

  const renderInfo = () => (
    <Stack spacing={1.5}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Iconify icon="solar:buildings-3-bold" width={20} />
        <Typography variant="body2">{tipoEmpreendimento}</Typography>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Iconify icon="solar:map-point-bold" width={20} />
        <Typography variant="body2">
          {cidade}, {estado}
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Iconify icon="solar:home-bold" width={20} />
        <Typography variant="body2">{construtora?.name}</Typography>
      </Box>

      {criadoEm && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Iconify icon="solar:calendar-bold" width={20} />
          <Typography variant="body2">Criado em {fDate(criadoEm)}</Typography>
        </Box>
      )}

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Iconify icon="solar:document-bold" width={20} />
        <Typography variant="body2">
          {plantas?.length || 0} {plantas?.length === 1 ? 'planta' : 'plantas'} disponível
          {plantas?.length !== 1 ? 'is' : ''}
        </Typography>
      </Box>
    </Stack>
  );

  const renderBeneficios = () => (
    <Stack spacing={1}>
      <Typography variant="subtitle2">Benefícios</Typography>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
        {beneficios?.map((beneficio) => (
          <Chip key={beneficio} label={beneficio} size="small" variant="outlined" />
        )) || (
          <Typography variant="body2" color="text.secondary">
            Nenhum benefício informado
          </Typography>
        )}
      </Box>
    </Stack>
  );

  const renderDiferenciais = () => (
    <Stack spacing={1}>
      <Typography variant="subtitle2">Diferenciais</Typography>

      {diferenciaisEdificio && diferenciaisEdificio.length > 0 && (
        <Box>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
            Edifício:
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
            {diferenciaisEdificio.map((diferencial) => (
              <Chip
                key={diferencial}
                label={diferencial}
                size="small"
                color="primary"
                variant="outlined"
              />
            ))}
          </Box>
        </Box>
      )}

      {diferenciaisApartamento && diferenciaisApartamento.length > 0 && (
        <Box>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
            Apartamento:
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
            {diferenciaisApartamento.map((diferencial) => (
              <Chip
                key={diferencial}
                label={diferencial}
                size="small"
                color="secondary"
                variant="outlined"
              />
            ))}
          </Box>
        </Box>
      )}

      {!diferenciaisEdificio?.length && !diferenciaisApartamento?.length && (
        <Typography variant="body2" color="text.secondary">
          Nenhum diferencial informado
        </Typography>
      )}
    </Stack>
  );

  const renderActions = () => (
    <Stack spacing={2}>
      <Button
        fullWidth
        size="large"
        color="primary"
        variant="contained"
        startIcon={<Iconify icon="solar:phone-bold" />}
      >
        Entrar em contato
      </Button>

      <Button
        fullWidth
        size="large"
        color="inherit"
        variant="outlined"
        startIcon={<Iconify icon="solar:bookmark-bold" />}
      >
        Salvar nos favoritos
      </Button>
    </Stack>
  );

  return (
    <Stack spacing={3} sx={{ pt: 3 }}>
      <Stack spacing={2}>
        <Typography variant="h4">{nome || titulo}</Typography>

        {renderStatus()}

        {renderPrice()}
      </Stack>

      <Divider sx={{ borderStyle: 'dashed' }} />

      {renderInfo()}

      <Divider sx={{ borderStyle: 'dashed' }} />

      {renderBeneficios()}

      <Divider sx={{ borderStyle: 'dashed' }} />

      {renderDiferenciais()}

      <Divider sx={{ borderStyle: 'dashed' }} />

      {renderActions()}
    </Stack>
  );
}
