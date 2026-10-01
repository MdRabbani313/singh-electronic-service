import {
  ComplaintTicket,
  Technician,
  ServiceCentre,
  UserAccount,
  SystemSettings
} from '../types';
import {
  INITIAL_TICKETS,
  INITIAL_TECHNICIANS,
  INITIAL_SERVICE_CENTRES,
  INITIAL_USERS,
  INITIAL_SETTINGS
} from '../data/initialData';

const STORAGE_KEYS = {
  TICKETS: 'singh_electronics_tickets_v1',
  TECHNICIANS: 'singh_electronics_technicians_v1',
  SERVICE_CENTRES: 'singh_electronics_sc_v1',
  USERS: 'singh_electronics_users_v1',
  ACTIVE_USER: 'singh_electronics_active_user_v1',
  SETTINGS: 'singh_electronics_settings_v1'
};

export function loadTickets(): ComplaintTicket[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.TICKETS);
    if (!raw) {
      saveTickets(INITIAL_TICKETS);
      return INITIAL_TICKETS;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to load tickets from localStorage', err);
    return INITIAL_TICKETS;
  }
}

export function saveTickets(tickets: ComplaintTicket[]) {
  try {
    localStorage.setItem(STORAGE_KEYS.TICKETS, JSON.stringify(tickets));
  } catch (err) {
    console.error('Failed to save tickets to localStorage', err);
  }
}

export function loadTechnicians(): Technician[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.TECHNICIANS);
    if (!raw) {
      saveTechnicians(INITIAL_TECHNICIANS);
      return INITIAL_TECHNICIANS;
    }
    return JSON.parse(raw);
  } catch (err) {
    return INITIAL_TECHNICIANS;
  }
}

export function saveTechnicians(technicians: Technician[]) {
  try {
    localStorage.setItem(STORAGE_KEYS.TECHNICIANS, JSON.stringify(technicians));
  } catch (err) {
    console.error('Failed to save technicians', err);
  }
}

export function loadServiceCentres(): ServiceCentre[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SERVICE_CENTRES);
    if (!raw) {
      saveServiceCentres(INITIAL_SERVICE_CENTRES);
      return INITIAL_SERVICE_CENTRES;
    }
    return JSON.parse(raw);
  } catch (err) {
    return INITIAL_SERVICE_CENTRES;
  }
}

export function saveServiceCentres(serviceCentres: ServiceCentre[]) {
  try {
    localStorage.setItem(STORAGE_KEYS.SERVICE_CENTRES, JSON.stringify(serviceCentres));
  } catch (err) {
    console.error('Failed to save service centres', err);
  }
}

export function loadUsers(): UserAccount[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.USERS);
    if (!raw) {
      saveUsers(INITIAL_USERS);
      return INITIAL_USERS;
    }
    return JSON.parse(raw);
  } catch (err) {
    return INITIAL_USERS;
  }
}

export function saveUsers(users: UserAccount[]) {
  try {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  } catch (err) {
    console.error('Failed to save users', err);
  }
}

export function loadActiveUser(): UserAccount {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ACTIVE_USER);
    if (raw) return JSON.parse(raw);
  } catch (err) {
    // fallback
  }
  return INITIAL_USERS[0]; // Rajesh Singh (Admin)
}

export function saveActiveUser(user: UserAccount) {
  try {
    localStorage.setItem(STORAGE_KEYS.ACTIVE_USER, JSON.stringify(user));
  } catch (err) {
    console.error('Failed to save active user', err);
  }
}

export function loadSettings(): SystemSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (!raw) {
      saveSettings(INITIAL_SETTINGS);
      return INITIAL_SETTINGS;
    }
    return JSON.parse(raw);
  } catch (err) {
    return INITIAL_SETTINGS;
  }
}

export function saveSettings(settings: SystemSettings) {
  try {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  } catch (err) {
    console.error('Failed to save settings', err);
  }
}

export function resetAllDataToDefault() {
  saveTickets(INITIAL_TICKETS);
  saveTechnicians(INITIAL_TECHNICIANS);
  saveServiceCentres(INITIAL_SERVICE_CENTRES);
  saveUsers(INITIAL_USERS);
  saveActiveUser(INITIAL_USERS[0]);
  saveSettings(INITIAL_SETTINGS);
}

export function generateNextTicketNumber(existingTickets: ComplaintTicket[]): string {
  const currentYear = new Date().getFullYear();
  let maxSeq = 1049;
  existingTickets.forEach((t) => {
    const match = t.ticketNumber.match(/SEK-(\d{4})-(\d+)/);
    if (match) {
      const seq = parseInt(match[2], 10);
      if (seq > maxSeq) {
        maxSeq = seq;
      }
    }
  });
  return `SEK-${currentYear}-${maxSeq + 1}`;
}

/**
 * Clean CSV export utility
 */
export function exportToCSV(filename: string, headers: string[], rows: (string | number)[][]) {
  const escapeCell = (val: string | number | undefined | null) => {
    if (val === undefined || val === null) return '""';
    const str = String(val).replace(/"/g, '""');
    return `"${str}"`;
  };

  const csvContent =
    '\uFEFF' + // UTF-8 BOM for Excel Hindi/English support
    [headers.map(escapeCell).join(','), ...rows.map((row) => row.map(escapeCell).join(','))].join('\r\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
