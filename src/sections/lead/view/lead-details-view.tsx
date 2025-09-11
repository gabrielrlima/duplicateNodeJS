import type { Dayjs } from 'dayjs';
import type { ILeadItem } from 'src/types/lead';

import dayjs from 'dayjs';
import { z as zod } from 'zod';
import { useState } from 'react';
import { paths } from '@/routes/paths';
import { Iconify } from '@/components/iconify';
import { RouterLink } from '@/routes/components';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, Controller } from 'react-hook-form';
import { DashboardContent } from '@/layouts/dashboard';
import { CustomBreadcrumbs } from '@/components/custom-breadcrumbs';

import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Card from '@mui/material/Card';
import Tabs from '@mui/material/Tabs';
import Grid from '@mui/material/Grid2';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';

import { usePathname, useSearchParams } from 'src/routes/hooks';

import { toast } from 'src/components/snackbar';
import { Scrollbar } from 'src/components/scrollbar';
import { Form, Field } from 'src/components/hook-form';
import { ColorPicker } from 'src/components/color-utils';

// ----------------------------------------------------------------------

const NAV_ITEMS = [
  {
    value: '',
    label: 'Geral',
    icon: <Iconify width={24} icon="solar:user-id-bold" />,
  },
  {
    value: 'visits',
    label: 'Visitas agendadas',
    icon: <Iconify width={24} icon="solar:calendar-bold" />,
  },
];

// ----------------------------------------------------------------------

const TAB_PARAM = 'tab';

export type LeadProfileSchemaType = zod.infer<typeof LeadProfileSchema>;

export const LeadProfileSchema = zod.object({
  name: zod.string().min(1, { message: 'Nome é obrigatório!' }),
  email: zod
    .string()
    .min(1, { message: 'Email é obrigatório!' })
    .email({ message: 'Email deve ser um endereço de email válido!' }),
  phoneNumber: zod.string().min(1, { message: 'WhatsApp é obrigatório!' }),
  status: zod.string(),
  isVerified: zod.boolean(),
});

// Schema para agendamento de visita
export const VisitScheduleSchema = zod.object({
  title: zod.string().min(1, { message: 'Título é obrigatório!' }),
  notes: zod.string().optional(),
  privateClient: zod.boolean(),
  visitDate: zod.custom<Dayjs>((val) => dayjs.isDayjs(val), {
    message: 'Data de visita é obrigatória!',
  }),
  interestedProduct: zod.string().min(1, { message: 'Produto interessado é obrigatório!' }),
  interestUnit: zod.string().min(1, { message: 'Unidade de interesse é obrigatória!' }),
  color: zod.string(),
});

export type VisitScheduleSchemaType = zod.infer<typeof VisitScheduleSchema>;

// ----------------------------------------------------------------------

type Props = {
  lead?: ILeadItem;
};

// Tipo para visita
interface IVisit {
  id?: number;
  title: string;
  date: Date;
  notes?: string;
  color: string;
  product: string;
  unit: string;
  status: string;
  privateClient: boolean;
}

