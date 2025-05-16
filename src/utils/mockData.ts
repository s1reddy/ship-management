import type { User, Ship, Component, MaintenanceJob, Notification } from '../types';

// Mock Users
export const MOCK_USERS: User[] = [
  {
    id: "1",
    name: "Admin User",
    email: "admin@entnt.in",
    password: "admin123",
    role: "admin"
  },
  {
    id: "2",
    name: "Inspector User",
    email: "inspector@entnt.in",
    password: "inspect123",
    role: "inspector"
  },
  {
    id: "3",
    name: "Engineer User",
    email: "engineer@entnt.in",
    password: "engine123",
    role: "engineer"
  }
];

// Mock Ships
export const MOCK_SHIPS: Ship[] = [
  {
    id: "s1",
    name: "Ever Given",
    type: "Container Ship",
    registrationNumber: "9811000",
    buildDate: "2018-09-25",
    status: "active",
    components: []
  },
  {
    id: "s2",
    name: "Maersk Alabama",
    type: "Container Ship",
    registrationNumber: "9164263",
    buildDate: "2008-05-12",
    status: "maintenance",
    components: []
  },
  {
    id: "s3",
    name: "Queen Mary 2",
    type: "Cruise Ship",
    registrationNumber: "9241061",
    buildDate: "2003-01-08",
    status: "active",
    components: []
  },
  {
    id: "s4",
    name: "USS Enterprise",
    type: "Aircraft Carrier",
    registrationNumber: "65",
    buildDate: "1958-11-29",
    status: "inactive",
    components: []
  }
];

// Mock Components
export const MOCK_COMPONENTS: Component[] = [
  {
    id: "c1",
    name: "Main Engine",
    type: "Propulsion",
    status: "operational",
    shipId: "s1",
    serialNumber: "ME-2024-001",
    installationDate: "2018-09-25",
    lastMaintenance: "2024-03-12",
    nextMaintenance: "2024-09-12"
  },
  {
    id: "c2",
    name: "Radar",
    type: "Navigation",
    status: "maintenance_required",
    shipId: "s2",
    serialNumber: "RAD-2023-045",
    installationDate: "2008-05-12",
    lastMaintenance: "2023-12-01",
    nextMaintenance: "2024-06-01"
  },
  {
    id: "c3",
    name: "Electrical Generator",
    type: "Power",
    status: "operational",
    shipId: "s1",
    serialNumber: "EG-2024-002",
    installationDate: "2018-09-25",
    lastMaintenance: "2024-02-15",
    nextMaintenance: "2024-08-15"
  },
  {
    id: "c4",
    name: "Navigation System",
    type: "Navigation",
    status: "out_of_service",
    shipId: "s3",
    serialNumber: "NAV-2023-089",
    installationDate: "2003-01-08",
    lastMaintenance: "2023-11-20",
    nextMaintenance: "2024-05-20"
  },
  {
    id: "c5",
    name: "Water Desalination System",
    type: "Utility",
    status: "operational",
    shipId: "s3",
    serialNumber: "WDS-2024-003",
    installationDate: "2003-01-08",
    lastMaintenance: "2024-01-05",
    nextMaintenance: "2024-07-05"
  },
  {
    id: "c6",
    name: "Auxiliary Engine",
    type: "Propulsion",
    status: "maintenance_required",
    shipId: "s4",
    serialNumber: "AE-2023-067",
    installationDate: "1958-11-29",
    lastMaintenance: "2023-10-10",
    nextMaintenance: "2024-04-10"
  }
];

