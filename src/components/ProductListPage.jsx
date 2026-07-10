import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import TablePagination from '@mui/material/TablePagination';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid2';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PageHeader from './PageHeader.jsx';
import SearchBar from './SearchBar.jsx';
import LoadingSpinner from './LoadingSpinner.jsx';
import ConfirmDialog from './ConfirmDialog.jsx';
import EntitySelect from './EntitySelect.jsx';
import { useDebounce } from '../hooks/useDebounce.js';
import { useAuth } from '../context/AuthContext.jsx';

const ProductListPage = ({
  title, subtitle, queryKey, fetchFn, createFn, updateFn, deleteFn,
  columns, formFields,   idField, canCreate = true, canEdit = true, createRoles = ['ADMIN', 'OPTICIEN'], editRoles = ['ADMIN', 'OPTICIEN'],
  supportsLowStock = false,
}) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const { hasRole } = useAuth();
  const [search, setSearch] = useState('');
  const [lowStock, setLowStock] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [deleteId, setDeleteId] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [formData, setFormData] = useState({});
  const debouncedSearch = useDebounce(search);

  const { data, isLoading } = useQuery({
    queryKey: [queryKey, page, rowsPerPage, debouncedSearch, lowStock],
    queryFn: () => fetchFn({
      page: page + 1,
      limit: rowsPerPage,
      search: debouncedSearch,
      ...(lowStock ? { lowStock: true } : {}),
    }),
  });

  const saveMutation = useMutation({
    mutationFn: (payload) => (editItem ? updateFn(editItem[idField], payload) : createFn(payload)),
    onSuccess: () => {
      toast.success(editItem ? t('common.updated') : t('common.created'));
      queryClient.invalidateQueries({ queryKey: [queryKey] });
      setDialogOpen(false);
      setEditItem(null);
    },
    onError: (err) => toast.error(err.response?.data?.message || t('common.error')),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteFn,
    onSuccess: () => {
      toast.success(t('common.deleted'));
      queryClient.invalidateQueries({ queryKey: [queryKey] });
      setDeleteId(null);
    },
    onError: (err) => toast.error(err.response?.data?.message || t('common.error')),
  });

  const openCreate = () => {
    setEditItem(null);
    setFormData(formFields.reduce((acc, f) => ({ ...acc, [f.name]: f.defaultValue || '' }), {}));
    setDialogOpen(true);
  };

  const openEdit = (item) => {
    setEditItem(item);
    setFormData(formFields.reduce((acc, f) => ({ ...acc, [f.name]: item[f.name] ?? '' }), {}));
    setDialogOpen(true);
  };

  const items = data?.data?.items || [];
  const total = data?.data?.pagination?.total || 0;
  const showCreate = canCreate && hasRole(...createRoles);

  return (
    <Box>
      <PageHeader
        title={title} subtitle={subtitle}
        action={showCreate && (
          <Button variant="contained" startIcon={<AddIcon />} onClick={openCreate}>{t('common.add')}</Button>
        )}
      />
      <Box mb={2} display="flex" gap={2} alignItems="center" flexWrap="wrap">
        <Box flex={1} minWidth={200}><SearchBar value={search} onChange={setSearch} placeholder={t('common.search')} /></Box>
        {supportsLowStock && (
          <FormControlLabel
            control={<Switch checked={lowStock} onChange={(e) => setLowStock(e.target.checked)} />}
            label={t('common.lowStockOnly')}
          />
        )}
      </Box>

      {isLoading ? <LoadingSpinner /> : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                {columns.map((col) => <TableCell key={col.key}>{col.label}</TableCell>)}
                <TableCell align="right">{t('common.actions')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((item) => (
                <TableRow key={item[idField]} hover>
                  {columns.map((col) => (
                    <TableCell key={col.key}>
                      {col.render ? col.render(item) : item[col.key]}
                    </TableCell>
                  ))}
                  <TableCell align="right">
                    {canEdit && hasRole(...editRoles) && <IconButton size="small" onClick={() => openEdit(item)}><EditIcon /></IconButton>}
                    {hasRole('ADMIN') && <IconButton size="small" color="error" onClick={() => setDeleteId(item[idField])}><DeleteIcon /></IconButton>}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <TablePagination component="div" count={total} page={page} onPageChange={(_, p) => setPage(p)} rowsPerPage={rowsPerPage} onRowsPerPageChange={(e) => { setRowsPerPage(+e.target.value); setPage(0); }} />
        </TableContainer>
      )}

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editItem ? t('common.edit') : t('common.add')}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 0.5 }}>
            {formFields.map((field) => (
              <Grid key={field.name} size={{ xs: 12, sm: field.fullWidth ? 12 : 6 }}>
                {field.entityOptions ? (
                  <EntitySelect
                    label={field.label}
                    options={field.entityOptions}
                    value={formData[field.name] ?? ''}
                    onChange={(val) => setFormData({ ...formData, [field.name]: val })}
                    getOptionLabel={(opt) => opt.label}
                    getOptionValue={(opt) => opt.value}
                    disabled={editItem && field.disabledOnEdit}
                  />
                ) : field.select ? (
                  <TextField
                    fullWidth select label={field.label}
                    disabled={editItem && field.disabledOnEdit}
                    value={formData[field.name] ?? ''}
                    onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })}
                    SelectProps={{ native: true }}
                  >
                    {field.options?.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                  </TextField>
                ) : (
                  <TextField
                    fullWidth label={field.label} type={field.type || 'text'}
                    disabled={editItem && field.disabledOnEdit}
                    value={formData[field.name] ?? ''}
                    onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })}
                    inputProps={field.name === 'stock' ? { style: { color: Number(formData.stock) <= 5 ? '#d32f2f' : undefined } } : undefined}
                  />
                )}
              </Grid>
            ))}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>{t('common.cancel')}</Button>
          <Button variant="contained" onClick={() => saveMutation.mutate(formData)} disabled={saveMutation.isPending}>{t('common.save')}</Button>
        </DialogActions>
      </Dialog>

      <ConfirmDialog open={!!deleteId} title={t('common.delete')} message={t('common.confirmDelete')} onConfirm={() => deleteMutation.mutate(deleteId)} onCancel={() => setDeleteId(null)} loading={deleteMutation.isPending} />
    </Box>
  );
};

export default ProductListPage;
