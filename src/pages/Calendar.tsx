import * as React from 'react';
import { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  ToggleButton,
  ToggleButtonGroup,
  useTheme,
  alpha,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Fade,
  Zoom,
} from '@mui/material';
import {
  ViewDay,
  ViewWeek,
  ViewModule,
  ChevronLeft,
  ChevronRight,
  Warning,
  Schedule,
} from '@mui/icons-material';
import { DateCalendar, LocalizationProvider, PickersDay, PickersDayProps } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { useJobs } from '../context/JobContext';
import type { MaintenanceJob } from '../types';

type ViewMode = 'day' | 'week' | 'month';

interface Job {
  id: string;
  title: string;
  description: string;
  startDate: string;
  status: 'pending' | 'in_progress' | 'completed';
  priority: 'low' | 'medium' | 'high' | 'critical';
  assignedTo: string;
  shipId: string;
}

// Dummy data for demonstration
const dummyJobs: Job[] = [
  {
    id: '1',
    title: 'Engine Maintenance',
    description: 'Regular engine maintenance and inspection',
    startDate: new Date().toISOString(),
    status: 'pending',
    priority: 'high',
    assignedTo: 'John Doe',
    shipId: 'ship1',
  },
  {
    id: '2',
    title: 'Hull Inspection',
    description: 'Quarterly hull inspection and cleaning',
    startDate: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
    status: 'in_progress',
    priority: 'medium',
    assignedTo: 'Jane Smith',
    shipId: 'ship2',
  },
  {
    id: '3',
    title: 'Navigation System Update',
    description: 'Software update for navigation systems',
    startDate: new Date(Date.now() + 172800000).toISOString(), // Day after tomorrow
    status: 'pending',
    priority: 'critical',
    assignedTo: 'Mike Johnson',
    shipId: 'ship3',
  },
];

type CalendarJob = Job | MaintenanceJob;

const Calendar = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('month');
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedJob, setSelectedJob] = useState<CalendarJob | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const { jobs = [] } = useJobs();
  const allJobs = [...jobs, ...dummyJobs];
  const theme = useTheme();

  const handleViewChange = (
    _event: React.MouseEvent<HTMLElement>,
    newView: ViewMode | null,
  ) => {
    if (newView !== null) {
      setViewMode(newView);
    }
  };

  const handleDateChange = (newDate: Date | null) => {
    if (newDate) {
      setSelectedDate(newDate);
    }
  };

  const handlePrevious = () => {
    const newDate = new Date(selectedDate);
    switch (viewMode) {
      case 'day':
        newDate.setDate(newDate.getDate() - 1);
        break;
      case 'week':
        newDate.setDate(newDate.getDate() - 7);
        break;
      case 'month':
        newDate.setMonth(newDate.getMonth() - 1);
        break;
    }
    setSelectedDate(newDate);
  };

  const handleNext = () => {
    const newDate = new Date(selectedDate);
    switch (viewMode) {
      case 'day':
        newDate.setDate(newDate.getDate() + 1);
        break;
      case 'week':
        newDate.setDate(newDate.getDate() + 7);
        break;
      case 'month':
        newDate.setMonth(newDate.getMonth() + 1);
        break;
    }
    setSelectedDate(newDate);
  };

  const getJobsForDate = (date: Date) => {
    return allJobs.filter(job => {
      const jobDate = new Date(job.startDate);
      return (
        jobDate.getDate() === date.getDate() &&
        jobDate.getMonth() === date.getMonth() &&
        jobDate.getFullYear() === date.getFullYear()
      );
    });
  };

  const renderDayContent = (props: PickersDayProps<Date>) => {
    const { day, ...other } = props;
    const dayJobs = getJobsForDate(day);
    
    return (
      <PickersDay
        {...other}
        day={day}
        sx={{
          position: 'relative',
          height: 80,
          width: 80,
          '&:hover': {
            bgcolor: alpha(theme.palette.primary.main, 0.05),
          },
        }}
        onClick={() => {
          if (dayJobs.length > 0) {
            setSelectedJob(dayJobs[0] as CalendarJob);
            setOpenDialog(true);
          }
        }}
      >
        <Box
          sx={{
            position: 'relative',
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Typography variant="body2">{day.getDate()}</Typography>
          {dayJobs.length > 0 && (
            <Box
              sx={{
                position: 'absolute',
                bottom: 2,
                left: 2,
                right: 2,
                display: 'flex',
                gap: 0.5,
                justifyContent: 'center',
              }}
            >
              {dayJobs.map(job => (
                <Box
                  key={job.id}
                  sx={{
                    width: 4,
                    height: 4,
                    borderRadius: '50%',
                    bgcolor: job.priority === 'critical' || job.priority === 'high'
                      ? theme.palette.error.main
                      : job.priority === 'medium'
                      ? theme.palette.warning.main
                      : theme.palette.primary.main,
                    animation: job.priority === 'critical' ? 'pulse 2s infinite' : 'none',
                  }}
                />
              ))}
            </Box>
          )}
        </Box>
      </PickersDay>
    );
  };

  const renderJobDetails = (job: CalendarJob) => {
    const isMaintenanceJob = 'componentId' in job;
    const isJob = 'assignedTo' in job;
    
    return (
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth="sm"
        fullWidth
        TransitionComponent={Zoom}
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Schedule color="primary" />
            <Typography variant="h6">{job.title}</Typography>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <Typography variant="body1" gutterBottom>
              {job.description}
            </Typography>
            <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              <Chip
                label={job.status}
                color={
                  job.status === 'completed'
                    ? 'success'
                    : job.status === 'in_progress'
                    ? 'primary'
                    : 'default'
                }
              />
              <Chip
                label={job.priority}
                color={
                  job.priority === 'critical' || job.priority === 'high'
                    ? 'error'
                    : job.priority === 'medium'
                    ? 'warning'
                    : 'default'
                }
              />
              {isMaintenanceJob && job.componentId && (
                <Chip label={`Component: ${job.componentId}`} />
              )}
              {isJob && (
                <Chip label={`Assigned to: ${job.assignedTo}`} />
              )}
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    );
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4">Calendar</Typography>
        <ToggleButtonGroup
          value={viewMode}
          exclusive
          onChange={handleViewChange}
          aria-label="calendar view"
        >
          <ToggleButton value="day" aria-label="day view">
            <ViewDay />
          </ToggleButton>
          <ToggleButton value="week" aria-label="week view">
            <ViewWeek />
          </ToggleButton>
          <ToggleButton value="month" aria-label="month view">
            <ViewModule />
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>

      <Paper sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <IconButton onClick={handlePrevious}>
            <ChevronLeft />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1, textAlign: 'center' }}>
            {selectedDate.toLocaleDateString('en-US', {
              month: 'long',
              year: 'numeric',
              ...(viewMode === 'day' && { day: 'numeric' }),
            })}
          </Typography>
          <IconButton onClick={handleNext}>
            <ChevronRight />
          </IconButton>
        </Box>

        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DateCalendar
            value={selectedDate}
            onChange={handleDateChange}
            views={['month', 'day']}
            sx={{
              width: '100%',
              '& .MuiPickersDay-root': {
                height: 80,
                width: 80,
              },
              '& .MuiPickersCalendarHeader-root': {
                display: 'none',
              },
              '& .MuiPickersCalendarHeader-label': {
                display: 'none',
              },
            }}
            slots={{
              day: renderDayContent,
            }}
          />
        </LocalizationProvider>
      </Paper>

      {selectedJob && renderJobDetails(selectedJob)}
    </Box>
  );
};

export default Calendar; 