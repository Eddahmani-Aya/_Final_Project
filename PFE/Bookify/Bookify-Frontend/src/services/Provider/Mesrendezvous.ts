import api from '../api';

// ─── CONFIGURATION ───────────────────────────────────────────────────────────
// Toggle this to switch between fake and real data
const USE_FAKE_DATA = true; // Set to false when backend is ready

// ─── INTERFACES ──────────────────────────────────────────────────────────────

export type Status = 'upcoming' | 'completed' | 'cancelled';

export interface Appointment {
  id: number;
  clientName: string;
  clientPhone: string;
  service: string;
  date: string; // Format: YYYY-MM-DD
  startTime: string; // Format: HH:MM
  endTime: string; // Format: HH:MM
  status: Status;
  avatar: string;
  location?: string;
  notes?: string;
  color: string;
}

export interface AppointmentStats {
  total: number;
  today: number;
  thisWeek: number;
  upcoming: number;
  completed: number;
  cancelled: number;
}

export interface CreateAppointmentDTO {
  clientName: string;
  clientPhone: string;
  service: string;
  date: string;
  startTime: string;
  endTime: string;
  location?: string;
  notes?: string;
}

// ─── FAKE DATA ───────────────────────────────────────────────────────────────

const COLORS = [
  '#3b82f6', '#10b981', '#8b5cf6', '#ef4444', '#f59e0b', '#ec4899'
];

let FAKE_APPOINTMENTS: Appointment[] = [
  {
    id: 1, 
    clientName: 'Ahmed Mansouri', 
    clientPhone: '+212 6 11 22 33 44',
    service: 'Consultation générale', 
    date: '2025-01-21', 
    startTime: '09:00', 
    endTime: '09:30',
    status: 'upcoming', 
    avatar: 'https://i.pravatar.cc/150?img=12', 
    location: 'Cabinet', 
    color: '#3b82f6'
  },
  {
    id: 2, 
    clientName: 'Sara Bennis', 
    clientPhone: '+212 6 22 33 44 55',
    service: 'Suivi médical', 
    date: '2025-01-21', 
    startTime: '10:00', 
    endTime: '10:45',
    status: 'upcoming', 
    avatar: 'https://i.pravatar.cc/150?img=47', 
    location: 'Cabinet', 
    color: '#10b981'
  },
  {
    id: 3, 
    clientName: 'Malika Fassi', 
    clientPhone: '+212 6 33 44 55 66',
    service: 'Certificat médical', 
    date: '2025-01-21', 
    startTime: '14:00', 
    endTime: '14:20',
    status: 'upcoming', 
    avatar: 'https://i.pravatar.cc/150?img=68', 
    location: 'Cabinet', 
    color: '#8b5cf6'
  },
  {
    id: 4, 
    clientName: 'Karim Idrissi', 
    clientPhone: '+212 6 44 55 66 77',
    service: 'Urgence', 
    date: '2025-01-22', 
    startTime: '11:30', 
    endTime: '12:00',
    status: 'upcoming', 
    avatar: 'https://i.pravatar.cc/150?img=32', 
    location: 'Cabinet', 
    color: '#ef4444'
  },
  {
    id: 5, 
    clientName: 'Fatima Zahra', 
    clientPhone: '+212 6 55 66 77 88',
    service: 'Visite à domicile', 
    date: '2025-01-22', 
    startTime: '15:00', 
    endTime: '16:00',
    status: 'upcoming', 
    avatar: 'https://i.pravatar.cc/150?img=15', 
    location: 'Domicile', 
    color: '#f59e0b'
  },
  {
    id: 6, 
    clientName: 'Mohamed Nasri', 
    clientPhone: '+212 6 66 77 88 99',
    service: 'Consultation', 
    date: '2025-01-23', 
    startTime: '09:00', 
    endTime: '09:30',
    status: 'upcoming', 
    avatar: 'https://i.pravatar.cc/150?img=44', 
    location: 'Cabinet', 
    color: '#ec4899'
  },
];

// Helper function to simulate API delay
const delay = (ms: number = 800) => new Promise(resolve => setTimeout(resolve, ms));

// Calculate stats from appointments
const calculateStats = (appointments: Appointment[]): AppointmentStats => {
  const today = '2025-01-21';
  const weekStart = new Date('2025-01-20'); // Monday
  const weekEnd = new Date('2025-01-26'); // Sunday
  
  return {
    total: appointments.length,
    today: appointments.filter(a => a.date === today).length,
    thisWeek: appointments.filter(a => {
      const aptDate = new Date(a.date);
      return aptDate >= weekStart && aptDate <= weekEnd;
    }).length,
    upcoming: appointments.filter(a => a.status === 'upcoming').length,
    completed: appointments.filter(a => a.status === 'completed').length,
    cancelled: appointments.filter(a => a.status === 'cancelled').length,
  };
};

// ─── API CALLS ───────────────────────────────────────────────────────────────

/**
 * Get all appointments
 */
export const getAllAppointments = async (): Promise<Appointment[]> => {
  if (USE_FAKE_DATA) {
    await delay();
    return [...FAKE_APPOINTMENTS];
  }
  
  try {
    const response = await api.get('/provider/appointments');
    return response.data;
  } catch (error: any) {
    console.error('Error fetching appointments:', error);
    throw error;
  }
};

/**
 * Get appointments for a specific date range
 */
