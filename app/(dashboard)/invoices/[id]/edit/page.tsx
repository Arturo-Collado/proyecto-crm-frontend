
'use client';

import { useState, useEffect, use } from 'react';
import { DocumentPlusIcon, UserCircleIcon, CalendarIcon, TrashIcon } from '@heroicons/react/24/solid';
import { getProducts, getClients, getInvoiceById, updateInvoice, Product, Client, Invoice } from '@/services/api';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function EditInvoicePage({ params }: { params: Promise <{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);
  const [loading, setLoading] = useState(true);
  const [productsDB, setProductsDB] = useState<Product[]>([]);
  const [clientsDB, setClientsDB] = useState<Client[]>([]);
  const [currentInvoice, setCurrentInvoice] = useState<Invoice | null>(null);
  const [selectedClient, setSelectedClient] = useState('');
  const [date, setDate] = useState('');
  const [lines, setLines] = useState<any[]>([]);

  useEffect(() => {
      const init = async () => {
      const [pData, cData, invData] = await Promise.all([getProducts(), getClients(), getInvoiceById(id)]);
      
      if (!invData) { alert("Factura no encontrada"); return router.push('/invoices'); }

      setProductsDB(pData);
      setClientsDB(cData);
      setCurrentInvoice(invData); // Guardamos la factura completa
      
      setSelectedClient(
        typeof invData.client === 'object' 
        ? (invData.client.documentId || String(invData.client.id)) 
        : String(invData.client)
        );
      setDate(invData.date);
      setLines(invData.items || []);
      setLoading(false);
    };
    init();
  }, [id, router]);

  const addLine = () => setLines([...lines, { id: Date.now(), productId: '', description: '', quantity: 1, price: 0 }]);
  const removeLine = (lineId: number) => setLines(lines.filter(l => l.id !== lineId));
  const handleLineChange = (lineId: number, field: string, value: any) => {
  const newLines = lines.map(line => {
      if (line.id === lineId) {
        const updated = { ...line, [field]: value };
        if (field === 'productId') {
          const prod = productsDB.find(p => p.documentId === value);
          if (prod) { updated.price = prod.price; updated.description = prod.name; }
        }
        return updated;
      }
      return line;
    });
    setLines(newLines);
  };

  const subtotal = lines.reduce((sum, line) => sum + (line.quantity * line.price), 0);
  const total = subtotal * 1.15;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentInvoice) return;

    await updateInvoice(currentInvoice.documentId, { 
        client: selectedClient, 
        date, 
        items: lines, 
        total 
    });
    
    alert("Factura corregida");
    router.push('/invoices');
  };

  if(loading) return <div>Cargando...</div>;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex items-center border-b pb-4 mb-6">
        <DocumentPlusIcon className="h-8 w-8 text-[--primary-color]" />
        <h1 className="text-2xl font-bold text-gray-800 ml-3">Editar Factura #{id}</h1>
      </div>
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Mismo formulario que New, pero pre-llenado */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Cliente</label>
            <select className="block w-full border p-2 rounded-md" value={selectedClient} onChange={e => setSelectedClient(e.target.value)}>
               {clientsDB.map(c => <option key={c.documentId} value={c.documentId}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Fecha</label>
            <input type="text" className="block w-full border p-2 rounded-md bg-gray-100" value={date} readOnly />
          </div>
        </div>

        <div className="border-t pt-6">
           {/* Tabla de items igual a new invoice */}
           {lines.map((line) => (
              <div key={line.id} className="flex gap-2 mb-2 items-center">
                  <select className="border p-2 rounded w-1/3" value={line.productId} onChange={e => handleLineChange(line.id, 'productId', e.target.value)}>
                      <option value="">Producto</option>
                      {productsDB.map(p => <option key={p.documentId} value={p.documentId}>{p.name}</option>)}
                  </select>
                  <input type="number" className="border p-2 rounded w-20" value={line.quantity} onChange={e => handleLineChange(line.id, 'quantity', Number(e.target.value))} />
                  <input type="text" className="border p-2 rounded w-24 bg-gray-50" value={line.price} readOnly />
                  <span className="font-bold w-24 text-right">${(line.quantity * line.price).toFixed(2)}</span>
                  <button type="button" onClick={() => removeLine(line.id)} className="text-red-500"><TrashIcon className="h-5 w-5"/></button>
              </div>
           ))}
           <button type="button" onClick={addLine} className="text-sm text-blue-600 font-bold mt-2">+ Agregar Item</button>
        </div>
        
        <div className="flex justify-end border-t pt-4">
            <span className="text-xl font-bold">Total: ${total.toFixed(2)}</span>
        </div>

        <div className="flex justify-end gap-4">
            <Link href="/invoices" className="px-4 py-2 bg-gray-200 rounded">Cancelar</Link>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">Guardar Cambios</button>
        </div>
      </form>
    </div>
  );
}