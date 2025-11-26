
'use client';

import { useState, useEffect } from 'react';
import { BuildingOfficeIcon, CheckCircleIcon } from '@heroicons/react/24/solid';
import { getCompanySettings, saveCompanySettings, CompanySettings } from '@/services/api';

export default function SettingsPage() {
  const [formData, setFormData] = useState<CompanySettings>({
    name: '', ruc: '', address: '', email: '', phone: ''
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCompanySettings().then(data => {
      setFormData(data);
      setLoading(false);
    });
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await saveCompanySettings(formData);
    alert("Configuración guardada correctamente");
  };

  if (loading) return <div className="p-8">Cargando...</div>;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md max-w-2xl mx-auto">
      <div className="flex items-center border-b pb-4 mb-6">
        <BuildingOfficeIcon className="h-8 w-8 text-[--primary-color]" />
        <h1 className="text-2xl font-bold text-gray-800 ml-3">Configuración de la Empresa</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Nombre de la Empresa</label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} className="mt-1 block w-full border p-2 rounded-md" />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">RUC / Cédula</label>
            <input type="text" name="ruc" value={formData.ruc} onChange={handleChange} className="mt-1 block w-full border p-2 rounded-md" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Teléfono</label>
            <input type="text" name="phone" value={formData.phone} onChange={handleChange} className="mt-1 block w-full border p-2 rounded-md" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Dirección</label>
          <input type="text" name="address" value={formData.address} onChange={handleChange} className="mt-1 block w-full border p-2 rounded-md" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Correo Electrónico</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} className="mt-1 block w-full border p-2 rounded-md" />
        </div>

        <div className="pt-4">
          <button type="submit" className="flex items-center justify-center w-full bg-[--primary-color] text-white px-4 py-2 rounded-lg hover:bg-[--primary-hover-color]">
            <CheckCircleIcon className="h-5 w-5 mr-2" /> Guardar Cambios
          </button>
        </div>
      </form>
    </div>
  );
}