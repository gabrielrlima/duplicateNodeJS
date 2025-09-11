import type { IEmpreendimentoPlanta } from 'src/types/empreendimento';

import { useState, useCallback } from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Accordion from '@mui/material/Accordion';
import Typography from '@mui/material/Typography';
import CardHeader from '@mui/material/CardHeader';
import InputAdornment from '@mui/material/InputAdornment';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';

import { Iconify } from 'src/components/iconify';
import { Field } from 'src/components/hook-form';

import type { NewEmpreendimentoSchemaType } from './empreendimento-new-edit-form';

// ----------------------------------------------------------------------

type Props = {
  caracteristicasOptions?: string[];
};

export function EmpreendimentoPlantasManager({ caracteristicasOptions = [] }: Props) {
  const { control, watch } = useFormContext<NewEmpreendimentoSchemaType>();
  const [expandedPanel, setExpandedPanel] = useState<string | false>('panel-0');

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'plantas',
  });

  const plantas = watch('plantas');

  const handleAddPlanta = useCallback(() => {
    const newId = `planta-${Date.now()}`;
    const newPlanta: IEmpreendimentoPlanta = {
      id: newId,
      nome: `Planta Tipo ${fields.length + 1}`,
      descricao: '',
      area: 0,
      quartos: 2,
      banheiros: 1,
      vagas: 1,
      suites: 0,
      disponivel: true,
      caracteristicas: [],
      imagens: [],
    };
    append(newPlanta);
    setExpandedPanel(`panel-${fields.length}`);
  }, [append, fields.length]);

  const handleRemovePlanta = useCallback(
    (index: number) => {
      remove(index);
      if (expandedPanel === `panel-${index}`) {
        setExpandedPanel(index > 0 ? `panel-${index - 1}` : 'panel-0');
      }
    },
    [remove, expandedPanel]
  );

  const handlePanelChange = useCallback(
    (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpandedPanel(isExpanded ? panel : false);
    },
    []
  );

  const renderPlantaForm = (index: number) => (
    <Stack spacing={3}>
      <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: 'repeat(2, 1fr)' }}>
        <Field.Text
          name={`plantas.${index}.nome`}
          label="Nome da planta"
          placeholder="Ex: Planta Tipo 1 ou Cobertura Duplex"
        />
        <Field.Text
          name={`plantas.${index}.area`}
          label="Área (m²)"
          type="number"
          slotProps={{
            input: {
              endAdornment: (
                <InputAdornment position="end">
                  <Box component="span" sx={{ color: 'text.disabled' }}>
                    m²
                  </Box>
                </InputAdornment>
              ),
            },
          }}
        />
      </Box>

      <Field.Text
        name={`plantas.${index}.descricao`}
        label="Descrição"
        placeholder="Descrição da planta..."
        multiline
        rows={2}
      />

      <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: 'repeat(4, 1fr)' }}>
        <Field.Text
          name={`plantas.${index}.quartos`}
          label="Quartos"
          type="number"
          slotProps={{ input: { inputProps: { min: 0 } } }}
        />
        <Field.Text
          name={`plantas.${index}.banheiros`}
          label="Banheiros"
          type="number"
          slotProps={{ input: { inputProps: { min: 1 } } }}
        />
        <Field.Text
          name={`plantas.${index}.vagas`}
          label="Vagas"
          type="number"
          slotProps={{ input: { inputProps: { min: 0 } } }}
        />
        <Field.Text
          name={`plantas.${index}.suites`}
          label="Suítes"
          type="number"
          slotProps={{ input: { inputProps: { min: 0 } } }}
        />
      </Box>

      {caracteristicasOptions.length > 0 && (
        <Stack spacing={1}>
          <Typography variant="subtitle2">Características específicas</Typography>
          <Field.Autocomplete
            name={`plantas.${index}.caracteristicas`}
            placeholder="+ Características"
            multiple
            disableCloseOnSelect
            options={caracteristicasOptions}
            getOptionLabel={(option) => option || ''}
            renderOption={(props, option) => (
              <Box component="li" {...props}>
                {option}
              </Box>
            )}
          />
        </Stack>
      )}

      <Divider sx={{ borderStyle: 'dashed' }} />

      <Stack spacing={2}>
        <Typography variant="subtitle2">Preço específico (opcional)</Typography>

        <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: '1fr' }}>
          <Field.Text
            name={`plantas.${index}.preco.valor`}
            label="Preço Total"
            type="number"
            placeholder="0.00"
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start" sx={{ mr: 0.75 }}>
                    <Box component="span" sx={{ color: 'text.disabled' }}>
                      R$
                    </Box>
                  </InputAdornment>
                ),
              },
            }}
          />
        </Box>

        <Field.Switch name={`plantas.${index}.preco.negociavel`} label="Preço negociável" />
      </Stack>

      <Divider sx={{ borderStyle: 'dashed' }} />

      <Stack spacing={2}>
        <Typography variant="subtitle2">Imagens</Typography>
        <Field.Upload
          name={`plantas.${index}.imagens`}
          multiple
          maxSize={3145728}
          helperText="Faça upload das imagens da planta (máx. 3MB cada)"
        />
      </Stack>
    </Stack>
  );

  return (
    <Card>
      <CardHeader
        title="Plantas do empreendimento"
        subheader="Adicione as diferentes plantas disponíveis"
        action={
          <Button
            size="small"
            color="primary"
            startIcon={<Iconify icon="mingcute:add-line" />}
            onClick={handleAddPlanta}
          >
            Adicionar planta
          </Button>
        }
        sx={{ mb: 3 }}
      />

      <Divider />

      <Box sx={{ p: 3 }}>
        {fields.length === 0 ? (
          <Box
            sx={{
              py: 6,
              textAlign: 'center',
              color: 'text.secondary',
            }}
          >
            <Iconify icon="solar:home-2-bold-duotone" width={64} sx={{ mb: 2, opacity: 0.5 }} />
            <Typography variant="h6" gutterBottom>
              Nenhuma planta adicionada
            </Typography>
            <Typography variant="body2">
              Clique em &quot;Adicionar planta&quot; para começar
            </Typography>
          </Box>
        ) : (
          <Stack spacing={2}>
            {fields.map((field, index) => {
              const planta = plantas[index];
              const panelId = `panel-${index}`;

              return (
                <Accordion
                  key={field.id}
                  expanded={expandedPanel === panelId}
                  onChange={handlePanelChange(panelId)}
                >
                  <AccordionSummary
                    expandIcon={<Iconify icon="eva:arrow-ios-downward-fill" />}
                    sx={{
                      '&.Mui-expanded': {
                        minHeight: 56,
                      },
                      '& .MuiAccordionSummary-content': {
                        '&.Mui-expanded': {
                          margin: '12px 0',
                        },
                      },
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                      <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="subtitle1">
                          {planta?.nome || `Planta ${index + 1}`}
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                          {planta?.area ? `${planta.area}m²` : 'Área não definida'} •{' '}
                          {planta?.quartos || 0} quartos • {planta?.banheiros || 0} banheiros
                        </Typography>
                      </Box>

                      {fields.length > 1 && (
                        <Box
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemovePlanta(index);
                          }}
                          sx={{
                            ml: 1,
                            p: 0.5,
                            borderRadius: 1,
                            cursor: 'pointer',
                            color: 'error.main',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            '&:hover': {
                              bgcolor: 'error.lighter',
                            },
                          }}
                        >
                          <Iconify icon="solar:trash-bin-trash-bold" width={18} />
                        </Box>
                      )}
                    </Box>
                  </AccordionSummary>

                  <AccordionDetails>{renderPlantaForm(index)}</AccordionDetails>
                </Accordion>
              );
            })}
          </Stack>
        )}
      </Box>
    </Card>
  );
}
