import qs from 'qs';

// CONEXION BACKEND
const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://proyecto-crm-backend.onrender.com/api"; 
const API_TOKEN = process.env.NEXT_PUBLIC_API_TOKEN || "390a72a4f08a38ff314e9fafff836ecbbd43095b6a78bbda1dbe63ba70161539775c95394b54f6bf7d8cf4df64071162f98642e62866ed8cb66609090241540227954c1380c8e03db2e0e9faa558063a4c792d5866a2c800ec3707bc82abe96b359ef3dfb57f01bf63a50f9358cc00e355a58f823433f668a0b212b707620427";

// ==========================================
// SECCIÓN 1: CLIENTES
// ==========================================
export interface Client {
  id: number;     
  documentId: string;  
  name: string;
  ruc: string;
  email: string;
  address: string;
  phone: string;
  status: string;
}

const normalizeClient = (data: any): Client => {
  const attrs = data.attributes || data;
  return {
    id: data.id,
    documentId: data.documentId, 
    name: attrs.Nombre || '',
    email: attrs.Correo || '',
    ruc: attrs.Identificacion || '',
    address: attrs.Direccion || '',
    phone: attrs.Telefono || '',
    status: 'Activo'
  };
};


export const getClients = async (): Promise<Client[]> => {
  try {
    const res = await fetch(`${API_URL}/clientes`, { 
      headers: { 'Authorization': `Bearer ${API_TOKEN}`, 'Cache-Control': 'no-cache' }, 
      cache: 'no-store' 
    });
    if (!res.ok) return [];
    const json = await res.json();
    return json.data.map((item: any) => normalizeClient(item));
  } catch (error) {
    console.error("Error clientes:", error);
    return [];
  }
};

export const getClientById = async (id: string) => {
   const list = await getClients();
   return list.find((c: Client) => String(c.id) === id || c.documentId === id) || null;
};
export const createClient = async (data: any) => {
  const payload = {
    Nombre: data.name,
    Correo: data.email,
    Identificacion: data.ruc,
    Direccion: data.address,
    Telefono: data.phone
  };
  try {
    await fetch(`${API_URL}/clientes`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${API_TOKEN}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ data: payload })
    });
  } catch (error) { console.error(error); }
};

export const updateClient = async (documentId: string, data: any) => {
  const payload = {
    Nombre: data.name,
    Correo: data.email,
    Identificacion: data.ruc,
    Direccion: data.address,
    Telefono: data.phone
  };
  try {
    await fetch(`${API_URL}/clientes/${documentId}`, {
      method: 'PUT',
      headers: { 'Authorization': `Bearer ${API_TOKEN}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ data: payload })
    });
  } catch (error) { console.error(error); }
};

export const deleteClient = async (documentId: string) => {
  try {
    await fetch(`${API_URL}/clientes/${documentId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${API_TOKEN}` }
    });
  } catch (error) { console.error(error); }
};


// ==========================================
// SECCIÓN 2: PRODUCTOS 
// ==========================================
export interface Product {
  id: number;
  documentId: string; 
  name: string;
  description: string;
  price: number;
  stock: number;
  sku: string;
}

const normalizeProduct = (data: any): Product => {
  const attrs = data.attributes || data;
  return {
    id: data.id,
    documentId: data.documentId, 
    name: attrs.Nombre || '',
    description: attrs.Descripcion || '',
    price: Number(attrs.Precio_Unitario) || 0,
    stock: Number(attrs.Stock) || 0,
    sku: String(data.id)
  };
};

export const getProducts = async (): Promise<Product[]> => {
  try {
    const res = await fetch(`${API_URL}/productos`, { 
      headers: { 'Authorization': `Bearer ${API_TOKEN}`, 'Cache-Control': 'no-cache' }, 
      cache: 'no-store' 
    });
    if (!res.ok) return [];
    const json = await res.json();
    return json.data.map((item: any) => normalizeProduct(item));
  } catch (error) {
    console.error("Error productos:", error);
    return [];
  }
};

export const getProductById = async (id: string) => {
   const list = await getProducts();
   return list.find((p: Product) => String(p.id) === id || p.documentId === id) || null;
};

export const createProduct = async (data: any) => {
  const payload = {
    Nombre: data.name,
    Descripcion: data.description || 'Sin descripción',
    Precio_Unitario: Number(data.price),
    Stock: Number(data.stock)
  };
  try {
    await fetch(`${API_URL}/productos`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${API_TOKEN}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ data: payload })
    });
  } catch (error) { console.error(error); }
};

export const updateProduct = async (documentId: string, data: any) => {
  const payload = {
    Nombre: data.name,
    Descripcion: data.description,
    Precio_Unitario: Number(data.price),
    Stock: Number(data.stock)
  };
  try {
    await fetch(`${API_URL}/productos/${documentId}`, {
      method: 'PUT',
      headers: { 'Authorization': `Bearer ${API_TOKEN}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ data: payload })
    });
  } catch (error) { console.error(error); }
};

