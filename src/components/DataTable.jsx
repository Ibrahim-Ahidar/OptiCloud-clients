import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import TablePagination from '@mui/material/TablePagination';
import EmptyState from './EmptyState.jsx';
import LoadingSpinner from './LoadingSpinner.jsx';

const DataTable = memo(({
  columns,
  rows,
  rowKey,
  total = 0,
  page,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
  isLoading,
  emptyTitle,
  renderActions,
  onRowClick,
}) => {
  const { t } = useTranslation();

  if (isLoading) return <LoadingSpinner />;

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            {columns.map((col) => (
              <TableCell key={col.key} align={col.align}>{col.label}</TableCell>
            ))}
            {renderActions && <TableCell align="right">{t('common.actions')}</TableCell>}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.length === 0 ? (
            <TableRow>
              <TableCell colSpan={columns.length + (renderActions ? 1 : 0)}>
                <EmptyState title={emptyTitle} />
              </TableCell>
            </TableRow>
          ) : (
            rows.map((row) => (
              <TableRow
                key={row[rowKey]}
                hover
                onClick={onRowClick ? () => onRowClick(row) : undefined}
                sx={onRowClick ? { cursor: 'pointer' } : undefined}
              >
                {columns.map((col) => (
                  <TableCell key={col.key} align={col.align}>
                    {col.render ? col.render(row) : row[col.key]}
                  </TableCell>
                ))}
                {renderActions && (
                  <TableCell align="right">{renderActions(row)}</TableCell>
                )}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
      <TablePagination
        component="div"
        count={total}
        page={page}
        onPageChange={onPageChange}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={onRowsPerPageChange}
        labelRowsPerPage={t('common.actions')}
      />
    </TableContainer>
  );
});

DataTable.displayName = 'DataTable';
export default DataTable;
