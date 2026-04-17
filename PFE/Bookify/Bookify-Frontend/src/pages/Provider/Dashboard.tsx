import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Provider/Navbar';
import TopBar from '../../components/Provider/TopBar';
import Footer from '../../components/Provider/Footer';
import {
  BarChart2, Users, Star, Calendar, TrendingUp,
  MoreHorizontal, AlignJustify, CheckCircle2, XCircle, Loader2, AlertCircle
} from 'lucide-react';
import {
  getDashboardData,
  acceptRequest,
  refuseRequest,
  type DashboardData,
  type AreaChartData,
  type BarChartData,
  type PieChartData
} from '../../services/Provider/Dashboardservice';

// ─── CALENDAR ────────────────────────────────────────────────────────────────
const CAL_DAYS  = ["Mo","Tu","We","Th","Fr","Sa","Su"];
const CAL_WEEKS = [
  [28,29,30,31, 1, 2, 3],
  [ 4, 5, 6, 7, 8, 9,10],
  [11,12,13,14,15,16,17],
  [18,19,20,21,22,23,24],
  [25,26,27,28,29,30, 1],
  [ 2, 3, 4, 5, 6, 7, 8],
];
const CAL_RANGE = [27,28,29,30];

// ─── KPI CARD ────────────────────────────────────────────────────────────────
interface KpiCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  loading?: boolean;
}
const KpiCard: React.FC<KpiCardProps> = ({ icon, label, value, loading }) => (
  <div className="rounded-2xl p-4 flex items-center gap-3 shadow-sm bg-white dark:bg-dark-surface">
    <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 bg-blue-50 dark:bg-blue-900/20">
      {icon}
    </div>
    <div>
      <p className="text-xs mb-0.5 text-gray-400 dark:text-gray-500">{label}</p>
      {loading ? (
        <div className="h-6 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
      ) : (
        <p className="text-xl font-extrabold leading-none text-[#0f2a5e] dark:text-white">{value}</p>
      )}
    </div>
  </div>
);

// ─── CARD WRAPPER ─────────────────────────────────────────────────────────────
const Card: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = "" }) => (
  <div className={`bg-white dark:bg-dark-surface rounded-2xl shadow-sm p-5 ${className}`}>
    {children}
  </div>
);

// ─── SVG AREA CHART ──────────────────────────────────────────────────────────
const AreaChartSVG: React.FC<{ data: AreaChartData[] }> = ({ data }) => {
  const W = 340, H = 120, pad = { t: 10, r: 10, b: 24, l: 28 };
  const iW = W - pad.l - pad.r;
  const iH = H - pad.t - pad.b;
  const maxV = Math.max(...data.map(d => Math.max(d.v1, d.v2))) + 2;
  
  const pts = (key: 'v1' | 'v2') =>
    data.map((d, i) => ({
      x: pad.l + (i / (data.length - 1)) * iW,
      y: pad.t + iH - (d[key] / maxV) * iH,
    }));
  
  const toPath = (pts: {x:number;y:number}[]) =>
    pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');
  
  const toArea = (pts: {x:number;y:number}[]) =>
    `${toPath(pts)} L${(pad.l+iW).toFixed(1)},${(pad.t+iH).toFixed(1)} L${pad.l},${(pad.t+iH).toFixed(1)} Z`;

  const p1 = pts('v1'), p2 = pts('v2');
  const lastP1 = p1[p1.length - 1];
  const maxIdx = data.reduce((maxI, d, i, arr) => d.v1 > arr[maxI].v1 ? i : maxI, 0);
  const maxP1 = p1[maxIdx];

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height: 130 }}>
      <defs>
        <linearGradient id="svgG1" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#1e3a8a" stopOpacity="0.25"/>
          <stop offset="100%" stopColor="#1e3a8a" stopOpacity="0"/>
        </linearGradient>
        <linearGradient id="svgG2" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#93c5fd" stopOpacity="0.3"/>
          <stop offset="100%" stopColor="#93c5fd" stopOpacity="0"/>
        </linearGradient>
      </defs>

      {[0,0.25,0.5,0.75,1].map((t,i) => (
        <line key={i}
          x1={pad.l} y1={(pad.t + t*iH).toFixed(1)}
          x2={pad.l+iW} y2={(pad.t + t*iH).toFixed(1)}
          stroke="#f3f4f6" strokeWidth="1"
        />
      ))}

      <path d={toArea(p2)} fill="url(#svgG2)"/>
      <path d={toArea(p1)} fill="url(#svgG1)"/>

      <path d={toPath(p2)} fill="none" stroke="#93c5fd" strokeWidth="2" strokeLinejoin="round"/>
      <path d={toPath(p1)} fill="none" stroke="#1e3a8a" strokeWidth="2.5" strokeLinejoin="round"/>

      <rect x={maxP1.x-14} y={maxP1.y-22} width="28" height="18" rx="5" fill="#1e3a8a"/>
      <text x={maxP1.x} y={maxP1.y-9} textAnchor="middle" fill="white" fontSize="9" fontWeight="bold">
        {data[maxIdx].v1}
      </text>
      <polygon points={`${maxP1.x-4},${maxP1.y-4} ${maxP1.x+4},${maxP1.y-4} ${maxP1.x},${maxP1.y}`} fill="#1e3a8a"/>

      <circle cx={lastP1.x} cy={lastP1.y} r="4" fill="white" stroke="#1e3a8a" strokeWidth="2"/>

      {data.map((d, i) => (
        <text key={i}
          x={(pad.l + (i/(data.length-1))*iW).toFixed(1)}
          y={H - 6}
          textAnchor="middle" fill="#9ca3af" fontSize="9"
        >{d.month}</text>
      ))}

      {[0, Math.round(maxV/2), maxV].map((v,i) => (
        <text key={i}
          x={pad.l - 4}
          y={(pad.t + iH - (v/maxV)*iH + 3).toFixed(1)}
          textAnchor="end" fill="#9ca3af" fontSize="9"
        >{v}</text>
      ))}
    </svg>
  );
};