export const deleteProduct = async (documentId: string) => {
  try {
    await fetch(`${API_URL}/productos/${documentId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${API_TOKEN}` }
    });
  } catch (error) { console.error(error); }
};

// ==========================================
// SECCIÓN 3: FACTURAS 
// ==========================================

export interface InvoiceItem {
  id?: number;
  productId: number | string;
  description: string;
  quantity: number;
  price: number;
  subtotal?: number;
}

export interface Invoice {
  id: number;
  documentId: string;
  codigo: string;
  client: any; 
  date: string;
  total: number;
  status: string;
  items: InvoiceItem[];
}

  const normalizeInvoice = (data: any): Invoice => {

  let clientData = { id: 0, name: 'Cliente', address: '', ruc: '' };
  
  if (data.cliente) {
    clientData = { 
      id: data.cliente.id,
      name: data.cliente.Nombre || 'Sin Nombre',
      ruc: data.cliente.Identificacion || '',
      address: data.cliente.Direccion || ''
    };
  }


  const rawItems = data.detalle_facturas || []; 
  const items: InvoiceItem[] = Array.isArray(rawItems) ? rawItems.map((item: any) => {
    const prod = item.producto;

    return {
      id: item.id,
      productId: prod?.documentId || prod?.id || 0,
      description: prod?.Nombre || 'Producto Generico',
      quantity: Number(item.Cantidad || 0),
      price: Number(item.Precio_Unitario_Venta || 0),
      subtotal: Number(item.SubTotal_Linea || 0)
    };
  }) : [];

  return {
    id: data.id,
    documentId: data.documentId,
    codigo: data.Codigo || `FAC-${String(data.id).padStart(4, '0')}`,
    client: clientData,
    date: data.Fecha_de_Compra || '', 
    total: Number(data.Total_General || 0),
    status: 'Pagada',
    items: items
  };
};

// --- LEER FACTURAS (READ)---
export const getInvoices = async (): Promise<Invoice[]> => {
  try {
    const query = qs.stringify({
      populate: {
        cliente: { fields: ['Nombre', 'Identificacion', 'Direccion', 'documentId'] },
        detalle_facturas: {
          populate: { producto: { fields: ['Nombre', 'Precio_Unitario', 'documentId'] } }
        }
      },
      sort: ['id:desc']
    }, { encodeValuesOnly: true });

    const res = await fetch(`${API_URL}/facturas?${query}`, { 
      headers: { 'Authorization': `Bearer ${API_TOKEN}`, 'Cache-Control': 'no-cache' }, 
      cache: 'no-store' 
    });

    if (!res.ok) return [];
    const json = await res.json();
    return json.data.map((item: any) => normalizeInvoice(item));
  } catch (error) {
    console.error("Error facturas:", error);
    return [];
  }
};

export const getInvoiceById = async (id: string) => {
  const list = await getInvoices();
  return list.find((inv) => String(inv.id) === id) || null;
};

