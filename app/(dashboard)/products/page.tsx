
'use client';

import { useState, useEffect } from 'react';

import { CubeIcon, PlusIcon, TrashIcon, PencilIcon, MagnifyingGlassIcon } from '@heroicons/react/24/solid';
import Link from 'next/link';
import { getProducts, deleteProduct, Product } from '@/services/api';

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const data = await getProducts();
    setProducts(data);
    setLoading(false);
  };

  const handleDelete = async (product: Product) => {
    if (confirm('¿Borrar este producto del inventario?')) {
      await deleteProduct(product.documentId);
      loadData();
    }
  };

  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="p-8 text-center text-gray-500">Cargando inventario...</div>;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      
      {/* Encabezado con Buscador */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <div className="flex items-center">
          <CubeIcon className="h-8 w-8 text-[--primary-color]" />
          <h1 className="text-2xl font-bold text-gray-800 ml-3">Inventario</h1>
        </div>

        <div className="flex w-full md:w-auto gap-3">
          {/* BARRA DE BÚSQUEDA */}
          <div className="relative flex-1 md:w-64">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input 
              type="text" 
              className="block w-full p-2 pl-10 text-sm border border-gray-300 rounded-lg bg-gray-50 focus:ring-[--primary-color] focus:border-[--primary-color] outline-none transition-all" 
              placeholder="Buscar por nombre o SKU..." 
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Botón Nuevo */}
          <Link href="/products/new" className="flex items-center bg-[--primary-color] text-white px-4 py-2 rounded-lg shadow-sm hover:bg-[--primary-hover-color] transition-colors whitespace-nowrap">
            <PlusIcon className="h-5 w-5 mr-2" />
            Nuevo Producto
          </Link>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="px-6 py-3 font-medium text-gray-600">SKU</th>
              <th className="px-6 py-3 font-medium text-gray-600">Nombre</th>
              <th className="px-6 py-3 font-medium text-gray-600">Precio</th>
              <th className="px-6 py-3 font-medium text-gray-600">Stock</th>
              <th className="px-6 py-3 font-medium text-gray-600 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-8 text-gray-500">
                  {searchTerm ? `No se encontraron productos con "${searchTerm}"` : "No hay productos en inventario."}
                </td>
              </tr>
            ) : (
              filteredProducts.map((product) => (
                <tr key={product.documentId} className="border-b hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-gray-500 font-mono text-xs">{product.sku}</td>
                  <td className="px-6 py-4 font-medium text-gray-800">{product.name}</td>
                  <td className="px-6 py-4 text-gray-600 font-semibold">${Number(product.price).toFixed(2)}</td>
                  <td className="px-6 py-4">
                    {/* Stock con colores condicionales */}
                    <span className={`px-2 py-1 rounded-full text-xs font-bold border ${
                      product.stock < 5 
                        ? 'bg-red-50 text-red-700 border-red-200' 
                        : product.stock < 20 
                          ? 'bg-yellow-50 text-yellow-700 border-yellow-200'
                          : 'bg-green-50 text-green-700 border-green-200'
                    }`}>
                      {product.stock} unid.
                    </span>
                  </td>
                  <td className="px-6 py-4 flex justify-end space-x-3">
                    <Link href={`/products/${product.documentId}/edit`} className="text-indigo-600 hover:text-indigo-900 p-1 rounded hover:bg-indigo-50" title="Editar">
                      <PencilIcon className="h-5 w-5" />
                    </Link>
                    <button onClick={() => handleDelete(product)} className="text-red-500 hover:text-red-700 p-1 rounded hover:bg-red-50" title="Eliminar">
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