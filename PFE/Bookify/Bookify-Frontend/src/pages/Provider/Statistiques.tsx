import React, { useState } from 'react';
import { 
  TrendingUp, TrendingDown, DollarSign, Users, Calendar,
  Download, Filter, BarChart3, PieChart, LineChart,
  ChevronDown, Star, Clock, CheckCircle
} from 'lucide-react';
import Navbar from '../../components/Provider/Navbar';
import TopBar from '../../components/Provider/TopBar';
import Footer from '../../components/Provider/Footer';

type Period = 'week' | 'month' | 'year';

interface ServiceStat {
  name: string;
  count: number;
  revenue: number;
  percentage: number;
  color: string;
}

const Statistiques: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('statistiques');
  const [userName] = useState('Dr. Youssef');
  const [selectedPeriod, setSelectedPeriod] = useState<Period>('month');

  // KPIs data
  const kpis = {
    totalAppointments: { value: 247, change: 12.5, isPositive: true },
    acceptanceRate: { value: 92, change: 5.3, isPositive: true },
    revenue: { value: 67500, change: -3.2, isPositive: false },
    avgRating: { value: 4.8, change: 0.2, isPositive: true }
  };

  // Monthly revenue data (for line chart)
  const monthlyRevenue = [
    { month: 'Jan', value: 45000 },
    { month: 'Fév', value: 52000 },
    { month: 'Mar', value: 48000 },
    { month: 'Avr', value: 58000 },
    { month: 'Mai', value: 62000 },
    { month: 'Juin', value: 67500 },
  ];

  // Weekly appointments (for bar chart)
  const weeklyAppointments = [
    { day: 'Lun', value: 12 },
    { day: 'Mar', value: 15 },
    { day: 'Mer', value: 10 },
    { day: 'Jeu', value: 18 },
    { day: 'Ven', value: 14 },
    { day: 'Sam', value: 8 },
    { day: 'Dim', value: 5 },
  ];

  // Top services (for pie chart & table)
  const topServices: ServiceStat[] = [
    { name: 'Consultation générale', count: 98, revenue: 29400, percentage: 40, color: '#3b82f6' },
    { name: 'Suivi médical', count: 72, revenue: 21600, percentage: 29, color: '#10b981' },
    { name: 'Certificat médical', count: 45, revenue: 9000, percentage: 18, color: '#8b5cf6' },
    { name: 'Urgence', count: 20, revenue: 8000, percentage: 8, color: '#ef4444' },
    { name: 'Visite à domicile', count: 12, revenue: 7200, percentage: 5, color: '#f59e0b' },
  ];

  // Calculate max values for charts
  const maxRevenue = Math.max(...monthlyRevenue.map(d => d.value));
  const maxAppointments = Math.max(...weeklyAppointments.map(d => d.value));

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('fr-MA', { style: 'currency', currency: 'MAD' }).format(value);
  };

  return (
     <div className="min-h-screen bg-[#F4F7FE] dark:bg-dark-bg transition-colors duration-200">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        * { font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif; }
        @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(18px) } to { opacity: 1; transform: translateY(0) } }
        @keyframes slideRight { from { opacity: 0; transform: translateX(18px) } to { opacity: 1; transform: translateX(0) } }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
        .sidebar-overlay { animation: fadeIn .3s ease-out forwards; }
        .anim-up { animation: slideUp .45s cubic-bezier(.16, 1, .3, 1) both; }
        .anim-right { animation: slideRight .45s cubic-bezier(.16, 1, .3, 1) both; }
        .stat-card { transition: all 0.3s ease; }
        .stat-card:hover { transform: translateY(-4px); box-shadow: 0 12px 24px rgba(0,0,0,0.1); }
      `}</style>

      {isSidebarOpen && <div className="sidebar-overlay fixed inset-0 bg-black bg-opacity-50 z-40" onClick={()=>setIsSidebarOpen(false)}/>}
      <div className={`fixed left-0 top-0 h-full w-64 bg-white dark:bg-dark-surface transform transition-transform duration-300 z-50 ${isSidebarOpen?'translate-x-0':'-translate-x-full'}`}>
        <Navbar activeSection={activeSection} onSectionChange={s=>{setActiveSection(s);setIsSidebarOpen(false);}}/>
      </div>

      <main className={`min-h-screen transition-all duration-300 lg:${isSidebarOpen?'ml-64':'ml-0'}`}>
        <TopBar userName={userName} onMenuToggle={()=>setIsSidebarOpen(!isSidebarOpen)} isMobileMenuOpen={isSidebarOpen}/>

        <div className="p-4 sm:p-6 lg:p-8 space-y-6">

          {/* HEADER */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 anim-up">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-dark-text">Statistiques & Performance</h1>
              <p className="text-sm text-gray-500 dark:text-dark-muted mt-0.5">Analysez vos performances et revenus</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <select
                  value={selectedPeriod}
                  onChange={(e) => setSelectedPeriod(e.target.value as Period)}
                  className="appearance-none pl-4 pr-10 py-2.5 bg-white dark:bg-dark-surface border border-gray-200 dark:border-dark-border rounded-xl text-sm font-semibold text-gray-700 dark:text-dark-text outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                >
                  <option value="week">Cette semaine</option>
                  <option value="month">Ce mois</option>
                  <option value="year">Cette année</option>
                </select>
                <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
              </div>
              <button className="flex items-center gap-2 bg-[#0059B2] hover:bg-[#004a99] text-white px-4 py-2.5 rounded-xl font-semibold text-sm transition-all">
                <Download size={15} />
                Export
              </button>
            </div>
          </div>

          {/* KPI CARDS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 anim-up" style={{ animationDelay: '.05s' }}>
            
            {/* Total Appointments */}
            <div className="stat-card bg-white dark:bg-dark-surface rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-dark-border">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-500/15 rounded-xl flex items-center justify-center">
                  <Calendar className="text-blue-600 dark:text-blue-400" size={24} />
                </div>
                <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${
                  kpis.totalAppointments.isPositive ? 'bg-emerald-100 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-400' : 'bg-red-100 dark:bg-red-500/15 text-red-700 dark:text-red-400'
                }`}>
                  {kpis.totalAppointments.isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                  {kpis.totalAppointments.change}%
                </div>
              </div>
              <p className="text-xs text-gray-500 dark:text-dark-muted mb-1">Total Rendez-vous</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-dark-text">{kpis.totalAppointments.value}</p>
              <p className="text-xs text-gray-400 dark:text-dark-muted mt-2">vs. mois dernier</p>
            </div>

            {/* Acceptance Rate */}
            <div className="stat-card bg-white dark:bg-dark-surface rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-dark-border">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-500/15 rounded-xl flex items-center justify-center">
                  <CheckCircle className="text-emerald-600 dark:text-emerald-400" size={24} />
                </div>
                <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${
                  kpis.acceptanceRate.isPositive ? 'bg-emerald-100 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-400' : 'bg-red-100 dark:bg-red-500/15 text-red-700 dark:text-red-400'
                }`}>
                  {kpis.acceptanceRate.isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                  {kpis.acceptanceRate.change}%
                </div>
              </div>
              <p className="text-xs text-gray-500 dark:text-dark-muted mb-1">Taux d'acceptation</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-dark-text">{kpis.acceptanceRate.value}%</p>
              <p className="text-xs text-gray-400 dark:text-dark-muted mt-2">Très bon taux</p>
            </div>

            {/* Revenue */}
            <div className="stat-card bg-white dark:bg-dark-surface rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-dark-border">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-500/15 rounded-xl flex items-center justify-center">
                  <DollarSign className="text-purple-600 dark:text-purple-400" size={24} />
                </div>
                <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${
                  kpis.revenue.isPositive ? 'bg-emerald-100 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-400' : 'bg-red-100 dark:bg-red-500/15 text-red-700 dark:text-red-400'
                }`}>
                  {kpis.revenue.isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                  {Math.abs(kpis.revenue.change)}%
                </div>
              </div>
              <p className="text-xs text-gray-500 dark:text-dark-muted mb-1">Revenu Total</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-dark-text">{formatCurrency(kpis.revenue.value).split(',')[0]}</p>
              <p className="text-xs text-gray-400 dark:text-dark-muted mt-2">Ce mois</p>
            </div>

            {/* Average Rating */}
            <div className="stat-card bg-white dark:bg-dark-surface rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-dark-border">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-500/15 rounded-xl flex items-center justify-center">
                  <Star className="text-yellow-600 dark:text-yellow-400" size={24} />
                </div>
                <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${
                  kpis.avgRating.isPositive ? 'bg-emerald-100 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-400' : 'bg-red-100 dark:bg-red-500/15 text-red-700 dark:text-red-400'
                }`}>
                  {kpis.avgRating.isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                  {kpis.avgRating.change}
                </div>
              </div>
              <p className="text-xs text-gray-500 dark:text-dark-muted mb-1">Note Moyenne</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-dark-text">{kpis.avgRating.value}/5</p>
              <p className="text-xs text-gray-400 dark:text-dark-muted mt-2">156 avis</p>
            </div>
          </div>

          {/* CHARTS ROW */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* LINE CHART - Revenue Evolution */}
            <div className="lg:col-span-2 bg-white dark:bg-dark-surface rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-dark-border anim-up" style={{ animationDelay: '.1s' }}>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-dark-text flex items-center gap-2">
                    <LineChart size={20} className="text-blue-600 dark:text-blue-400" />
                    Évolution du Revenu
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-dark-muted mt-1">6 derniers mois</p>
                </div>
                <button className="p-2 hover:bg-gray-100 dark:hover:bg-dark-border rounded-lg transition-all">
                  <Filter size={18} className="text-gray-400" />
                </button>
              </div>

              {/* SVG Line Chart */}
              <div className="relative" style={{ height: '280px' }}>
                <svg viewBox="0 0 600 280" className="w-full h-full">
                  <defs>
                    <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.2"/>
                      <stop offset="100%" stopColor="#3b82f6" stopOpacity="0"/>
                    </linearGradient>
                  </defs>

                  {/* Grid lines */}
                  {[0, 0.25, 0.5, 0.75, 1].map((t, i) => (
                    <line
                      key={i}
                      x1="40" y1={40 + t * 200}
                      x2="580" y2={40 + t * 200}
                      stroke="#e5e7eb"
                      strokeWidth="1"
                      strokeDasharray="4 4"
                    />
                  ))}

                  {/* Area under line */}
                  <path
                    d={`M 40 ${240 - ((monthlyRevenue[0].value / maxRevenue) * 200)} ${
                      monthlyRevenue.map((d, i) => 
                        `L ${40 + (i / (monthlyRevenue.length - 1)) * 540} ${240 - ((d.value / maxRevenue) * 200)}`
                      ).join(' ')
                    } L 580 240 L 40 240 Z`}
                    fill="url(#revenueGradient)"
                  />

                  {/* Line */}
                  <path
                    d={`M 40 ${240 - ((monthlyRevenue[0].value / maxRevenue) * 200)} ${
                      monthlyRevenue.map((d, i) => 
                        `L ${40 + (i / (monthlyRevenue.length - 1)) * 540} ${240 - ((d.value / maxRevenue) * 200)}`
                      ).join(' ')
                    }`}
                    stroke="#3b82f6"
                    strokeWidth="3"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />

                  {/* Dots */}
                  {monthlyRevenue.map((d, i) => (
                    <circle
                      key={i}
                      cx={40 + (i / (monthlyRevenue.length - 1)) * 540}
                      cy={240 - ((d.value / maxRevenue) * 200)}
                      r="5"
                      fill="white"
                      stroke="#3b82f6"
                      strokeWidth="3"
                    />
                  ))}

                  {/* X-axis labels */}
                  {monthlyRevenue.map((d, i) => (
                    <text
                      key={i}
                      x={40 + (i / (monthlyRevenue.length - 1)) * 540}
                      y="265"
                      textAnchor="middle"
                      fill="#9ca3af"
                      fontSize="12"
                    >
                      {d.month}
                    </text>
                  ))}

                  {/* Y-axis labels */}
                  {[0, 25, 50, 75, 100].map((v, i) => (
                    <text
                      key={i}
                      x="30"
                      y={240 - (v / 100) * 200 + 4}
                      textAnchor="end"
                      fill="#9ca3af"
                      fontSize="11"
                    >
                      {Math.round((maxRevenue * v / 100) / 1000)}k
                    </text>
                  ))}
                </svg>
              </div>
            </div>

            {/* PIE CHART - Services Distribution */}
            <div className="bg-white dark:bg-dark-surface rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-dark-border anim-up" style={{ animationDelay: '.15s' }}>
              <h3 className="text-lg font-bold text-gray-900 dark:text-dark-text flex items-center gap-2 mb-6">
                <PieChart size={20} className="text-purple-600 dark:text-purple-400" />
                Répartition Services
              </h3>

              {/* SVG Donut Chart */}
              <div className="flex items-center justify-center mb-6">
                <svg viewBox="0 0 200 200" className="w-48 h-48">
                  <defs>
                    {topServices.map((service, i) => (
                      <linearGradient key={i} id={`gradient-${i}`} x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor={service.color} stopOpacity="1"/>
                        <stop offset="100%" stopColor={service.color} stopOpacity="0.7"/>
                      </linearGradient>
                    ))}
                  </defs>
                  {(() => {
                    let currentAngle = -90;
                    return topServices.map((service, i) => {
                      const angle = (service.percentage / 100) * 360;
                      const startAngle = currentAngle;
                      const endAngle = currentAngle + angle;
                      currentAngle = endAngle;

                      const startRad = (startAngle * Math.PI) / 180;
                      const endRad = (endAngle * Math.PI) / 180;

                      const x1 = 100 + 70 * Math.cos(startRad);
                      const y1 = 100 + 70 * Math.sin(startRad);
                      const x2 = 100 + 70 * Math.cos(endRad);
                      const y2 = 100 + 70 * Math.sin(endRad);

                      const largeArc = angle > 180 ? 1 : 0;

                      return (
                        <path
                          key={i}
                          d={`M 100 100 L ${x1} ${y1} A 70 70 0 ${largeArc} 1 ${x2} ${y2} Z`}
                          fill={`url(#gradient-${i})`}
                          stroke="white"
                          strokeWidth="2"
                        />
                      );
                    });
                  })()}
                  {/* Center hole */}
                  <circle cx="100" cy="100" r="45" fill="white" className="dark:fill-dark-surface" />
                  <text x="100" y="95" textAnchor="middle" fontSize="20" fontWeight="bold" fill="#1f2937" className="dark:fill-dark-text">
                    {topServices.reduce((sum, s) => sum + s.count, 0)}
                  </text>
                  <text x="100" y="110" textAnchor="middle" fontSize="11" fill="#9ca3af">
                    Total
                  </text>
                </svg>
              </div>

              {/* Legend */}
              <div className="space-y-2">
                {topServices.slice(0, 5).map((service, i) => (
                  <div key={i} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: service.color }} />
                      <span className="text-gray-600 dark:text-dark-muted truncate max-w-[120px]">{service.name}</span>
                    </div>
                    <span className="font-bold text-gray-900 dark:text-dark-text">{service.percentage}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* BOTTOM ROW */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* BAR CHART - Weekly Appointments */}
            <div className="bg-white dark:bg-dark-surface rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-dark-border anim-up" style={{ animationDelay: '.2s' }}>
              <h3 className="text-lg font-bold text-gray-900 dark:text-dark-text flex items-center gap-2 mb-6">
                <BarChart3 size={20} className="text-emerald-600 dark:text-emerald-400" />
                Rendez-vous par Jour
              </h3>

              {/* SVG Bar Chart */}
              <div className="relative" style={{ height: '220px' }}>
                <svg viewBox="0 0 400 220" className="w-full h-full">
                  {/* Grid */}
                  {[0, 0.25, 0.5, 0.75, 1].map((t, i) => (
                    <line
                      key={i}
                      x1="40" y1={20 + t * 160}
                      x2="380" y2={20 + t * 160}
                      stroke="#e5e7eb"
                      strokeWidth="1"
                      strokeDasharray="4 4"
                    />
                  ))}

                  {/* Bars */}
                  {weeklyAppointments.map((d, i) => {
                    const barHeight = (d.value / maxAppointments) * 160;
                    const x = 60 + i * 45;
                    const y = 180 - barHeight;
                    const isHighest = d.value === maxAppointments;
                    
                    return (
                      <g key={i}>
                        <rect
                          x={x}
                          y={y}
                          width="35"
                          height={barHeight}
                          rx="4"
                          fill={isHighest ? '#10b981' : '#3b82f6'}
                          opacity="0.8"
                        />
                        <text
                          x={x + 17.5}
                          y={y - 8}
                          textAnchor="middle"
                          fill="#1f2937"
                          fontSize="12"
                          fontWeight="bold"
                          className="dark:fill-dark-text"
                        >
                          {d.value}
                        </text>
                        <text
                          x={x + 17.5}
                          y="200"
                          textAnchor="middle"
                          fill="#9ca3af"
                          fontSize="12"
                        >
                          {d.day}
                        </text>
                      </g>
                    );
                  })}
                </svg>
              </div>
            </div>

            {/* TOP SERVICES TABLE */}
            <div className="bg-white dark:bg-dark-surface rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-dark-border anim-up" style={{ animationDelay: '.25s' }}>
              <h3 className="text-lg font-bold text-gray-900 dark:text-dark-text flex items-center gap-2 mb-6">
                <Users size={20} className="text-blue-600 dark:text-blue-400" />
                Top Services
              </h3>

              <div className="space-y-3">
                {topServices.map((service, i) => (
                  <div key={i} className="flex items-center gap-4 p-3 bg-gray-50 dark:bg-dark-bg rounded-xl hover:bg-gray-100 dark:hover:bg-dark-border transition-all">
                    <div className="flex items-center justify-center w-8 h-8 rounded-lg font-bold text-sm" style={{ backgroundColor: service.color + '20', color: service.color }}>
                      #{i + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm text-gray-900 dark:text-dark-text truncate">{service.name}</p>
                      <p className="text-xs text-gray-500 dark:text-dark-muted">{service.count} consultations</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-sm text-gray-900 dark:text-dark-text">{formatCurrency(service.revenue).split(',')[0]}</p>
                      <p className="text-xs text-gray-400 dark:text-dark-muted">{service.percentage}%</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>

        <Footer />
      </main>
    </div>
  );
};

export default Statistiques;