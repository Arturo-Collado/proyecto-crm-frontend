
'use client';

import { useEffect, useState } from 'react';
import { BanknotesIcon, ClockIcon, UserGroupIcon, CubeIcon } from '@heroicons/react/24/solid';

import { getInvoices, getClients, getProducts, Invoice, Product } from '@/services/api';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend 
} from 'recharts';

export default function DashboardPage() {
  const [stats, setStats] = useState({ money: 0, clients: 0, products: 0, invoicesCount: 0 });
  const [salesData, setSalesData] = useState<any[]>([]);
  const [productData, setProductData] = useState<any[]>([]);

  const COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#ef4444'];

  useEffect(() => {
    const loadStats = async () => {
      const [inv, cli, prod] = await Promise.all([getInvoices(), getClients(), getProducts()]);
      
      
      const totalMoney = inv.reduce((acc: number, curr: Invoice) => acc + Number(curr.total), 0);
      
      setStats({
        money: totalMoney,
        clients: cli.length,
        products: prod.length,
        invoicesCount: inv.length
      });

      //  Gráfico de Ventas 
      const groupedByDate = inv.reduce((acc: Record<string, number>, curr: Invoice) => {
        const date = curr.date;
        acc[date] = (acc[date] || 0) + Number(curr.total);
        return acc;
      }, {});

      const sData = Object.keys(groupedByDate).map(date => ({ name: date, total: groupedByDate[date] }));
      setSalesData(sData);

      //  Gráfico de Productos 
      const pData = prod.map((p: Product, index: number) => ({
        name: p.name,
        value: Math.floor(Math.random() * 100) + 10 
      })).slice(0, 4); 
      
      setProductData(pData);
    };
    loadStats();
  }, []);

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-gray-800">Resumen del Negocio</h1>

      {/* KPIs */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center">
          <div className="bg-indigo-100 p-3 rounded-lg"><BanknotesIcon className="h-6 w-6 text-indigo-600" /></div>
          <div className="ml-4">
            <p className="text-xs font-medium text-gray-500 uppercase">Ingresos</p>
            <p className="text-2xl font-bold text-gray-900">${stats.money.toFixed(2)}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center">
          <div className="bg-emerald-100 p-3 rounded-lg"><UserGroupIcon className="h-6 w-6 text-emerald-600" /></div>
          <div className="ml-4">
             <p className="text-xs font-medium text-gray-500 uppercase">Clientes</p>
             <p className="text-2xl font-bold text-gray-900">{stats.clients}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center">
          <div className="bg-amber-100 p-3 rounded-lg"><CubeIcon className="h-6 w-6 text-amber-600" /></div>
          <div className="ml-4">
             <p className="text-xs font-medium text-gray-500 uppercase">Productos</p>
             <p className="text-2xl font-bold text-gray-900">{stats.products}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center">
           <div className="bg-rose-100 p-3 rounded-lg"><ClockIcon className="h-6 w-6 text-rose-600" /></div>
           <div className="ml-4">
              <p className="text-xs font-medium text-gray-500 uppercase">Facturas</p>
              <p className="text-2xl font-bold text-gray-900">{stats.invoicesCount}</p>
           </div>
        </div>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-80">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Tendencia de Ventas</h2>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={salesData}>
              <defs>
                <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" style={{ fontSize: '12px' }} />
              <YAxis style={{ fontSize: '12px' }} />
              <Tooltip />
              <Area type="monotone" dataKey="total" stroke="#4f46e5" fillOpacity={1} fill="url(#colorTotal)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-80">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Top Productos</h2>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={productData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {productData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend verticalAlign="bottom" height={36}/>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}