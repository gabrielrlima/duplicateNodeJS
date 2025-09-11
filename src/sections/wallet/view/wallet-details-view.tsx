import type { TableHeadCellProps } from 'src/components/table';

import { useState, useCallback } from 'react';
import { useBoolean } from 'minimal-shared/hooks';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { fCurrency } from 'src/utils/format-number';

import { DashboardContent } from 'src/layouts/dashboard';

import { Label } from 'src/components/label';
import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import {
  useTable,
  emptyRows,
  rowInPage,
  TableNoData,
  getComparator,
  TableEmptyRows,
  TableHeadCustom,
  TableSelectedAction,
} from 'src/components/table';

// ----------------------------------------------------------------------

interface IWalletKey {
  id: string;
  type: 'CPF/CNPJ' | 'Email' | 'Chave aleatória' | 'Celular';
  key: string;
  status: 'Ativa' | 'Inativa';
  icon: string;
}

const MOCK_KEYS: IWalletKey[] = [
  {
    id: '1',
    type: 'CPF/CNPJ',
    key: '00.000.000/0000-00',
    status: 'Ativa',
    icon: 'solar:user-bold',
  },
  {
    id: '2',
    type: 'Email',
    key: 'julia@gmail.com',
    status: 'Ativa',
    icon: 'solar:letter-bold',
  },
  {
    id: '3',
    type: 'Chave aleatória',
    key: 'bfb38234-a852-4c42...',
    status: 'Ativa',
    icon: 'solar:key-bold',
  },
  {
    id: '4',
    type: 'Celular',
    key: '(11) 9 0000-0000',
    status: 'Ativa',
    icon: 'solar:phone-bold',
  },
];

const TABLE_HEAD: TableHeadCellProps[] = [
  { id: 'type', label: 'Tipo de chave', width: 200 },
  { id: 'key', label: 'Chave' },
  { id: 'status', label: 'Status', width: 110 },
  { id: '', width: 88 },
];

const WALLET_ACTIONS = [
  {
    icon: 'solar:transfer-horizontal-bold',
    label: 'Transferir',
    action: 'transfer',
  },
  {
    icon: 'solar:copy-bold',
    label: 'Copia e cola',
    action: 'copy',
  },
  {
    icon: 'solar:download-bold',
    label: 'Extrato',
    action: 'extract',
  },
  {
    icon: 'solar:card-bold',
    label: 'Limites',
    action: 'limits',
  },
  {
    icon: 'solar:lock-password-bold',
    label: 'PIN',
    action: 'pin',
  },
];

// ----------------------------------------------------------------------

