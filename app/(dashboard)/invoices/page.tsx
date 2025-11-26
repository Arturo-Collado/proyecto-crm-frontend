'use client';

import { useState, useEffect } from 'react';
import { 
  DocumentTextIcon, 
  PlusIcon, 
  TrashIcon, 
  PencilIcon, 
  EyeIcon, 
  ArrowDownTrayIcon // Importante para el botón de exportar
} from '@heroicons/react/24/solid';
import Link from 'next/link';
// Importamos tipos y funciones desde nuestra API
import { getInvoices, deleteInvoice, Invoice, Client } from '@/services/api';

export default function InvoicesPage() {
  // Estado para almacenar las facturas
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    getInvoices().then((data) => {
      setInvoices(data);
      setLoading(false);
    });
  };

  const handleDelete = async (id: number) => {
    if (confirm("¿Eliminar esta factura?")) {
       await deleteInvoice(id);
       loadData();
    }
  };

  // FUNCIÓN PARA EXPORTAR A EXCEL (CSV)
  const exportToCSV = () => {
    // Encabezados del CSV
    const headers = ["ID,Cliente,Fecha,Total,Estado"];
    
    // Convertir datos. Aquí tipamos 'inv' como Invoice para evitar el error de 'any'
    const rows = invoices.map((inv: Invoice) => {
      // Verificamos si client es objeto o ID para obtener el nombre correctamente
      const clientName = typeof inv.client === 'object' ? (inv.client as Client).name : 'Cliente ' + inv.client;
      // Formateamos la línea del CSV. Usamos comillas para el nombre por si tiene comas.
      return `${inv.id},"${clientName}",${inv.date},${inv.total},${inv.status}`;
    });

    // Unir encabezados y filas
    const csvContent = [headers, ...rows].join("\n");

    // Crear el archivo y forzar la descarga
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "reporte_facturas.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link); // Limpieza
  };

  if (loading) return <div className="p-8 text-center">Cargando facturas...</div>;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <DocumentTextIcon className="h-8 w-8 text-[--primary-color]" />
          <h1 className="text-2xl font-bold text-gray-800 ml-3">Listado de Facturas</h1>
        </div>
        
        <div className="flex gap-2">
          {/* Botón Exportar */}
          <button 
            onClick={exportToCSV} 
            className="flex items-center bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
          >
            <ArrowDownTrayIcon className="h-5 w-5 mr-2" /> 
            Exportar Excel
          </button>

          {/* Botón Nueva Factura */}
          <Link 
            href="/invoices/new" 
            className="flex items-center bg-[--primary-color] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[--primary-hover-color] transition-colors"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Crear Factura
          </Link>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="px-6 py-3 font-medium text-gray-600">N°</th>
              <th className="px-6 py-3 font-medium text-gray-600">Cliente</th>
              <th className="px-6 py-3 font-medium text-gray-600">Fecha</th>
              <th className="px-6 py-3 font-medium text-gray-600">Monto</th>
              <th className="px-6 py-3 font-medium text-gray-600">Estado</th>
              <th className="px-6 py-3 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {invoices.length === 0 ? (
               <tr><td colSpan={6} className="text-center py-4 text-gray-500">No hay facturas registradas</td></tr>
            ) : (
              invoices.map((invoice) => (
                <tr key={invoice.id} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-800">#{invoice.id}</td>
                  <td className="px-6 py-4 text-gray-600">
                    {typeof invoice.client === 'object' ? (invoice.client as Client).name : 'Cliente #' + invoice.client}
                  </td>
                  <td className="px-6 py-4 text-gray-600">{invoice.date}</td>
                  <td className="px-6 py-4 text-gray-600">${Number(invoice.total).toFixed(2)}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      invoice.status === 'Pagada' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {invoice.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 flex justify-end space-x-2">
                     {/* Ver Factura */}
                     <Link href={`/invoices/${invoice.id}`} className="text-blue-600 hover:text-blue-900" title="Ver Factura">
                        <EyeIcon className="h-5 w-5" />
                     </Link>

                     {/* Editar Factura */}
                     <Link href={`/invoices/${invoice.id}/edit`} className="text-indigo-600 hover:text-indigo-900" title="Editar">
                        <PencilIcon className="h-5 w-5" />
                     </Link>
                     
                     {/* Eliminar Factura */}
                     <button onClick={() => handleDelete(invoice.id)} className="text-red-500 hover:text-red-700" title="Eliminar">
                        <TrashIcon className="h-5 w-5" />
                     </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}