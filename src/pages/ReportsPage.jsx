import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid2';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { BarChart } from '@mui/x-charts/BarChart';
import { reportsApi } from '../api/index.js';
import PageHeader from '../components/PageHeader.jsx';
import StatCard from '../components/StatCard.jsx';
import StatusChip from '../components/StatusChip.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import { formatCurrency } from '../utils/format.js';

const ReportsPage = () => {
  const { t, i18n } = useTranslation();
  const year = new Date().getFullYear();
  const [from, setFrom] = useState(`${year}-01-01`);
  const [to, setTo] = useState(new Date().toISOString().split('T')[0]);

  const { data, isLoading } = useQuery({
    queryKey: ['reports', from, to],
    queryFn: () => reportsApi.getSummary({ from, to }),
  });

  const report = data?.data;

  const chartData = useMemo(() => ({
    months: report?.devisByMonth?.map((m) => m.month) || [],
    counts: report?.devisByMonth?.map((m) => parseInt(m.count, 10)) || [],
  }), [report]);

  if (isLoading) return <LoadingSpinner fullPage />;

  return (
    <Box>
      <PageHeader title={t('reports.title')} subtitle={t('reports.subtitle')} />

      <Box mb={3} display="flex" gap={2} flexWrap="wrap">
        <TextField type="date" label={t('common.from')} value={from} onChange={(e) => setFrom(e.target.value)} InputLabelProps={{ shrink: true }} size="small" />
        <TextField type="date" label={t('common.to')} value={to} onChange={(e) => setTo(e.target.value)} InputLabelProps={{ shrink: true }} size="small" />
      </Box>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard title={t('reports.totalRevenue')} value={formatCurrency(report?.totalRevenue, i18n.language)} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard title={t('reports.acceptedDevis')} value={report?.acceptedCount} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard title={t('reports.conversionRate')} value={`${report?.conversionRate ?? 0}%`} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard title={t('reports.newPatients')} value={report?.newPatients} />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>{t('reports.devisByStatus')}</Typography>
              {(report?.devisByStatut || []).map((item) => (
                <Box key={item.statut} display="flex" justifyContent="space-between" alignItems="center" py={1}>
                  <StatusChip status={item.statut} />
                  <Typography fontWeight={600}>{item.count}</Typography>
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>{t('reports.devisByMonth')}</Typography>
              {chartData.months.length > 0 ? (
                <BarChart
                  xAxis={[{ scaleType: 'band', data: chartData.months }]}
                  series={[{ data: chartData.counts, color: '#0D47A1' }]}
                  height={280}
                />
              ) : (
                <Typography color="text.secondary">{t('common.noData')}</Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ReportsPage;