// Dialog de agendamento de visita
function VisitScheduleDialog({
  open,
  onClose,
  lead,
  editVisit,
  onSave,
}: {
  open: boolean;
  onClose: () => void;
  lead?: ILeadItem;
  editVisit?: IVisit;
  onSave?: (visit: IVisit) => void;
}) {
  const colors = [
    '#22c55e', // verde
    '#06b6d4', // cyan
    '#3b82f6', // azul
    '#f59e0b', // laranja
    '#f97316', // orange
    '#ef4444', // vermelho
  ];

  const defaultValues: VisitScheduleSchemaType = {
    title: editVisit?.title || '',
    notes: editVisit?.notes || '',
    privateClient: editVisit?.privateClient || false,
    visitDate: editVisit?.date ? dayjs(editVisit.date) : dayjs(),
    interestedProduct: editVisit?.product || lead?.productInterest || '',
    interestUnit: editVisit?.unit || lead?.interestUnit || '',
    color: editVisit?.color || colors[0],
  };

  const methods = useForm<VisitScheduleSchemaType>({
    resolver: zodResolver(VisitScheduleSchema),
    defaultValues,
  });

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));

      const visitData: IVisit = {
        id: editVisit?.id || Date.now(),
        title: data.title,
        date: data.visitDate.toDate(),
        notes: data.notes,
        color: data.color,
        product: data.interestedProduct,
        unit: data.interestUnit,
        status: editVisit?.status || 'Agendada',
        privateClient: data.privateClient,
      };

      if (editVisit) {
        toast.success('Visita atualizada com sucesso!');
        onSave?.(visitData);
      } else {
        toast.success('Este lead será adicionado à sua lista de clientes após agendar a visita.');
        onSave?.(visitData);
      }

      console.info('VISIT DATA', visitData);
      onClose();
    } catch (error) {
      console.error(error);
      toast.error(editVisit ? 'Erro ao atualizar visita' : 'Erro ao agendar visita');
    }
  });

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>{editVisit ? 'Editar visita' : 'Agendar visita'}</DialogTitle>

      <Form methods={methods} onSubmit={onSubmit}>
        <Scrollbar sx={{ p: 3, bgcolor: 'background.neutral' }}>
          <Stack spacing={3}>
            <Box
              sx={{
                bgcolor: 'info.lighter',
                p: 2,
                borderRadius: 1,
                display: 'flex',
                alignItems: 'center',
                gap: 1,
              }}
            >
              <Iconify icon="solar:info-circle-bold" sx={{ color: 'info.main' }} />
              <Typography variant="body2" sx={{ color: 'info.dark' }}>
                Este lead será adicionado à sua lista de clientes após agendar a visita.
              </Typography>
            </Box>

            <Field.Text name="title" label="Título" placeholder="Digite o título da visita" />

            <Field.Text
              name="notes"
              label="Anotações"
              multiline
              rows={3}
              placeholder="Adicione observações sobre a visita"
            />

            <Field.Switch name="privateClient" label="Privar cliente" />

            <Field.MobileDateTimePicker name="visitDate" label="Quando a visita vai acontecer?" />

            <Controller
              name="color"
              control={control}
              render={({ field }) => (
                <ColorPicker
                  value={field.value as string}
                  onChange={(color) => field.onChange(color as string)}
                  options={colors}
                />
              )}
            />

            <Field.Select name="interestedProduct" label="Produto interessado">
              <option value="">Selecione...</option>
              <option value="Lake House">Lake House</option>
              <option value="Mountain View">Mountain View</option>
              <option value="City Apartment">City Apartment</option>
              <option value="Beach House">Beach House</option>
            </Field.Select>

            <Field.Select name="interestUnit" label="Unidade de interesse">
              <option value="">Selecione...</option>
              <option value="66m2, 99m2">66m2, 99m2</option>
              <option value="45m2, 65m2">45m2, 65m2</option>
              <option value="80m2, 120m2">80m2, 120m2</option>
              <option value="100m2, 150m2">100m2, 150m2</option>
            </Field.Select>
          </Stack>
        </Scrollbar>

        <DialogActions sx={{ flexShrink: 0 }}>
          <Button variant="outlined" color="inherit" onClick={onClose}>
            Cancelar
          </Button>

          <LoadingButton
            type="submit"
            variant="contained"
            loading={isSubmitting}
            sx={{ bgcolor: 'grey.800', '&:hover': { bgcolor: 'grey.900' } }}
          >
            {editVisit ? 'Salvar alterações' : 'Agendar visita'}
          </LoadingButton>
        </DialogActions>
      </Form>
    </Dialog>
  );
}

