import React, { useState, useEffect } from 'react';
import { 
  Calendar, Clock, ChevronLeft, ChevronRight, Plus, Download,
  Search, Filter, Phone, User, X, MapPin, MoreHorizontal, Loader2, AlertCircle
} from 'lucide-react';
import Navbar from '../../components/Provider/Navbar';
import TopBar from '../../components/Provider/TopBar';
import Footer from '../../components/Provider/Footer';
import {
  getAllAppointments,
  getAppointmentsByDateRange,
  getAppointmentStats,
  createAppointment,
  type Appointment,
  type AppointmentStats,
  type CreateAppointmentDTO
} from '../../services/Provider/Mesrendezvous';

type ViewMode = 'day' | 'week' | 'month';

interface NewAppointmentForm {
  clientName: string;
  clientPhone: string;
  service: string;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  notes: string;
}

const SERVICES = [
  'Consultation générale',
  'Suivi médical',
  'Certificat médical',
  'Urgence',
  'Visite à domicile'
];

const HOURS = Array.from({ length: 13 }, (_, i) => i + 8); // 8:00 - 20:00
const DAYS_OF_WEEK = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];

const MesRendezVousCalendar: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string>('mesRendezVous');
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [userName, setUserName] = useState('Dr. Youssef');
  const [viewMode, setViewMode] = useState<ViewMode>('week');
  const [currentDate, setCurrentDate] = useState(new Date('2025-01-21')); // Tuesday
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  
  // Data state
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [stats, setStats] = useState<AppointmentStats>({
    total: 0,
    today: 0,
    thisWeek: 0,
    upcoming: 0,
    completed: 0,
    cancelled: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Modal state
  const [showNewAppointmentModal, setShowNewAppointmentModal] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [newAppointment, setNewAppointment] = useState<NewAppointmentForm>({
    clientName: '',
    clientPhone: '',
    service: 'Consultation générale',
    date: '',
    startTime: '09:00',
    endTime: '09:30',
    location: 'Cabinet',
    notes: ''
  });

  useEffect(() => {
    const s = localStorage.getItem('provider');
    if (s) {
      try {
        const u = JSON.parse(s);
        setUserName(u.nom || u.nomComplet || 'Dr. Youssef');
      } catch (e) {}
    }
  }, []);

  // Fetch appointments
  const fetchData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const [appointmentsData, statsData] = await Promise.all([
        getAllAppointments(),
        getAppointmentStats()
      ]);
      
      setAppointments(appointmentsData);
      setStats(statsData);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Erreur lors du chargement des rendez-vous');
      console.error('Error loading appointments:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Get week dates starting from Monday
  const getWeekDates = () => {
    const dates = [];
    const day = currentDate.getDay();
    const diff = currentDate.getDate() - day + (day === 0 ? -6 : 1); // Adjust to Monday
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(currentDate);
      date.setDate(diff + i);
      dates.push(date);
    }
    return dates;
  };

  const weekDates = getWeekDates();

  // Navigation functions
  const goToPreviousWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() - 7);
    setCurrentDate(newDate);
  };

  const goToNextWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + 7);
    setCurrentDate(newDate);
  };

  const goToToday = () => {
    setCurrentDate(new Date('2025-01-21'));
  };

  // Add new appointment
  const handleAddAppointment = async () => {
    if (!newAppointment.clientName || !newAppointment.clientPhone || !newAppointment.date) {
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }

    setIsCreating(true);
    
    try {
      const dto: CreateAppointmentDTO = {
        clientName: newAppointment.clientName,
        clientPhone: newAppointment.clientPhone,
        service: newAppointment.service,
        date: newAppointment.date,
        startTime: newAppointment.startTime,
        endTime: newAppointment.endTime,
        location: newAppointment.location,
        notes: newAppointment.notes
      };
      
      const created = await createAppointment(dto);
      
      // Add to local state
      setAppointments([...appointments, created]);
      
      // Update stats
      setStats({
        ...stats,
        total: stats.total + 1,
        upcoming: stats.upcoming + 1,
        thisWeek: stats.thisWeek + 1
      });
      
      // Close modal and reset form
      setShowNewAppointmentModal(false);
      setNewAppointment({
        clientName: '',
        clientPhone: '',
        service: 'Consultation générale',
        date: '',
        startTime: '09:00',
        endTime: '09:30',
        location: 'Cabinet',
        notes: ''
      });
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Erreur lors de la création du rendez-vous');
    } finally {
      setIsCreating(false);
    }
  };

  // Get appointments for specific date
  const getAppointmentsForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return appointments.filter(apt => apt.date === dateStr);
  };

  // Calculate position for appointment in calendar
  const getAppointmentPosition = (startTime: string, endTime: string) => {
    const [startH, startM] = startTime.split(':').map(Number);
    const [endH, endM] = endTime.split(':').map(Number);
    
    const startMinutes = (startH - 8) * 60 + startM;
    const duration = (endH * 60 + endM) - (startH * 60 + startM);
    
    const top = (startMinutes / 60) * 80; // 80px per hour
    const height = (duration / 60) * 80;
    
    return { top, height };
  };

  const formatDate = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short' };
    return date.toLocaleDateString('fr-FR', options);
  };

  const isToday = (date: Date) => {
    return date.toDateString() === new Date('2025-01-21').toDateString();
  };

  // Loading skeleton
  const LoadingSkeleton = () => (
    <div className="bg-white dark:bg-dark-surface rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-dark-border">
      <div className="animate-pulse space-y-4">
        <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded w-1/3" />
        <div className="grid grid-cols-7 gap-2">
          {[...Array(7)].map((_, i) => (
            <div key={i} className="h-64 bg-gray-200 dark:bg-gray-700 rounded" />
          ))}
        </div>
      </div>
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
        @keyframes slideRight { from { opacity: 0; transform: translateX(-18px) } to { opacity: 1; transform: translateX(0) } }
        .sidebar-overlay { animation: fadeIn .3s ease-out forwards; }
        .anim-up { animation: slideUp .45s cubic-bezier(.16, 1, .3, 1) both; }
        .appointment-card { transition: all 0.2s ease; cursor: pointer; }
        .appointment-card:hover { transform: translateY(-2px); box-shadow: 0 8px 16px rgba(0,0,0,0.15); }
        .calendar-grid { display: grid; grid-template-columns: 60px repeat(7, 1fr); }
        .time-slot { height: 80px; border-bottom: 1px solid #e5e7eb; }
        .dark .time-slot { border-color: #374151; }
      `}</style>

      {/* Appointment Detail Modal */}
      {selectedAppointment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-[100] flex items-center justify-center p-4 sidebar-overlay" onClick={() => setSelectedAppointment(null)}>
          <div className="bg-white dark:bg-dark-surface rounded-2xl p-6 max-w-md w-full shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-3">
                <img src={selectedAppointment.avatar} alt={selectedAppointment.clientName} className="w-12 h-12 rounded-full" />
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-dark-text">{selectedAppointment.clientName}</h3>
                  <p className="text-sm text-gray-500 dark:text-dark-muted">{selectedAppointment.service}</p>
                </div>
              </div>
              <button onClick={() => setSelectedAppointment(null)} className="p-1 hover:bg-gray-100 dark:hover:bg-dark-border rounded-lg">
                <X size={20} className="text-gray-500" />
              </button>
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-dark-bg rounded-xl">
                <Calendar size={16} className="text-blue-600 dark:text-blue-400" />
                <span className="text-sm text-gray-700 dark:text-dark-text font-medium">{selectedAppointment.date}</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-dark-bg rounded-xl">
                <Clock size={16} className="text-blue-600 dark:text-blue-400" />
                <span className="text-sm text-gray-700 dark:text-dark-text font-medium">
                  {selectedAppointment.startTime} - {selectedAppointment.endTime}
                </span>
              </div>
              {selectedAppointment.location && (
                <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-dark-bg rounded-xl">
                  <MapPin size={16} className="text-blue-600 dark:text-blue-400" />
                  <span className="text-sm text-gray-700 dark:text-dark-text font-medium">{selectedAppointment.location}</span>
                </div>
              )}
            </div>

            <div className="flex gap-2">
              <a href={`tel:${selectedAppointment.clientPhone}`} className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl font-semibold text-sm transition-all">
                <Phone size={16} />
                Appeler
              </a>
              <button className="flex-1 flex items-center justify-center gap-2 bg-gray-100 dark:bg-dark-border hover:bg-gray-200 text-gray-700 dark:text-dark-text px-4 py-2.5 rounded-xl font-semibold text-sm transition-all">
                <User size={16} />
                Profil
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New Appointment Modal */}
      {showNewAppointmentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-[100] flex items-center justify-center p-4 sidebar-overlay" onClick={() => setShowNewAppointmentModal(false)}>
          <div className="bg-white dark:bg-dark-surface rounded-2xl p-6 max-w-lg w-full shadow-2xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-dark-text">Nouveau Rendez-vous</h3>
              <button onClick={() => setShowNewAppointmentModal(false)} className="p-1 hover:bg-gray-100 dark:hover:bg-dark-border rounded-lg">
                <X size={20} className="text-gray-500" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-dark-text mb-2">
                  Nom du client <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={newAppointment.clientName}
                  onChange={(e) => setNewAppointment({ ...newAppointment, clientName: e.target.value })}
                  placeholder="Ex: Ahmed Mansouri"
                  className="w-full px-4 py-2.5 bg-gray-50 dark:bg-dark-bg border border-gray-200 dark:border-dark-border rounded-xl text-sm text-gray-900 dark:text-dark-text outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-dark-text mb-2">
                  Téléphone <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  value={newAppointment.clientPhone}
                  onChange={(e) => setNewAppointment({ ...newAppointment, clientPhone: e.target.value })}
                  placeholder="+212 6 12 34 56 78"
                  className="w-full px-4 py-2.5 bg-gray-50 dark:bg-dark-bg border border-gray-200 dark:border-dark-border rounded-xl text-sm text-gray-900 dark:text-dark-text outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-dark-text mb-2">
                  Service
                </label>
                <select
                  value={newAppointment.service}
                  onChange={(e) => setNewAppointment({ ...newAppointment, service: e.target.value })}
                  className="w-full px-4 py-2.5 bg-gray-50 dark:bg-dark-bg border border-gray-200 dark:border-dark-border rounded-xl text-sm text-gray-900 dark:text-dark-text outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {SERVICES.map(service => (
                    <option key={service} value={service}>{service}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-dark-text mb-2">
                  Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={newAppointment.date}
                  onChange={(e) => setNewAppointment({ ...newAppointment, date: e.target.value })}
                  className="w-full px-4 py-2.5 bg-gray-50 dark:bg-dark-bg border border-gray-200 dark:border-dark-border rounded-xl text-sm text-gray-900 dark:text-dark-text outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-dark-text mb-2">Heure début</label>
                  <input
                    type="time"
                    value={newAppointment.startTime}
                    onChange={(e) => setNewAppointment({ ...newAppointment, startTime: e.target.value })}
                    className="w-full px-4 py-2.5 bg-gray-50 dark:bg-dark-bg border border-gray-200 dark:border-dark-border rounded-xl text-sm text-gray-900 dark:text-dark-text outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-dark-text mb-2">Heure fin</label>
                  <input
                    type="time"
                    value={newAppointment.endTime}
                    onChange={(e) => setNewAppointment({ ...newAppointment, endTime: e.target.value })}
                    className="w-full px-4 py-2.5 bg-gray-50 dark:bg-dark-bg border border-gray-200 dark:border-dark-border rounded-xl text-sm text-gray-900 dark:text-dark-text outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-dark-text mb-2">Localisation</label>
                <input
                  type="text"
                  value={newAppointment.location}
                  onChange={(e) => setNewAppointment({ ...newAppointment, location: e.target.value })}
                  placeholder="Cabinet, Domicile..."
                  className="w-full px-4 py-2.5 bg-gray-50 dark:bg-dark-bg border border-gray-200 dark:border-dark-border rounded-xl text-sm text-gray-900 dark:text-dark-text outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-dark-text mb-2">Notes (optionnel)</label>
                <textarea
                  value={newAppointment.notes}
                  onChange={(e) => setNewAppointment({ ...newAppointment, notes: e.target.value })}
                  placeholder="Ajoutez des notes..."
                  rows={3}
                  className="w-full px-4 py-2.5 bg-gray-50 dark:bg-dark-bg border border-gray-200 dark:border-dark-border rounded-xl text-sm text-gray-900 dark:text-dark-text outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowNewAppointmentModal(false)}
                disabled={isCreating}
                className="flex-1 px-4 py-2.5 bg-gray-100 dark:bg-dark-border hover:bg-gray-200 text-gray-700 dark:text-dark-text rounded-xl font-semibold text-sm transition-all disabled:opacity-50"
              >
                Annuler
              </button>
              <button
                onClick={handleAddAppointment}
                disabled={isCreating}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold text-sm transition-all disabled:opacity-50"
              >
                {isCreating ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Création...
                  </>
                ) : (
                  'Créer RDV'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {isSidebarOpen && <div className="sidebar-overlay fixed inset-0 bg-black bg-opacity-50 z-40" onClick={()=>setIsSidebarOpen(false)}/>}
      <div className={`fixed left-0 top-0 h-full w-64 bg-white dark:bg-dark-surface transform transition-transform duration-300 z-50 ${isSidebarOpen?'translate-x-0':'-translate-x-full'}`}>
        <Navbar activeSection={activeSection} onSectionChange={s=>{setActiveSection(s);setIsSidebarOpen(false);}}/>
      </div>

      <main className={`min-h-screen transition-all duration-300 lg:${isSidebarOpen?'ml-64':'ml-0'}`}>
        <TopBar userName={userName} onMenuToggle={()=>setIsSidebarOpen(!isSidebarOpen)} isMobileMenuOpen={isSidebarOpen}/>

        <div className="p-4 sm:p-6 lg:p-8 space-y-6">

          {/* HEADER */}
          <div className="flex flex-col gap-4 anim-up">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-dark-text">Mes Rendez-vous</h1>
              <div className="flex items-center gap-2">
                <button className="flex items-center gap-2 bg-gray-100 dark:bg-dark-border hover:bg-gray-200 text-gray-700 dark:text-dark-text px-4 py-2 rounded-xl font-semibold text-sm transition-all">
                  <Download size={15} />
                  <span className="hidden sm:inline">Export PDF</span>
                </button>
                <button 
                  onClick={() => setShowNewAppointmentModal(true)}
                  className="flex items-center gap-2 bg-[#0059B2] hover:bg-[#004a99] text-white px-4 py-2 rounded-xl font-semibold text-sm transition-all"
                >
                  <Plus size={15} />
                  <span className="hidden sm:inline">Nouveau RDV</span>
                </button>
              </div>
            </div>

            {/* Error */}
            {error && <ErrorMessage />}

            {/* Stats Bar */}
            {!loading && (
              <div className="flex items-center gap-4 overflow-x-auto pb-2">
                <div className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-dark-surface rounded-xl border border-gray-100 dark:border-dark-border">
                  <div className="w-2 h-2 bg-blue-500 rounded-full" />
                  <span className="text-sm text-gray-600 dark:text-dark-muted whitespace-nowrap">Total: <strong className="text-gray-900 dark:text-dark-text">{stats.total}</strong></span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-dark-surface rounded-xl border border-gray-100 dark:border-dark-border">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                  <span className="text-sm text-gray-600 dark:text-dark-muted whitespace-nowrap">Aujourd'hui: <strong className="text-gray-900 dark:text-dark-text">{stats.today}</strong></span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-dark-surface rounded-xl border border-gray-100 dark:border-dark-border">
                  <div className="w-2 h-2 bg-purple-500 rounded-full" />
                  <span className="text-sm text-gray-600 dark:text-dark-muted whitespace-nowrap">Cette semaine: <strong className="text-gray-900 dark:text-dark-text">{stats.thisWeek}</strong></span>
                </div>
              </div>
            )}
          </div>

          {loading ? (
            <LoadingSkeleton />
          ) : (
            <>
              {/* CALENDAR TOOLBAR */}
              <div className="bg-white dark:bg-dark-surface rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-dark-border anim-up" style={{ animationDelay: '.05s' }}>
                <div className="flex items-center justify-between gap-4">
                  
                  {/* Left: Navigation */}
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1 bg-gray-100 dark:bg-dark-bg rounded-xl p-1">
                      <button onClick={goToPreviousWeek} className="p-2 hover:bg-white dark:hover:bg-dark-surface rounded-lg transition-all">
                        <ChevronLeft size={18} className="text-gray-600 dark:text-dark-muted" />
                      </button>
                      <button onClick={goToNextWeek} className="p-2 hover:bg-white dark:hover:bg-dark-surface rounded-lg transition-all">
                        <ChevronRight size={18} className="text-gray-600 dark:text-dark-muted" />
                      </button>
                    </div>
                    <button onClick={goToToday} className="px-4 py-2 bg-gray-100 dark:bg-dark-bg hover:bg-gray-200 rounded-xl text-sm font-semibold text-gray-700 dark:text-dark-text transition-all">
                      Aujourd'hui
                    </button>
                    <h2 className="text-lg font-bold text-gray-900 dark:text-dark-text hidden sm:block">
                      {formatDate(weekDates[0])} - {formatDate(weekDates[6])}
                    </h2>
                  </div>

                  {/* Right: View Mode + Actions */}
                  <div className="flex items-center gap-2">
                    <div className="hidden sm:flex items-center gap-1 bg-gray-100 dark:bg-dark-bg rounded-xl p-1">
                      <button
                        onClick={() => setViewMode('day')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                          viewMode === 'day' ? 'bg-white dark:bg-dark-surface text-blue-600 dark:text-blue-400 shadow-sm' : 'text-gray-600 dark:text-dark-muted hover:text-gray-900'
                        }`}
                      >
                        Jour
                      </button>
                      <button
                        onClick={() => setViewMode('week')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                          viewMode === 'week' ? 'bg-white dark:bg-dark-surface text-blue-600 dark:text-blue-400 shadow-sm' : 'text-gray-600 dark:text-dark-muted hover:text-gray-900'
                        }`}
                      >
                        Semaine
                      </button>
                      <button
                        onClick={() => setViewMode('month')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                          viewMode === 'month' ? 'bg-white dark:bg-dark-surface text-blue-600 dark:text-blue-400 shadow-sm' : 'text-gray-600 dark:text-dark-muted hover:text-gray-900'
                        }`}
                      >
                        Mois
                      </button>
                    </div>
                    
                    <button className="p-2 hover:bg-gray-100 dark:hover:bg-dark-border rounded-lg transition-all">
                      <Search size={18} className="text-gray-600 dark:text-dark-muted" />
                    </button>
                    <button className="p-2 hover:bg-gray-100 dark:hover:bg-dark-border rounded-lg transition-all">
                      <Filter size={18} className="text-gray-600 dark:text-dark-muted" />
                    </button>
                    <button className="p-2 hover:bg-gray-100 dark:hover:bg-dark-border rounded-lg transition-all">
                      <MoreHorizontal size={18} className="text-gray-600 dark:text-dark-muted" />
                    </button>
                  </div>
                </div>
              </div>

              {/* CALENDAR GRID */}
              <div className="bg-white dark:bg-dark-surface rounded-2xl shadow-sm border border-gray-100 dark:border-dark-border overflow-hidden anim-up" style={{ animationDelay: '.1s' }}>
                
                {/* Header Row */}
                <div className="calendar-grid border-b border-gray-200 dark:border-dark-border bg-gray-50 dark:bg-dark-bg">
                  <div className="p-3"></div> {/* Empty corner */}
                  {weekDates.map((date, idx) => (
                    <div key={idx} className="p-3 text-center border-l border-gray-200 dark:border-dark-border">
                      <div className="text-xs text-gray-500 dark:text-dark-muted font-medium">{DAYS_OF_WEEK[idx]}</div>
                      <div className={`text-sm font-bold mt-1 ${
                        isToday(date) ? 'w-7 h-7 mx-auto bg-blue-600 text-white rounded-full flex items-center justify-center' : 'text-gray-900 dark:text-dark-text'
                      }`}>
                        {date.getDate()}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Time Grid */}
                <div className="overflow-auto" style={{ maxHeight: '600px' }}>
                  <div className="calendar-grid">
                    {HOURS.map(hour => (
                      <React.Fragment key={hour}>
                        {/* Time Label */}
                        <div className="time-slot p-2 text-xs text-gray-500 dark:text-dark-muted text-right pr-3 border-r border-gray-200 dark:border-dark-border">
                          {hour.toString().padStart(2, '0')}:00
                        </div>
                        
                        {/* Day Columns */}
                        {weekDates.map((date, dayIdx) => (
                          <div
                            key={dayIdx}
                            className="time-slot border-l border-gray-200 dark:border-dark-border relative hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-colors cursor-pointer"
                            style={{ position: 'relative' }}
                          >
                            {/* Render appointments for this time slot */}
                            {getAppointmentsForDate(date).map(apt => {
                              const { top, height } = getAppointmentPosition(apt.startTime, apt.endTime);
                              const startHour = parseInt(apt.startTime.split(':')[0]);
                              
                              if (startHour === hour) {
                                return (
                                  <div
                                    key={apt.id}
                                    onClick={() => setSelectedAppointment(apt)}
                                    className="appointment-card absolute left-1 right-1 rounded-lg p-2 text-white text-xs overflow-hidden"
                                    style={{
                                      backgroundColor: apt.color,
                                      top: `${top % 80}px`,
                                      height: `${Math.min(height, 76)}px`,
                                      zIndex: 10
                                    }}
                                  >
                                    <div className="font-semibold truncate">{apt.clientName}</div>
                                    <div className="text-white/90 truncate text-[10px] mt-0.5">{apt.service}</div>
                                    <div className="text-white/80 text-[10px] mt-0.5">
                                      {apt.startTime} - {apt.endTime}
                                    </div>
                                  </div>
                                );
                              }
                              return null;
                            })}
                          </div>
                        ))}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}

        </div>

        <Footer />
      </main>
    </div>
  );
};

export default MesRendezVousCalendar;