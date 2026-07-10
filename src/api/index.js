import api from './axios.js';

const get = (url, params) => api.get(url, { params }).then((r) => r.data);
const post = (url, data) => api.post(url, data).then((r) => r.data);
const put = (url, data) => api.put(url, data).then((r) => r.data);
const del = (url) => api.delete(url).then((r) => r.data);

export const authApi = {
  login: (data) => post('/auth/login', data),
  logout: () => post('/auth/logout'),
  profile: () => get('/auth/profile'),
};

export const dashboardApi = {
  getStats: () => get('/dashboard/stats'),
};

export const patientsApi = {
  getAll: (params) => get('/patients', params),
  getById: (id) => get(`/patients/${id}`),
  getHistory: (id) => get(`/patients/${id}/history`),
  create: (data) => post('/patients', data),
  update: (id, data) => put(`/patients/${id}`, data),
  remove: (id) => del(`/patients/${id}`),
};

export const ordonnancesApi = {
  getAll: (params) => get('/ordonnances', params),
  getById: (id) => get(`/ordonnances/${id}`),
  getByPatient: (patientId) => get(`/ordonnances/patient/${patientId}`),
  create: (data) => post('/ordonnances', data),
  update: (id, data) => put(`/ordonnances/${id}`, data),
  remove: (id) => del(`/ordonnances/${id}`),
};

export const productsApi = {
  montures: {
    getAll: (params) => get('/products/montures', params),
    getById: (id) => get(`/products/montures/${id}`),
    create: (data) => post('/products/montures', data),
    update: (id, data) => put(`/products/montures/${id}`, data),
    remove: (id) => del(`/products/montures/${id}`),
  },
  verres: {
    getAll: (params) => get('/products/verres', params),
    getById: (id) => get(`/products/verres/${id}`),
    create: (data) => post('/products/verres', data),
    update: (id, data) => put(`/products/verres/${id}`, data),
    remove: (id) => del(`/products/verres/${id}`),
  },
  lentilles: {
    getAll: (params) => get('/products/lentilles', params),
    getById: (id) => get(`/products/lentilles/${id}`),
    create: (data) => post('/products/lentilles', data),
    update: (id, data) => put(`/products/lentilles/${id}`, data),
    remove: (id) => del(`/products/lentilles/${id}`),
  },
};

export const catalogApi = {
  categories: {
    getAll: (params) => get('/catalog/categories', params),
    create: (data) => post('/catalog/categories', data),
    update: (id, data) => put(`/catalog/categories/${id}`, data),
    remove: (id) => del(`/catalog/categories/${id}`),
  },
  marques: {
    getAll: (params) => get('/catalog/marques', params),
    create: (data) => post('/catalog/marques', data),
    update: (id, data) => put(`/catalog/marques/${id}`, data),
    remove: (id) => del(`/catalog/marques/${id}`),
  },
  fournisseurs: {
    getAll: (params) => get('/catalog/fournisseurs', params),
    getProducts: (id) => get(`/catalog/fournisseurs/${id}/products`),
    create: (data) => post('/catalog/fournisseurs', data),
    update: (id, data) => put(`/catalog/fournisseurs/${id}`, data),
    remove: (id) => del(`/catalog/fournisseurs/${id}`),
  },
};

export const devisApi = {
  getAll: (params) => get('/devis', params),
  getById: (id) => get(`/devis/${id}`),
  create: (data) => post('/devis', data),
  update: (id, data) => put(`/devis/${id}`, data),
  remove: (id) => del(`/devis/${id}`),
  exportPdf: (id) => api.get(`/devis/${id}/pdf`, { responseType: 'blob' }),
};

export const rendezVousApi = {
  getAll: (params) => get('/rendez-vous', params),
  getById: (id) => get(`/rendez-vous/${id}`),
  getAvailableSlots: (params) => get('/rendez-vous/available-slots', params),
  create: (data) => post('/rendez-vous', data),
  update: (id, data) => put(`/rendez-vous/${id}`, data),
  remove: (id) => del(`/rendez-vous/${id}`),
};

export const reportsApi = {
  getSummary: (params) => get('/reports/summary', params),
};