// --- CREAR FACTURA (CREATE) ---
export const createInvoice = async (data: any) => {
  try {
    const [day, month, year] = data.date.includes('/') ? data.date.split('/') : [null, null, null];
    const formattedDate = year ? `${year}-${month}-${day}` : new Date().toISOString().split('T')[0];
    const queryLast = qs.stringify({ sort: ['id:desc'], pagination: { limit: 1 }, fields: ['Codigo'] });
    const resLast = await fetch(`${API_URL}/facturas?${queryLast}`, { headers: { 'Authorization': `Bearer ${API_TOKEN}` } });
    let nextNumber = 1;
    if (resLast.ok) {
      const jsonLast = await resLast.json();
      if (jsonLast.data?.[0]?.Codigo) {
        const parts = jsonLast.data[0].Codigo.split('-');
        if (parts[1]) nextNumber = Number(parts[1]) + 1;
      }
    }
    const newCodigo = `FAC-${String(nextNumber).padStart(4, '0')}`;
    const invoicePayload = {
      Codigo: newCodigo,
      Fecha_de_Compra: formattedDate,
      cliente: data.client,
      Total_General: Number(data.total),
      SubTotal: Number(data.total) / 1.15,
      Total_Impuesto: Number(data.total) - (Number(data.total) / 1.15)
    };

    const resInvoice = await fetch(`${API_URL}/facturas`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${API_TOKEN}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ data: invoicePayload })
    });

    if (!resInvoice.ok) throw new Error("Error guardando cabecera");
    const newInvoice = await resInvoice.json();
    const newInvoiceId = newInvoice.data.documentId;
    const itemPromises = data.items.map(async (item: any) => {

      await fetch(`${API_URL}/detalle-facturas`, { 
        method: 'POST',
        headers: { 'Authorization': `Bearer ${API_TOKEN}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: {
            factura: newInvoiceId,
            producto: item.productId,
            Cantidad: Number(item.quantity),
            Precio_Unitario_Venta: Number(item.price),
            SubTotal_Linea: Number(item.quantity) * Number(item.price)
        }})
      });

      const resProd = await fetch(`${API_URL}/productos/${item.productId}`, {
         headers: { 'Authorization': `Bearer ${API_TOKEN}` }
      });
      
      if (resProd.ok) {
        const jsonProd = await resProd.json();
        const currentStock = Number(jsonProd.data.Stock || 0);
        const newStock = currentStock - Number(item.quantity);
        
        await fetch(`${API_URL}/productos/${item.productId}`, {
          method: 'PUT',
          headers: { 'Authorization': `Bearer ${API_TOKEN}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({ data: { Stock: newStock < 0 ? 0 : newStock } })
        });
      }
    });

    await Promise.all(itemPromises);
    return { success: true };

  } catch (error) {
    console.error(error);
    throw error;
  }
};

// --- ACTUALIZAR FACTURA (PUT) ---
export const updateInvoice = async (documentId: string, data: any) => {
  const [day, month, year] = data.date.includes('/') ? data.date.split('/') : [null, null, null];
  const formattedDate = year ? `${year}-${month}-${day}` : data.date;
  
  const payload = {
    Fecha_de_Compra: formattedDate,
    cliente: data.client, 
    Total_General: Number(data.total)
  };
  
  await fetch(`${API_URL}/facturas/${documentId}`, {
      method: 'PUT',
      headers: { 'Authorization': `Bearer ${API_TOKEN}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ data: payload })
  });
};

// --- ELIMINAR FACTURA (DELETE) ---
export const deleteInvoice = async (documentId: string) => {

  try {
      const query = qs.stringify({ populate: { detalle_facturas: { fields: ['documentId'] } } });
      const resCheck = await fetch(`${API_URL}/facturas/${documentId}?${query}`, { headers: { 'Authorization': `Bearer ${API_TOKEN}` } });
      
      if (resCheck.ok) {
        const json = await resCheck.json();
        const detalles = json.data.detalle_facturas || [];
        const deletePromises = detalles.map((item: any) => 
            fetch(`${API_URL}/detalle-facturas/${item.documentId}`, {
              method: 'DELETE', headers: { 'Authorization': `Bearer ${API_TOKEN}` }
            })
        );
        await Promise.all(deletePromises);
      }
  } catch (e) { console.error("Error borrando detalles", e); }

  // Luego borramos la factura
  await fetch(`${API_URL}/facturas/${documentId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${API_TOKEN}` }
  });
};

// --- AUTENTICACIÓN (LOGIN REAL CON STRAPI) ---
export const loginUser = async (credentials: { identifier: string; password: string }) => {
  try {
    const res = await fetch(`${API_URL}/auth/local`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        identifier: credentials.identifier,
        password: credentials.password,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error?.message || "Error al iniciar sesión");
    }

    return data; 
  } catch (error) {
    console.error("Error Login:", error);
    throw error;
  }
};

// --- REGISTRO DE USUARIO ---
export const registerUser = async (userData: { username: string; email: string; password: string }) => {
  try {
    const res = await fetch(`${API_URL}/auth/local/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error?.message || "Error al registrar usuario");
    }

    return data;
  } catch (error) {
    console.error("Register error:", error);
    throw error;
  }
};



// ==========================================
// OTROS (Settings, Auth)
// ==========================================
export interface CompanySettings {
  name: string; ruc: string; address: string; email: string; phone: string;
}
export const getCompanySettings = async (): Promise<CompanySettings> => {
  return {
    name: 'Pinolero CRM', ruc: 'J00000000', address: 'Managua', email: 'admin@crm.com', phone: '0000'
  };
};
export const saveCompanySettings = async (settings: CompanySettings) => { return { success: true }; };

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