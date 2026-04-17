import React, { useState } from 'react';
import { 
  ArrowLeft, Calendar, Clock, MapPin, Phone, Mail, User, 
  FileText, MessageSquare, Check, X, Send, AlertCircle,
  CheckCircle2, XCircle, History
} from 'lucide-react';
import Navbar from '../../components/Provider/Navbar';
import TopBar from '../../components/Provider/TopBar';
import Footer from '../../components/Provider/Footer';
import { useNavigate, useParams } from 'react-router-dom';

interface Demande {
  id: number;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  service: string;
  date: string;
  time: string;
  duration: string;
  note: string;
  avatar: string;
  createdAt: string;
  status: 'pending' | 'accepted' | 'refused';
  location?: string;
}

interface HistoryItem {
  date: string;
  action: string;
  author: string;
  note?: string;
}

// Mock data - à remplacer par API call
const DEMANDE_DETAILS: Demande = {
  id: 1,
  clientName: 'Ahmed Mansouri',
  clientEmail: 'ahmed.mansouri@email.com',
  clientPhone: '+212 6 11 22 33 44',
  service: 'Consultation générale',
  date: '21 Janvier 2025',
  time: '14:00',
  duration: '30 minutes',
  note: 'Besoin urgent de consultation pour mal de dos persistant depuis 3 jours. Douleur intense dans la région lombaire, difficulté à se déplacer.',
  avatar: 'https://i.pravatar.cc/150?img=12',
  createdAt: '15 Janvier 2025 à 09:30',
  status: 'pending',
  location: 'Casablanca, Maarif'
};

const HISTORY: HistoryItem[] = [
  {
    date: '15 Jan 2025, 09:30',
    action: 'Demande créée',
    author: 'Ahmed Mansouri',
  },
  {
    date: '15 Jan 2025, 10:15',
    action: 'Message envoyé',
    author: 'Dr. Youssef',
    note: 'Pouvez-vous préciser la nature de la douleur?'
  },
  {
    date: '15 Jan 2025, 11:00',
    action: 'Réponse reçue',
    author: 'Ahmed Mansouri',
    note: 'Douleur aiguë, pire le matin'
  }
];

