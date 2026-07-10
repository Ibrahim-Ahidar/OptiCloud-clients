import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import Chip from '@mui/material/Chip';
import { productsApi, catalogApi } from '../../api/index.js';
import ProductListPage from '../../components/ProductListPage.jsx';

const VerresPage = () => {
  const { t } = useTranslation();
  const { data: marquesData } = useQuery({ queryKey: ['marques-list'], queryFn: () => catalogApi.marques.getAll({ limit: 100 }) });
  const marqueOptions = useMemo(() => (marquesData?.data?.items || []).map((m) => ({ value: m.idmarque, label: m.nom })), [marquesData]);

  return (
    <ProductListPage
      title={t('products.verres.title')}
      subtitle={t('products.verres.subtitle')}
      queryKey="verres"
      fetchFn={productsApi.verres.getAll}
      createFn={productsApi.verres.create}
      updateFn={productsApi.verres.update}
      deleteFn={productsApi.verres.remove}
      idField="idverre"
      supportsLowStock
      columns={[
        { key: 'idverre', label: 'ID' },
        { key: 'nom', label: t('catalog.nom') },
        { key: 'type', label: 'Type' },
        { key: 'indice', label: 'Indice' },
        { key: 'prix', label: t('products.prix') },
        { key: 'stock', label: t('products.stock'), render: (item) => (
          <Chip label={item.stock} size="small" color={item.stock <= 5 ? 'error' : 'default'} />
        )},
        { key: 'marque', label: t('products.marque'), render: (item) => item.marque?.nom },
      ]}
      formFields={[
        { name: 'idverre', label: 'ID', disabledOnEdit: true },
        { name: 'nom', label: t('catalog.nom') },
        { name: 'type', label: 'Type' },
        { name: 'indice', label: 'Indice', type: 'number' },
        { name: 'traitement', label: 'Traitement' },
        { name: 'prix', label: t('products.prix'), type: 'number' },
        { name: 'idmarque', label: t('products.marque'), entityOptions: marqueOptions },
        { name: 'stock', label: t('products.stock'), type: 'number', defaultValue: 0 },
        { name: 'description', label: t('products.description'), fullWidth: true },
      ]}
    />
  );
};

export default VerresPage;
