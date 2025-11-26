// Archivo: services/api.ts esto aqui es lo que falta para strappi conexion

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://proyecto-crm-backend.onrender.com"; 
const API_TOKEN = process.env.NEXT_PUBLIC_API_TOKEN || "";

// --- TIPOS Clientes ---
export interface Client {
  id: number;
  name: string;
  ruc: string;
  email: string;
  address: string;
  status?: string;
}

export interface Product {
  id: number;
  name: string;
  price: number;
  sku: string;
  stock: number;
}

export interface Invoice {
  id: number;
  client: Client | number; 
  date: string;
  total: number;
  status: string;
  items?: any[];
}

// --- DATOS INICIALES PARA SIMULACIÓN ---
const INITIAL_CLIENTS: Client[] = [
  { id: 1, name: 'Cliente Demo S.A.', ruc: 'J0000000', email: 'demo@crm.com', address: 'Managua', status: 'Activo' }
];
const INITIAL_PRODUCTS: Product[] = [
  { id: 101, name: 'Servicio Web Básico', price: 300, sku: 'WEB-001', stock: 10 },
  { id: 102, name: 'Mouse Logitech', price: 15, sku: 'HW-002', stock: 50 }
];
const INITIAL_INVOICES: Invoice[] = [];

// --- FUNCIONES AUXILIARES DE LOCAL STORAGE ---
const getLocal = (key: string, initial: any) => {
  if (typeof window === 'undefined') return initial;
  const stored = localStorage.getItem(key);
  if (!stored) {
    localStorage.setItem(key, JSON.stringify(initial));
    return initial;
  }
  return JSON.parse(stored);
};

const setLocal = (key: string, data: any) => {
  if (typeof window !== 'undefined') localStorage.setItem(key, JSON.stringify(data));
};

const normalizeStrapiData = (data: any) => {
  if (!data) return null;
  const isArray = Array.isArray(data);
  const items = isArray ? data : [data];
  const flattened = items.map((item: any) => item.attributes ? { id: item.id, ...item.attributes } : item);
  return isArray ? flattened : flattened[0];
};

// --- CLIENTES ---
export const getClients = async (): Promise<Client[]> => {
  try {
    const res = await fetch(`${API_URL}/clients`, { headers: { 'Authorization': `Bearer ${API_TOKEN}` }, cache: 'no-store' });
    if (!res.ok) throw new Error();
    const json = await res.json();
    return normalizeStrapiData(json.data);
  } catch { return getLocal('pinolero_clients', INITIAL_CLIENTS); }
};
export const getClientById = async (id: string) => {
   const list = await getClients();
   return list.find((c: Client) => c.id === Number(id)) || null;
};
export const createClient = async (data: any) => {
   try { await fetch(`${API_URL}/clients`, { method: 'POST', headers: { 'Authorization': `Bearer ${API_TOKEN}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ data }) }); }
   catch { const list = getLocal('pinolero_clients', INITIAL_CLIENTS); setLocal('pinolero_clients', [...list, { ...data, id: Date.now() }]); }
};
export const updateClient = async (id: string, data: any) => {
   try { await fetch(`${API_URL}/clients/${id}`, { method: 'PUT', headers: { 'Authorization': `Bearer ${API_TOKEN}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ data }) }); }
   catch { const list = getLocal('pinolero_clients', INITIAL_CLIENTS); setLocal('pinolero_clients', list.map((c: Client) => c.id === Number(id) ? { ...c, ...data } : c)); }
};
export const deleteClient = async (id: number) => {
   try { await fetch(`${API_URL}/clients/${id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${API_TOKEN}` } }); }
   catch { const list = getLocal('pinolero_clients', INITIAL_CLIENTS); setLocal('pinolero_clients', list.filter((c: Client) => c.id !== id)); }
};

// --- PRODUCTOS ---
export const getProducts = async (): Promise<Product[]> => {
  try {
    const res = await fetch(`${API_URL}/products`, { headers: { 'Authorization': `Bearer ${API_TOKEN}` }, cache: 'no-store' });
    if (!res.ok) throw new Error();
    const json = await res.json();
    return normalizeStrapiData(json.data);
  } catch { return getLocal('pinolero_products', INITIAL_PRODUCTS); }
};
export const getProductById = async (id: string) => {
   const list = await getProducts();
   return list.find((p: Product) => p.id === Number(id)) || null;
};
export const createProduct = async (data: any) => {
   const payload = { ...data, stock: Number(data.stock) };
   try { await fetch(`${API_URL}/products`, { method: 'POST', headers: { 'Authorization': `Bearer ${API_TOKEN}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ data: payload }) }); }
   catch { const list = getLocal('pinolero_products', INITIAL_PRODUCTS); setLocal('pinolero_products', [...list, { ...payload, id: Date.now() }]); }
};
export const updateProduct = async (id: string, data: any) => {
   const payload = { ...data, stock: Number(data.stock) };
   try { await fetch(`${API_URL}/products/${id}`, { method: 'PUT', headers: { 'Authorization': `Bearer ${API_TOKEN}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ data: payload }) }); }
   catch { const list = getLocal('pinolero_products', INITIAL_PRODUCTS); setLocal('pinolero_products', list.map((p: Product) => p.id === Number(id) ? { ...p, ...payload } : p)); }
};
export const deleteProduct = async (id: number) => {
   try { await fetch(`${API_URL}/products/${id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${API_TOKEN}` } }); }
   catch { const list = getLocal('pinolero_products', INITIAL_PRODUCTS); setLocal('pinolero_products', list.filter((p: Product) => p.id !== id)); }
};

