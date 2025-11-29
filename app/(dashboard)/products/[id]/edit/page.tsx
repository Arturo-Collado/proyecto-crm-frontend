
'use client';

import { useState, useEffect, use } from 'react';
import { PencilSquareIcon } from '@heroicons/react/24/solid';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getProductById, updateProduct, Product } from '@/services/api';

export default function EditProductPage({ params }: { params: Promise <{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);
  const [loading, setLoading] = useState(true);
  const [documentId, setDocumentId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: 0,
    stock: 0
  });

  useEffect(() => {
    const fetchProduct = async () => {
      const product = await getProductById(id);
      
      if (product) {
        setDocumentId(product.documentId);
        
        setFormData({
          name: product.name,
          description: product.description || '',
          price: product.price,
          stock: product.stock
        });
      } else {
        alert("Producto no encontrado");
        router.push('/products');
      }
      setLoading(false);
    };
   if (id) fetchProduct();
  }, [id, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const value = e.target.type === 'number' ? Number(e.target.value) : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!documentId) return;
    await updateProduct(documentId, formData);
    
    alert('Producto actualizado');
    router.push('/products');
  };

  if (loading) return <div className="p-8 text-center">Cargando...</div>;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex items-center border-b pb-4 mb-6">
        <PencilSquareIcon className="h-8 w-8 text-[--primary-color]" />
        <h1 className="text-2xl font-bold text-gray-800 ml-3">Editar Producto</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Nombre</label>
            <input
              type="text" name="name" required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2 focus:border-[--primary-color]"
              value={formData.name}
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Stock Disponible</label>
            <input
              type="number" name="stock" required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2 focus:border-[--primary-color]"
              value={formData.stock}
              onChange={handleChange}
            />
          </div>
        </div>
        <div>
            <label className="block text-sm font-medium text-gray-700">Descripción</label>
            <textarea
              name="description"
              rows={3}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2 focus:border-[--primary-color]"
              value={formData.description}
              onChange={handleChange}
            />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Precio (c$)</label>
          <input
            type="number" name="price" step="0.01" required
            className="mt-1 block w-32 rounded-md border-gray-300 shadow-sm border p-2 focus:border-[--primary-color]"
            value={formData.price}
            onChange={handleChange}
          />
        </div>
        
        <div className="flex justify-end space-x-4 border-t pt-6">
          <Link href="/products" className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300">Cancelar</Link>
          <button type="submit" className="px-4 py-2 bg-[--primary-color] text-white rounded-lg hover:bg-[--primary-hover-color]">
            Actualizar
          </button>
        </div>
      </form>
    </div>
  );
}