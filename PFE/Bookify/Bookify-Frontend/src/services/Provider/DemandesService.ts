import api from '../api';

// ─── CONFIGURATION ───────────────────────────────────────────────────────────
// Toggle this to switch between fake and real data
const USE_FAKE_DATA = true; // Set to false when backend is ready

// ─── INTERFACES ──────────────────────────────────────────────────────────────

export type Status = 'pending' | 'accepted' | 'refused';

export interface Demande {
  id: number;
  clientName: string;
  service: string;
  date: string;
  time: string;
  phone: string;
  status: Status;
  avatar: string;
  note?: string;
  createdAt: string;
  isNew?: boolean;
}

export interface DemandesStats {
  total: number;
  pending: number;
  accepted: number;
  refused: number;
}

export interface DemandeDetails extends Demande {
  clientEmail: string;
  duration: string;
  location?: string;
}

export interface HistoryItem {
  date: string;
  action: string;
  author: string;
  note?: string;
}

// ─── FAKE DATA ───────────────────────────────────────────────────────────────

const FAKE_DEMANDES: Demande[] = [
  { 
    id: 1, 
    clientName: 'Ahmed Mansouri', 
    service: 'Consultation générale', 
    date: '21 Jan 2025', 
    time: '02:00 PM', 
    phone: '+212 6 11 22 33 44', 
    status: 'pending', 
    avatar: 'https://i.pravatar.cc/150?img=12',
    note: 'Besoin urgent de consultation pour mal de dos',
    createdAt: '15 Jan 2025',
    isNew: true
  },
  { 
    id: 2, 
    clientName: 'Sara Bennis', 
    service: 'Suivi médical', 
    date: '17 Fév 2025', 
    time: '06:00 PM', 
    phone: '+212 6 22 33 44 55', 
    status: 'pending', 
    avatar: 'https://i.pravatar.cc/150?img=47',
    note: 'Consultation de suivi après traitement',
    createdAt: '16 Jan 2025',
    isNew: true
  },
  { 
    id: 3, 
    clientName: 'Malika Fassi', 
    service: 'Certificat médical', 
    date: '25 Fév 2025', 
    time: '10:00 AM', 
    phone: '+212 6 33 44 55 66', 
    status: 'accepted', 
    avatar: 'https://i.pravatar.cc/150?img=68',
    createdAt: '14 Jan 2025'
  },
  { 
    id: 4, 
    clientName: 'Karim Idrissi', 
    service: 'Consultation générale', 
    date: '31 Jan 2025', 
    time: '11:30 AM', 
    phone: '+212 6 44 55 66 77', 
    status: 'refused', 
    avatar: 'https://i.pravatar.cc/150?img=32',
    note: 'Conflit d\'horaire',
    createdAt: '13 Jan 2025'
  },
  { 
    id: 5, 
    clientName: 'Fatima Zahra', 
    service: 'Visite à domicile', 
    date: '05 Mar 2025', 
    time: '09:00 AM', 
    phone: '+212 6 55 66 77 88', 
    status: 'pending', 
    avatar: 'https://i.pravatar.cc/150?img=15',
    note: 'Préfère une visite à domicile',
    createdAt: '17 Jan 2025',
    isNew: true
  },
  { 
    id: 6, 
    clientName: 'Mohamed Nasri', 
    service: 'Urgence', 
    date: '12 Mar 2025', 
    time: '03:30 PM', 
    phone: '+212 6 66 77 88 99', 
    status: 'accepted', 
    avatar: 'https://i.pravatar.cc/150?img=44',
    createdAt: '12 Jan 2025'
  },
  { 
    id: 7, 
    clientName: 'Youssef Alami', 
    service: 'Consultation générale', 
    date: '28 Déc 2024', 
    time: '08:30 AM', 
    phone: '+212 6 77 88 99 00', 
    status: 'accepted', 
    avatar: 'https://i.pravatar.cc/150?img=57',
    createdAt: '10 Jan 2025'
  },
];

const FAKE_HISTORY: Record<number, HistoryItem[]> = {
  1: [
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
  ],
  2: [
    {
      date: '16 Jan 2025, 14:20',
      action: 'Demande créée',
      author: 'Sara Bennis',
    }
  ],
  3: [
    {
      date: '14 Jan 2025, 08:45',
      action: 'Demande créée',
      author: 'Malika Fassi',
    },
    {
      date: '14 Jan 2025, 09:30',
      action: 'Demande acceptée',
      author: 'Dr. Youssef',
      note: 'Rendez-vous confirmé'
    }
  ]
};

// Helper function to simulate API delay
const delay = (ms: number = 800) => new Promise(resolve => setTimeout(resolve, ms));

// ─── API CALLS ───────────────────────────────────────────────────────────────

/**
 * Get all demandes
 */
export const getAllDemandes = async (): Promise<Demande[]> => {
  if (USE_FAKE_DATA) {
    await delay();
    return [...FAKE_DEMANDES];
  }
  
  try {
    const response = await api.get('/provider/demandes');
    return response.data;
  } catch (error: any) {
    console.error('Error fetching demandes:', error);
    throw error;
  }
};

/**
 * Get demandes by status
 */
