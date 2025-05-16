import type { Ship, Component, MaintenanceJob, Notification } from '../types';

const STORAGE_KEYS = {
  SHIPS: 'ships',
  COMPONENTS: 'components',
  JOBS: 'maintenanceJobs',
  NOTIFICATIONS: 'notifications',
  USER: 'user',
  USERS: 'users'
} as const;

// Generic storage functions
export const getFromStorage = <T>(key: string): T | null => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  } catch (error) {
    console.error(`Error getting data from storage for key ${key}:`, error);
    return null;
  }
};

export const setToStorage = <T>(key: string, value: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error setting data to storage for key ${key}:`, error);
  }
};

export const removeFromStorage = (key: string): void => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error(`Error removing data from storage for key ${key}:`, error);
  }
};

// Ships
export const getShips = (): Ship[] => {
  return getFromStorage<Ship[]>(STORAGE_KEYS.SHIPS) || [];
};

export const saveShips = (ships: Ship[]): void => {
  setToStorage(STORAGE_KEYS.SHIPS, ships);
};

// Components
export const getComponents = (): Component[] => {
  return getFromStorage<Component[]>(STORAGE_KEYS.COMPONENTS) || [];
};

export const saveComponents = (components: Component[]): void => {
  setToStorage(STORAGE_KEYS.COMPONENTS, components);
};

// Maintenance Jobs
export const getMaintenanceJobs = (): MaintenanceJob[] => {
  return getFromStorage<MaintenanceJob[]>(STORAGE_KEYS.JOBS) || [];
};

export const saveMaintenanceJobs = (jobs: MaintenanceJob[]): void => {
  setToStorage(STORAGE_KEYS.JOBS, jobs);
};

// Notifications
export const getNotifications = (): Notification[] => {
  return getFromStorage<Notification[]>(STORAGE_KEYS.NOTIFICATIONS) || [];
};

export const saveNotifications = (notifications: Notification[]): void => {
  setToStorage(STORAGE_KEYS.NOTIFICATIONS, notifications);
};

// Helper function to generate a unique ID
export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}; 