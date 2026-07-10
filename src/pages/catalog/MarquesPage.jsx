import { useTranslation } from 'react-i18next';
import { catalogApi } from '../../api/index.js';
import ProductListPage from '../../components/ProductListPage.jsx';

const MarquesPage = () => {
  const { t } = useTranslation();
  return (
    <ProductListPage
      title={t('catalog.marques.title')}
      subtitle={t('catalog.marques.subtitle')}
      queryKey="marques"
      fetchFn={catalogApi.marques.getAll}
      createFn={catalogApi.marques.create}
      updateFn={catalogApi.marques.update}
      deleteFn={catalogApi.marques.remove}
      idField="idmarque"
      createRoles={['ADMIN']}
      editRoles={['ADMIN']}
      columns={[
        { key: 'idmarque', label: 'ID' },
        { key: 'nom', label: t('catalog.nom') },
        { key: 'pays', label: t('catalog.pays') },
      ]}
      formFields={[
        { name: 'idmarque', label: 'ID', disabledOnEdit: true },
        { name: 'nom', label: t('catalog.nom') },
        { name: 'pays', label: t('catalog.pays') },
      ]}
    />
  );
};

export default MarquesPage;
