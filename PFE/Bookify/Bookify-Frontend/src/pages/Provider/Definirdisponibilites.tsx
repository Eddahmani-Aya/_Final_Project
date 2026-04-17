import React, { useState, useEffect } from 'react';
import { 
  Calendar, Clock, Plus, X, ChevronRight, ChevronLeft,
  Save, Trash2, Edit3, Copy, AlertCircle, Check,
  RefreshCw, Coffee, Loader2
} from 'lucide-react';
import Navbar from '../../components/Provider/Navbar';
import TopBar from '../../components/Provider/TopBar';
import Footer from '../../components/Provider/Footer';
import {
  getAvailabilityData,
  createTimeSlot,
  deleteTimeSlot,
  applyTemplateToAll,
  createException,
  deleteException,
  type TimeSlot,
  type Exception,
  type CreateTimeSlotDTO,
  type CreateExceptionDTO
} from '../../services/Provider/Disponibilitesservice';

const DAYS_OF_WEEK = [
  { id: 'monday', label: 'Lundi', short: 'Lun' },
  { id: 'tuesday', label: 'Mardi', short: 'Mar' },
  { id: 'wednesday', label: 'Mercredi', short: 'Mer' },
  { id: 'thursday', label: 'Jeudi', short: 'Jeu' },
  { id: 'friday', label: 'Vendredi', short: 'Ven' },
  { id: 'saturday', label: 'Samedi', short: 'Sam' },
  { id: 'sunday', label: 'Dimanche', short: 'Dim' }
];

const TIME_OPTIONS = [
  '08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30',
  '16:00', '16:30', '17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00'
];

// Calendar for current month
const CALENDAR_DAYS = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];
const CALENDAR_DATES = [
  [29, 30, 31, 1, 2, 3, 4],
  [5, 6, 7, 8, 9, 10, 11],
  [12, 13, 14, 15, 16, 17, 18],
  [19, 20, 21, 22, 23, 24, 25],
  [26, 27, 28, 29, 30, 31, 1],
];

