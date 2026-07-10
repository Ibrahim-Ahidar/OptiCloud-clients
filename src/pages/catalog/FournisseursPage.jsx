import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Drawer from '@mui/material/Drawer';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import IconButton from '@mui/material/IconButton';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { catalogApi } from '../../api/index.js';
import ProductListPage from '../../components/ProductListPage.jsx';

const FournisseursPage = () => {
  const { t } = useTranslation();
  const [productsDrawer, setProductsDrawer] = useState(null);

  const { data: productsData, isLoading } = useQuery({
    queryKey: ['fournisseur-products', productsDrawer],
    queryFn: () => catalogApi.fournisseurs.getProducts(productsDrawer),
    enabled: !!productsDrawer,
  });

  const products = productsData?.data;

  return (
    <>
      <ProductListPage
        title={t('catalog.fournisseurs.title')}
        subtitle={t('catalog.fournisseurs.subtitle')}
        queryKey="fournisseurs"
        fetchFn={catalogApi.fournisseurs.getAll}
        createFn={catalogApi.fournisseurs.create}
        updateFn={catalogApi.fournisseurs.update}
        deleteFn={catalogApi.fournisseurs.remove}
        idField="idfournisseur"
        columns={[
          { key: 'nom', label: t('catalog.nom') },
          { key: 'responsable', label: t('catalog.responsable') },
          { key: 'ville', label: t('patients.ville') },
          { key: 'telephone', label: t('patients.telephone') },
          { key: 'email', label: t('settings.email') },
          {
            key: 'actions',
            label: t('catalog.products'),
            render: (item) => (
              <Button size="small" startIcon={<VisibilityIcon />} onClick={(e) => { e.stopPropagation(); setProductsDrawer(item.idfournisseur); }}>
                {t('catalog.viewProducts')}
              </Button>
            ),
          },
        ]}
        formFields={[
          { name: 'nom', label: t('catalog.nom') },
          { name: 'responsable', label: t('catalog.responsable') },
          { name: 'adresse', label: t('catalog.adresse'), fullWidth: true },
          { name: 'ville', label: t('patients.ville') },
          { name: 'telephone', label: t('patients.telephone') },
          { name: 'email', label: t('settings.email') },
        ]}
      />

      <Drawer anchor="right" open={!!productsDrawer} onClose={() => setProductsDrawer(null)}>
        <Box sx={{ width: 360, p: 3 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6">{t('catalog.products')}</Typography>
            <IconButton onClick={() => setProductsDrawer(null)}>×</IconButton>
          </Box>
          {isLoading ? (
            <Typography>{t('common.loading')}</Typography>
          ) : (
            <>
              <Typography variant="subtitle2" gutterBottom>{t('nav.montures')}</Typography>
              <List dense>
                {(products?.montures || []).map((m) => (
                  <ListItem key={m.idmonture}>
                    <ListItemText primary={m.modele} secondary={`${m.reference} — ${t('products.stock')}: ${m.stock}`} />
                  </ListItem>
                ))}
              </List>
              <Typography variant="subtitle2" gutterBottom mt={2}>{t('nav.lentilles')}</Typography>
              <List dense>
                {(products?.lentilles || []).map((l) => (
                  <ListItem key={l.idlentille}>
                    <ListItemText primary={l.nom} secondary={`${t('products.stock')}: ${l.stock}`} />
                  </ListItem>
                ))}
              </List>
              {!products?.montures?.length && !products?.lentilles?.length && (
                <Typography color="text.secondary">{t('common.noData')}</Typography>
              )}
            </>
          )}
        </Box>
      </Drawer>
    </>
  );
};

export default FournisseursPage;
