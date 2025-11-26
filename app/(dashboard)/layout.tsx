
import { 
  HomeIcon, 
  UsersIcon, 
  DocumentTextIcon, 
  ArrowRightOnRectangleIcon, 
  CubeIcon, 
  Cog6ToothIcon 
} from '@heroicons/react/24/solid';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-gray-100">

      {/* Barra Lateral */}
      <aside className="w-64 bg-gray-800 text-white flex flex-col">
        <div className="h-16 flex items-center justify-center text-xl font-bold border-b border-gray-700">
          Pinolero CRM
        </div>

        <nav className="flex-1 px-4 py-4 space-y-2">
          {/* Dashboard */}
          <a href="/dashboard" className="flex items-center px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white rounded-md transition-colors">
            <HomeIcon className="h-5 w-5 mr-3" />
            Dashboard
          </a>
          
          {/* Clientes */}
          <a href="/clients" className="flex items-center px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white rounded-md transition-colors">
            <UsersIcon className="h-5 w-5 mr-3" />
            Clientes
          </a>

          {/* Inventario */}
          <a href="/products" className="flex items-center px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white rounded-md transition-colors">
            <CubeIcon className="h-5 w-5 mr-3" />
            Inventario
          </a>

          {/* Facturas */}
          <a href="/invoices" className="flex items-center px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white rounded-md transition-colors">
            <DocumentTextIcon className="h-5 w-5 mr-3" />
            Facturas
          </a>

          {/* Configuración (Nuevo) */}
          <a href="/settings" className="flex items-center px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white rounded-md transition-colors">
            <Cog6ToothIcon className="h-5 w-5 mr-3" />
            Configuración
          </a>
        </nav>

        {/* Botón Cerrar Sesión */}
        <div className='p-4 border-t border-gray-700'>
          <a href="/" className="flex items-center px-4 py-2 text-gray-300 hover:bg-red-600 hover:text-white rounded-md transition-colors">
            <ArrowRightOnRectangleIcon className="h-5 w-5 mr-3" />
            Cerrar Sesión
          </a>
        </div>
      </aside>

      {/* Contenido Principal */}
      <main className="flex-1 p-8 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}