export function WalletDetailsView() {
  const router = useRouter();
  const table = useTable({ defaultOrderBy: 'type' });

  const confirmDialog = useBoolean();

  const [tableData, setTableData] = useState<IWalletKey[]>(MOCK_KEYS);
  const [showBalance, setShowBalance] = useState(true);

  const balance = 36963899.0;

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(table.order, table.orderBy),
  });

  const dataInPage = rowInPage(dataFiltered, table.page, table.rowsPerPage);

  const notFound = !dataFiltered.length;

  const handleDeleteRow = useCallback(
    (id: string) => {
      const deleteRow = tableData.filter((row) => row.id !== id);

      toast.success('Chave Pix deletada com sucesso!');

      setTableData(deleteRow);

      table.onUpdatePageDeleteRow(dataInPage.length);
    },
    [dataInPage.length, table, tableData]
  );

  const handleDeleteRows = useCallback(() => {
    const deleteRows = tableData.filter((row) => !table.selected.includes(row.id));

    toast.success('Chaves Pix deletadas com sucesso!');

    setTableData(deleteRows);

    table.onUpdatePageDeleteRows(dataInPage.length, dataFiltered.length);
  }, [dataFiltered.length, dataInPage.length, table, tableData]);

  const toggleShowBalance = () => {
    setShowBalance(!showBalance);
  };

  const handleWalletAction = (action: string) => {
    switch (action) {
      case 'transfer':
        router.push(paths.dashboard.wallet.transfer);
        break;
      case 'copy':
        router.push(paths.dashboard.wallet.transferCopyPaste);
        break;
      case 'extract':
        toast.info('Função extrato em desenvolvimento');
        break;
      case 'limits':
        toast.info('Função limites em desenvolvimento');
        break;
      case 'pin':
        toast.info('Função PIN em desenvolvimento');
        break;
      default:
        break;
    }
  };

  const renderConfirmDialog = () => (
    <ConfirmDialog
      open={confirmDialog.value}
      onClose={confirmDialog.onFalse}
      title="Deletar"
      content={
        <>
          Tem certeza que deseja deletar <strong> {table.selected.length} </strong> chaves?
        </>
      }
      action={
        <Button
          variant="contained"
          color="error"
          onClick={() => {
            handleDeleteRows();
            confirmDialog.onFalse();
          }}
        >
          Deletar
        </Button>
      }
    />
  );

  const renderBalanceCard = () => (
    <Stack spacing={3} sx={{ mb: 3, p: 3 }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Typography variant="h6" color="text.primary">
          Saldo disponível
        </Typography>
        <Button
          size="small"
          variant="text"
          startIcon={<Iconify icon={showBalance ? 'solar:eye-closed-bold' : 'solar:eye-bold'} />}
          onClick={toggleShowBalance}
          sx={{ color: 'success.main' }}
        >
          {showBalance ? 'Ocultar valores' : 'Mostrar valores'}
        </Button>
      </Stack>

      <Typography variant="h3" color="text.primary">
        {showBalance ? fCurrency(balance) : '•••••••••'}
      </Typography>
    </Stack>
  );

  const renderPixActions = () => (
    <Card sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" sx={{ mb: 4 }}>
        Área Pix
      </Typography>

      <Stack direction="row" spacing={2} sx={{ overflowX: 'auto' }}>
        {WALLET_ACTIONS.map((action) => (
          <Stack
            key={action.label}
            onClick={() => handleWalletAction(action.action)}
            sx={{
              position: 'relative',
              minWidth: 100,
              height: 100,
              borderRadius: 1,
              border: '1px solid',
              borderColor: 'divider',
              cursor: 'pointer',
              bgcolor: 'background.paper',
              '&:hover': {
                bgcolor: 'action.hover',
              },
            }}
          >
            <Box
              sx={{
                position: 'absolute',
                top: 8,
                left: 8,
                width: 24,
                height: 24,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Iconify icon={action.icon} width={25} sx={{ color: 'text.secondary' }} />
            </Box>

            <Typography
              variant="button"
              sx={{
                position: 'absolute',
                bottom: 8,
                right: 8,
                lineHeight: 1.2,
                fontWeight: 500,
                color: 'text.primary',
                textAlign: 'right',
              }}
            >
              {action.label}
            </Typography>
          </Stack>
        ))}
      </Stack>
    </Card>
  );

  const renderKeysTable = () => (
    <Card>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ p: 3, pb: 2 }}
      >
        <Typography variant="h6" color="text.primary">
          Minhas Chaves
        </Typography>
        <Button
          variant="text"
          size="small"
          color="primary"
          startIcon={<Iconify icon="eva:plus-fill" />}
        >
          Criar chave Pix
        </Button>
      </Stack>

      <Box sx={{ position: 'relative' }}>
        <TableSelectedAction
          dense={table.dense}
          numSelected={table.selected.length}
          rowCount={dataFiltered.length}
          onSelectAllRows={(checked) =>
            table.onSelectAllRows(
              checked,
              dataFiltered.map((row) => row.id)
            )
          }
          action={
            <Tooltip title="Deletar">
              <IconButton color="error" onClick={confirmDialog.onTrue}>
                <Iconify icon="solar:trash-bin-trash-bold" />
              </IconButton>
            </Tooltip>
          }
        />

        <Scrollbar sx={{ minHeight: 300 }}>
          <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 650 }}>
            <TableHeadCustom
              order={table.order}
              orderBy={table.orderBy}
              headCells={TABLE_HEAD}
              rowCount={dataFiltered.length}
              numSelected={table.selected.length}
              onSort={table.onSort}
              onSelectAllRows={(checked) =>
                table.onSelectAllRows(
                  checked,
                  dataFiltered.map((row) => row.id)
                )
              }
            />

            <TableBody>
              {dataFiltered
                .slice(
                  table.page * table.rowsPerPage,
                  table.page * table.rowsPerPage + table.rowsPerPage
                )
                .map((row) => (
                  <TableRow
                    key={row.id}
                    hover
                    selected={table.selected.includes(row.id)}
                    sx={{ '&:hover': { bgcolor: 'action.hover' } }}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={table.selected.includes(row.id)}
                        onChange={() => table.onSelectRow(row.id)}
                        size="small"
                      />
                    </TableCell>

                    <TableCell>
                      <Stack direction="row" alignItems="center" spacing={2}>
                        <Box
                          sx={{
                            width: 36,
                            height: 36,
                            borderRadius: 1,
                            bgcolor: 'grey.100',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'grey.700',
                          }}
                        >
                          <Iconify icon={row.icon} width={18} />
                        </Box>
                        <Typography variant="body2" color="text.primary" fontWeight={500}>
                          {row.type}
                        </Typography>
                      </Stack>
                    </TableCell>

                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {row.key}
                      </Typography>
                    </TableCell>

                    <TableCell>
                      <Label
                        variant="soft"
                        color={row.status === 'Ativa' ? 'success' : 'default'}
                        sx={{
                          textTransform: 'capitalize',
                          fontWeight: 600,
                          fontSize: '0.75rem',
                        }}
                      >
                        {row.status}
                      </Label>
                    </TableCell>

                    <TableCell align="right">
                      <IconButton
                        onClick={() => handleDeleteRow(row.id)}
                        size="small"
                        sx={{ color: 'text.secondary' }}
                      >
                        <Iconify icon="eva:more-vertical-fill" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}

              <TableEmptyRows
                height={table.dense ? 52 : 72}
                emptyRows={emptyRows(table.page, table.rowsPerPage, dataFiltered.length)}
              />

              <TableNoData notFound={notFound} />
            </TableBody>
          </Table>
        </Scrollbar>
      </Box>

      {/* <TablePaginationCustom
        page={table.page}
        dense={table.dense}
        count={dataFiltered.length}
        rowsPerPage={table.rowsPerPage}
        onPageChange={table.onChangePage}
        onChangeDense={table.onChangeDense}
        onRowsPerPageChange={table.onChangeRowsPerPage}
      /> */}
    </Card>
  );

  return (
    <>
      <DashboardContent>
        <CustomBreadcrumbs
          heading="Carteira da imobiliária"
          links={[
            { name: 'Painel', href: paths.dashboard.root },
            { name: 'Carteira da imobiliária' },
          ]}
          sx={{ mb: { xs: 3, md: 5 } }}
        />
        {renderBalanceCard()}
        {renderPixActions()}
        {renderKeysTable()}
      </DashboardContent>

      {renderConfirmDialog()}
    </>
  );
}

// ----------------------------------------------------------------------

type ApplyFilterProps = {
  inputData: IWalletKey[];
  comparator: (a: any, b: any) => number;
};

function applyFilter({ inputData, comparator }: ApplyFilterProps) {
  const stabilizedThis = inputData.map((el, index) => [el, index] as const);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  return stabilizedThis.map((el) => el[0]);
}
