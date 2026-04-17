import api from '../api';

// ─── CONFIGURATION ───────────────────────────────────────────────────────────
// Toggle this to switch between fake and real data
const USE_FAKE_DATA = true; // Set to false when backend is ready

// ─── INTERFACES ──────────────────────────────────────────────────────────────

export interface TimeSlot {
  id: string;
  day: string; // 'monday', 'tuesday', etc.
  startTime: string; // Format: HH:MM
  endTime: string; // Format: HH:MM
  isRecurring: boolean;
}

export interface Exception {
  id: string;
  date: string; // Display format: "25 Déc 2025" or "15-20 Fév 2026"
  reason: string;
  type: 'holiday' | 'vacation' | 'personal';
}

export interface CreateTimeSlotDTO {
  day: string;
  startTime: string;
  endTime: string;
  isRecurring: boolean;
}

export interface CreateExceptionDTO {
  date: string;
  reason: string;
  type: 'holiday' | 'vacation' | 'personal';
}

export interface AvailabilityData {
  timeSlots: TimeSlot[];
  exceptions: Exception[];
}

// ─── FAKE DATA ───────────────────────────────────────────────────────────────

let FAKE_TIME_SLOTS: TimeSlot[] = [
  { id: '1', day: 'monday', startTime: '09:00', endTime: '17:00', isRecurring: true },
  { id: '2', day: 'tuesday', startTime: '09:00', endTime: '17:00', isRecurring: true },
  { id: '3', day: 'wednesday', startTime: '09:00', endTime: '17:00', isRecurring: true },
  { id: '4', day: 'thursday', startTime: '09:00', endTime: '17:00', isRecurring: true },
  { id: '5', day: 'friday', startTime: '09:00', endTime: '17:00', isRecurring: true },
];

let FAKE_EXCEPTIONS: Exception[] = [
  { id: '1', date: '25 Déc 2025', reason: 'Noël', type: 'holiday' },
  { id: '2', date: '1 Jan 2026', reason: 'Nouvel An', type: 'holiday' },
  { id: '3', date: '15-20 Fév 2026', reason: 'Vacances', type: 'vacation' },
];

// Helper function to simulate API delay
const delay = (ms: number = 800) => new Promise(resolve => setTimeout(resolve, ms));

// ─── API CALLS ───────────────────────────────────────────────────────────────

/**
 * Get all availability data (time slots + exceptions)
 */
export const getAvailabilityData = async (): Promise<AvailabilityData> => {
  if (USE_FAKE_DATA) {
    await delay();
    return {
      timeSlots: [...FAKE_TIME_SLOTS],
      exceptions: [...FAKE_EXCEPTIONS]
    };
  }
  
  try {
    const response = await api.get('/provider/availability');
    return response.data;
  } catch (error: any) {
    console.error('Error fetching availability data:', error);
    throw error;
  }
};

/**
 * Get all time slots
 */
export const getTimeSlots = async (): Promise<TimeSlot[]> => {
  if (USE_FAKE_DATA) {
    await delay(500);
    return [...FAKE_TIME_SLOTS];
  }
  
  try {
    const response = await api.get('/provider/availability/time-slots');
    return response.data;
  } catch (error: any) {
    console.error('Error fetching time slots:', error);
    throw error;
  }
};

/**
 * Get time slots for a specific day
 */
export const getTimeSlotsForDay = async (day: string): Promise<TimeSlot[]> => {
  if (USE_FAKE_DATA) {
    await delay(300);
    return FAKE_TIME_SLOTS.filter(slot => slot.day === day);
  }
  
  try {
    const response = await api.get(`/provider/availability/time-slots/${day}`);
    return response.data;
  } catch (error: any) {
    console.error('Error fetching time slots for day:', error);
    throw error;
  }
};

/**
 * Create a new time slot
 */
export const createTimeSlot = async (data: CreateTimeSlotDTO): Promise<TimeSlot> => {
  if (USE_FAKE_DATA) {
    await delay(1000);
    console.log('✅ FAKE: Creating new time slot', data);
    
    const newSlot: TimeSlot = {
      id: Date.now().toString(),
      ...data
    };
    
    FAKE_TIME_SLOTS.push(newSlot);
    return newSlot;
  }
  
  try {
    const response = await api.post('/provider/availability/time-slots', data);
    return response.data;
  } catch (error: any) {
    console.error('Error creating time slot:', error);
    throw error;
  }
};

/**
 * Update a time slot
 */
