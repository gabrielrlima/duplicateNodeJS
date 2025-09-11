import type { ICalendarEvent } from 'src/types/calendar';

import { z as zod } from 'zod';
import { useCallback } from 'react';
import { uuidv4 } from 'minimal-shared/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, Controller } from 'react-hook-form';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import LoadingButton from '@mui/lab/LoadingButton';
import DialogActions from '@mui/material/DialogActions';

import { fIsAfter } from 'src/utils/format-time';

import { createEvent, updateEvent, deleteEvent } from 'src/actions/calendar';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { Form, Field } from 'src/components/hook-form';
import { ColorPicker } from 'src/components/color-utils';

// ----------------------------------------------------------------------

export type EventSchemaType = zod.infer<typeof EventSchema>;

export const EventSchema = zod.object({
  title: zod
    .string()
    .min(1, { message: 'Título é obrigatório!' })
    .max(100, { message: 'Título deve ter menos de 100 caracteres' }),
  description: zod
    .string()
    .min(1, { message: 'Descrição é obrigatória!' })
    .min(10, { message: 'Descrição deve ter pelo menos 10 caracteres' }),
  // Not required
  color: zod.string(),
  allDay: zod.boolean(),
  start: zod.union([zod.string(), zod.number()]),
  end: zod.union([zod.string(), zod.number()]),
});

// ----------------------------------------------------------------------

type Props = {
  colorOptions: string[];
  onClose: () => void;
  currentEvent?: ICalendarEvent;
  redirectToOrder?: boolean;
  onSuccess?: (date: Date) => void;
};

export function CalendarForm({
  currentEvent,
  colorOptions,
  onClose,
  redirectToOrder = false,
  onSuccess,
}: Props) {
  // Valores padrão para garantir que o formulário funcione
  const defaultValues = {
    title: currentEvent?.title || 'Visita agendada',
    description: currentEvent?.description || 'Visita agendada para o cliente',
    color: currentEvent?.color || colorOptions[0] || '#1976d2',
    allDay: currentEvent?.allDay || false,
    start: currentEvent?.start || new Date().getTime(),
    end: currentEvent?.end || new Date(Date.now() + 60 * 60 * 1000).getTime(), // 1 hora depois
  };

  const methods = useForm<EventSchemaType>({
    mode: 'all',
    resolver: zodResolver(EventSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  const dateError = fIsAfter(values.start, values.end);

  const onSubmit = handleSubmit(async (data) => {
    console.log('onSubmit chamado com dados:', data);
    console.log('dateError:', dateError);

    const eventData = {
      id: currentEvent?.id ? currentEvent?.id : uuidv4(),
      color: data?.color,
      title: data?.title,
      allDay: data?.allDay,
      description: data?.description,
      end: data?.end,
      start: data?.start,
    };

    console.log('eventData criado:', eventData);

    try {
      if (!dateError) {
        console.log('Sem erro de data, prosseguindo...');
        if (currentEvent?.id) {
          console.log('Atualizando evento existente');
          await updateEvent(eventData);
          toast.success('Atualizado com sucesso!');
        } else {
          console.log('Criando novo evento');
          await createEvent(eventData);
          toast.success('Visita agendada com sucesso!');

          // Chama onSuccess se fornecido
          console.log('Chamando onSuccess:', !!onSuccess);
          if (onSuccess) {
            const visitDate = new Date(eventData.start);
            onSuccess(visitDate);
          }
        }
        console.log('Fechando modal e resetando formulário');
        onClose();
        reset();
      } else {
        console.log('Erro de data detectado, não enviando formulário');
      }
    } catch (error) {
      console.error('Erro no onSubmit:', error);
      toast.error('Erro ao agendar visita!');
    }
  });

  const onDelete = useCallback(async () => {
    try {
      await deleteEvent(`${currentEvent?.id}`);
      toast.success('Excluído com sucesso!');
      onClose();
    } catch (error) {
      console.error(error);
    }
  }, [currentEvent?.id, onClose]);

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Scrollbar sx={{ p: 3, bgcolor: 'background.neutral' }}>
        <Stack spacing={3}>
          <Field.Text name="title" label="Título" />

          <Field.Text name="description" label="Descrição" multiline rows={3} />

          <Field.Switch name="allDay" label="Dia inteiro" />

          <Field.MobileDateTimePicker name="start" label="Data de início" />

          <Field.MobileDateTimePicker
            name="end"
            label="Data de término"
            slotProps={{
              textField: {
                error: dateError,
                helperText: dateError
                  ? 'Data de término deve ser posterior à data de início'
                  : null,
              },
            }}
          />

          <Controller
            name="color"
            control={control}
            render={({ field }) => (
              <ColorPicker
                value={field.value as string}
                onChange={(color) => field.onChange(color as string)}
                options={colorOptions}
              />
            )}
          />
        </Stack>
      </Scrollbar>

      <DialogActions sx={{ flexShrink: 0 }}>
        {!!currentEvent?.id && (
          <Tooltip title="Excluir evento">
            <IconButton onClick={onDelete}>
              <Iconify icon="solar:trash-bin-trash-bold" />
            </IconButton>
          </Tooltip>
        )}

        <Box sx={{ flexGrow: 1 }} />

        <Button variant="outlined" color="inherit" onClick={onClose}>
          Cancelar
        </Button>

        <LoadingButton
          type="submit"
          variant="contained"
          loading={isSubmitting}
          disabled={dateError}
        >
          Agendar visita
        </LoadingButton>
      </DialogActions>
    </Form>
  );
}
