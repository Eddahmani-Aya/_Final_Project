import React, { useEffect, useState } from 'react';
import { Calendar, Clock, Search, Filter, ChevronRight, X, Check, AlertCircle, Phone, User, MessageSquare, ArrowRight, Loader2 } from 'lucide-react';
import Navbar from '../../components/Provider/Navbar';
import TopBar from '../../components/Provider/TopBar';
import Footer from '../../components/Provider/Footer';
import { useNavigate } from 'react-router-dom';
import { 
  getAllDemandes, 
  getDemandesStats,
  type Demande,
  type Status 
} from '../../services/Provider/DemandesService';

type Tab = 'all' | 'pending' | 'accepted' | 'refused';

const CFG = {
  pending:  { label: 'En attente', bg: 'bg-yellow-100 dark:bg-yellow-500/15', text: 'text-yellow-700 dark:text-yellow-400', dot: 'bg-yellow-500', Icon: Clock },
  accepted: { label: 'Accepté',    bg: 'bg-emerald-100 dark:bg-emerald-500/15', text: 'text-emerald-700 dark:text-emerald-400', dot: 'bg-emerald-500', Icon: Check },
  refused:  { label: 'Refusé',     bg: 'bg-red-100 dark:bg-red-500/15', text: 'text-red-700 dark:text-red-400', dot: 'bg-red-500', Icon: X },
};

const TABS: { id: Tab; label: string }[] = [
  { id: 'all', label: 'Toutes' },
  { id: 'pending', label: 'En attente' },
  { id: 'accepted', label: 'Acceptées' },
  { id: 'refused', label: 'Refusées' }
];