// Componente para aba de visitas agendadas
function ScheduledVisits({ lead }: Props) {
  const [visits, setVisits] = useState<IVisit[]>([
    {
      id: 1,
      title: 'Visita Lake House',
      date: new Date('2024-01-15T14:00:00'),
      notes: 'Cliente interessado em unidade de 99m2',
      color: '#22c55e',
      product: 'Lake House',
      unit: '66m2, 99m2',
      status: 'Agendada',
      privateClient: false,
    },
    {
      id: 2,
      title: 'Apresentação Mountain View',
      date: new Date('2024-01-20T10:30:00'),
      notes: 'Mostrar plantas e localização',
      color: '#3b82f6',
      product: 'Mountain View',
      unit: '80m2, 120m2',
      status: 'Confirmada',
      privateClient: true,
    },
  ]);

  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingVisit, setEditingVisit] = useState<IVisit | undefined>();

  const handleEditVisit = (visit: IVisit) => {
    setEditingVisit(visit);
    setEditDialogOpen(true);
  };

  const handleDeleteVisit = async (visitId: number) => {
    try {
      setVisits((prev) => prev.filter((visit) => visit.id !== visitId));
      toast.success('Visita excluída com sucesso!');
    } catch (error) {
      console.error(error);
      toast.error('Erro ao excluir visita');
    }
  };

  const handleSaveVisit = (updatedVisit: IVisit) => {
    setVisits((prev) => prev.map((visit) => (visit.id === updatedVisit.id ? updatedVisit : visit)));
    setEditDialogOpen(false);
    setEditingVisit(undefined);
  };

  return (
    <>
      <Grid container spacing={3}>
        {visits.length === 0 ? (
          <Grid size={12}>
            <Card sx={{ p: 3, textAlign: 'center' }}>
              <Iconify
                icon="solar:calendar-add-bold-duotone"
                sx={{ width: 64, height: 64, mx: 'auto', mb: 2, color: 'text.disabled' }}
              />
              <Typography variant="h6" sx={{ mb: 1 }}>
                Nenhuma visita agendada
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                As visitas agendadas para este lead aparecerão aqui
              </Typography>
            </Card>
          </Grid>
        ) : (
          visits.map((visit) => (
            <Grid size={{ xs: 12, md: 6 }} key={visit.id}>
              <Card sx={{ p: 3 }}>
                <Stack spacing={2}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar sx={{ bgcolor: visit.color, width: 40, height: 40 }}>
                      <Iconify icon="solar:calendar-bold" />
                    </Avatar>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                        {visit.title}
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        {visit.date.toLocaleDateString('pt-BR', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </Typography>
                    </Box>
                  </Box>

                  <Box>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      <strong>Produto:</strong> {visit.product}
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      <strong>Unidade:</strong> {visit.unit}
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      <strong>Status:</strong> {visit.status}
                    </Typography>
                    {visit.notes && (
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        <strong>Observações:</strong> {visit.notes}
                      </Typography>
                    )}
                  </Box>

                  <Stack direction="row" spacing={1}>
                    <Button
                      size="small"
                      variant="outlined"
                      startIcon={<Iconify icon="solar:pen-bold" />}
                      onClick={() => handleEditVisit(visit)}
                    >
                      Editar
                    </Button>
                    <Button
                      size="small"
                      variant="outlined"
                      color="error"
                      startIcon={<Iconify icon="solar:trash-bin-trash-bold" />}
                      onClick={() => handleDeleteVisit(visit.id!)}
                    >
                      Excluir
                    </Button>
                  </Stack>
                </Stack>
              </Card>
            </Grid>
          ))
        )}
      </Grid>

      <VisitScheduleDialog
        open={editDialogOpen}
        onClose={() => {
          setEditDialogOpen(false);
          setEditingVisit(undefined);
        }}
        lead={lead}
        editVisit={editingVisit}
        onSave={handleSaveVisit}
      />
    </>
  );
}

// Componente para aba Geral
function LeadGeneral({ lead }: Props) {
  const defaultValues: LeadProfileSchemaType = {
    status: lead?.status || '',
    isVerified: lead?.isVerified || true,
    name: lead?.name || '',
    email: lead?.email || '',
    phoneNumber: lead?.phoneNumber || '',
  };

  const methods = useForm<LeadProfileSchemaType>({
    mode: 'onSubmit',
    resolver: zodResolver(LeadProfileSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting, isDirty },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      toast.success('Dados atualizados com sucesso!');
      console.info('DATA UPDATED', data);
    } catch (error) {
      console.error(error);
      toast.error('Erro ao atualizar dados');
    }
  });

  // const handleDelete = async () => {
  //   try {
  //     // Implementar lógica de exclusão
  //     toast.success('Lead excluído com sucesso!');
  //   } catch (error) {
  //     console.error(error);
  //     toast.error('Erro ao excluir lead');
  //   }
  // };

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        {/* Formulário */}
        <Grid size={{ xs: 12 }}>
          <Card sx={{ p: 3 }}>
            <Box
              sx={{
                rowGap: 3,
                columnGap: 2,
                display: 'grid',
                gridTemplateColumns: { xs: 'repeat(1, 1fr)' },
              }}
            >
              <Field.Text name="name" label="Nome" />
              <Field.Text name="email" label="Email" />
              <Field.Phone name="phoneNumber" label="WhatsApp" country="BR" />
            </Box>

            <Stack direction="row" spacing={2} sx={{ mt: 3, justifyContent: 'flex-end' }}>
              <Button
                variant="contained"
                color={lead?.status === 'desativados' ? 'success' : 'error'}
                onClick={() => {
                  const isDeactivated = lead?.status === 'desativados';
                  if (isDeactivated) {
                    toast.success('Lead será ativado!');
                    // Aqui você pode implementar a lógica para ativar o lead
                  } else {
                    toast.warning('Lead será desativado!');
                    // Aqui você pode implementar a lógica para desativar o lead
                  }
                }}
              >
                {lead?.status === 'desativados' ? 'Ativar Lead' : 'Desativar Lead'}
              </Button>
              <LoadingButton
                type="submit"
                variant="contained"
                loading={isSubmitting}
                disabled={!isDirty}
                sx={{ bgcolor: 'grey.800', '&:hover': { bgcolor: 'grey.900' } }}
              >
                Salvar ajustes
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </Form>
  );
}