export const getAppointmentsByDateRange = async (startDate: string, endDate: string): Promise<Appointment[]> => {
  if (USE_FAKE_DATA) {
    await delay(500);
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    return FAKE_APPOINTMENTS.filter(apt => {
      const aptDate = new Date(apt.date);
      return aptDate >= start && aptDate <= end;
    });
  }
  
  try {
    const response = await api.get(`/provider/appointments?startDate=${startDate}&endDate=${endDate}`);
    return response.data;
  } catch (error: any) {
    console.error('Error fetching appointments by date range:', error);
    throw error;
  }
};

/**
 * Get appointments for a specific date
 */
export const getAppointmentsByDate = async (date: string): Promise<Appointment[]> => {
  if (USE_FAKE_DATA) {
    await delay(400);
    return FAKE_APPOINTMENTS.filter(apt => apt.date === date);
  }
  
  try {
    const response = await api.get(`/provider/appointments/date/${date}`);
    return response.data;
  } catch (error: any) {
    console.error('Error fetching appointments by date:', error);
    throw error;
  }
};

/**
 * Get appointment statistics
 */
export const getAppointmentStats = async (): Promise<AppointmentStats> => {
  if (USE_FAKE_DATA) {
    await delay(300);
    return calculateStats(FAKE_APPOINTMENTS);
  }
  
  try {
    const response = await api.get('/provider/appointments/stats');
    return response.data;
  } catch (error: any) {
    console.error('Error fetching appointment stats:', error);
    throw error;
  }
};

/**
 * Get single appointment by ID
 */
export const getAppointmentById = async (id: number): Promise<Appointment | null> => {
  if (USE_FAKE_DATA) {
    await delay(300);
    return FAKE_APPOINTMENTS.find(apt => apt.id === id) || null;
  }
  
  try {
    const response = await api.get(`/provider/appointments/${id}`);
    return response.data;
  } catch (error: any) {
    console.error('Error fetching appointment:', error);
    throw error;
  }
};

/**
 * Create a new appointment
 */
export const createAppointment = async (data: CreateAppointmentDTO): Promise<Appointment> => {
  if (USE_FAKE_DATA) {
    await delay(1000);
    console.log('✅ FAKE: Creating new appointment', data);
    
    const newAppointment: Appointment = {
      id: FAKE_APPOINTMENTS.length + 1,
      ...data,
      status: 'upcoming',
      avatar: `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70)}`,
      color: COLORS[Math.floor(Math.random() * COLORS.length)]
    };
    
    FAKE_APPOINTMENTS.push(newAppointment);
    return newAppointment;
  }
  
  try {
    const response = await api.post('/provider/appointments', data);
    return response.data;
  } catch (error: any) {
    console.error('Error creating appointment:', error);
    throw error;
  }
};

/**
 * Update an appointment
 */
export const updateAppointment = async (id: number, data: Partial<CreateAppointmentDTO>): Promise<Appointment> => {
  if (USE_FAKE_DATA) {
    await delay(1000);
    console.log(`✅ FAKE: Updating appointment ${id}`, data);
    
    const index = FAKE_APPOINTMENTS.findIndex(apt => apt.id === id);
    if (index !== -1) {
      FAKE_APPOINTMENTS[index] = { ...FAKE_APPOINTMENTS[index], ...data };
      return FAKE_APPOINTMENTS[index];
    }
    throw new Error('Appointment not found');
  }
  
  try {
    const response = await api.put(`/provider/appointments/${id}`, data);
    return response.data;
  } catch (error: any) {
    console.error('Error updating appointment:', error);
    throw error;
  }
};

/**
 * Update appointment status
 */
export const updateAppointmentStatus = async (id: number, status: Status): Promise<void> => {
  if (USE_FAKE_DATA) {
    await delay(800);
    console.log(`✅ FAKE: Updating appointment ${id} status to ${status}`);
    
    const appointment = FAKE_APPOINTMENTS.find(apt => apt.id === id);
    if (appointment) {
      appointment.status = status;
    }
    return;
  }
  
  try {
    await api.patch(`/provider/appointments/${id}/status`, { status });
  } catch (error: any) {
    console.error('Error updating appointment status:', error);
    throw error;
  }
};

/**
 * Cancel an appointment
 */
export const cancelAppointment = async (id: number, reason?: string): Promise<void> => {
  if (USE_FAKE_DATA) {
    await delay(1000);
    console.log(`❌ FAKE: Cancelling appointment ${id}`, reason ? `Reason: ${reason}` : '');
    
    const appointment = FAKE_APPOINTMENTS.find(apt => apt.id === id);
    if (appointment) {
      appointment.status = 'cancelled';
    }
    return;
  }
  
  try {
    await api.post(`/provider/appointments/${id}/cancel`, { reason });
  } catch (error: any) {
    console.error('Error cancelling appointment:', error);
    throw error;
  }
};

/**
 * Delete an appointment
 */
export const deleteAppointment = async (id: number): Promise<void> => {
  if (USE_FAKE_DATA) {
    await delay(800);
    console.log(`🗑️ FAKE: Deleting appointment ${id}`);
    
    FAKE_APPOINTMENTS = FAKE_APPOINTMENTS.filter(apt => apt.id !== id);
    return;
  }
  
  try {
    await api.delete(`/provider/appointments/${id}`);
  } catch (error: any) {
    console.error('Error deleting appointment:', error);
    throw error;
  }
};

export default {
  getAllAppointments,
  getAppointmentsByDateRange,
  getAppointmentsByDate,
  getAppointmentStats,
  getAppointmentById,
  createAppointment,
  updateAppointment,
  updateAppointmentStatus,
  cancelAppointment,
  deleteAppointment
};