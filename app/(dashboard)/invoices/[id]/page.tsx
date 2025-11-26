
'use client';

import { useEffect, useState } from 'react';

import { getInvoiceById, getCompanySettings, Invoice, Client, CompanySettings } from '@/services/api';
import { PrinterIcon, ArrowLeftIcon } from '@heroicons/react/24/solid';
import Link from 'next/link';

export default function ViewInvoicePage({ params }: { params: { id: string } }) {
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [company, setCompany] = useState<CompanySettings | null>(null); // Estado para la empresa
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    //factura Y configuración al mismo tiempo
    Promise.all([
      getInvoiceById(params.id),
      getCompanySettings()
    ]).then(([invData, compData]) => {
      setInvoice(invData);
      setCompany(compData);
      setLoading(false);
    });
  }, [params.id]);

  if (loading) return <div className="p-10 text-center">Cargando documento...</div>;
  if (!invoice || !company) return <div className="p-10 text-center">Datos no disponibles</div>;

  const client = invoice.client as Client;

  return (
    <div className="max-w-4xl mx-auto">
      {/* ... (Barra de herramientas) ... */}
      <div className="flex justify-between items-center mb-6 print:hidden">
        <Link href="/invoices" className="flex items-center text-gray-600 hover:text-gray-900">
          <ArrowLeftIcon className="h-4 w-4 mr-2" /> Volver
        </Link>
        <button onClick={() => window.print()} className="flex items-center bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-700">
          <PrinterIcon className="h-5 w-5 mr-2" /> Imprimir
        </button>
      </div>

      {/* HOJA DE FACTURA */}
      <div className="bg-white p-10 rounded-lg shadow-lg border border-gray-200 print:shadow-none print:border-0">
        
        {/* Encabezado DINÁMICO */}
        <div className="flex justify-between items-start border-b pb-8 mb-8">
          <div>
            <h1 className="text-4xl font-bold text-[--primary-color]">FACTURA</h1>
            <p className="text-gray-500 mt-1">#{invoice.id}</p>
          </div>
          <div className="text-right">
            {/* Usamos los datos de la empresa */}
            <h2 className="font-bold text-xl text-gray-800">{company.name}</h2>
            <p className="text-gray-500 text-sm">{company.address}</p>
            <p className="text-gray-500 text-sm">RUC: {company.ruc}</p>
            <p className="text-gray-500 text-sm">{company.email}</p>
            <p className="text-gray-500 text-sm">{company.phone}</p>
          </div>
        </div>

        {/* ... (factura: Cliente, Tabla, Totales... sigue igual) ... */}
        <div className="flex justify-between mb-10">
          <div>
            <h3 className="text-gray-600 font-bold uppercase text-xs mb-2">Facturar a:</h3>
            <p className="font-bold text-gray-800 text-lg">{client.name || 'Consumidor Final'}</p>
            <p className="text-gray-500">{client.address}</p>
            <p className="text-gray-500">RUC: {client.ruc}</p>
          </div>
          {/* ... */}
        </div>
        
        {/* ... Tabla de items ... */}
        <table className="w-full mb-8">
            {/* ... (contenido de la tabla igual que antes) ... */}
            <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left py-3 px-4 font-bold text-gray-600 text-sm uppercase">Descripción</th>
              <th className="text-center py-3 px-4 font-bold text-gray-600 text-sm uppercase">Cant.</th>
              <th className="text-right py-3 px-4 font-bold text-gray-600 text-sm uppercase">Precio Unit.</th>
              <th className="text-right py-3 px-4 font-bold text-gray-600 text-sm uppercase">Total</th>
            </tr>
          </thead>
          <tbody>
            {invoice.items?.map((item: any, index: number) => (
              <tr key={index} className="border-b border-gray-100">
                <td className="py-3 px-4 text-gray-800">{item.description}</td>
                <td className="py-3 px-4 text-center text-gray-600">{item.quantity}</td>
                <td className="py-3 px-4 text-right text-gray-600">${Number(item.price).toFixed(2)}</td>
                <td className="py-3 px-4 text-right font-bold text-gray-800">
                  ${(item.quantity * item.price).toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Totales */}
        <div className="flex justify-end">
          <div className="w-1/2">
            <div className="flex justify-between py-4">
              <span className="font-bold text-xl text-[--primary-color]">Total</span>
              <span className="font-bold text-xl text-[--primary-color]">${Number(invoice.total).toFixed(2)}</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}