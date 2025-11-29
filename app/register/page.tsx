'use client';

import { useState } from 'react';
import { UserIcon, EnvelopeIcon, LockClosedIcon, BuildingOfficeIcon } from '@heroicons/react/24/solid';
import { useRouter } from 'next/navigation';
import { registerUser } from '@/services/api';
import Link from 'next/link';

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData);

    // Validación de contraseñas
    if (data.password !== data.confirmPassword) {
      setErrorMsg("Las contraseñas no coinciden");
      setLoading(false);
      return;
    }

    try {
      const response = await registerUser({ 
        username: data.username as string, 
        email: data.email as string, 
        password: data.password as string,
      });

      if (response.jwt) {
        localStorage.setItem('crm_token', response.jwt);
        localStorage.setItem('crm_user', JSON.stringify(response.user));

        if (data.companyName) {
            localStorage.setItem('company_name', data.companyName as string);
        }

        alert("¡Cuenta creada! Bienvenido.");
        router.push('/dashboard'); 
      }

    } catch (error: any) {
      console.error(error);
      if (error.message?.includes('taken')) {
          setErrorMsg("Este correo o usuario ya está registrado.");
      } else {
          setErrorMsg("Error al registrar. Intenta nuevamente.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-[--primary-color] mb-2">Crear Cuenta</h2>
        <p className="text-center text-gray-500 mb-6">Únete a Pinolero CRM</p>

        {errorMsg && (
            <div className="mb-4 p-2 bg-red-100 border border-red-400 text-red-700 text-sm rounded text-center">
                {errorMsg}
            </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Nombre Empresa (Visual por ahora, se guarda en localStorage) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre de tu Empresa</label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <BuildingOfficeIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input type="text" name="companyName" className="block w-full rounded-md border-gray-300 pl-10 py-2 shadow-sm border focus:border-[--primary-color] outline-none" placeholder="Ej: Farmacia La Salud" required />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre de Usuario</label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3"><UserIcon className="h-5 w-5 text-gray-400" /></div>
              <input type="text" name="username" className="block w-full rounded-md border-gray-300 pl-10 py-2 shadow-sm border focus:border-[--primary-color] outline-none" required minLength={3} />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Correo</label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3"><EnvelopeIcon className="h-5 w-5 text-gray-400" /></div>
              <input type="email" name="email" className="block w-full rounded-md border-gray-300 pl-10 py-2 shadow-sm border focus:border-[--primary-color] outline-none" required />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3"><LockClosedIcon className="h-5 w-5 text-gray-400" /></div>
              <input type="password" name="password" className="block w-full rounded-md border-gray-300 pl-10 py-2 shadow-sm border focus:border-[--primary-color] outline-none" required minLength={6} />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Confirmar Contraseña</label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3"><LockClosedIcon className="h-5 w-5 text-gray-400" /></div>
              <input type="password" name="confirmPassword" className="block w-full rounded-md border-gray-300 pl-10 py-2 shadow-sm border focus:border-[--primary-color] outline-none" required />
            </div>
          </div>

          <button type="submit" disabled={loading} className="w-full justify-center rounded-md bg-[--primary-color] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[--primary-hover-color] transition-colors mt-4 disabled:opacity-50">
            {loading ? 'Registrando...' : 'Registrarse'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          ¿Ya tienes cuenta?{' '}
          <Link href="/" className="font-semibold text-[--primary-color] hover:underline">
            Inicia Sesión
          </Link>
        </p>
      </div>
    </main>
  );
}