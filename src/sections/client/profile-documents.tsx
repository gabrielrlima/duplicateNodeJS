import type { IClientItem } from 'src/types/client';
// Interfaces
import type { IFile, IFileFilters } from 'src/types/file';

import { useState, useCallback } from 'react';
import { useBoolean, useSetState } from 'minimal-shared/hooks';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import InputAdornment from '@mui/material/InputAdornment';

import { fIsAfter, fIsBetween } from 'src/utils/format-time';

import { _allFiles } from 'src/_mock';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { fileFormat } from 'src/components/file-thumbnail';
import { EmptyContent } from 'src/components/empty-content';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { useTable, rowInPage, getComparator } from 'src/components/table';

// ----------------------------------------------------------------------

type Props = {
  client: IClientItem;
};

export function ProfileDocuments({ client }: Props) {
  const table = useTable({ defaultRowsPerPage: 10 });

  const confirmDialog = useBoolean();
  const [tableData, setTableData] = useState<IFile[]>(_allFiles);

  const filters = useSetState<IFileFilters>({
    name: '',
    type: [],
    startDate: null,
    endDate: null,
  });
  const { state: currentFilters, setState: updateFilters } = filters;

  const dateError = fIsAfter(currentFilters.startDate, currentFilters.endDate);

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(table.order, table.orderBy),
    filters: currentFilters,
    dateError,
  });

  const dataInPage = rowInPage(dataFiltered, table.page, table.rowsPerPage);
  const notFound = (!dataFiltered.length && !!currentFilters.name) || !dataFiltered.length;

  // const handleDeleteItem = useCallback(
  //   (id: string) => {
  //     const deleteRow = tableData.filter((row) => row.id !== id);
  //     toast.success('Arquivo excluído com sucesso!');
  //     setTableData(deleteRow);
  //     table.onUpdatePageDeleteRow(dataInPage.length);
  //   },
  //   [dataInPage.length, table, tableData]
  // );

  const handleDeleteItems = useCallback(() => {
    const deleteRows = tableData.filter((row) => !table.selected.includes(row.id));
    toast.success('Arquivos excluídos com sucesso!');
    setTableData(deleteRows);
    table.onUpdatePageDeleteRows(dataInPage.length, dataFiltered.length);
  }, [dataFiltered.length, dataInPage.length, table, tableData]);

  const renderSearch = (
    <TextField
      fullWidth
      value={currentFilters.name}
      onChange={(event) => {
        updateFilters({
          name: event.target.value,
        });
        table.onResetPage();
      }}
      placeholder="Procurar..."
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
          </InputAdornment>
        ),
      }}
      sx={{ mr: 1 }}
    />
  );

  const renderFilters = (
    <Stack direction="row" spacing={2} justifyContent="space-between" sx={{ mt: 3, mb: 2 }}>
      <Stack direction="row" spacing={2} flex={1}>
        {renderSearch}
      </Stack>

      <Stack direction="row" spacing={1} alignItems="center">
        <Button
          color="primary"
          variant="outlined"
          startIcon={<Iconify icon="mdi:filter-outline" />}
          onClick={() => {}}
        >
          Período
        </Button>
        <Button
          color="primary"
          variant="outlined"
          startIcon={<Iconify icon="mdi:filter-outline" />}
          onClick={() => {}}
        >
          Tipo
        </Button>
      </Stack>
    </Stack>
  );

  const renderDocumentsList = (
    <Box sx={{ position: 'relative', mt: 1 }}>
      <Box sx={{ bgcolor: 'background.neutral', borderRadius: 1.5, p: 0 }}>
        <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
          <Stack direction="row" alignItems="center" spacing={2}>
            <Checkbox
              checked={table.selected.length > 0 && table.selected.length === dataFiltered.length}
              indeterminate={
                table.selected.length > 0 && table.selected.length < dataFiltered.length
              }
              onChange={(event, checked) => table.onSelectAllRows(checked, [])}
            />

            <Box sx={{ flex: 1 }}>
              <Typography variant="subtitle2">Nome</Typography>
            </Box>

            <Box sx={{ width: 120, textAlign: 'center' }}>
              <Typography variant="subtitle2">Tamanho</Typography>
            </Box>

            <Box sx={{ width: 120, textAlign: 'center' }}>
              <Typography variant="subtitle2">Tipo</Typography>
            </Box>

            <Box sx={{ width: 160, textAlign: 'center' }}>
              <Typography variant="subtitle2">Último acesso</Typography>
            </Box>

            <Box sx={{ width: 160, textAlign: 'center' }}>
              <Typography variant="subtitle2">Compartilhado com</Typography>
            </Box>

            <Box sx={{ width: 60 }} />
          </Stack>
        </Box>

        {dataFiltered.map((file) => (
          <Stack
            key={file.id}
            direction="row"
            alignItems="center"
            sx={{
              px: 2,
              py: 1.5,
              borderBottom: '1px solid',
              borderColor: 'divider',
              '&:hover': { bgcolor: 'background.paper' },
            }}
          >
            <Checkbox
              checked={table.selected.includes(file.id)}
              onChange={() => table.onSelectRow(file.id)}
            />

            <Box sx={{ display: 'flex', alignItems: 'center', flex: 1 }}>
              <Iconify
                icon={
                  file.type === 'pdf'
                    ? 'mdi:file-pdf-box'
                    : file.type === 'jpg' || file.type === 'jpeg'
                      ? 'mdi:file-image'
                      : file.type === 'doc' || file.type === 'docx'
                        ? 'mdi:file-word'
                        : file.type === 'txt'
                          ? 'mdi:file-document-outline'
                          : file.type === 'js'
                            ? 'mdi:language-javascript'
                            : file.type === 'psd'
                              ? 'mdi:file-image-outline'
                              : 'mdi:file-outline'
                }
                color={
                  file.type === 'pdf'
                    ? '#F44336'
                    : file.type === 'jpg' || file.type === 'jpeg'
                      ? '#FF9800'
                      : file.type === 'doc' || file.type === 'docx'
                        ? '#2196F3'
                        : file.type === 'txt'
                          ? '#4CAF50'
                          : file.type === 'js'
                            ? '#FFC107'
                            : file.type === 'psd'
                              ? '#9C27B0'
                              : '#607D8B'
                }
                sx={{ width: 24, height: 24, mr: 2 }}
              />
              <Typography variant="body2">{file.name}</Typography>
            </Box>

            <Box sx={{ width: 120, textAlign: 'center' }}>
              <Typography variant="body2">{file.size}</Typography>
            </Box>

            <Box sx={{ width: 120, textAlign: 'center' }}>
              <Typography variant="body2">{file.type}</Typography>
            </Box>

            <Box sx={{ width: 160, textAlign: 'center' }}>
              <Typography variant="body2">{file.modifiedAt}</Typography>
            </Box>

            <Box sx={{ width: 160, textAlign: 'center' }}>
              {file.shared ? (
                <Stack direction="row" justifyContent="center">
                  {[0, 1, 2].map((index) => (
                    <Box
                      key={index}
                      sx={{
                        width: 24,
                        height: 24,
                        borderRadius: '50%',
                        bgcolor: `primary.light`,
                        border: '2px solid #fff',
                        ml: index > 0 ? -0.5 : 0,
                      }}
                    />
                  ))}
                </Stack>
              ) : (
                <Typography variant="body2">-</Typography>
              )}
            </Box>

            <Box sx={{ width: 60, display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                size="small"
                color="inherit"
                onClick={() => {}}
                sx={{ minWidth: 'auto', p: 1 }}
              >
                <Iconify icon="eva:more-vertical-fill" />
              </Button>
            </Box>
          </Stack>
        ))}

        {notFound && <EmptyContent filled title="Nenhum arquivo encontrado" sx={{ py: 10 }} />}
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
        <Typography variant="body2" color="text.secondary">
          Itens por página:
          <Box component="span" sx={{ mx: 0.5 }}>
            5
          </Box>
          <Box component="span" sx={{ mx: 0.5 }}>
            6-10 de 11
          </Box>
        </Typography>

        <Stack direction="row" spacing={1}>
          <Button size="small" onClick={() => {}} disabled={table.page === 0} color="inherit">
            <Iconify icon="eva:arrow-ios-back-fill" />
          </Button>

          <Button
            size="small"
            onClick={() => {}}
            disabled={table.page >= Math.ceil(dataFiltered.length / table.rowsPerPage) - 1}
            color="inherit"
          >
            <Iconify icon="eva:arrow-ios-forward-fill" />
          </Button>
        </Stack>
      </Box>
    </Box>
  );

  const renderConfirmDialog = (
    <ConfirmDialog
      open={confirmDialog.value}
      onClose={confirmDialog.onFalse}
      title="Excluir"
      content={
        <>
          Você tem certeza que deseja excluir <strong> {table.selected.length} </strong> itens?
        </>
      }
      action={
        <Button
          variant="contained"
          color="error"
          onClick={() => {
            handleDeleteItems();
            confirmDialog.onFalse();
          }}
        >
          Excluir
        </Button>
      }
    />
  );

  return (
    <>
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h5">Documentos de {client.name.split(' ')[0]}</Typography>
          <Button
            variant="contained"
            color="primary"
            size="medium"
            startIcon={<Iconify icon="eva:plus-fill" />}
            onClick={() => {}}
          >
            Adicionar novo documento
          </Button>
        </Box>

        {renderFilters}
        {renderDocumentsList}
      </Box>

      {renderConfirmDialog}
    </>
  );
}

// ----------------------------------------------------------------------

type ApplyFilterProps = {
  dateError: boolean;
  inputData: IFile[];
  filters: IFileFilters;
  comparator: (a: any, b: any) => number;
};

function applyFilter({ inputData, comparator, filters, dateError }: ApplyFilterProps) {
  const { name, type, startDate, endDate } = filters;

  const stabilizedThis = inputData.map((el, index) => [el, index] as const);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  if (name) {
    inputData = inputData.filter((file) => file.name.toLowerCase().includes(name.toLowerCase()));
  }

  if (type.length) {
    inputData = inputData.filter((file) => type.includes(fileFormat(file.type)));
  }

  if (!dateError) {
    if (startDate && endDate) {
      inputData = inputData.filter((file) => fIsBetween(file.createdAt, startDate, endDate));
    }
  }

  return inputData;
}
