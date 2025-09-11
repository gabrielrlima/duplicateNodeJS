import type { Theme, SxProps } from '@mui/material/styles';
import type { TablePaginationProps } from '@mui/material/TablePagination';

import Box from '@mui/material/Box';
import TablePagination from '@mui/material/TablePagination';
// ----------------------------------------------------------------------
export type TablePaginationCustomProps = TablePaginationProps & {
  dense?: boolean;
  sx?: SxProps<Theme>;
  onChangeDense?: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

export function TablePaginationCustom({
  sx,
  dense,
  onChangeDense,
  rowsPerPageOptions = [5, 10, 25],
  ...other
}: TablePaginationCustomProps) {
  return (
    <Box sx={[{ position: 'relative' }, ...(Array.isArray(sx) ? sx : [sx])]}>
      <TablePagination
        rowsPerPageOptions={rowsPerPageOptions}
        component="div"
        {...other}
        labelRowsPerPage="Itens por página:"
        labelDisplayedRows={({ from, to, count }) =>
          `${from}-${to} de ${count !== -1 ? count : `mais de ${to}`}`
        }
        getItemAriaLabel={(type) =>
          type === 'first'
            ? 'Ir para a primeira página'
            : type === 'last'
              ? 'Ir para a última página'
              : type === 'next'
                ? 'Ir para a próxima página'
                : 'Ir para a página anterior'
        }
        sx={{ borderTopColor: 'transparent' }}
      />
      {/* {onChangeDense && (
        <FormControlLabel
          label="Dense"
          control={
            <Switch checked={dense} onChange={onChangeDense} inputProps={{ id: 'dense-switch' }} />
          }
          sx={{
            pl: 2,
            py: 1.5,
            top: 0,
            position: { sm: 'absolute' },
          }}
        />
      )} */}
    </Box>
  );
}