// ─── SVG BAR CHART ───────────────────────────────────────────────────────────
const BarChartSVG: React.FC<{ data: BarChartData[] }> = ({ data }) => {
  const W = 280, H = 110, pad = { t: 5, r: 5, b: 20, l: 24 };
  const iW = W - pad.l - pad.r;
  const iH = H - pad.t - pad.b;
  const maxV = Math.max(...data.map(d => d.value)) + 5;
  const barW = iW / data.length;
  const maxIdx = data.reduce((maxI, d, i, arr) => d.value > arr[maxI].value ? i : maxI, 0);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height: 110 }}>
      {data.map((d, i) => {
        const bH = (d.value / maxV) * iH;
        const x  = pad.l + i * barW + barW * 0.2;
        const y  = pad.t + iH - bH;
        const fill = i === maxIdx ? "#1e3a8a" : i < maxIdx ? "#93c5fd" : "#bfdbfe";
        return (
          <g key={i}>
            <rect x={x} y={y} width={barW*0.6} height={bH} rx="3" fill={fill}/>
            <text x={x + barW*0.3} y={H-5} textAnchor="middle" fill="#9ca3af" fontSize="9">{d.day}</text>
          </g>
        );
      })}
      {[0,0.5,1].map((t,i)=>(
        <text key={i} x={pad.l-3} y={(pad.t + (1-t)*iH + 3).toFixed(1)} textAnchor="end" fill="#9ca3af" fontSize="9">
          {Math.round(t*maxV)}
        </text>
      ))}
    </svg>
  );
};

// ─── SVG DONUT CHART ─────────────────────────────────────────────────────────
const DonutChartSVG: React.FC<{ data: PieChartData[] }> = ({ data }) => {
  const cx = 70, cy = 65, r = 48, ir = 30;
  let angle = -Math.PI / 2;
  const total = data.reduce((sum, d) => sum + d.value, 0);
  
  const arcs = data.map(d => {
    const sweep = (d.value / total) * 2 * Math.PI;
    const x1 = cx + r * Math.cos(angle);
    const y1 = cy + r * Math.sin(angle);
    angle += sweep;
    const x2 = cx + r * Math.cos(angle);
    const y2 = cy + r * Math.sin(angle);
    const ix1 = cx + ir * Math.cos(angle);
    const iy1 = cy + ir * Math.sin(angle);
    const ix2 = cx + ir * Math.cos(angle - sweep);
    const iy2 = cy + ir * Math.sin(angle - sweep);
    const large = sweep > Math.PI ? 1 : 0;
    return {
      d: `M${x1.toFixed(2)},${y1.toFixed(2)} A${r},${r} 0 ${large},1 ${x2.toFixed(2)},${y2.toFixed(2)} L${ix1.toFixed(2)},${iy1.toFixed(2)} A${ir},${ir} 0 ${large},0 ${ix2.toFixed(2)},${iy2.toFixed(2)} Z`,
      color: d.color,
    };
  });

  return (
    <svg viewBox="0 0 140 130" className="w-full" style={{ height: 130 }}>
      {arcs.map((arc, i) => (
        <path key={i} d={arc.d} fill={arc.color} stroke="white" strokeWidth="2"/>
      ))}
    </svg>
  );
};