const DefinirDisponibilites: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string>('definirDisponibilites');
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [userName, setUserName] = useState('Dr. Youssef');
  
  // Data state
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [exceptions, setExceptions] = useState<Exception[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Modal state
  const [showAddSlotModal, setShowAddSlotModal] = useState(false);
  const [showAddExceptionModal, setShowAddExceptionModal] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  // Form state
  const [newSlot, setNewSlot] = useState<CreateTimeSlotDTO>({
    day: 'monday',
    startTime: '09:00',
    endTime: '17:00',
    isRecurring: true
  });

  const [newException, setNewException] = useState<CreateExceptionDTO>({
    date: '',
    reason: '',
    type: 'vacation'
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

  // Fetch availability data
  const fetchData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await getAvailabilityData();
      setTimeSlots(data.timeSlots);
      setExceptions(data.exceptions);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Erreur lors du chargement des disponibilités');
      console.error('Error loading availability:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Add time slot
  const handleAddSlot = async () => {
    setIsCreating(true);
    
    try {
      const created = await createTimeSlot(newSlot);
      setTimeSlots([...timeSlots, created]);
      setShowAddSlotModal(false);
      setNewSlot({ day: 'monday', startTime: '09:00', endTime: '17:00', isRecurring: true });
      showToast();
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Erreur lors de la création du créneau');
    } finally {
      setIsCreating(false);
    }
  };

  // Delete time slot
  const handleDeleteSlot = async (id: string) => {
    try {
      await deleteTimeSlot(id);
      setTimeSlots(timeSlots.filter(slot => slot.id !== id));
      showToast();
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Erreur lors de la suppression');
    }
  };

  // Add exception
  const handleAddException = async () => {
    if (!newException.date || !newException.reason) {
      alert('Veuillez remplir tous les champs');
      return;
    }
    
    setIsCreating(true);
    
    try {
      const created = await createException(newException);
      setExceptions([...exceptions, created]);
      setShowAddExceptionModal(false);
      setNewException({ date: '', reason: '', type: 'vacation' });
      showToast();
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Erreur lors de la création de l\'exception');
    } finally {
      setIsCreating(false);
    }
  };

  // Delete exception
  const handleDeleteException = async (id: string) => {
    try {
      await deleteException(id);
      setExceptions(exceptions.filter(ex => ex.id !== id));
      showToast();
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Erreur lors de la suppression');
    }
  };

  // Apply template to all weekdays
  const handleApplyToAll = async () => {
    const template = timeSlots[0];
    if (!template) {
      alert('Aucun créneau à copier');
      return;
    }
    
    try {
      const newSlots = await applyTemplateToAll(template);
      setTimeSlots(newSlots);
      showToast();
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Erreur lors de l\'application du modèle');
    }
  };

  const showToast = () => {
    setShowSuccessToast(true);
    setTimeout(() => setShowSuccessToast(false), 3000);
  };

  const getSlotsForDay = (dayId: string) => {
    return timeSlots.filter(slot => slot.day === dayId);
  };

  const exceptionDates = [25, 1, 15, 16, 17, 18, 19, 20]; // Highlighted dates

  // Loading skeleton
  const LoadingSkeleton = () => (
    <div className="space-y-6">
      <div className="bg-white dark:bg-dark-surface rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-dark-border">
        <div className="animate-pulse space-y-3">
          {[1, 2, 3, 4, 5, 6, 7].map(i => (
            <div key={i} className="h-24 bg-gray-200 dark:bg-gray-700 rounded-xl" />
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
        @keyframes slideDown { from { opacity: 0; transform: translateY(-18px) } to { opacity: 1; transform: translateY(0) } }
        @keyframes scaleIn { from { opacity: 0; transform: scale(0.95) } to { opacity: 1; transform: scale(1) } }
        .sidebar-overlay { animation: fadeIn .3s ease-out forwards; }
        .anim-up { animation: slideUp .45s cubic-bezier(.16, 1, .3, 1) both; }
        .anim-scale { animation: scaleIn .3s cubic-bezier(.16, 1, .3, 1) both; }
        .toast { animation: slideDown .3s cubic-bezier(.16, 1, .3, 1) both; }
      `}</style>

      {/* Success Toast */}
      {showSuccessToast && (
        <div className="fixed top-20 right-4 z-[100] toast">
          <div className="bg-emerald-600 text-white px-6 py-3 rounded-xl shadow-lg flex items-center gap-3">
            <Check size={20} />
            <span className="font-semibold">Modifications enregistrées!</span>
          </div>
        </div>
      )}

      {/* Add Slot Modal */}
      {showAddSlotModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-[100] flex items-center justify-center p-4 sidebar-overlay">
          <div className="bg-white dark:bg-dark-surface rounded-2xl p-6 max-w-md w-full anim-scale shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-dark-text">Ajouter un créneau</h3>
              <button onClick={() => setShowAddSlotModal(false)} className="p-1 hover:bg-gray-100 dark:hover:bg-dark-border rounded-lg">
                <X size={20} className="text-gray-500" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-dark-text mb-2">Jour</label>
                <select
                  value={newSlot.day}
                  onChange={(e) => setNewSlot({ ...newSlot, day: e.target.value })}
                  className="w-full px-4 py-2.5 bg-gray-50 dark:bg-dark-bg border border-gray-200 dark:border-dark-border rounded-xl text-sm text-gray-900 dark:text-dark-text outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {DAYS_OF_WEEK.map(day => (
                    <option key={day.id} value={day.id}>{day.label}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-dark-text mb-2">Début</label>
                  <select
                    value={newSlot.startTime}
                    onChange={(e) => setNewSlot({ ...newSlot, startTime: e.target.value })}
                    className="w-full px-4 py-2.5 bg-gray-50 dark:bg-dark-bg border border-gray-200 dark:border-dark-border rounded-xl text-sm text-gray-900 dark:text-dark-text outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {TIME_OPTIONS.map(time => (
                      <option key={time} value={time}>{time}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-dark-text mb-2">Fin</label>
                  <select
                    value={newSlot.endTime}
                    onChange={(e) => setNewSlot({ ...newSlot, endTime: e.target.value })}
                    className="w-full px-4 py-2.5 bg-gray-50 dark:bg-dark-bg border border-gray-200 dark:border-dark-border rounded-xl text-sm text-gray-900 dark:text-dark-text outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {TIME_OPTIONS.map(time => (
                      <option key={time} value={time}>{time}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="recurring"
                  checked={newSlot.isRecurring}
                  onChange={(e) => setNewSlot({ ...newSlot, isRecurring: e.target.checked })}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="recurring" className="text-sm text-gray-700 dark:text-dark-text">
                  Répéter chaque semaine
                </label>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowAddSlotModal(false)}
                disabled={isCreating}
                className="flex-1 px-4 py-2.5 bg-gray-100 dark:bg-dark-border hover:bg-gray-200 text-gray-700 dark:text-dark-text rounded-xl font-semibold text-sm transition-all disabled:opacity-50"
              >
                Annuler
              </button>
              <button
                onClick={handleAddSlot}
                disabled={isCreating}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold text-sm transition-all disabled:opacity-50"
              >
                {isCreating ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Ajout...
                  </>
                ) : (
                  'Ajouter'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Exception Modal */}
      {showAddExceptionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-[100] flex items-center justify-center p-4 sidebar-overlay">
          <div className="bg-white dark:bg-dark-surface rounded-2xl p-6 max-w-md w-full anim-scale shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-dark-text">Ajouter une exception</h3>
              <button onClick={() => setShowAddExceptionModal(false)} className="p-1 hover:bg-gray-100 dark:hover:bg-dark-border rounded-lg">
                <X size={20} className="text-gray-500" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-dark-text mb-2">Date / Période</label>
                <input
                  type="text"
                  value={newException.date}
                  onChange={(e) => setNewException({ ...newException, date: e.target.value })}
                  placeholder="Ex: 25 Déc 2025 ou 15-20 Fév 2026"
                  className="w-full px-4 py-2.5 bg-gray-50 dark:bg-dark-bg border border-gray-200 dark:border-dark-border rounded-xl text-sm text-gray-900 dark:text-dark-text outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-dark-text mb-2">Raison</label>
                <input
                  type="text"
                  value={newException.reason}
                  onChange={(e) => setNewException({ ...newException, reason: e.target.value })}
                  placeholder="Ex: Vacances, Jour férié..."
                  className="w-full px-4 py-2.5 bg-gray-50 dark:bg-dark-bg border border-gray-200 dark:border-dark-border rounded-xl text-sm text-gray-900 dark:text-dark-text outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-dark-text mb-2">Type</label>
                <select
                  value={newException.type}
                  onChange={(e) => setNewException({ ...newException, type: e.target.value as 'holiday' | 'vacation' | 'personal' })}
                  className="w-full px-4 py-2.5 bg-gray-50 dark:bg-dark-bg border border-gray-200 dark:border-dark-border rounded-xl text-sm text-gray-900 dark:text-dark-text outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="vacation">Vacances</option>
                  <option value="holiday">Jour férié</option>
                  <option value="personal">Personnel</option>
                </select>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowAddExceptionModal(false)}
                disabled={isCreating}
                className="flex-1 px-4 py-2.5 bg-gray-100 dark:bg-dark-border hover:bg-gray-200 text-gray-700 dark:text-dark-text rounded-xl font-semibold text-sm transition-all disabled:opacity-50"
              >
                Annuler
              </button>
              <button
                onClick={handleAddException}
                disabled={isCreating}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold text-sm transition-all disabled:opacity-50"
              >
                {isCreating ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Ajout...
                  </>
                ) : (
                  'Ajouter'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {isSidebarOpen && <div className="sidebar-overlay fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" onClick={()=>setIsSidebarOpen(false)}/>}
      
      <div className={`fixed left-0 top-0 h-full w-64 bg-white dark:bg-dark-surface shadow-lg transform transition-transform duration-300 z-50 ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0`}>
        <Navbar activeSection={activeSection} onSectionChange={s=>{setActiveSection(s);setIsSidebarOpen(false);}}/>
      </div>

      <main className="min-h-screen lg:ml-64">
        <TopBar userName={userName} onMenuToggle={()=>setIsSidebarOpen(!isSidebarOpen)} isMobileMenuOpen={isSidebarOpen}/>

        <div className="p-4 sm:p-6 lg:p-8 space-y-6">

          {/* HEADER */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 anim-up">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-dark-text">Définir mes Disponibilités</h1>
              <p className="text-sm text-gray-500 dark:text-dark-muted mt-0.5">Gérez vos horaires et jours de travail</p>
            </div>
            {!loading && (
              <button
                onClick={handleApplyToAll}
                className="flex items-center gap-2 bg-gray-100 dark:bg-dark-border hover:bg-gray-200 text-gray-700 dark:text-dark-text px-5 py-2.5 rounded-xl font-semibold text-sm transition-all shrink-0"
              >
                <Copy size={15} />
                Appliquer à tous
              </button>
            )}
          </div>

          {/* Error */}
          {error && <ErrorMessage />}

          {loading ? (
            <LoadingSkeleton />
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

              {/* LEFT COLUMN - Weekly Schedule */}
              <div className="lg:col-span-2 space-y-6">

                {/* Weekly Time Slots */}
                <div className="bg-white dark:bg-dark-surface rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-dark-border anim-up" style={{ animationDelay: '.05s' }}>
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-dark-text flex items-center gap-2">
                      <Clock size={20} className="text-blue-600 dark:text-blue-400" />
                      Horaires hebdomadaires
                    </h3>
                    <button
                      onClick={() => setShowAddSlotModal(true)}
                      className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl font-semibold text-sm transition-all"
                    >
                      <Plus size={16} />
                      Ajouter
                    </button>
                  </div>

                  <div className="space-y-3">
                    {DAYS_OF_WEEK.map((day, idx) => {
                      const slots = getSlotsForDay(day.id);
                      return (
                        <div key={day.id} className="border border-gray-100 dark:border-dark-border rounded-xl p-4">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-sm ${
                                slots.length > 0 ? 'bg-blue-100 dark:bg-blue-500/15 text-blue-700 dark:text-blue-400' : 'bg-gray-100 dark:bg-dark-border text-gray-400'
                              }`}>
                                {day.short}
                              </div>
                              <div>
                                <p className="font-semibold text-gray-900 dark:text-dark-text text-sm">{day.label}</p>
                                <p className="text-xs text-gray-500 dark:text-dark-muted">
                                  {slots.length === 0 ? 'Indisponible' : `${slots.length} créneau${slots.length > 1 ? 'x' : ''}`}
                                </p>
                              </div>
                            </div>
                          </div>

                          {slots.length > 0 ? (
                            <div className="space-y-2">
                              {slots.map(slot => (
                                <div key={slot.id} className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-500/10 rounded-lg">
                                  <div className="flex items-center gap-2">
                                    <Clock size={14} className="text-blue-600 dark:text-blue-400" />
                                    <span className="text-sm font-semibold text-gray-900 dark:text-dark-text">
                                      {slot.startTime} - {slot.endTime}
                                    </span>
                                    {slot.isRecurring && (
                                      <span className="text-xs px-2 py-0.5 bg-blue-200 dark:bg-blue-600/30 text-blue-700 dark:text-blue-300 rounded-full font-semibold">
                                        Récurrent
                                      </span>
                                    )}
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <button className="p-1.5 hover:bg-blue-100 dark:hover:bg-blue-600/20 rounded-lg transition-all">
                                      <Edit3 size={14} className="text-blue-600 dark:text-blue-400" />
                                    </button>
                                    <button
                                      onClick={() => handleDeleteSlot(slot.id)}
                                      className="p-1.5 hover:bg-red-100 dark:hover:bg-red-600/20 rounded-lg transition-all"
                                    >
                                      <Trash2 size={14} className="text-red-500 dark:text-red-400" />
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="text-center py-4">
                              <Coffee size={20} className="text-gray-300 dark:text-dark-muted mx-auto mb-2" />
                              <p className="text-xs text-gray-400 dark:text-dark-muted">Jour de repos</p>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Exceptions (Congés) */}
                <div className="bg-white dark:bg-dark-surface rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-dark-border anim-up" style={{ animationDelay: '.1s' }}>
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-dark-text flex items-center gap-2">
                      <AlertCircle size={20} className="text-orange-600 dark:text-orange-400" />
                      Exceptions & Congés
                    </h3>
                    <button
                      onClick={() => setShowAddExceptionModal(true)}
                      className="flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-xl font-semibold text-sm transition-all"
                    >
                      <Plus size={16} />
                      Ajouter
                    </button>
                  </div>

                  {exceptions.length === 0 ? (
                    <div className="text-center py-8">
                      <Calendar size={32} className="text-gray-300 dark:text-dark-muted mx-auto mb-3" />
                      <p className="text-gray-500 dark:text-dark-muted font-medium">Aucune exception définie</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {exceptions.map(ex => (
                        <div key={ex.id} className="flex items-center justify-between p-4 bg-orange-50 dark:bg-orange-500/10 rounded-xl border border-orange-100 dark:border-orange-500/20">
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                              ex.type === 'holiday' ? 'bg-red-100 dark:bg-red-500/15' :
                              ex.type === 'vacation' ? 'bg-blue-100 dark:bg-blue-500/15' :
                              'bg-purple-100 dark:bg-purple-500/15'
                            }`}>
                              <Calendar size={16} className={
                                ex.type === 'holiday' ? 'text-red-600 dark:text-red-400' :
                                ex.type === 'vacation' ? 'text-blue-600 dark:text-blue-400' :
                                'text-purple-600 dark:text-purple-400'
                              } />
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900 dark:text-dark-text text-sm">{ex.reason}</p>
                              <p className="text-xs text-gray-500 dark:text-dark-muted">{ex.date}</p>
                            </div>
                          </div>
                          <button
                            onClick={() => handleDeleteException(ex.id)}
                            className="p-2 hover:bg-red-100 dark:hover:bg-red-600/20 rounded-lg transition-all"
                          >
                            <Trash2 size={16} className="text-red-500 dark:text-red-400" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

              </div>

              {/* RIGHT COLUMN - Calendar Preview & Tips */}
              <div className="space-y-6">

                {/* Calendar Preview */}
                <div className="bg-white dark:bg-dark-surface rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-dark-border anim-up" style={{ animationDelay: '.15s' }}>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-sm font-bold text-gray-900 dark:text-dark-text">Janvier 2026</h3>
                    <div className="flex items-center gap-1">
                      <button className="p-1 hover:bg-gray-100 dark:hover:bg-dark-border rounded-lg">
                        <ChevronLeft size={14} className="text-gray-600 dark:text-dark-muted" />
                      </button>
                      <button className="p-1 hover:bg-gray-100 dark:hover:bg-dark-border rounded-lg">
                        <ChevronRight size={14} className="text-gray-600 dark:text-dark-muted" />
                      </button>
                    </div>
                  </div>

                  {/* Calendar */}
                  <div className="grid grid-cols-7 gap-1 mb-2">
                    {CALENDAR_DAYS.map(day => (
                      <div key={day} className="text-center text-[10px] font-semibold text-gray-400 py-1">
                        {day}
                      </div>
                    ))}
                  </div>

                  {CALENDAR_DATES.map((week, wi) => (
                    <div key={wi} className="grid grid-cols-7 gap-1 mb-1">
                      {week.map((date, di) => {
                        const isToday = date === 21 && wi === 3;
                        const hasException = exceptionDates.includes(date) && wi >= 3;
                        const isOtherMonth = (wi === 0 && date > 20) || (wi === 4 && date < 10);
                        return (
                          <div
                            key={di}
                            className={`aspect-square flex items-center justify-center rounded-lg text-[11px] cursor-pointer transition-all ${
                              isToday ? 'bg-blue-600 text-white font-bold' :
                              hasException ? 'bg-orange-100 dark:bg-orange-500/15 text-orange-700 dark:text-orange-400 font-semibold' :
                              isOtherMonth ? 'text-gray-300 dark:text-gray-600' :
                              'text-gray-700 dark:text-dark-text hover:bg-gray-50 dark:hover:bg-dark-border'
                            }`}
                          >
                            {date}
                          </div>
                        );
                      })}
                    </div>
                  ))}

                  {/* Legend */}
                  <div className="flex flex-col gap-2 mt-4 pt-4 border-t border-gray-100 dark:border-dark-border">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-blue-600 rounded" />
                      <span className="text-xs text-gray-600 dark:text-dark-muted">Aujourd'hui</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-orange-100 dark:bg-orange-500/15 rounded border border-orange-300 dark:border-orange-500" />
                      <span className="text-xs text-gray-600 dark:text-dark-muted">Exception</span>
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-gradient-to-br from-[#0059B2] to-[#1A6FD1] rounded-2xl p-5 text-white shadow-lg anim-up" style={{ animationDelay: '.2s' }}>
                  <h3 className="text-sm font-bold mb-4 flex items-center gap-2">
                    <RefreshCw size={16} />
                    Actions rapides
                  </h3>
                  <div className="space-y-2">
                    <button
                      onClick={() => setShowAddSlotModal(true)}
                      className="w-full p-3 bg-white/15 hover:bg-white/25 rounded-xl text-left transition-all"
                    >
                      <p className="text-sm font-semibold">Ajouter un créneau</p>
                      <p className="text-xs text-blue-200 mt-0.5">Définir nouvel horaire</p>
                    </button>
                    <button
                      onClick={() => setShowAddExceptionModal(true)}
                      className="w-full p-3 bg-white/15 hover:bg-white/25 rounded-xl text-left transition-all"
                    >
                      <p className="text-sm font-semibold">Marquer absence</p>
                      <p className="text-xs text-blue-200 mt-0.5">Congés ou jour férié</p>
                    </button>
                  </div>
                </div>

                {/* Tips */}
                <div className="bg-white dark:bg-dark-surface rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-dark-border anim-up" style={{ animationDelay: '.25s' }}>
                  <h3 className="text-sm font-bold text-gray-900 dark:text-dark-text mb-3">💡 Conseils</h3>
                  <div className="space-y-2.5">
                    {[
                      { e: '🔁', t: 'Utilisez les créneaux récurrents pour vos horaires fixes' },
                      { e: '📅', t: 'Planifiez vos congés à l\'avance' },
                      { e: '⏰', t: 'Laissez des pauses entre les consultations' }
                    ].map((item, i) => (
                      <div key={i} className="flex items-start gap-2.5 p-2.5 bg-blue-50 dark:bg-blue-500/10 rounded-xl">
                        <span className="text-base leading-none">{item.e}</span>
                        <p className="text-xs text-gray-700 dark:text-dark-text font-medium leading-relaxed">{item.t}</p>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>
          )}

        </div>

        <Footer />
      </main>
    </div>
  );
};

export default DefinirDisponibilites;