export const getDemandesByStatus = async (status: Status): Promise<Demande[]> => {
  if (USE_FAKE_DATA) {
    await delay(500);
    return FAKE_DEMANDES.filter(d => d.status === status);
  }
  
  try {
    const response = await api.get(`/provider/demandes?status=${status}`);
    return response.data;
  } catch (error: any) {
    console.error('Error fetching demandes by status:', error);
    throw error;
  }
};

/**
 * Get pending demandes (urgent)
 */
export const getPendingDemandes = async (): Promise<Demande[]> => {
  if (USE_FAKE_DATA) {
    await delay(400);
    return FAKE_DEMANDES.filter(d => d.status === 'pending');
  }
  
  try {
    const response = await api.get('/provider/demandes/pending');
    return response.data;
  } catch (error: any) {
    console.error('Error fetching pending demandes:', error);
    throw error;
  }
};

/**
 * Get urgent demandes (new + pending)
 */
export const getUrgentDemandes = async (): Promise<Demande[]> => {
  if (USE_FAKE_DATA) {
    await delay(300);
    return FAKE_DEMANDES.filter(d => d.status === 'pending' && d.isNew).slice(0, 3);
  }
  
  try {
    const response = await api.get('/provider/demandes/urgent');
    return response.data;
  } catch (error: any) {
    console.error('Error fetching urgent demandes:', error);
    throw error;
  }
};

/**
 * Get demandes statistics
 */
export const getDemandesStats = async (): Promise<DemandesStats> => {
  if (USE_FAKE_DATA) {
    await delay(300);
    return {
      total: FAKE_DEMANDES.length,
      pending: FAKE_DEMANDES.filter(d => d.status === 'pending').length,
      accepted: FAKE_DEMANDES.filter(d => d.status === 'accepted').length,
      refused: FAKE_DEMANDES.filter(d => d.status === 'refused').length,
    };
  }
  
  try {
    const response = await api.get('/provider/demandes/stats');
    return response.data;
  } catch (error: any) {
    console.error('Error fetching demandes stats:', error);
    throw error;
  }
};

/**
 * Get single demande by ID (with extended details)
 */
export const getDemandeById = async (id: number): Promise<DemandeDetails | null> => {
  if (USE_FAKE_DATA) {
    await delay(400);
    const demande = FAKE_DEMANDES.find(d => d.id === id);
    if (!demande) return null;
    
    // Add extended fields for detail page
    return {
      ...demande,
      clientEmail: `${demande.clientName.toLowerCase().replace(/ /g, '.')}.@email.com`,
      duration: '30 minutes',
      location: 'Casablanca, Maarif'
    };
  }
  
  try {
    const response = await api.get(`/provider/demandes/${id}`);
    return response.data;
  } catch (error: any) {
    console.error('Error fetching demande:', error);
    throw error;
  }
};

/**
 * Get demande history/interactions
 */
export const getDemandeHistory = async (id: number): Promise<HistoryItem[]> => {
  if (USE_FAKE_DATA) {
    await delay(300);
    return FAKE_HISTORY[id] || [
      {
        date: new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
        action: 'Demande créée',
        author: 'Client',
      }
    ];
  }
  
  try {
    const response = await api.get(`/provider/demandes/${id}/history`);
    return response.data;
  } catch (error: any) {
    console.error('Error fetching demande history:', error);
    throw error;
  }
};

/**
 * Accept a demande
 */
export const acceptDemande = async (id: number, comment: string): Promise<void> => {
  if (USE_FAKE_DATA) {
    await delay(1000);
    console.log(`✅ FAKE: Demande ${id} accepted with comment: "${comment}"`);
    const demande = FAKE_DEMANDES.find(d => d.id === id);
    if (demande) {
      demande.status = 'accepted';
      demande.isNew = false;
    }
    return;
  }
  
  try {
    await api.post(`/provider/demandes/${id}/accept`, { comment });
  } catch (error: any) {
    console.error('Error accepting demande:', error);
    throw error;
  }
};

/**
 * Refuse a demande
 */
export const refuseDemande = async (id: number, comment: string): Promise<void> => {
  if (USE_FAKE_DATA) {
    await delay(1000);
    console.log(`❌ FAKE: Demande ${id} refused with comment: "${comment}"`);
    const demande = FAKE_DEMANDES.find(d => d.id === id);
    if (demande) {
      demande.status = 'refused';
      demande.isNew = false;
    }
    return;
  }
  
  try {
    await api.post(`/provider/demandes/${id}/refuse`, { comment });
  } catch (error: any) {
    console.error('Error refusing demande:', error);
    throw error;
  }
};

/**
 * Search demandes
 */
export const searchDemandes = async (query: string): Promise<Demande[]> => {
  if (USE_FAKE_DATA) {
    await delay(400);
    const q = query.toLowerCase();
    return FAKE_DEMANDES.filter(d => 
      d.clientName.toLowerCase().includes(q) || 
      d.service.toLowerCase().includes(q)
    );
  }
  
  try {
    const response = await api.get(`/provider/demandes/search?q=${query}`);
    return response.data;
  } catch (error: any) {
    console.error('Error searching demandes:', error);
    throw error;
  }
};

export default {
  getAllDemandes,
  getDemandesByStatus,
  getPendingDemandes,
  getUrgentDemandes,
  getDemandesStats,
  getDemandeById,
  getDemandeHistory,
  acceptDemande,
  refuseDemande,
  searchDemandes
};