// --- FACTURAS ---
export const getInvoices = async (): Promise<Invoice[]> => {
  try {
    const res = await fetch(`${API_URL}/invoices?populate=client`, { headers: { 'Authorization': `Bearer ${API_TOKEN}` }, cache: 'no-store' });
    if (!res.ok) throw new Error();
    const json = await res.json();
    return normalizeStrapiData(json.data);
  } catch {
    const invoices = getLocal('pinolero_invoices', INITIAL_INVOICES);
    const clients = getLocal('pinolero_clients', INITIAL_CLIENTS);
    return invoices.map((inv: any) => {
      const clientData = clients.find((c: Client) => c.id == inv.client) || { name: 'Cliente Desconocido' };
      return { ...inv, client: clientData };
    });
  }
};
export const getInvoiceById = async (id: string) => {
  const list = await getInvoices();
  return list.find((inv: Invoice) => String(inv.id) === id) || null;
};
export const createInvoice = async (data: any) => {
  try {
    await fetch(`${API_URL}/invoices`, { method: 'POST', headers: { 'Authorization': `Bearer ${API_TOKEN}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ data }) });
  } catch {
    const invoices = getLocal('pinolero_invoices', INITIAL_INVOICES);
    const products = getLocal('pinolero_products', INITIAL_PRODUCTS);
    const newInvoice = { ...data, id: Date.now(), status: 'Pendiente' };
    setLocal('pinolero_invoices', [...invoices, newInvoice]);
    const updatedProducts = products.map((p: Product) => {
        const soldItem = data.items.find((item: any) => String(item.productId) === String(p.id));
        if (soldItem) {
            const newStock = p.stock - Number(soldItem.quantity);
            return { ...p, stock: newStock < 0 ? 0 : newStock };
        }
        return p;
    });
    setLocal('pinolero_products', updatedProducts);
  }
};
export const updateInvoice = async (id: string, data: any) => {
  try { await fetch(`${API_URL}/invoices/${id}`, { method: 'PUT', headers: { 'Authorization': `Bearer ${API_TOKEN}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ data }) }); }
  catch { const list = getLocal('pinolero_invoices', INITIAL_INVOICES); setLocal('pinolero_invoices', list.map((i: Invoice) => String(i.id) === id ? { ...i, ...data } : i)); }
};
export const deleteInvoice = async (id: number) => {
  try { await fetch(`${API_URL}/invoices/${id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${API_TOKEN}` } }); }
  catch { const list = getLocal('pinolero_invoices', INITIAL_INVOICES); setLocal('pinolero_invoices', list.filter((i: Invoice) => i.id !== id)); }
};

// --- AUTENTICACIÓN DE USUARIOS ---
export const loginUser = async (credentials: any) => {
  if (credentials.identifier === 'admin@crm.com' && credentials.password === '123456') {
    return { jwt: 'fake-token', user: { username: 'Admin' } };
  }
  throw new Error("Error login");
};

export const registerUser = async (data: any) => {
  console.log("Registrando usuario:", data);
  // Simulación de registro exitoso
  return { jwt: 'fake-token', user: data };
};

// ================= CONFIGURACIÓN DE EMPRESA =================

export interface CompanySettings {
  name: string;
  ruc: string;
  address: string;
  email: string;
  phone: string;
}

const DEFAULT_SETTINGS: CompanySettings = {
  name: 'Pinolero CRM',
  ruc: 'J00000000',
  address: 'Managua, Nicaragua',
  email: 'info@pinolerocrm.com',
  phone: '+505 0000-0000'
};

export const getCompanySettings = async (): Promise<CompanySettings> => {
  // Simulamos que esto también se guarda en el backend o local
  return getLocal('pinolero_settings', DEFAULT_SETTINGS);
};

export const saveCompanySettings = async (settings: CompanySettings) => {
  // Aquí harías un PUT al backend si existiera
  setLocal('pinolero_settings', settings);
  return { success: true };
};