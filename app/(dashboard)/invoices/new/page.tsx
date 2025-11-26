
'use client';

import { useState, useEffect } from 'react';
import { DocumentPlusIcon, UserCircleIcon, CalendarIcon, TrashIcon } from '@heroicons/react/24/solid';
import { getProducts, getClients, createInvoice, Product, Client } from '@/services/api';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function NewInvoicePage() {
  const router = useRouter();
  const currentDate = new Date().toLocaleDateString('es-NI');
  
  const [productsDB, setProductsDB] = useState<Product[]>([]);
  const [clientsDB, setClientsDB] = useState<Client[]>([]);
  const [selectedClient, setSelectedClient] = useState('');
  
  // Estado de las líneas
  const [lines, setLines] = useState([
    { id: Date.now(), productId: '', description: '', quantity: 1, price: 0, maxStock: 0 }
  ]);

  // Cargar datos
  useEffect(() => {
    getProducts().then(data => setProductsDB(data));
    getClients().then(data => setClientsDB(data));
  }, []);

  const addLine = () => {
    setLines([...lines, { id: Date.now(), productId: '', description: '', quantity: 1, price: 0, maxStock: 0 }]);
  };

  const removeLine = (id: number) => {
    if (lines.length === 1) return;
    setLines(lines.filter(l => l.id !== id));
  };

  const handleLineChange = (id: number, field: string, value: any) => {
    const newLines = lines.map(line => {
      if (line.id === id) {
        let updatedLine = { ...line, [field]: value };
        
        // Si cambiamos el producto, traemos su precio y su STOCK MÁXIMO
        if (field === 'productId') {
          const prod = productsDB.find(p => String(p.id) === String(value));
          if (prod) {
            updatedLine.price = prod.price;
            updatedLine.description = prod.name;
            updatedLine.maxStock = prod.stock || 0; // Guarda cuánto hay disponible
            updatedLine.quantity = 1; // Resetea a 1
          }
        }

        // 2. VALIDACIÓN DE STOCK: Si cambia la cantidad, verificamos que no se pase
        if (field === 'quantity') {
          const qty = Number(value);
          if (line.maxStock > 0 && qty > line.maxStock) {
            alert(`¡Alto ahí! Solo tienes ${line.maxStock} unidades de este producto en inventario.`);
            updatedLine.quantity = line.maxStock; // Le ponemos el máximo posible
          } else if (qty < 1) {
            updatedLine.quantity = 1;
          }
        }

        return updatedLine;
      }
      return line;
    });
    setLines(newLines);
  };

  const subtotal = lines.reduce((sum, line) => sum + (line.quantity * line.price), 0);
  const tax = subtotal * 0.15;
  const total = subtotal + tax;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClient) return alert("Selecciona un cliente");

    // Validar una última vez antes de guardar
    for (const line of lines) {
      if (line.maxStock > 0 && line.quantity > line.maxStock) {
        return alert(`Error: El producto "${line.description}" excede el stock disponible.`);
      }
    }

    const invoicePayload = {
      client: selectedClient,
      date: currentDate,
      items: lines,
      total: total
    };

    await createInvoice(invoicePayload);
    alert("¡Factura guardada y Stock descontado!");
    router.push('/invoices');
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex items-center border-b pb-4 mb-6">
        <DocumentPlusIcon className="h-8 w-8 text-[--primary-color]" />
        <h1 className="text-2xl font-bold text-gray-800 ml-3">Crear Nueva Factura</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
              <UserCircleIcon className="h-5 w-5 mr-2 text-gray-500"/> Cliente
            </label>
            <select 
              className="block w-full rounded-md border-gray-300 p-2 border shadow-sm focus:border-[--primary-color]"
              value={selectedClient}
              onChange={(e) => setSelectedClient(e.target.value)}
              required
            >
              <option value="">Seleccione un cliente...</option>
              {clientsDB.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
              <CalendarIcon className="h-5 w-5 mr-2 text-gray-500"/> Fecha
            </label>
            <input type="text" className="block w-full rounded-md bg-gray-100 border-gray-300 p-2 border" value={currentDate} readOnly />
          </div>
        </div>

        <div className="border-t pt-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Detalles</h2>
          <table className="min-w-full text-left text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-gray-600 w-5/12">Producto</th>
                <th className="px-4 py-2 text-gray-600 w-24 text-center">Stock</th>
                <th className="px-4 py-2 text-gray-600 w-24">Cant.</th>
                <th className="px-4 py-2 text-gray-600 w-32">Precio</th>
                <th className="px-4 py-2 text-gray-600 text-right">Total</th>
                <th className="px-4 py-2 w-10"></th>
              </tr>
            </thead>
            <tbody>
              {lines.map((line) => (
                <tr key={line.id} className="border-b">
                  <td className="px-4 py-2">
                    <select 
                      className="w-full border-gray-300 rounded-md p-1 border"
                      value={line.productId}
                      onChange={(e) => handleLineChange(line.id, 'productId', e.target.value)}
                      required
                    >
                      <option value="">Seleccionar...</option>
                      {productsDB.map(p => (
                        
                        <option key={p.id} value={p.id} disabled={p.stock === 0}>
                          {p.name} {p.stock === 0 ? '(AGOTADO)' : `(Disp: ${p.stock})`}
                        </option>
                      ))}
                    </select>
                  </td>
                  {/* Columna visual de Stock para referencia */}
                  <td className="px-4 py-2 text-center text-gray-500 text-xs">
                    {line.maxStock > 0 ? line.maxStock : '-'}
                  </td>
                  <td className="px-4 py-2">
                    <input 
                      type="number" 
                      min="1" 
                      // El máximo del input es el stock real
                      max={line.maxStock}
                      className="w-full border-gray-300 rounded-md p-1 border text-center"
                      value={line.quantity}
                      onChange={(e) => handleLineChange(line.id, 'quantity', Number(e.target.value))}
                      disabled={!line.productId} // No puedes poner cantidad si no has elegido producto
                    />
                  </td>
                  <td className="px-4 py-2 text-gray-600">${line.price.toFixed(2)}</td>
                  <td className="px-4 py-2 text-right font-bold text-gray-800">
                    ${(line.quantity * line.price).toFixed(2)}
                  </td>
                  <td className="px-4 py-2 text-center">
                    <button type="button" onClick={() => removeLine(line.id)} className="text-red-500 hover:text-red-700">
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button type="button" onClick={addLine} className="mt-4 text-sm font-semibold text-[--primary-color] hover:text-[--primary-hover-color]">
            + Añadir otra línea
          </button>
        </div>

        <div className="flex justify-end border-t pt-6">
          <div className="w-full max-w-sm space-y-2">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal:</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>IVA (15%):</span>
              <span>${tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between border-t pt-3 text-xl font-bold text-gray-900">
              <span>Total:</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>
        </div>
        
        <div className="flex justify-end space-x-4 border-t pt-6">
          <Link href="/invoices" className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300">
            Cancelar
          </Link>
          <button type="submit" className="px-4 py-2 bg-[--primary-color] text-white rounded-lg hover:bg-[--primary-hover-color]">
            Guardar Factura
          </button>
        </div>
      </form>
    </div>
  );
}