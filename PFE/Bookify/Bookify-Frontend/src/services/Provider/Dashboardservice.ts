import api from '../api';

// ─── CONFIGURATION ───────────────────────────────────────────────────────────
// Toggle this to switch between fake and real data
const USE_FAKE_DATA = true; // Set to false when backend is ready

// ─── INTERFACES ──────────────────────────────────────────────────────────────

export interface DashboardStats {
  profileViews: number;
  averageRating: number;
  totalClients: number;
  totalAppointments: number;
}

export interface AreaChartData {
  month: string;
  v1: number;  // Main line
  v2: number;  // Secondary line
}

export interface BarChartData {
  day: string;
  value: number;
}

export interface PieChartData {
  name: string;
  value: number;
  color: string;
}

export interface PendingRequest {
  id: number;
  clientName: string;
}

export interface UpcomingAppointment {
  id: number;
  name: string;
  date: string;
  time: string;
  service: string;
}

export interface RecentRequest {
  id: number;
  name: string;
  date: string;
  service: string;
  status: 'pending' | 'accepted' | 'refused';
}

export interface DashboardData {
  stats: DashboardStats;
  areaChart: AreaChartData[];
  barChart: BarChartData[];
  pieChart: PieChartData[];
  pendingRequests: PendingRequest[];
  upcomingAppointments: UpcomingAppointment[];
  recentRequests: RecentRequest[];
}

// ─── FAKE DATA ───────────────────────────────────────────────────────────────

const FAKE_DATA: DashboardData = {
  stats: {
    profileViews: 228,
    averageRating: 4.5,
    totalClients: 54,
    totalAppointments: 70
  },
  areaChart: [
    { month: "SEP", v1: 6,  v2: 3  },
    { month: "OCT", v1: 8,  v2: 5  },
    { month: "NOV", v1: 14, v2: 8  },
    { month: "DEC", v1: 10, v2: 6  },
    { month: "JAN", v1: 8,  v2: 4  },
    { month: "FEV", v1: 13, v2: 9  },
  ],
  barChart: [
    { day: "L", value: 18 },
    { day: "M", value: 28 },
    { day: "M", value: 22 },
    { day: "J", value: 32 },
    { day: "V", value: 25 },
    { day: "S", value: 12 },
    { day: "D", value: 8  },
  ],
  pieChart: [
    { name: "Accepter",   value: 63, color: "#1e3a8a" },
    { name: "Refuser",    value: 25, color: "#93c5fd" },
    { name: "En attente", value: 12, color: "#dbeafe" },
  ],
  pendingRequests: [
    { id: 1, clientName: "Khalid Ibnchahboune" },
    { id: 2, clientName: "Youssef Titiou" },
    { id: 3, clientName: "Nossair Zaatout" },
    { id: 4, clientName: "Yassine Anaianai" },
    { id: 5, clientName: "Amine El Jaoui" },
  ],
  upcomingAppointments: [
    { id: 1, name: "Yassir El ghazi",  date: "24.Jan.2026",  time: "10:00AM", service: "Consultation" },
    { id: 2, name: "Hafsa bara",       date: "8.Fev.2026",   time: "02:00PM", service: "Visite" },
    { id: 3, name: "Hassan Bara",      date: "10.Fev.2026",  time: "11:30AM", service: "Traitement" },
    { id: 4, name: "Yassine Aniyanya", date: "15.Fev.2026",  time: "03:30PM", service: "Consultation online" },
    { id: 5, name: "Reda Jamali",      date: "31.Mars.2026", time: "05:00PM", service: "Consultation" },
  ],
  recentRequests: [
    { id: 1, name: "Aya Eddahmani",  date: "26 Mars 2025",  service: "Consultation",        status: "pending" },
    { id: 2, name: "Hassbi taha",    date: "17 Avril 2024", service: "Visite",              status: "pending" },
    { id: 3, name: "Marwa Habchi",   date: "19 Fev 2025",   service: "Consultation online", status: "accepted" },
    { id: 4, name: "Abouali Amine",  date: "15 Juin 2025",  service: "Consultation",        status: "refused" },
  ]
};

// Helper function to simulate API delay
const delay = (ms: number = 800) => new Promise(resolve => setTimeout(resolve, ms));

// ─── API CALLS ───────────────────────────────────────────────────────────────

/**
 * Get all dashboard data for provider
 */
export const getDashboardData = async (): Promise<DashboardData> => {
  if (USE_FAKE_DATA) {
    await delay(); // Simulate network delay
    return FAKE_DATA;
  }
  
  try {
    const response = await api.get('/provider/dashboard');
    return response.data;
  } catch (error: any) {
    console.error('Error fetching dashboard data:', error);
    throw error;
  }
};