const AccepterRefuser: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
   const [activeSection, setActiveSection] = useState<string>('listeDesDemandes');
    const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [userName] = useState('Dr. Youssef');
  
  const [comment, setComment] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [actionType, setActionType] = useState<'accept' | 'refuse' | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAccept = () => {
    if (!comment.trim()) {
      alert('Veuillez ajouter un commentaire pour confirmer.');
      return;
    }
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setActionType('accept');
      setShowSuccessModal(true);
      
      // Redirect after 2s
      setTimeout(() => {
        navigate('/provider/demandes');
      }, 2000);
    }, 1000);
  };

  const handleRefuse = () => {
    if (!comment.trim()) {
      alert('Veuillez indiquer la raison du refus.');
      return;
    }
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setActionType('refuse');
      setShowSuccessModal(true);
      
      // Redirect after 2s
      setTimeout(() => {
        navigate('/provider/demandes');
      }, 2000);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[#F4F7FE] dark:bg-dark-bg transition-colors duration-200">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        * { font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif; }
        @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(18px) } to { opacity: 1; transform: translateY(0) } }
        @keyframes scaleIn { from { opacity: 0; transform: scale(0.95) } to { opacity: 1; transform: scale(1) } }
        .sidebar-overlay { animation: fadeIn .3s ease-out forwards; }
        .anim-up { animation: slideUp .45s cubic-bezier(.16, 1, .3, 1) both; }
        .anim-scale { animation: scaleIn .3s cubic-bezier(.16, 1, .3, 1) both; }
        .info-row { transition: all 0.2s ease; }
        .info-row:hover { background: rgba(0, 89, 178, 0.03); }
      `}</style>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-[100] flex items-center justify-center p-4 sidebar-overlay">
          <div className="bg-white dark:bg-dark-surface rounded-2xl p-8 max-w-md w-full text-center anim-scale shadow-2xl">
            {actionType === 'accept' ? (
              <>
                <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-500/15 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="text-emerald-600 dark:text-emerald-400" size={32} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-dark-text mb-2">Demande Acceptée!</h3>
                <p className="text-gray-600 dark:text-dark-muted text-sm">
                  Le client recevra une notification de confirmation par email.
                </p>
              </>
            ) : (
              <>
                <div className="w-16 h-16 bg-red-100 dark:bg-red-500/15 rounded-full flex items-center justify-center mx-auto mb-4">
                  <XCircle className="text-red-600 dark:text-red-400" size={32} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-dark-text mb-2">Demande Refusée</h3>
                <p className="text-gray-600 dark:text-dark-muted text-sm">
                  Le client sera informé du refus avec votre commentaire.
                </p>
              </>
            )}
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
          <div className="flex items-center gap-4 anim-up">
            <button
              onClick={() => navigate('/Liste-Des-Demandes')}
              className="p-2 hover:bg-white dark:hover:bg-dark-surface rounded-xl transition-all"
            >
              <ArrowLeft size={20} className="text-gray-600 dark:text-dark-muted" />
            </button>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-dark-text">Gérer la Demande</h1>
              <p className="text-sm text-gray-500 dark:text-dark-muted mt-0.5">
                Demande #{id} • Reçue le {DEMANDE_DETAILS.createdAt}
              </p>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-yellow-100 dark:bg-yellow-500/15 text-yellow-700 dark:text-yellow-400 rounded-xl font-semibold text-sm shrink-0">
              <Clock size={15} />
              En attente
            </div>
          </div>

          {/* MAIN LAYOUT */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* LEFT COLUMN - Client Info & Details */}
            <div className="lg:col-span-2 space-y-6">

              {/* Client Info Card */}
              <div className="bg-white dark:bg-dark-surface rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-dark-border anim-up" style={{ animationDelay: '.05s' }}>
                <div className="flex items-start gap-4 mb-6">
                  <img
                    src={DEMANDE_DETAILS.avatar}
                    alt={DEMANDE_DETAILS.clientName}
                    className="w-16 h-16 rounded-full object-cover ring-4 ring-blue-50 dark:ring-blue-500/10"
                  />
                  <div className="flex-1">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-dark-text">{DEMANDE_DETAILS.clientName}</h2>
                    <p className="text-sm text-gray-500 dark:text-dark-muted mb-3">Nouveau patient</p>
                    <div className="flex flex-wrap gap-3">
                      <a href={`tel:${DEMANDE_DETAILS.clientPhone}`} className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400 hover:underline">
                        <Phone size={14} />
                        {DEMANDE_DETAILS.clientPhone}
                      </a>
                      <a href={`mailto:${DEMANDE_DETAILS.clientEmail}`} className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400 hover:underline">
                        <Mail size={14} />
                        {DEMANDE_DETAILS.clientEmail}
                      </a>
                    </div>
                  </div>
                </div>

                {/* Appointment Details */}
                <div className="space-y-3">
                  <h3 className="text-sm font-bold text-gray-900 dark:text-dark-text mb-3 flex items-center gap-2">
                    <FileText size={16} className="text-blue-600 dark:text-blue-400" />
                    Détails du rendez-vous
                  </h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="info-row flex items-center gap-3 p-3 bg-gray-50 dark:bg-dark-bg rounded-xl">
                      <div className="w-10 h-10 bg-blue-100 dark:bg-blue-500/15 rounded-lg flex items-center justify-center shrink-0">
                        <Calendar size={16} className="text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 dark:text-dark-muted">Date</p>
                        <p className="text-sm font-semibold text-gray-900 dark:text-dark-text">{DEMANDE_DETAILS.date}</p>
                      </div>
                    </div>

                    <div className="info-row flex items-center gap-3 p-3 bg-gray-50 dark:bg-dark-bg rounded-xl">
                      <div className="w-10 h-10 bg-blue-100 dark:bg-blue-500/15 rounded-lg flex items-center justify-center shrink-0">
                        <Clock size={16} className="text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 dark:text-dark-muted">Heure</p>
                        <p className="text-sm font-semibold text-gray-900 dark:text-dark-text">{DEMANDE_DETAILS.time}</p>
                      </div>
                    </div>

                    <div className="info-row flex items-center gap-3 p-3 bg-gray-50 dark:bg-dark-bg rounded-xl">
                      <div className="w-10 h-10 bg-blue-100 dark:bg-blue-500/15 rounded-lg flex items-center justify-center shrink-0">
                        <User size={16} className="text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 dark:text-dark-muted">Service</p>
                        <p className="text-sm font-semibold text-gray-900 dark:text-dark-text">{DEMANDE_DETAILS.service}</p>
                      </div>
                    </div>

                    <div className="info-row flex items-center gap-3 p-3 bg-gray-50 dark:bg-dark-bg rounded-xl">
                      <div className="w-10 h-10 bg-blue-100 dark:bg-blue-500/15 rounded-lg flex items-center justify-center shrink-0">
                        <Clock size={16} className="text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 dark:text-dark-muted">Durée</p>
                        <p className="text-sm font-semibold text-gray-900 dark:text-dark-text">{DEMANDE_DETAILS.duration}</p>
                      </div>
                    </div>
                  </div>

                  {DEMANDE_DETAILS.location && (
                    <div className="info-row flex items-center gap-3 p-3 bg-gray-50 dark:bg-dark-bg rounded-xl">
                      <div className="w-10 h-10 bg-blue-100 dark:bg-blue-500/15 rounded-lg flex items-center justify-center shrink-0">
                        <MapPin size={16} className="text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 dark:text-dark-muted">Localisation</p>
                        <p className="text-sm font-semibold text-gray-900 dark:text-dark-text">{DEMANDE_DETAILS.location}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Client Note */}
              <div className="bg-white dark:bg-dark-surface rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-dark-border anim-up" style={{ animationDelay: '.1s' }}>
                <h3 className="text-sm font-bold text-gray-900 dark:text-dark-text mb-3 flex items-center gap-2">
                  <MessageSquare size={16} className="text-blue-600 dark:text-blue-400" />
                  Note du client
                </h3>
                <div className="p-4 bg-blue-50 dark:bg-blue-500/10 rounded-xl border-l-4 border-blue-600 dark:border-blue-400">
                  <p className="text-sm text-gray-700 dark:text-dark-text leading-relaxed">
                    {DEMANDE_DETAILS.note}
                  </p>
                </div>
              </div>

              {/* Your Comment */}
              <div className="bg-white dark:bg-dark-surface rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-dark-border anim-up" style={{ animationDelay: '.15s' }}>
                <h3 className="text-sm font-bold text-gray-900 dark:text-dark-text mb-3 flex items-center gap-2">
                  <Send size={16} className="text-blue-600 dark:text-blue-400" />
                  Ajouter un commentaire
                </h3>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Ajoutez une note ou un message pour le client..."
                  rows={4}
                  className="w-full p-4 bg-gray-50 dark:bg-dark-bg border border-gray-200 dark:border-dark-border rounded-xl text-sm text-gray-900 dark:text-dark-text placeholder-gray-400 dark:placeholder-dark-muted outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-all resize-none"
                />
                <p className="text-xs text-gray-500 dark:text-dark-muted mt-2">
                  {comment.length}/500 caractères
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 anim-up" style={{ animationDelay: '.2s' }}>
                <button
                  onClick={handleAccept}
                  disabled={isSubmitting || !comment.trim()}
                  className="flex-1 flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-300 dark:disabled:bg-gray-700 text-white px-6 py-4 rounded-xl font-bold text-sm transition-all shadow-md hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                      Traitement...
                    </>
                  ) : (
                    <>
                      <Check size={18} />
                      Accepter la Demande
                    </>
                  )}
                </button>
                
                <button
                  onClick={handleRefuse}
                  disabled={isSubmitting || !comment.trim()}
                  className="flex-1 flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 disabled:bg-gray-300 dark:disabled:bg-gray-700 text-white px-6 py-4 rounded-xl font-bold text-sm transition-all shadow-md hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                      Traitement...
                    </>
                  ) : (
                    <>
                      <X size={18} />
                      Refuser la Demande
                    </>
                  )}
                </button>
              </div>

            </div>

            {/* RIGHT COLUMN - History & Tips */}
            <div className="space-y-6">

              {/* History */}
              <div className="bg-white dark:bg-dark-surface rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-dark-border anim-up" style={{ animationDelay: '.1s' }}>
                <h3 className="text-sm font-bold text-gray-900 dark:text-dark-text mb-4 flex items-center gap-2">
                  <History size={16} className="text-blue-600 dark:text-blue-400" />
                  Historique des interactions
                </h3>
                <div className="space-y-3">
                  {HISTORY.map((item, i) => (
                    <div key={i} className="relative pl-6 pb-4 last:pb-0">
                      {/* Timeline line */}
                      {i < HISTORY.length - 1 && (
                        <div className="absolute left-2 top-6 bottom-0 w-0.5 bg-gray-200 dark:bg-dark-border" />
                      )}
                      
                      {/* Timeline dot */}
                      <div className="absolute left-0 top-1 w-4 h-4 bg-blue-600 dark:bg-blue-400 rounded-full ring-4 ring-white dark:ring-dark-surface" />
                      
                      <div>
                        <p className="text-xs text-gray-400 dark:text-dark-muted mb-1">{item.date}</p>
                        <p className="text-sm font-semibold text-gray-900 dark:text-dark-text">{item.action}</p>
                        <p className="text-xs text-gray-500 dark:text-dark-muted mb-1">par {item.author}</p>
                        {item.note && (
                          <div className="mt-2 p-2 bg-gray-50 dark:bg-dark-bg rounded-lg">
                            <p className="text-xs text-gray-600 dark:text-dark-muted italic">"{item.note}"</p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tips */}
              <div className="bg-gradient-to-br from-[#0059B2] to-[#1A6FD1] rounded-2xl p-5 text-white shadow-lg anim-up" style={{ animationDelay: '.15s' }}>
                <h3 className="text-sm font-bold mb-3 flex items-center gap-2">
                  <AlertCircle size={16} />
                  Conseils
                </h3>
                <div className="space-y-3">
                  {[
                    { e: '✅', t: 'Vérifiez votre disponibilité avant d\'accepter' },
                    { e: '💬', t: 'Ajoutez toujours un commentaire explicatif' },
                    { e: '⏰', t: 'Répondez rapidement pour une meilleure expérience' },
                    { e: '📞', t: 'Contactez le client si besoin de clarification' }
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-2.5 p-2.5 bg-white/10 rounded-xl backdrop-blur-sm">
                      <span className="text-base leading-none">{item.e}</span>
                      <p className="text-xs font-medium leading-relaxed">{item.t}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white dark:bg-dark-surface rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-dark-border anim-up" style={{ animationDelay: '.2s' }}>
                <h3 className="text-sm font-bold text-gray-900 dark:text-dark-text mb-3">Actions rapides</h3>
                <div className="space-y-2">
                  <a
                    href={`tel:${DEMANDE_DETAILS.clientPhone}`}
                    className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-500/10 hover:bg-blue-100 dark:hover:bg-blue-500/20 rounded-xl transition-all group"
                  >
                    <div className="w-8 h-8 bg-blue-600 dark:bg-blue-500 rounded-lg flex items-center justify-center">
                      <Phone size={14} className="text-white" />
                    </div>
                    <span className="text-sm font-semibold text-gray-900 dark:text-dark-text">Appeler le client</span>
                  </a>
                  
                  <a
                    href={`mailto:${DEMANDE_DETAILS.clientEmail}`}
                    className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-dark-bg hover:bg-gray-100 dark:hover:bg-dark-border rounded-xl transition-all group"
                  >
                    <div className="w-8 h-8 bg-gray-600 dark:bg-gray-500 rounded-lg flex items-center justify-center">
                      <Mail size={14} className="text-white" />
                    </div>
                    <span className="text-sm font-semibold text-gray-900 dark:text-dark-text">Envoyer un email</span>
                  </a>
                </div>
              </div>

            </div>
          </div>

        </div>

        <Footer />
      </main>
    </div>
  );
};

export default AccepterRefuser;