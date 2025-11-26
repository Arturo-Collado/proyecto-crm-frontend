
'use client';

import { useState, useEffect } from 'react';
import { UsersIcon, PlusIcon, PencilIcon, TrashIcon, MagnifyingGlassIcon } from '@heroicons/react/24/solid';
import Link from 'next/link';
import { getClients, deleteClient, Client } from '@/services/api';

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [searchTerm, setSearchTerm] = useState(''); // Estado del buscador
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadClients();
  }, []);

  const loadClients = async () => {
    const data = await getClients();
    setClients(data);
    setLoading(false);
  };

  const handleDelete = async (id: number) => {
    if (confirm('¿Eliminar cliente?')) {
      await deleteClient(id);
      loadClients();
    }
  };

  // Lógica de Filtrado
  const filteredClients = clients.filter(client => 
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.ruc.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="p-8">Cargando...</div>;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <div className="flex items-center">
          <UsersIcon className="h-8 w-8 text-[--primary-color]" />
          <h1 className="text-2xl font-bold text-gray-800 ml-3">Clientes</h1>
        </div>
        
        <div className="flex w-full md:w-auto gap-2">
          {/* BARRA DE BÚSQUEDA */}
          <div className="relative flex-1 md:w-64">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input 
              type="text" 
              className="block w-full p-2 pl-10 text-sm border border-gray-300 rounded-lg bg-gray-50 focus:ring-[--primary-color] focus:border-[--primary-color]" 
              placeholder="Buscar cliente..." 
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <Link href="/clients/new" className="flex items-center bg-[--primary-color] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[--primary-hover-color]">
            <PlusIcon className="h-5 w-5 mr-1" /> Nuevo
          </Link>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="px-6 py-3 font-medium text-gray-600">Nombre</th>
              <th className="px-6 py-3 font-medium text-gray-600">RUC</th>
              <th className="px-6 py-3 font-medium text-gray-600">Email</th>
              <th className="px-6 py-3 font-medium text-gray-600 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {/* Usamos filteredClients en vez de clients */}
            {filteredClients.map((client) => (
              <tr key={client.id} className="border-b hover:bg-gray-50">
                <td className="px-6 py-4 font-medium text-gray-800">{client.name}</td>
                <td className="px-6 py-4 text-gray-600">{client.ruc}</td>
                <td className="px-6 py-4 text-gray-600">{client.email}</td>
                <td className="px-6 py-4 flex justify-end space-x-3">
                  <Link href={`/clients/${client.id}/edit`} className="text-indigo-600"><PencilIcon className="h-5 w-5" /></Link>
                  <button onClick={() => handleDelete(client.id)} className="text-red-600"><TrashIcon className="h-5 w-5" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}