export const updateTimeSlot = async (id: string, data: Partial<CreateTimeSlotDTO>): Promise<TimeSlot> => {
  if (USE_FAKE_DATA) {
    await delay(800);
    console.log(`✅ FAKE: Updating time slot ${id}`, data);
    
    const index = FAKE_TIME_SLOTS.findIndex(slot => slot.id === id);
    if (index !== -1) {
      FAKE_TIME_SLOTS[index] = { ...FAKE_TIME_SLOTS[index], ...data };
      return FAKE_TIME_SLOTS[index];
    }
    throw new Error('Time slot not found');
  }
  
  try {
    const response = await api.put(`/provider/availability/time-slots/${id}`, data);
    return response.data;
  } catch (error: any) {
    console.error('Error updating time slot:', error);
    throw error;
  }
};

/**
 * Delete a time slot
 */
export const deleteTimeSlot = async (id: string): Promise<void> => {
  if (USE_FAKE_DATA) {
    await delay(600);
    console.log(`🗑️ FAKE: Deleting time slot ${id}`);
    
    FAKE_TIME_SLOTS = FAKE_TIME_SLOTS.filter(slot => slot.id !== id);
    return;
  }
  
  try {
    await api.delete(`/provider/availability/time-slots/${id}`);
  } catch (error: any) {
    console.error('Error deleting time slot:', error);
    throw error;
  }
};

/**
 * Apply template to all weekdays (Mon-Fri)
 */
export const applyTemplateToAll = async (templateSlot: TimeSlot): Promise<TimeSlot[]> => {
  if (USE_FAKE_DATA) {
    await delay(1000);
    console.log('✅ FAKE: Applying template to all weekdays', templateSlot);
    
    const weekdays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];
    const newSlots: TimeSlot[] = weekdays.map((day, idx) => ({
      id: (idx + 1).toString(),
      day,
      startTime: templateSlot.startTime,
      endTime: templateSlot.endTime,
      isRecurring: true
    }));
    
    FAKE_TIME_SLOTS = newSlots;
    return newSlots;
  }
  
  try {
    const response = await api.post('/provider/availability/apply-template', {
      startTime: templateSlot.startTime,
      endTime: templateSlot.endTime,
      isRecurring: templateSlot.isRecurring
    });
    return response.data;
  } catch (error: any) {
    console.error('Error applying template:', error);
    throw error;
  }
};

/**
 * Get all exceptions
 */
export const getExceptions = async (): Promise<Exception[]> => {
  if (USE_FAKE_DATA) {
    await delay(500);
    return [...FAKE_EXCEPTIONS];
  }
  
  try {
    const response = await api.get('/provider/availability/exceptions');
    return response.data;
  } catch (error: any) {
    console.error('Error fetching exceptions:', error);
    throw error;
  }
};

/**
 * Create a new exception
 */
export const createException = async (data: CreateExceptionDTO): Promise<Exception> => {
  if (USE_FAKE_DATA) {
    await delay(1000);
    console.log('✅ FAKE: Creating new exception', data);
    
    const newException: Exception = {
      id: Date.now().toString(),
      ...data
    };
    
    FAKE_EXCEPTIONS.push(newException);
    return newException;
  }
  
  try {
    const response = await api.post('/provider/availability/exceptions', data);
    return response.data;
  } catch (error: any) {
    console.error('Error creating exception:', error);
    throw error;
  }
};

/**
 * Update an exception
 */
export const updateException = async (id: string, data: Partial<CreateExceptionDTO>): Promise<Exception> => {
  if (USE_FAKE_DATA) {
    await delay(800);
    console.log(`✅ FAKE: Updating exception ${id}`, data);
    
    const index = FAKE_EXCEPTIONS.findIndex(ex => ex.id === id);
    if (index !== -1) {
      FAKE_EXCEPTIONS[index] = { ...FAKE_EXCEPTIONS[index], ...data };
      return FAKE_EXCEPTIONS[index];
    }
    throw new Error('Exception not found');
  }
  
  try {
    const response = await api.put(`/provider/availability/exceptions/${id}`, data);
    return response.data;
  } catch (error: any) {
    console.error('Error updating exception:', error);
    throw error;
  }
};

/**
 * Delete an exception
 */
export const deleteException = async (id: string): Promise<void> => {
  if (USE_FAKE_DATA) {
    await delay(600);
    console.log(`🗑️ FAKE: Deleting exception ${id}`);
    
    FAKE_EXCEPTIONS = FAKE_EXCEPTIONS.filter(ex => ex.id !== id);
    return;
  }
  
  try {
    await api.delete(`/provider/availability/exceptions/${id}`);
  } catch (error: any) {
    console.error('Error deleting exception:', error);
    throw error;
  }
};

export default {
  getAvailabilityData,
  getTimeSlots,
  getTimeSlotsForDay,
  createTimeSlot,
  updateTimeSlot,
  deleteTimeSlot,
  applyTemplateToAll,
  getExceptions,
  createException,
  updateException,
  deleteException
};