/**
 * Get dashboard stats (KPI cards)
 */
export const getDashboardStats = async (): Promise<DashboardStats> => {
  if (USE_FAKE_DATA) {
    await delay(500);
    return FAKE_DATA.stats;
  }
  
  try {
    const response = await api.get('/provider/dashboard/stats');
    return response.data;
  } catch (error: any) {
    console.error('Error fetching dashboard stats:', error);
    throw error;
  }
};

/**
 * Get area chart data (visitors/appointments over time)
 */
export const getAreaChartData = async (): Promise<AreaChartData[]> => {
  if (USE_FAKE_DATA) {
    await delay(600);
    return FAKE_DATA.areaChart;
  }
  
  try {
    const response = await api.get('/provider/dashboard/area-chart');
    return response.data;
  } catch (error: any) {
    console.error('Error fetching area chart data:', error);
    throw error;
  }
};

/**
 * Get bar chart data (weekly appointments)
 */
export const getBarChartData = async (): Promise<BarChartData[]> => {
  if (USE_FAKE_DATA) {
    await delay(500);
    return FAKE_DATA.barChart;
  }
  
  try {
    const response = await api.get('/provider/dashboard/bar-chart');
    return response.data;
  } catch (error: any) {
    console.error('Error fetching bar chart data:', error);
    throw error;
  }
};

/**
 * Get pie chart data (acceptance rate)
 */
export const getPieChartData = async (): Promise<PieChartData[]> => {
  if (USE_FAKE_DATA) {
    await delay(500);
    return FAKE_DATA.pieChart;
  }
  
  try {
    const response = await api.get('/provider/dashboard/pie-chart');
    return response.data;
  } catch (error: any) {
    console.error('Error fetching pie chart data:', error);
    throw error;
  }
};

/**
 * Get pending requests
 */
export const getPendingRequests = async (): Promise<PendingRequest[]> => {
  if (USE_FAKE_DATA) {
    await delay(400);
    return FAKE_DATA.pendingRequests;
  }
  
  try {
    const response = await api.get('/provider/requests/pending');
    return response.data;
  } catch (error: any) {
    console.error('Error fetching pending requests:', error);
    throw error;
  }
};

/**
 * Get upcoming appointments
 */
export const getUpcomingAppointments = async (): Promise<UpcomingAppointment[]> => {
  if (USE_FAKE_DATA) {
    await delay(500);
    return FAKE_DATA.upcomingAppointments;
  }
  
  try {
    const response = await api.get('/provider/appointments/upcoming');
    return response.data;
  } catch (error: any) {
    console.error('Error fetching upcoming appointments:', error);
    throw error;
  }
};

/**
 * Get recent requests
 */
export const getRecentRequests = async (): Promise<RecentRequest[]> => {
  if (USE_FAKE_DATA) {
    await delay(600);
    return FAKE_DATA.recentRequests;
  }
  
  try {
    const response = await api.get('/provider/requests/recent');
    return response.data;
  } catch (error: any) {
    console.error('Error fetching recent requests:', error);
    throw error;
  }
};

/**
 * Accept a request
 */
export const acceptRequest = async (requestId: number): Promise<void> => {
  if (USE_FAKE_DATA) {
    await delay(1000);
    console.log(`✅ FAKE: Request ${requestId} accepted`);
    // Update fake data (simulate backend update)
    const request = FAKE_DATA.recentRequests.find(r => r.id === requestId);
    if (request) {
      request.status = 'accepted';
    }
    return;
  }
  
  try {
    await api.post(`/provider/requests/${requestId}/accept`);
  } catch (error: any) {
    console.error('Error accepting request:', error);
    throw error;
  }
};

/**
 * Refuse a request
 */
export const refuseRequest = async (requestId: number): Promise<void> => {
  if (USE_FAKE_DATA) {
    await delay(1000);
    console.log(`❌ FAKE: Request ${requestId} refused`);
    // Update fake data (simulate backend update)
    const request = FAKE_DATA.recentRequests.find(r => r.id === requestId);
    if (request) {
      request.status = 'refused';
    }
    return;
  }
  
  try {
    await api.post(`/provider/requests/${requestId}/refuse`);
  } catch (error: any) {
    console.error('Error refusing request:', error);
    throw error;
  }
};

export default {
  getDashboardData,
  getDashboardStats,
  getAreaChartData,
  getBarChartData,
  getPieChartData,
  getPendingRequests,
  getUpcomingAppointments,
  getRecentRequests,
  acceptRequest,
  refuseRequest
};