import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import Chip from '@mui/material/Chip';
import { productsApi, catalogApi } from '../../api/index.js';
import ProductListPage from '../../components/ProductListPage.jsx';

const MonturesPage = () => {
  const { t } = useTranslation();

  const { data: marquesData } = useQuery({ queryKey: ['marques-list'], queryFn: () => catalogApi.marques.getAll({ limit: 100 }) });
  const { data: categoriesData } = useQuery({ queryKey: ['categories-list'], queryFn: () => catalogApi.categories.getAll({ limit: 100 }) });
  const { data: fournisseursData } = useQuery({ queryKey: ['fournisseurs-list'], queryFn: () => catalogApi.fournisseurs.getAll({ limit: 100 }) });

  const marqueOptions = useMemo(() => (marquesData?.data?.items || []).map((m) => ({ value: m.idmarque, label: m.nom })), [marquesData]);
  const categorieOptions = useMemo(() => (categoriesData?.data?.items || []).map((c) => ({ value: c.idcategorie, label: c.nomcategorie })), [categoriesData]);
  const fournisseurOptions = useMemo(() => (fournisseursData?.data?.items || []).map((f) => ({ value: f.idfournisseur, label: f.nom })), [fournisseursData]);

  return (
    <ProductListPage
      title={t('products.montures.title')}
      subtitle={t('products.montures.subtitle')}
      queryKey="montures"
      fetchFn={productsApi.montures.getAll}
      createFn={productsApi.montures.create}
      updateFn={productsApi.montures.update}
      deleteFn={productsApi.montures.remove}
      idField="idmonture"
      supportsLowStock
      columns={[
        { key: 'reference', label: t('products.reference') },
        { key: 'modele', label: t('products.modele') },
        { key: 'couleur', label: t('products.couleur') },
        { key: 'genre', label: t('products.genre') },
        { key: 'prix', label: t('products.prix') },
        { key: 'stock', label: t('products.stock'), render: (item) => (
          <Chip label={item.stock} size="small" color={item.stock <= 5 ? 'error' : 'default'} />
        )},
        { key: 'marque', label: t('products.marque'), render: (item) => item.marque?.nom },
      ]}
      formFields={[
        { name: 'reference', label: t('products.reference') },
        { name: 'modele', label: t('products.modele') },
        { name: 'couleur', label: t('products.couleur') },
        { name: 'materiau', label: t('products.materiau') },
        { name: 'genre', label: t('products.genre'), select: true, options: [
          { value: 'homme', label: t('products.genreHomme') },
          { value: 'femme', label: t('products.genreFemme') },
          { value: 'enfant', label: t('products.genreEnfant') },
          { value: 'mixte', label: t('products.genreMixte') },
        ]},
        { name: 'prix', label: t('products.prix'), type: 'number' },
        { name: 'stock', label: t('products.stock'), type: 'number', defaultValue: 0 },
        { name: 'idmarque', label: t('products.marque'), entityOptions: marqueOptions },
        { name: 'idcategorie', label: t('products.categorie'), entityOptions: categorieOptions },
        { name: 'idfournisseur', label: t('products.fournisseur'), entityOptions: fournisseurOptions },
        { name: 'description', label: t('products.description'), fullWidth: true },
      ]}
    />
  );
};

export default MonturesPage;
