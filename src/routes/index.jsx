import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout.jsx';
import ProtectedRoute from './ProtectedRoute.jsx';
import LoginPage from '../pages/auth/LoginPage.jsx';
import DashboardPage from '../pages/DashboardPage.jsx';
import PatientsPage from '../pages/patients/PatientsPage.jsx';
import PatientFormPage from '../pages/patients/PatientFormPage.jsx';
import PatientDetailPage from '../pages/patients/PatientDetailPage.jsx';
import OrdonnancesPage from '../pages/ordonnances/OrdonnancesPage.jsx';
import OrdonnanceFormPage from '../pages/ordonnances/OrdonnanceFormPage.jsx';
import AppointmentsPage from '../pages/appointments/AppointmentsPage.jsx';
import AppointmentFormPage from '../pages/appointments/AppointmentFormPage.jsx';
import MonturesPage from '../pages/products/MonturesPage.jsx';
import VerresPage from '../pages/products/VerresPage.jsx';
import LentillesPage from '../pages/products/LentillesPage.jsx';
import CategoriesPage from '../pages/catalog/CategoriesPage.jsx';
import MarquesPage from '../pages/catalog/MarquesPage.jsx';
import FournisseursPage from '../pages/catalog/FournisseursPage.jsx';
import DevisPage from '../pages/devis/DevisPage.jsx';
import DevisFormPage from '../pages/devis/DevisFormPage.jsx';
import DevisDetailPage from '../pages/devis/DevisDetailPage.jsx';
import ReportsPage from '../pages/ReportsPage.jsx';
import SettingsPage from '../pages/SettingsPage.jsx';
import ForbiddenPage from '../pages/ForbiddenPage.jsx';

const AppRoutes = () => (
  <Routes>
    <Route path="/login" element={<LoginPage />} />
    <Route path="/forbidden" element={<ForbiddenPage />} />
    <Route
      element={(
        <ProtectedRoute roles={['ADMIN', 'OPTICIEN', 'RECEPTION']}>
          <MainLayout />
        </ProtectedRoute>
      )}
    >
      <Route index element={<DashboardPage />} />
      <Route path="patients" element={<PatientsPage />} />
      <Route path="patients/new" element={<PatientFormPage />} />
      <Route path="patients/:id" element={<PatientDetailPage />} />
      <Route path="patients/:id/edit" element={<PatientFormPage />} />
      <Route path="ordonnances" element={<OrdonnancesPage />} />
      <Route path="ordonnances/new" element={<OrdonnanceFormPage />} />
      <Route path="ordonnances/:id/edit" element={<OrdonnanceFormPage />} />
      <Route path="appointments" element={<AppointmentsPage />} />
      <Route path="appointments/new" element={<AppointmentFormPage />} />
      <Route path="appointments/:id/edit" element={<AppointmentFormPage />} />
      <Route path="products/montures" element={<MonturesPage />} />
      <Route path="products/verres" element={<VerresPage />} />
      <Route path="products/lentilles" element={<LentillesPage />} />
      <Route path="categories" element={<CategoriesPage />} />
      <Route path="marques" element={<MarquesPage />} />
      <Route path="fournisseurs" element={<FournisseursPage />} />
      <Route path="devis" element={<DevisPage />} />
      <Route path="devis/new" element={<DevisFormPage />} />
      <Route path="devis/:id/edit" element={<DevisFormPage />} />
      <Route path="devis/:id" element={<DevisDetailPage />} />
      <Route path="reports" element={(
        <ProtectedRoute roles={['ADMIN', 'OPTICIEN']}>
          <ReportsPage />
        </ProtectedRoute>
      )} />
      <Route path="settings" element={<SettingsPage />} />
    </Route>
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
);

export default AppRoutes;