// Mock Maintenance Jobs
export const MOCK_MAINTENANCE_JOBS: MaintenanceJob[] = [
  {
    id: "j1",
    title: "Engine Inspection",
    description: "Routine inspection of main engine components",
    shipId: "s1",
    componentId: "c1",
    priority: "high",
    status: "pending",
    startDate: "2024-05-05",
    endDate: "2024-05-06",
    createdAt: "2024-04-01T10:00:00Z",
    updatedAt: "2024-04-01T10:00:00Z"
  },
  {
    id: "j2",
    title: "Radar System Repair",
    description: "Fix malfunctioning radar display and calibrate sensors",
    shipId: "s2",
    componentId: "c2",
    priority: "medium",
    status: "in_progress",
    startDate: "2024-04-15",
    endDate: "2024-04-18",
    createdAt: "2024-04-02T09:30:00Z",
    updatedAt: "2024-04-10T14:20:00Z"
  },
  {
    id: "j3",
    title: "Electrical Generator Maintenance",
    description: "Scheduled maintenance for primary electrical generator",
    shipId: "s1",
    componentId: "c3",
    priority: "low",
    status: "completed",
    startDate: "2024-04-08",
    endDate: "2024-04-09",
    createdAt: "2024-03-25T11:15:00Z",
    updatedAt: "2024-04-09T16:45:00Z"
  },
  {
    id: "j4",
    title: "Navigation System Replacement",
    description: "Replace faulty navigation system with updated model",
    shipId: "s3",
    componentId: "c4",
    priority: "high",
    status: "pending",
    startDate: "2024-05-10",
    endDate: "2024-05-12",
    createdAt: "2024-04-05T13:20:00Z",
    updatedAt: "2024-04-05T13:20:00Z"
  },
  {
    id: "j5",
    title: "Desalination Filter Change",
    description: "Routine replacement of water desalination filters",
    shipId: "s3",
    componentId: "c5",
    priority: "medium",
    status: "pending",
    startDate: "2024-05-20",
    endDate: "2024-05-20",
    createdAt: "2024-04-08T09:45:00Z",
    updatedAt: "2024-04-08T09:45:00Z"
  },
  {
    id: "j6",
    title: "Auxiliary Engine Overhaul",
    description: "Complete overhaul of auxiliary propulsion engine",
    shipId: "s4",
    componentId: "c6",
    priority: "high",
    status: "cancelled",
    startDate: "2024-04-20",
    endDate: "2024-04-25",
    createdAt: "2024-03-15T10:30:00Z",
    updatedAt: "2024-04-05T15:45:00Z"
  }
];

// Mock Notifications
export const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: "n1",
    type: "job_created",
    message: "New maintenance job created: Engine Inspection",
    read: false,
    createdAt: "2024-04-01T10:00:00Z",
    relatedId: "j1"
  },
  {
    id: "n2",
    type: "job_updated",
    message: "Maintenance job status updated to: in_progress",
    read: true,
    createdAt: "2024-04-10T14:20:00Z",
    relatedId: "j2"
  },
  {
    id: "n3",
    type: "job_completed",
    message: "Maintenance job completed: Electrical Generator Maintenance",
    read: false,
    createdAt: "2024-04-09T16:45:00Z",
    relatedId: "j3"
  },
  {
    id: "n4",
    type: "job_created",
    message: "New maintenance job created: Navigation System Replacement",
    read: true,
    createdAt: "2024-04-05T13:20:00Z",
    relatedId: "j4"
  },
  {
    id: "n5",
    type: "job_overdue",
    message: "Maintenance job is overdue: Radar System Repair",
    read: false,
    createdAt: "2024-04-19T08:00:00Z",
    relatedId: "j2"
  },
  {
    id: "n6",
    type: "job_created",
    message: "New maintenance job created: Desalination Filter Change",
    read: false,
    createdAt: "2024-04-08T09:45:00Z",
    relatedId: "j5"
  },
  {
    id: "n7",
    type: "job_updated",
    message: "Maintenance job status updated to: cancelled",
    read: true,
    createdAt: "2024-04-05T15:45:00Z",
    relatedId: "j6"
  }
];

// Initialize mock data
export const initializeMockData = () => {
  try {
    // Store mock data in localStorage
    localStorage.setItem('users', JSON.stringify(MOCK_USERS));
    localStorage.setItem('ships', JSON.stringify(MOCK_SHIPS));
    localStorage.setItem('components', JSON.stringify(MOCK_COMPONENTS));
    localStorage.setItem('maintenanceJobs', JSON.stringify(MOCK_MAINTENANCE_JOBS));
    localStorage.setItem('notifications', JSON.stringify(MOCK_NOTIFICATIONS));
    
    console.log('Mock data initialized successfully');
  } catch (error) {
    console.error('Error initializing mock data:', error);
    throw error;
  }
}; 