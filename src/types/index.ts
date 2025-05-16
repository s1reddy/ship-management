export interface User {
  id: string;
  email: string;
  password?: string;
  role: 'admin' | 'inspector' | 'engineer';
  name: string;
}

export interface Ship {
  id: string;
  name: string;
  type: string;
  registrationNumber: string;
  buildDate: string;
  status: 'active' | 'maintenance' | 'inactive';
  components: Component[];
}

export interface Component {
  id: string;
  name: string;
  type: string;
  status: 'operational' | 'maintenance_required' | 'out_of_service';
  shipId: string;
  serialNumber: string;
  installationDate: string;
  lastMaintenance: string;
  nextMaintenance: string;
}

export interface MaintenanceJob {
  id: string;
  title: string;
  description: string;
  shipId: string;
  componentId?: string;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  startDate: string;
  endDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface Notification {
  id: string;
  type: 'job_created' | 'job_updated' | 'job_completed' | 'job_overdue';
  message: string;
  read: boolean;
  createdAt: string;
  relatedId?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
} 