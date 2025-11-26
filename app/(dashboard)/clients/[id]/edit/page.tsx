
'use client';

import { useState, useEffect } from 'react';
import { PencilSquareIcon } from '@heroicons/react/24/solid';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getClientById, updateClient } from '@/services/api';

export default function EditClientPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    ruc: '',
    address: '',
    email: ''
  });

  // Cargar datos del cliente existente usando el ID de la URL
  useEffect(() => {
    const fetchClient = async () => {
      const client = await getClientById(params.id);
      if (client) {
        setFormData({
          name: client.name,
          ruc: client.ruc,
          address: client.address,
          email: client.email
        });
      } else {
        alert("Cliente no encontrado");
        router.push('/clients');
      }
      setLoading(false);
    };
    
    // Solo ejecutamos si hay ID 
    if (params.id) fetchClient();
  }, [params.id, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateClient(params.id, formData);
    alert('Cliente actualizado correctamente');
    router.push('/clients');
  };

  if (loading) return <div className="p-8 text-center">Cargando datos del cliente...</div>;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex items-center border-b pb-4 mb-6">
        <PencilSquareIcon className="h-8 w-8 text-[--primary-color]" />
        <h1 className="text-2xl font-bold text-gray-800 ml-3">Editar Cliente</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Nombre Completo</label>
          <input
            type="text" name="name" required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2 focus:border-[--primary-color]"
            value={formData.name}
            onChange={handleChange}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Cédula o RUC</label>
          <input
            type="text" name="ruc" required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2 focus:border-[--primary-color]"
            value={formData.ruc}
            onChange={handleChange}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Dirección</label>
          <input
            type="text" name="address"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2 focus:border-[--primary-color]"
            value={formData.address}
            onChange={handleChange}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Correo Electrónico</label>
          <input
            type="email" name="email" required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2 focus:border-[--primary-color]"
            value={formData.email}
            onChange={handleChange}
          />
        </div>
        
        <div className="flex justify-end space-x-4 border-t pt-6">
          <Link href="/clients" className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300">
            Cancelar
          </Link>
          <button type="submit" className="px-4 py-2 bg-[--primary-color] text-white rounded-lg hover:bg-[--primary-hover-color]">
            Actualizar Cliente
          </button>
        </div>
      </form>
    </div>
  );
}