import { useTranslation } from 'react-i18next';
import { catalogApi } from '../../api/index.js';
import ProductListPage from '../../components/ProductListPage.jsx';

const CategoriesPage = () => {
  const { t } = useTranslation();
  return (
    <ProductListPage
      title={t('catalog.categories.title')}
      subtitle={t('catalog.categories.subtitle')}
      queryKey="categories"
      fetchFn={catalogApi.categories.getAll}
      createFn={catalogApi.categories.create}
      updateFn={catalogApi.categories.update}
      deleteFn={catalogApi.categories.remove}
      idField="idcategorie"
      createRoles={['ADMIN']}
      editRoles={['ADMIN']}
      columns={[
        { key: 'idcategorie', label: 'ID' },
        { key: 'nomcategorie', label: t('catalog.nom') },
      ]}
      formFields={[
        { name: 'idcategorie', label: 'ID', disabledOnEdit: true },
        { name: 'nomcategorie', label: t('catalog.nom') },
      ]}
    />
  );
};

export default CategoriesPage;
