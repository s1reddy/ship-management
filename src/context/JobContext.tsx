import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { MaintenanceJob, Notification } from '../types';
import { getMaintenanceJobs, saveMaintenanceJobs, getNotifications, saveNotifications, generateId } from '../utils/storage';

interface JobContextType {
  jobs: MaintenanceJob[];
  notifications: Notification[];
  addJob: (job: Omit<MaintenanceJob, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateJob: (id: string, job: Partial<MaintenanceJob>) => void;
  deleteJob: (id: string) => void;
  getJobsByShip: (shipId: string) => MaintenanceJob[];
  getJobsByComponent: (componentId: string) => MaintenanceJob[];
  getJobsByStatus: (status: MaintenanceJob['status']) => MaintenanceJob[];
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt'>) => void;
  markNotificationAsRead: (id: string) => void;
  deleteNotification: (id: string) => void;
}

const JobContext = createContext<JobContextType | undefined>(undefined);

export const JobProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [jobs, setJobs] = useState<MaintenanceJob[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    // Load initial data from localStorage
    setJobs(getMaintenanceJobs());
    setNotifications(getNotifications());
  }, []);

  const addJob = (jobData: Omit<MaintenanceJob, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString();
    const newJob: MaintenanceJob = {
      ...jobData,
      id: generateId(),
      createdAt: now,
      updatedAt: now
    };
    const updatedJobs = [...jobs, newJob];
    setJobs(updatedJobs);
    saveMaintenanceJobs(updatedJobs);

    // Create notification for new job
    addNotification({
      type: 'job_created',
      message: `New maintenance job created: ${jobData.title}`,
      read: false,
      relatedId: newJob.id
    });
  };

  const updateJob = (id: string, jobData: Partial<MaintenanceJob>) => {
    const updatedJobs = jobs.map(job =>
      job.id === id
        ? { ...job, ...jobData, updatedAt: new Date().toISOString() }
        : job
    );
    setJobs(updatedJobs);
    saveMaintenanceJobs(updatedJobs);

    // Create notification for job update
    if (jobData.status) {
      addNotification({
        type: 'job_updated',
        message: `Maintenance job status updated to: ${jobData.status}`,
        read: false,
        relatedId: id
      });
    }
  };

  const deleteJob = (id: string) => {
    const updatedJobs = jobs.filter(job => job.id !== id);
    setJobs(updatedJobs);
    saveMaintenanceJobs(updatedJobs);
  };

  const getJobsByShip = (shipId: string) => {
    return jobs.filter(job => job.shipId === shipId);
  };

  const getJobsByComponent = (componentId: string) => {
    return jobs.filter(job => job.componentId === componentId);
  };

  const getJobsByStatus = (status: MaintenanceJob['status']) => {
    return jobs.filter(job => job.status === status);
  };

  const addNotification = (notificationData: Omit<Notification, 'id' | 'createdAt'>) => {
    const newNotification: Notification = {
      ...notificationData,
      id: generateId(),
      createdAt: new Date().toISOString()
    };
    const updatedNotifications = [...notifications, newNotification];
    setNotifications(updatedNotifications);
    saveNotifications(updatedNotifications);
  };

  const markNotificationAsRead = (id: string) => {
    const updatedNotifications = notifications.map(notification =>
      notification.id === id ? { ...notification, read: true } : notification
    );
    setNotifications(updatedNotifications);
    saveNotifications(updatedNotifications);
  };

  const deleteNotification = (id: string) => {
    const updatedNotifications = notifications.filter(notification => notification.id !== id);
    setNotifications(updatedNotifications);
    saveNotifications(updatedNotifications);
  };

  return (
    <JobContext.Provider
      value={{
        jobs,
        notifications,
        addJob,
        updateJob,
        deleteJob,
        getJobsByShip,
        getJobsByComponent,
        getJobsByStatus,
        addNotification,
        markNotificationAsRead,
        deleteNotification
      }}
    >
      {children}
    </JobContext.Provider>
  );
};

export const useJobs = () => {
  const context = useContext(JobContext);
  if (context === undefined) {
    throw new Error('useJobs must be used within a JobProvider');
  }
  return context;
}; 