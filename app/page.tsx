'use client'; 

import { useState } from 'react';
import { EnvelopeIcon, LockClosedIcon } from '@heroicons/react/24/solid';
import { useRouter } from 'next/navigation';
import { loginUser } from '@/services/api';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    try {
      const response = await loginUser({ identifier: email, password: password });
      
      localStorage.setItem('crm_token', response.jwt);
      localStorage.setItem('crm_user', JSON.stringify(response.user));

      router.push('/dashboard');
      
    } catch (err: any) {
      console.error(err);
      setError('Correo o contraseña incorrectos.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-2">Bienvenidos a</h1>
        <h2 className="text-3xl font-bold text-center text-[--primary-color] mb-8">Pinolero CRM</h2>

        {/* Mensaje de Error */}
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 text-sm rounded-md text-center animate-pulse">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Correo</label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <EnvelopeIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input 
                type="email" 
                id="email" 
                name="email" 
                placeholder="ejemplo@empresa.com" 
                className="block w-full rounded-md border-gray-300 pl-10 py-2 shadow-sm focus:ring-[--primary-color] focus:border-[--primary-color] outline-none transition-all" 
                required 
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <LockClosedIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input 
                type="password" 
                id="password" 
                name="password" 
                placeholder="••••••••" 
                className="block w-full rounded-md border-gray-300 pl-10 py-2 shadow-sm focus:ring-[--primary-color] focus:border-[--primary-color] outline-none transition-all" 
                required 
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading} 
            className="w-full justify-center rounded-md bg-[--primary-color] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[--primary-hover-color] disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            {loading ? 'Validando...' : 'Iniciar Sesión'}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-gray-500">
          ¿No tienes cuenta?{' '}
          <Link href="/register" className="font-semibold text-[--primary-color] hover:underline">
            Regístrate aquí
          </Link>
        </p>
      </div>
    </main>
  );
}