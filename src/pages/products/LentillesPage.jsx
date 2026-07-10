import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import Chip from '@mui/material/Chip';
import { productsApi, catalogApi } from '../../api/index.js';
import ProductListPage from '../../components/ProductListPage.jsx';

const LentillesPage = () => {
  const { t } = useTranslation();
  const { data: marquesData } = useQuery({ queryKey: ['marques-list'], queryFn: () => catalogApi.marques.getAll({ limit: 100 }) });
  const { data: fournisseursData } = useQuery({ queryKey: ['fournisseurs-list'], queryFn: () => catalogApi.fournisseurs.getAll({ limit: 100 }) });
  const marqueOptions = useMemo(() => (marquesData?.data?.items || []).map((m) => ({ value: m.idmarque, label: m.nom })), [marquesData]);
  const fournisseurOptions = useMemo(() => (fournisseursData?.data?.items || []).map((f) => ({ value: f.idfournisseur, label: f.nom })), [fournisseursData]);

  return (
    <ProductListPage
      title={t('products.lentilles.title')}
      subtitle={t('products.lentilles.subtitle')}
      queryKey="lentilles"
      fetchFn={productsApi.lentilles.getAll}
      createFn={productsApi.lentilles.create}
      updateFn={productsApi.lentilles.update}
      deleteFn={productsApi.lentilles.remove}
      idField="idlentille"
      supportsLowStock
      columns={[
        { key: 'idlentille', label: 'ID' },
        { key: 'nom', label: t('catalog.nom') },
        { key: 'type', label: 'Type' },
        { key: 'prix', label: t('products.prix') },
        { key: 'stock', label: t('products.stock'), render: (item) => (
          <Chip label={item.stock} size="small" color={item.stock <= 5 ? 'error' : 'default'} />
        )},
        { key: 'marqueInfo', label: t('products.marque'), render: (item) => item.marqueInfo?.nom },
      ]}
      formFields={[
        { name: 'idlentille', label: 'ID', disabledOnEdit: true },
        { name: 'nom', label: t('catalog.nom') },
        { name: 'marque', label: t('products.marque'), entityOptions: marqueOptions },
        { name: 'type', label: 'Type' },
        { name: 'prix', label: t('products.prix'), type: 'number' },
        { name: 'stock', label: t('products.stock'), type: 'number', defaultValue: 0 },
        { name: 'idfournisseur', label: t('products.fournisseur'), entityOptions: fournisseurOptions },
        { name: 'description', label: t('products.description'), fullWidth: true },
      ]}
    />
  );
};

export default LentillesPage;
