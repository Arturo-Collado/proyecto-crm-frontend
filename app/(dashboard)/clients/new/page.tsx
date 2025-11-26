
'use client';

import { useState } from 'react';
import { UserPlusIcon } from '@heroicons/react/24/solid';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/services/api';

export default function NewClientPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    ruc: '',
    address: '',
    email: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
   
    await createClient({ 
      ...formData, 
      status: 'Activo' 
    });
    
    alert('Cliente creado exitosamente');
    router.push('/clients'); // Redirigir a la lista
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex items-center border-b pb-4 mb-6">
        <UserPlusIcon className="h-8 w-8 text-[--primary-color]" />
        <h1 className="text-2xl font-bold text-gray-800 ml-3">Registrar Nuevo Cliente</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Nombre Completo o Razón Social</label>
          <input
            type="text" name="name" required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2 focus:border-[--primary-color]"
            placeholder="Ej: Empresa de Tecnología S.A."
            onChange={handleChange}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Cédula o RUC</label>
          <input
            type="text" name="ruc" required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2 focus:border-[--primary-color]"
            placeholder="Ej: J0310000000000"
            onChange={handleChange}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Dirección</label>
          <input
            type="text" name="address"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2 focus:border-[--primary-color]"
            placeholder="Ej: Managua, Nicaragua"
            onChange={handleChange}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Correo Electrónico</label>
          <input
            type="email" name="email" required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2 focus:border-[--primary-color]"
            placeholder="Ej: contacto@empresa.com"
            onChange={handleChange}
          />
        </div>
        
        <div className="flex justify-end space-x-4 border-t pt-6">
          <Link href="/clients" className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300">
            Cancelar
          </Link>
          <button type="submit" className="px-4 py-2 bg-[--primary-color] text-white rounded-lg hover:bg-[--primary-hover-color]">
            Guardar Cliente
          </button>
        </div>
      </form>
    </div>
  );
}