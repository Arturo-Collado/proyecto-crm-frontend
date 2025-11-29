
'use client';

import { useState } from 'react';
import { CubeIcon } from '@heroicons/react/24/solid';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createProduct } from '@/services/api';

export default function NewProductPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ 
    name: '', 
    description: '', 
    price: 0, 
    stock: 0 
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const value = e.target.type === 'number' ? Number(e.target.value) : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createProduct(formData);
    router.push('/products');
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex items-center border-b pb-4 mb-6">
        <CubeIcon className="h-8 w-8 text-[--primary-color]" />
        <h1 className="text-2xl font-bold text-gray-800 ml-3">Nuevo Producto</h1>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Nombre</label>
            <input type="text" name="name" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2" onChange={handleChange} />
          </div>
           <div>
           <label className="block text-sm font-medium text-gray-700">Descripción</label>
           <textarea 
             name="description" 
             rows={3}
             className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2 focus:border-[--primary-color]" 
             onChange={handleChange} 
           />
        </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Precio (c$)</label>
            <input type="number" name="price" step="0.01" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2" onChange={handleChange} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Stock Inicial</label>
            <input type="number" name="stock" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2" onChange={handleChange} />
          </div>
        </div>
        <div className="flex justify-end space-x-4 border-t pt-6">
          <Link href="/products" className="px-4 py-2 bg-gray-200 rounded-lg">Cancelar</Link>
          <button type="submit" className="px-4 py-2 bg-[--primary-color] text-white rounded-lg">Guardar</button>
        </div>
      </form>
    </div>
  );
}