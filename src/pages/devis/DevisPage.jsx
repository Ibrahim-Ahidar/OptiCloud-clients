import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import AddIcon from '@mui/icons-material/Add';
import { devisApi } from '../../api/index.js';
import PageHeader from '../../components/PageHeader.jsx';
import SearchBar from '../../components/SearchBar.jsx';
import DataTable from '../../components/DataTable.jsx';
import StatusChip from '../../components/StatusChip.jsx';
import { useDebounce } from '../../hooks/useDebounce.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { formatCurrency } from '../../utils/format.js';

const DevisPage = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { hasRole } = useAuth();
  const [search, setSearch] = useState('');
  const [statut, setStatut] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const debouncedSearch = useDebounce(search);

  const { data, isLoading } = useQuery({
    queryKey: ['devis', page, rowsPerPage, debouncedSearch, statut],
    queryFn: () => devisApi.getAll({ page: page + 1, limit: rowsPerPage, search: debouncedSearch, statut: statut || undefined }),
  });

  const items = data?.data?.items || [];
  const total = data?.data?.pagination?.total || 0;

  const columns = [
    { key: 'numero_devis', label: t('devis.numero') },
    { key: 'patient', label: t('devis.patient'), render: (d) => (d.patient ? `${d.patient.prenom} ${d.patient.nom}` : '—') },
    { key: 'date_devis', label: t('devis.dateDevis') },
    { key: 'montant_total', label: t('devis.montantTotal'), render: (d) => formatCurrency(d.montant_total, i18n.language) },
    { key: 'reste_a_charge', label: t('devis.resteACharge'), render: (d) => formatCurrency(d.reste_a_charge, i18n.language) },
    { key: 'statut', label: t('devis.filterStatus'), render: (d) => <StatusChip status={d.statut} /> },
  ];

  return (
    <Box>
      <PageHeader
        title={t('devis.title')}
        subtitle={t('devis.subtitle')}
        action={hasRole('ADMIN', 'OPTICIEN') && (
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => navigate('/devis/new')}>{t('devis.new')}</Button>
        )}
      />

      <Box mb={2} display="flex" gap={2} flexWrap="wrap">
        <SearchBar value={search} onChange={setSearch} placeholder={t('common.search')} />
        <TextField select size="small" label={t('devis.filterStatus')} value={statut} onChange={(e) => setStatut(e.target.value)} sx={{ minWidth: 160 }}>
          <MenuItem value="">{t('common.all')}</MenuItem>
          {['en_attente', 'accepte', 'refuse', 'expire'].map((s) => (
            <MenuItem key={s} value={s}>{t(`status.${s}`)}</MenuItem>
          ))}
        </TextField>
      </Box>

      <DataTable
        columns={columns}
        rows={items}
        rowKey="iddevis"
        total={total}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={(_, p) => setPage(p)}
        onRowsPerPageChange={(e) => { setRowsPerPage(+e.target.value); setPage(0); }}
        isLoading={isLoading}
        onRowClick={(d) => navigate(`/devis/${d.iddevis}`)}
      />
    </Box>
  );
};

export default DevisPage;