const ListeDesDemandes: React.FC = () => {
  const navigate = useNavigate();
    const [activeSection, setActiveSection] = useState<string>('listeDesDemandes');
    const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [userName, setUserName] = useState('');
  const [activeTab, setActiveTab] = useState<Tab>('all');
  const [search, setSearch] = useState('');
  const [selectedId, setSelectedId] = useState<number | null>(null);

  // Data state
  const [demandes, setDemandes] = useState<Demande[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    accepted: 0,
    refused: 0
  });

  useEffect(() => {
    const s = localStorage.getItem('provider');
    if (s) {
      try {
        const u = JSON.parse(s);
        setUserName(u.nom || u.nomComplet || 'Dr. Youssef');
      } catch (e) {}
    } else {
      setUserName('Dr. Youssef');
    }
  }, []);

  // Fetch data
  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [demandesData, statsData] = await Promise.all([
        getAllDemandes(),
        getDemandesStats()
      ]);
      setDemandes(demandesData);
      setStats(statsData);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Erreur lors du chargement des demandes');
      console.error('Error loading demandes:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Filter demandes
  const filtered = demandes.filter(d => {
    const matchTab =
      activeTab === 'all' ? true :
      activeTab === 'pending' ? d.status === 'pending' :
      activeTab === 'accepted' ? d.status === 'accepted' :
      d.status === 'refused';
    const q = search.toLowerCase();
    return matchTab && (d.clientName.toLowerCase().includes(q) || d.service.toLowerCase().includes(q));
  });

  const urgentDemandes = demandes.filter(d => d.status === 'pending' && d.isNew).slice(0, 3);

  // Loading skeleton
  const LoadingSkeleton = () => (
    <div className="space-y-4">
      {[1, 2, 3].map(i => (
        <div key={i} className="bg-white dark:bg-dark-surface rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-dark-border animate-pulse">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3" />
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  // Error message
  const ErrorMessage = () => (
    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-4 flex items-start gap-3">
      <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
      <div className="flex-1">
        <p className="text-sm font-semibold text-red-800 dark:text-red-200">{error}</p>
        <button 
          onClick={fetchData}
          className="mt-2 text-xs font-semibold text-red-600 dark:text-red-400 hover:underline"
        >
          Réessayer
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F4F7FE] dark:bg-dark-bg transition-colors duration-200">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        * { font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif; }
        @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(18px) } to { opacity: 1; transform: translateY(0) } }
        @keyframes slideRight { from { opacity: 0; transform: translateX(18px) } to { opacity: 1; transform: translateX(0) } }
        .sidebar-overlay { animation: fadeIn .3s ease-out forwards; }
        .anim-up { animation: slideUp .45s cubic-bezier(.16, 1, .3, 1) both; }
        .anim-right { animation: slideRight .45s cubic-bezier(.16, 1, .3, 1) both; }
        .demande-row { transition: transform .2s ease, box-shadow .2s ease; }
        .demande-row:hover { transform: translateX(3px); }
        .pulse-dot { animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
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
              <h1 className="text-2xl font-bold text-gray-900 dark:text-dark-text">Demandes de Rendez-vous</h1>
              <p className="text-sm text-gray-500 dark:text-dark-muted mt-0.5">Gérez toutes les demandes de vos clients</p>
            </div>
            {!loading && stats.pending > 0 && (
              <div className="flex items-center gap-2 bg-yellow-100 dark:bg-yellow-500/15 text-yellow-700 dark:text-yellow-400 px-4 py-2 rounded-xl font-semibold text-sm shrink-0">
                <Clock size={15} />
                <span>{stats.pending} en attente</span>
              </div>
            )}
          </div>

          {/* Error */}
          {error && <ErrorMessage />}

          {/* STAT CARDS */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 anim-up" style={{ animationDelay: '.05s' }}>
            {[
              { label: 'Total', value: stats.total, color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-500/10', dot: 'bg-blue-500' },
              { label: 'En attente', value: stats.pending, color: 'text-yellow-600 dark:text-yellow-400', bg: 'bg-yellow-50 dark:bg-yellow-500/10', dot: 'bg-yellow-500' },
              { label: 'Acceptées', value: stats.accepted, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-500/10', dot: 'bg-emerald-500' },
              { label: 'Refusées', value: stats.refused, color: 'text-red-600 dark:text-red-400', bg: 'bg-red-50 dark:bg-red-500/10', dot: 'bg-red-500' },
            ].map((s, i) => (
              <div key={i} className="bg-white dark:bg-dark-surface rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-dark-border transition-colors duration-200">
                <div className="flex items-center gap-2 mb-1.5">
                  <div className={`w-2 h-2 rounded-full ${s.dot}`} />
                  <span className="text-xs text-gray-500 dark:text-dark-muted font-medium">{s.label}</span>
                </div>
                {loading ? (
                  <div className="h-8 w-12 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                ) : (
                  <p className={`text-3xl font-bold ${s.color}`}>{s.value}</p>
                )}
              </div>
            ))}
          </div>

          {/* MAIN LAYOUT */}
          <div className="flex flex-col lg:flex-row gap-6">

            {/* LEFT: list */}
            <div className="flex-1 min-w-0 space-y-4">

              {/* Search + tabs */}
              <div className="bg-white dark:bg-dark-surface rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-dark-border transition-colors duration-200 anim-up" style={{ animationDelay: '.1s' }}>
                <div className="flex gap-3">
                  <div className="flex-1 flex items-center gap-2 bg-gray-50 dark:bg-dark-bg border border-gray-200 dark:border-dark-border rounded-xl px-3 py-2.5">
                    <Search size={14} className="text-gray-400 dark:text-dark-muted shrink-0" />
                    <input
                      type="text"
                      placeholder="Client ou service..."
                      value={search}
                      onChange={e => setSearch(e.target.value)}
                      autoComplete="off"
                      className="bg-transparent outline-none text-sm text-gray-700 dark:text-dark-text placeholder-gray-400 dark:placeholder-dark-muted w-full"
                    />
                    {search && <button onClick={() => setSearch('')}><X size={12} className="text-gray-400 hover:text-gray-600" /></button>}
                  </div>
                  <button className="flex items-center gap-2 px-4 border border-gray-200 dark:border-dark-border rounded-xl text-sm text-gray-600 dark:text-dark-muted hover:bg-gray-50 dark:hover:bg-dark-border transition-all font-medium shrink-0">
                    <Filter size={14} />
                  </button>
                </div>
                <div className="flex gap-1 mt-3 overflow-x-auto pb-0.5">
                  {TABS.map(tab => {
                    const count = tab.id === 'all' ? stats.total : tab.id === 'pending' ? stats.pending : tab.id === 'accepted' ? stats.accepted : stats.refused;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                          activeTab === tab.id ? 'bg-[#0059B2] text-white' : 'text-gray-500 dark:text-dark-muted hover:bg-gray-100 dark:hover:bg-dark-border'
                        }`}
                      >
                        {tab.label}
                        <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${activeTab === tab.id ? 'bg-white/25 text-white' : 'bg-gray-100 dark:bg-dark-border text-gray-500 dark:text-dark-muted'}`}>
                          {count}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Demandes Rows */}
              {loading ? (
                <LoadingSkeleton />
              ) : filtered.length === 0 ? (
                <div className="bg-white dark:bg-dark-surface rounded-2xl p-12 text-center shadow-sm border border-gray-100 dark:border-dark-border anim-up">
                  <AlertCircle size={32} className="text-gray-300 dark:text-dark-muted mx-auto mb-3" />
                  <p className="text-gray-500 dark:text-dark-muted font-medium">Aucune demande trouvée</p>
                </div>
              ) : (
                filtered.map((demande, idx) => {
                  const cfg = CFG[demande.status];
                  const SIcon = cfg.Icon;
                  const isOpen = selectedId === demande.id;
                  return (
                    <div
                      key={demande.id}
                      onClick={() => setSelectedId(isOpen ? null : demande.id)}
                      className={`demande-row bg-white dark:bg-dark-surface rounded-2xl p-4 shadow-sm border cursor-pointer transition-all duration-200 anim-up ${
                        isOpen ? 'border-[#0059B2] dark:border-blue-500 shadow-md' : 'border-gray-100 dark:border-dark-border hover:border-blue-100 dark:hover:border-dark-border hover:shadow-md'
                      }`}
                      style={{ animationDelay: `${.12 + idx * .05}s` }}
                    >
                      <div className="flex items-center gap-4">
                        <div className="relative shrink-0">
                          <img src={demande.avatar} alt={demande.clientName} className="w-12 h-12 rounded-full object-cover ring-2 ring-white dark:ring-dark-surface" />
                          <div className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-white dark:border-dark-surface ${cfg.dot}`} />
                          {demande.isNew && demande.status === 'pending' && (
                            <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full pulse-dot" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <div>
                              <div className="flex items-center gap-2">
                                <p className="font-bold text-gray-900 dark:text-dark-text text-sm">{demande.clientName}</p>
                                {demande.isNew && (
                                  <span className="inline-flex items-center px-1.5 py-0.5 bg-red-100 dark:bg-red-500/15 text-red-600 dark:text-red-400 rounded text-[10px] font-bold">
                                    NOUVEAU
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-gray-500 dark:text-dark-muted">{demande.service}</p>
                            </div>
                            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold shrink-0 ${cfg.bg} ${cfg.text}`}>
                              <SIcon size={9} />
                              {cfg.label}
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-3">
                            <span className="flex items-center gap-1 text-xs text-gray-500 dark:text-dark-muted">
                              <Calendar size={10} className="text-[#0059B2] dark:text-blue-400" />
                              {demande.date}
                            </span>
                            <span className="flex items-center gap-1 text-xs text-gray-500 dark:text-dark-muted">
                              <Clock size={10} className="text-[#0059B2] dark:text-blue-400" />
                              {demande.time}
                            </span>
                            <span className="flex items-center gap-1 text-xs text-gray-400 dark:text-dark-muted">
                              <User size={10} />
                              Reçue: {demande.createdAt}
                            </span>
                          </div>
                          {demande.note && (
                            <div className="mt-2 p-2 bg-gray-50 dark:bg-dark-bg rounded-lg">
                              <p className="text-xs text-gray-600 dark:text-dark-muted italic">"{demande.note}"</p>
                            </div>
                          )}
                        </div>
                        <ChevronRight
                          size={15}
                          className={`text-gray-300 dark:text-dark-muted shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-90 text-blue-500' : ''}`}
                        />
                      </div>

                      {isOpen && (
                        <div className="mt-4 pt-4 border-t border-gray-100 dark:border-dark-border flex flex-wrap gap-2 anim-up">
                          <a
                            href={`tel:${demande.phone}`}
                            className="flex items-center gap-1.5 px-3 py-2 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-lg text-xs font-semibold hover:bg-blue-100 dark:hover:bg-blue-500/20 transition-all"
                          >
                            <Phone size={12} />
                            Appeler
                          </a>
                          <button className="flex items-center gap-1.5 px-3 py-2 bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-dark-text rounded-lg text-xs font-semibold hover:bg-gray-100 transition-all">
                            <MessageSquare size={12} />
                            Message
                          </button>
                          {demande.status === 'pending' && (
                            <>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                   navigate(`/Accepterrefuser/${demande.id}`);
                                }}
                                className="flex items-center gap-1.5 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold transition-all"
                              >
                                <ArrowRight size={12} />
                                Gérer la demande
                              </button>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>

            {/* RIGHT sidebar */}
            <div className="w-full lg:w-68 shrink-0 space-y-4" style={{ width: '272px' }}>

              {/* Urgent Demandes */}
              <div className="bg-gradient-to-br from-[#0059B2] to-[#1A6FD1] rounded-2xl p-5 text-white shadow-lg anim-right" style={{ animationDelay: '.15s' }}>
                <p className="text-[10px] font-bold text-blue-200 uppercase tracking-widest mb-3">Demandes Urgentes</p>
                {loading ? (
                  <div className="space-y-2">
                    <div className="h-12 bg-white/15 rounded-lg animate-pulse" />
                    <div className="h-12 bg-white/15 rounded-lg animate-pulse" />
                  </div>
                ) : urgentDemandes.length === 0 ? (
                  <p className="text-sm text-blue-200">Aucune demande urgente</p>
                ) : (
                  <div className="space-y-3">
                    {urgentDemandes.map((d, i) => (
                      <div key={i} className="bg-white/15 rounded-lg p-3">
                        <div className="flex items-center gap-2 mb-2">
                          <img src={d.avatar} alt={d.clientName} className="w-8 h-8 rounded-full" />
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-sm truncate">{d.clientName}</p>
                            <p className="text-blue-200 text-xs truncate">{d.service}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-xs">
                          <Calendar size={10} />
                          {d.date} à {d.time}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Tips */}
              <div className="bg-white dark:bg-dark-surface rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-dark-border transition-colors duration-200 anim-right" style={{ animationDelay: '.2s' }}>
                <h3 className="text-sm font-bold text-gray-900 dark:text-dark-text mb-3">💡 Conseils</h3>
                <div className="space-y-2.5">
                  {[
                    { e: '⚡', t: 'Répondez rapidement aux demandes urgentes' },
                    { e: '📞', t: 'Contactez le client si besoin de clarification' },
                    { e: '📅', t: 'Vérifiez votre disponibilité avant d\'accepter' }
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-2.5 p-2.5 bg-blue-50 dark:bg-blue-500/10 rounded-xl">
                      <span className="text-base leading-none">{item.e}</span>
                      <p className="text-xs text-gray-700 dark:text-dark-text font-medium leading-relaxed">{item.t}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Stats summary */}
              <div className="bg-white dark:bg-dark-surface rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-dark-border transition-colors duration-200 anim-right" style={{ animationDelay: '.25s' }}>
                <h3 className="text-sm font-bold text-gray-900 dark:text-dark-text mb-4">📊 Performance</h3>
                {loading ? (
                  <div className="space-y-3">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                    ))}
                  </div>
                ) : (
                  <div className="space-y-3">
                    {[
                      { label: 'Taux d\'acceptation', pct: stats.total > 0 ? Math.round((stats.accepted / stats.total) * 100) : 0, color: 'bg-emerald-500' },
                      { label: 'Demandes en attente', pct: stats.total > 0 ? Math.round((stats.pending / stats.total) * 100) : 0, color: 'bg-yellow-500' },
                      { label: 'Taux de refus', pct: stats.total > 0 ? Math.round((stats.refused / stats.total) * 100) : 0, color: 'bg-red-400' }
                    ].map((item, i) => (
                      <div key={i}>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-gray-500 dark:text-dark-muted">{item.label}</span>
                          <span className="font-bold text-gray-900 dark:text-dark-text">{item.pct}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-gray-100 dark:bg-dark-border rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${item.color}`} style={{ width: `${item.pct}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>
          </div>
        </div>
        <Footer />
      </main>
    </div>
  );
};

export default ListeDesDemandes;