// Componente principal
export function LeadDetailsView({ lead }: Props) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const selectedTab = searchParams.get(TAB_PARAM) ?? '';
  const [visitDialogOpen, setVisitDialogOpen] = useState(false);

  const createRedirectPath = (currentPath: string, query: string) => {
    const queryString = new URLSearchParams({ [TAB_PARAM]: query }).toString();
    return query ? `${currentPath}?${queryString}` : currentPath;
  };

  const handleScheduleVisit = () => {
    setVisitDialogOpen(true);
  };

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading={lead?.name || ''}
        links={[
          { name: 'Painel', href: paths.dashboard.root },
          { name: 'Leads', href: paths.dashboard.lead.list },
          { name: lead?.name || '' },
        ]}
        action={
          <Button
            variant="contained"
            endIcon={<Iconify icon="mingcute:heart-fill" />}
            onClick={handleScheduleVisit}
            sx={{ bgcolor: 'grey.800', '&:hover': { bgcolor: 'grey.900' } }}
          >
            Agendar visita
          </Button>
        }
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <Box sx={{ mb: 3 }}>
        <Tabs value={selectedTab}>
          {NAV_ITEMS.map((tab) => (
            <Tab
              component={RouterLink}
              key={tab.value}
              value={tab.value}
              icon={tab.icon}
              label={tab.label}
              href={createRedirectPath(pathname, tab.value)}
            />
          ))}
        </Tabs>
      </Box>

      {selectedTab === '' && <LeadGeneral lead={lead} />}
      {selectedTab === 'visits' && <ScheduledVisits lead={lead} />}

      <VisitScheduleDialog
        open={visitDialogOpen}
        onClose={() => setVisitDialogOpen(false)}
        lead={lead}
      />
    </DashboardContent>
  );
}