// ─── LOADING SKELETON ────────────────────────────────────────────────────────
const LoadingSkeleton: React.FC = () => (
  <div className="animate-pulse">
    <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded-2xl" />
  </div>
);

// ─── ERROR MESSAGE ───────────────────────────────────────────────────────────
const ErrorMessage: React.FC<{ message: string; onRetry?: () => void }> = ({ message, onRetry }) => (
  <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-4 flex items-start gap-3">
    <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
    <div className="flex-1">
      <p className="text-sm font-semibold text-red-800 dark:text-red-200">{message}</p>
      {onRetry && (
        <button 
          onClick={onRetry}
          className="mt-2 text-xs font-semibold text-red-600 dark:text-red-400 hover:underline"
        >
          Réessayer
        </button>
      )}
    </div>
  </div>
);

// ─── MAIN DASHBOARD ──────────────────────────────────────────────────────────
const Dashboard: React.FC = () => {
  const [userName, setUserName] = useState('');
  const [activeSection, setActiveSection] = useState<string>('dashboardp');
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);

  // Data state
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<number | null>(null);

  // Fetch dashboard data
  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getDashboardData();
      setDashboardData(data);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Erreur lors du chargement des données');
      console.error('Dashboard error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    
    // Get user name
    const user = localStorage.getItem('provider');
    if (user) {
      const parsed = JSON.parse(user);
      setUserName(parsed.nomComplet || parsed.nom || 'Dr. Youssef');
    }
  }, []);

  // Handle accept request
  const handleAccept = async (requestId: number) => {
    setActionLoading(requestId);
    try {
      await acceptRequest(requestId);
      // Refresh data
      await fetchData();
      alert('Demande acceptée avec succès!');
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Erreur lors de l\'acceptation');
    } finally {
      setActionLoading(null);
    }
  };

  // Handle refuse request
  const handleRefuse = async (requestId: number) => {
    setActionLoading(requestId);
    try {
      await refuseRequest(requestId);
      // Refresh data
      await fetchData();
      alert('Demande refusée');
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Erreur lors du refus');
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F7FE] dark:bg-dark-bg transition-colors duration-200">
      {isSidebarOpen && <div className="sidebar-overlay fixed inset-0 bg-black bg-opacity-50 z-40" onClick={()=>setIsSidebarOpen(false)}/>}
      <div className={`fixed left-0 top-0 h-full w-64 bg-white dark:bg-dark-surface transform transition-transform duration-300 z-50 ${isSidebarOpen?'translate-x-0':'-translate-x-full'}`}>
        <Navbar activeSection={activeSection} onSectionChange={s=>{setActiveSection(s);setIsSidebarOpen(false);}}/>
      </div>

      <main className={`min-h-screen transition-all duration-300 lg:${isSidebarOpen?'ml-64':'ml-0'}`}>
        <TopBar userName={userName} onMenuToggle={()=>setIsSidebarOpen(!isSidebarOpen)} isMobileMenuOpen={isSidebarOpen}/>

        <div className="p-4 sm:p-6 lg:p-8 space-y-6">

          <h1 className="text-xl md:text-2xl font-extrabold text-[#0f2a5e] dark:text-white">
            Prestataires Dashboard
          </h1>

          {/* Error Message */}
          {error && <ErrorMessage message={error} onRetry={fetchData} />}

          {/* ── KPI CARDS ── */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <KpiCard 
              label="Vues de profil" 
              value={dashboardData?.stats.profileViews.toString() || '0'}
              loading={loading}
              icon={<BarChart2 className="w-5 h-5 text-blue-600 dark:text-blue-400"/>}
            />
            <KpiCard 
              label="Votre Note" 
              value={dashboardData?.stats.averageRating.toFixed(1) || '0.0'}
              loading={loading}
              icon={<Star className="w-5 h-5 text-blue-600 dark:text-blue-400"/>}
            />
            <KpiCard 
              label="Total Clients" 
              value={dashboardData?.stats.totalClients.toString() || '0'}
              loading={loading}
              icon={<Users className="w-5 h-5 text-blue-600 dark:text-blue-400"/>}
            />
            <KpiCard 
              label="Total Rendez-vous" 
              value={dashboardData?.stats.totalAppointments.toString() || '0'}
              loading={loading}
              icon={<Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400"/>}
            />
          </div>

          {/* ── ROW 2: Area | Pending | Calendar ── */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

            {/* Area Chart */}
            <Card className="lg:col-span-1">
              {loading ? (
                <LoadingSkeleton />
              ) : dashboardData?.areaChart ? (
                <>
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="text-xs text-gray-400 dark:text-gray-500">Total Visiteur de profil</p>
                      <h2 className="text-lg font-extrabold text-[#0f2a5e] dark:text-white">Rendez-vous</h2>
                      <p className="text-xs font-semibold text-green-500 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block"/>
                        On track <span className="text-gray-400 font-normal ml-1">↗ +2.45%</span>
                      </p>
                    </div>
                    <div className="flex items-center gap-1.5 bg-gray-50 dark:bg-gray-800 rounded-lg px-3 py-1.5 text-xs text-gray-500">
                      <Calendar className="w-3.5 h-3.5"/>
                      Ce mois
                    </div>
                  </div>
                  <AreaChartSVG data={dashboardData.areaChart} />
                </>
              ) : null}
            </Card>

            {/* Pending */}
            <Card>
              {loading ? (
                <LoadingSkeleton />
              ) : (
                <>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-sm font-bold text-[#0f2a5e] dark:text-white">
                      Demandes en attente ({dashboardData?.pendingRequests.length || 0})
                    </h3>
                    <MoreHorizontal className="w-4 h-4 text-gray-400"/>
                  </div>
                  {dashboardData?.pendingRequests.length === 0 ? (
                    <p className="text-sm text-gray-400 text-center py-8">Aucune demande en attente</p>
                  ) : (
                    dashboardData?.pendingRequests.map((req, i) => (
                      <div key={req.id} className={`flex justify-between items-center py-2.5 ${i < (dashboardData.pendingRequests.length-1) ? 'border-b border-gray-50 dark:border-gray-800' : ''}`}>
                        <span className="text-sm text-gray-700 dark:text-gray-300">{req.clientName}</span>
                        <AlignJustify className="w-3.5 h-3.5 text-gray-300"/>
                      </div>
                    ))
                  )}
                </>
              )}
            </Card>

            {/* Calendar */}
            <Card>
              <div className="flex justify-between items-center mb-3">
                <button className="text-xs font-semibold text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded-lg px-3 py-1.5">Janvier ▾</button>
                <button className="text-xs font-semibold text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded-lg px-3 py-1.5">2026 ▾</button>
              </div>
              <div className="grid grid-cols-7 mb-1">
                {CAL_DAYS.map(d => (
                  <div key={d} className="text-center text-[10px] font-semibold text-gray-400 py-1">{d}</div>
                ))}
              </div>
              {CAL_WEEKS.map((week, wi) => (
                <div key={wi} className="grid grid-cols-7">
                  {week.map((day, di) => {
                    const isToday = day === 30 && wi === 4;
                    const inRange = CAL_RANGE.includes(day) && wi >= 3 && wi <= 4 && !isToday;
                    const isGray  = (wi === 0 && day > 10) || (wi === 5 && day < 10);
                    return (
                      <div key={di} className={`text-center text-[11px] py-1.5 rounded-md cursor-pointer
                        ${isToday ? 'bg-blue-600 text-white font-bold' : ''}
                        ${inRange ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' : ''}
                        ${isGray  ? 'text-gray-300 dark:text-gray-600' : !isToday && !inRange ? 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800' : ''}
                      `}>{day}</div>
                    );
                  })}
                </div>
              ))}
            </Card>
          </div>

          {/* ── ROW 3: Bar | Pie | Upcoming ── */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

            {/* Bar */}
            <Card>
              {loading ? (
                <LoadingSkeleton />
              ) : dashboardData?.barChart ? (
                <>
                  <div className="mb-1">
                    <p className="text-xs text-gray-400 dark:text-gray-500">Rendez-vous cette semaine</p>
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-extrabold text-[#0f2a5e] dark:text-white">
                        {dashboardData.barChart.reduce((sum, d) => sum + d.value, 0)}
                      </span>
                      <span className="text-xs font-semibold text-green-500 flex items-center gap-0.5">
                        <TrendingUp className="w-3 h-3"/> +34.54%
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 dark:text-gray-500">Clients</p>
                  </div>
                  <BarChartSVG data={dashboardData.barChart} />
                </>
              ) : null}
            </Card>

            {/* Pie */}
            <Card>
              {loading ? (
                <LoadingSkeleton />
              ) : dashboardData?.pieChart ? (
                <>
                  <div className="flex justify-between mb-1">
                    <h3 className="text-sm font-bold text-[#0f2a5e] dark:text-white">Taux d'acceptation</h3>
                    <span className="text-xs text-gray-400">Mensuel ▾</span>
                  </div>
                  <DonutChartSVG data={dashboardData.pieChart} />
                  <div className="flex justify-center gap-3 mt-1 flex-wrap">
                    {dashboardData.pieChart.map((d, i) => (
                      <div key={i} className="flex items-center gap-1.5 text-xs">
                        <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: d.color }}/>
                        <span className="text-gray-500 dark:text-gray-400">{d.name}</span>
                        <span className="font-bold text-[#0f2a5e] dark:text-white">{d.value}%</span>
                      </div>
                    ))}
                  </div>
                </>
              ) : null}
            </Card>

            {/* Upcoming */}
            <Card>
              {loading ? (
                <LoadingSkeleton />
              ) : (
                <>
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-sm font-bold text-[#0f2a5e] dark:text-white">Prochains rendez-vous</h3>
                    <MoreHorizontal className="w-4 h-4 text-gray-400"/>
                  </div>
                  {dashboardData?.upcomingAppointments.length === 0 ? (
                    <p className="text-sm text-gray-400 text-center py-8">Aucun rendez-vous à venir</p>
                  ) : (
                    <>
                      <div className="grid grid-cols-4 gap-2 pb-2 border-b border-gray-50 dark:border-gray-800">
                        {["Nom","Date","Heure","Service"].map(h => (
                          <p key={h} className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">{h}</p>
                        ))}
                      </div>
                      {dashboardData?.upcomingAppointments.map((appt) => (
                        <div key={appt.id} className="grid grid-cols-4 gap-2 py-2 border-b border-gray-50 dark:border-gray-800 last:border-0 items-center">
                          <span className="text-xs font-semibold text-gray-800 dark:text-gray-200 truncate">{appt.name}</span>
                          <span className="text-[11px] text-gray-500 dark:text-gray-400">{appt.date}</span>
                          <span className="text-[11px] text-gray-500 dark:text-gray-400">{appt.time}</span>
                          <span className="text-[11px] text-gray-500 dark:text-gray-400 truncate">{appt.service}</span>
                        </div>
                      ))}
                    </>
                  )}
                </>
              )}
            </Card>
          </div>

          {/* ── RECENT REQUESTS TABLE ── */}
          <Card>
            {loading ? (
              <LoadingSkeleton />
            ) : (
              <>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-base font-bold text-[#0f2a5e] dark:text-white">Demandes récentes</h3>
                  <MoreHorizontal className="w-4 h-4 text-gray-400"/>
                </div>
                {dashboardData?.recentRequests.length === 0 ? (
                  <p className="text-sm text-gray-400 text-center py-8">Aucune demande récente</p>
                ) : (
                  <>
                    <div className="grid grid-cols-4 gap-4 pb-3 border-b border-gray-100 dark:border-gray-800">
                      {["NAME","DATE","SERVICE","ACTION"].map(h => (
                        <p key={h} className="text-[11px] font-bold text-gray-400 uppercase tracking-wide">{h}</p>
                      ))}
                    </div>
                    {dashboardData?.recentRequests.map((req) => (
                      <div key={req.id} className="grid grid-cols-4 gap-4 py-3.5 items-center border-b border-gray-50 dark:border-gray-800 last:border-0">
                        <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">{req.name}</span>
                        <span className="text-sm text-gray-500 dark:text-gray-400">{req.date}</span>
                        <span className="text-sm text-gray-500 dark:text-gray-400">{req.service}</span>
                        <div className="flex gap-2">
                          {req.status === 'pending' ? (
                            <>
                              <button 
                                onClick={() => handleAccept(req.id)}
                                disabled={actionLoading === req.id}
                                className="flex items-center gap-1 bg-green-600 hover:bg-green-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                {actionLoading === req.id ? (
                                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                ) : (
                                  <CheckCircle2 className="w-3.5 h-3.5" />
                                )}
                                Accepter
                              </button>
                              <button 
                                onClick={() => handleRefuse(req.id)}
                                disabled={actionLoading === req.id}
                                className="flex items-center gap-1 bg-red-500 hover:bg-red-600 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                {actionLoading === req.id ? (
                                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                ) : (
                                  <XCircle className="w-3.5 h-3.5" />
                                )}
                                Refuser
                              </button>
                            </>
                          ) : (
                            <span className={`text-xs font-semibold px-3 py-1.5 rounded-lg ${
                              req.status === 'accepted' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                            }`}>
                              {req.status === 'accepted' ? 'Accepté' : 'Refusé'}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </>
                )}
              </>
            )}
          </Card>

        </div>

        <Footer/>
      </main>
    </div>
  );
};

export default Dashboard;