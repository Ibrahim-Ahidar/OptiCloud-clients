import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { Link as RouterLink } from 'react-router-dom';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid2';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Link from '@mui/material/Link';
import PeopleIcon from '@mui/icons-material/People';
import DescriptionIcon from '@mui/icons-material/Description';
import RequestQuoteIcon from '@mui/icons-material/RequestQuote';
import InventoryIcon from '@mui/icons-material/Inventory';
import EventIcon from '@mui/icons-material/Event';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import { PieChart } from '@mui/x-charts/PieChart';
import { dashboardApi } from '../api/index.js';
import PageHeader from '../components/PageHeader.jsx';
import StatCard from '../components/StatCard.jsx';
import StatusChip from '../components/StatusChip.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import { formatCurrency, formatRelativeDate } from '../utils/format.js';

const DashboardPage = () => {
  const { t, i18n } = useTranslation();
  const locale = i18n.language;

  const { data, isLoading } = useQuery({
    queryKey: ['dashboard'],
    queryFn: () => dashboardApi.getStats(),
  });

  const stats = data?.data;

  const chartData = useMemo(() => (
    stats?.devisByStatut?.map((item, i) => ({
      id: i,
      value: parseInt(item.count, 10),
      label: t(`status.${item.statut}`, item.statut),
    })) || []
  ), [stats, t]);

  if (isLoading) return <LoadingSpinner fullPage />;

  const hasLowStock = stats?.lowStockAlerts?.montures?.length > 0
    || stats?.lowStockAlerts?.lentilles?.length > 0
    || stats?.lowStockAlerts?.verres?.length > 0;

  return (
    <Box>
      <PageHeader title={t('dashboard.title')} subtitle={t('dashboard.subtitle')} />

      <Grid container spacing={{ xs: 1.5, sm: 2, md: 3 }}>
        <Grid size={{ xs: 6, sm: 4, md: 4, lg: 2 }}>
          <StatCard title={t('dashboard.patients')} value={stats?.counts?.patients} icon={<PeopleIcon />} />
        </Grid>
        <Grid size={{ xs: 6, sm: 4, md: 4, lg: 2 }}>
          <StatCard title={t('dashboard.ordonnances')} value={stats?.counts?.ordonnances} icon={<DescriptionIcon />} color="secondary.main" />
        </Grid>
        <Grid size={{ xs: 6, sm: 4, md: 4, lg: 2 }}>
          <StatCard title={t('dashboard.devis')} value={stats?.counts?.devis} icon={<RequestQuoteIcon />} color="success.main" />
        </Grid>
        <Grid size={{ xs: 6, sm: 4, md: 4, lg: 2 }}>
          <StatCard
            title={t('dashboard.pendingDevis')}
            shortTitle={t('dashboard.pendingDevisShort')}
            value={stats?.counts?.devisEnAttente}
            icon={<PendingActionsIcon />}
            color="warning.main"
          />
        </Grid>
        <Grid size={{ xs: 6, sm: 4, md: 4, lg: 2 }}>
          <StatCard
            title={t('dashboard.stockProducts')}
            shortTitle={t('dashboard.stockProductsShort')}
            value={stats?.counts?.productsInStock}
            icon={<InventoryIcon />}
            color="info.main"
          />
        </Grid>
        <Grid size={{ xs: 6, sm: 4, md: 4, lg: 2 }}>
          <StatCard
            title={t('dashboard.todayAppointments')}
            shortTitle={t('dashboard.todayAppointmentsShort')}
            value={stats?.counts?.todayAppointments ?? 0}
            icon={<EventIcon />}
            color="secondary.main"
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>{t('dashboard.devisChart')}</Typography>
              {chartData.length > 0 ? (
                <PieChart
                  series={[{ data: chartData, innerRadius: 30, outerRadius: 100, paddingAngle: 2 }]}
                  height={260}
                  margin={{ top: 10, bottom: 10, left: 10, right: 10 }}
                />
              ) : (
                <Typography color="text.secondary">{t('common.noData')}</Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>{t('dashboard.recentDevis')}</Typography>
              <List dense disablePadding>
                {(stats?.recentDevis || []).map((d) => (
                  <ListItem
                    key={d.iddevis}
                    divider
                    component={RouterLink}
                    to={`/devis/${d.iddevis}`}
                    sx={{
                      textDecoration: 'none',
                      color: 'inherit',
                      alignItems: 'flex-start',
                      gap: 1,
                      py: 1,
                      px: { xs: 0, sm: 1 },
                    }}
                  >
                    <ListItemText
                      primary={d.numero_devis}
                      secondary={`${d.patient?.prenom} ${d.patient?.nom} — ${formatCurrency(d.montant_total, locale)}`}
                      slotProps={{
                        primary: { noWrap: true, sx: { fontWeight: 600, fontSize: '0.875rem' } },
                        secondary: { sx: { display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' } },
                      }}
                      sx={{ minWidth: 0, mr: 1 }}
                    />
                    <Box flexShrink={0} pt={0.25}>
                      <StatusChip status={d.statut} />
                    </Box>
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {stats?.upcomingAppointments?.length > 0 && (
          <Grid size={{ xs: 12, md: 6 }}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>{t('dashboard.upcomingAppointments')}</Typography>
                <List dense disablePadding>
                  {stats.upcomingAppointments.map((a) => (
                    <ListItem key={a.id} divider sx={{ alignItems: 'flex-start', gap: 1, py: 1, px: { xs: 0, sm: 1 } }}>
                      <ListItemText
                        primary={`${a.patient?.prenom} ${a.patient?.nom}`}
                        secondary={formatRelativeDate(a.date_rdv, locale)}
                        slotProps={{
                          primary: { sx: { fontWeight: 600, fontSize: '0.875rem', wordBreak: 'break-word' } },
                          secondary: { noWrap: true },
                        }}
                        sx={{ minWidth: 0, mr: 1 }}
                      />
                      <Box flexShrink={0} pt={0.25}>
                        <StatusChip status={a.statut} />
                      </Box>
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>
        )}

        {stats?.expiringPrescriptions?.length > 0 && (
          <Grid size={{ xs: 12, md: 6 }}>
            <Alert severity="info">
              <AlertTitle>{t('dashboard.expiringPrescriptions')}</AlertTitle>
              {stats.expiringPrescriptions.map((o) => (
                <Typography key={o.idordonnance} variant="body2">
                  {t('dashboard.expiringPrescriptionItem', {
                    patient: `${o.patient?.prenom} ${o.patient?.nom}`,
                    date: o.date_ordonnance,
                    doctor: o.medecin,
                  })}
                </Typography>
              ))}
            </Alert>
          </Grid>
        )}

        {hasLowStock && (
          <Grid size={12}>
            <Alert severity="warning">
              <AlertTitle>{t('dashboard.lowStockAlerts')}</AlertTitle>
              {stats.lowStockAlerts.montures?.map((m) => (
                <Typography key={m.idmonture} variant="body2">
                  <Link component={RouterLink} to="/products/montures">
                    {t('dashboard.montureStock', { ref: m.reference, model: m.modele, stock: m.stock })}
                  </Link>
                </Typography>
              ))}
              {stats.lowStockAlerts.lentilles?.map((l) => (
                <Typography key={l.idlentille} variant="body2">
                  <Link component={RouterLink} to="/products/lentilles">
                    {t('dashboard.lentilleStock', { name: l.nom, stock: l.stock })}
                  </Link>
                </Typography>
              ))}
              {stats.lowStockAlerts.verres?.map((v) => (
                <Typography key={v.idverre} variant="body2">
                  <Link component={RouterLink} to="/products/verres">
                    {t('dashboard.verreStock', { name: v.nom, stock: v.stock })}
                  </Link>
                </Typography>
              ))}
            </Alert>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default DashboardPage;
