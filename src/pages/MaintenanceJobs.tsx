import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Box,
  Typography,
  IconButton,
  Chip,
  Stack,
  Button,
  Avatar,
  useTheme,
  ButtonGroup,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Build as BuildIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Sort as SortIcon,
} from '@mui/icons-material';
import { useJobs } from '../context/JobContext';
import { useShips } from '../context/ShipContext';
import type { MaintenanceJob } from '../types';

const MaintenanceJobs = () => {
  const { jobs, addJob, updateJob, deleteJob } = useJobs();
  const { ships } = useShips();
  const [open, setOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<MaintenanceJob | null>(null);
  const [filter, setFilter] = useState<'all' | 'pending' | 'in_progress' | 'completed'>('all');
  const [sortBy, setSortBy] = useState<'date' | 'priority' | 'status'>('date');
  const theme = useTheme();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };

  const handleOpen = (job?: MaintenanceJob) => {
    if (job) {
      setEditingJob(job);
    } else {
      setEditingJob({
        id: '',
        title: '',
        description: '',
        shipId: ships[0]?.id || '',
        priority: 'medium',
        status: 'pending',
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date().toISOString().split('T')[0],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingJob(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingJob) {
      if (editingJob.id) {
        updateJob(editingJob.id, editingJob);
      } else {
        const { id, createdAt, updatedAt, ...newJob } = editingJob;
        addJob(newJob);
      }
    }
    handleClose();
  };

  const handleDelete = (jobId: string) => {
    if (window.confirm('Are you sure you want to delete this job?')) {
      deleteJob(jobId);
    }
  };

  const filteredJobs = jobs.filter(job => 
    filter === 'all' || job.status === filter
  ).sort((a, b) => {
    switch (sortBy) {
      case 'date':
        return new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
      case 'priority':
        return a.priority.localeCompare(b.priority);
      case 'status':
        return a.status.localeCompare(b.status);
      default:
        return 0;
    }
  });

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center' }}>
        <Avatar
          sx={{
            bgcolor: theme.palette.primary.main,
            mr: 2,
            width: 48,
            height: 48
          }}
        >
          <BuildIcon />
        </Avatar>
        <Box>
          <Typography variant="h4" fontWeight="bold" color="primary">
            Maintenance Jobs
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Manage and track all maintenance activities
          </Typography>
        </Box>
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <ButtonGroup variant="outlined">
          <Button
            variant={filter === 'all' ? 'contained' : 'outlined'}
            onClick={() => setFilter('all')}
          >
            All
          </Button>
          <Button
            variant={filter === 'pending' ? 'contained' : 'outlined'}
            onClick={() => setFilter('pending')}
          >
            Pending
          </Button>
          <Button
            variant={filter === 'in_progress' ? 'contained' : 'outlined'}
            onClick={() => setFilter('in_progress')}
          >
            In Progress
          </Button>
          <Button
            variant={filter === 'completed' ? 'contained' : 'outlined'}
            onClick={() => setFilter('completed')}
          >
            Completed
          </Button>
        </ButtonGroup>

        <ButtonGroup variant="outlined">
          <Button
            variant={sortBy === 'date' ? 'contained' : 'outlined'}
            onClick={() => setSortBy('date')}
            startIcon={<SortIcon />}
          >
            Date
          </Button>
          <Button
            variant={sortBy === 'priority' ? 'contained' : 'outlined'}
            onClick={() => setSortBy('priority')}
            startIcon={<SortIcon />}
          >
            Priority
          </Button>
          <Button
            variant={sortBy === 'status' ? 'contained' : 'outlined'}
            onClick={() => setSortBy('status')}
            startIcon={<SortIcon />}
          >
            Status
          </Button>
        </ButtonGroup>
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 3 }}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpen()}
        >
          Add Job
        </Button>
      </Box>

      <Stack spacing={2}>
        {filteredJobs.map((job) => (
          <Box
            key={job.id}
            sx={{
              p: 3,
              borderRadius: 2,
              bgcolor: 'background.paper',
              boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
              position: 'relative',
              transition: 'all 0.3s',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 6px 16px rgba(0,0,0,0.1)'
              }
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <Box>
                <Typography variant="h6" gutterBottom>
                  {job.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {job.description}
                </Typography>
                <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                  <Chip
                    label={job.status}
                    size="small"
                    color={
                      job.status === 'completed' ? 'success' :
                      job.status === 'in_progress' ? 'primary' :
                      'default'
                    }
                  />
                  <Chip
                    label={job.priority}
                    size="small"
                    color={
                      job.priority === 'high' ? 'error' :
                      job.priority === 'medium' ? 'warning' :
                      'default'
                    }
                  />
                </Stack>
              </Box>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <IconButton
                  size="small"
                  onClick={() => handleOpen(job)}
                  sx={{ color: theme.palette.primary.main }}
                >
                  <EditIcon />
                </IconButton>
                <IconButton
                  size="small"
                  onClick={() => handleDelete(job.id)}
                  sx={{ color: theme.palette.error.main }}
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
            </Box>
          </Box>
        ))}
      </Stack>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <form onSubmit={handleSubmit}>
          <DialogTitle>
            {editingJob?.id ? 'Edit Job' : 'Add New Job'}
          </DialogTitle>
          <DialogContent>
            <Box sx={{ mt: 2 }}>
              <TextField
                fullWidth
                label="Title"
                value={editingJob?.title || ''}
                onChange={(e) => setEditingJob(prev => prev ? { ...prev, title: e.target.value } : null)}
                margin="normal"
                required
              />
              <TextField
                fullWidth
                label="Description"
                value={editingJob?.description || ''}
                onChange={(e) => setEditingJob(prev => prev ? { ...prev, description: e.target.value } : null)}
                margin="normal"
                multiline
                rows={4}
                required
              />
              <FormControl fullWidth margin="normal">
                <InputLabel>Status</InputLabel>
                <Select
                  value={editingJob?.status || 'pending'}
                  label="Status"
                  onChange={(e) => setEditingJob(prev => prev ? { ...prev, status: e.target.value as MaintenanceJob['status'] } : null)}
                >
                  <MenuItem value="pending">Pending</MenuItem>
                  <MenuItem value="in_progress">In Progress</MenuItem>
                  <MenuItem value="completed">Completed</MenuItem>
                  <MenuItem value="cancelled">Cancelled</MenuItem>
                </Select>
              </FormControl>
              <FormControl fullWidth margin="normal">
                <InputLabel>Priority</InputLabel>
                <Select
                  value={editingJob?.priority || 'medium'}
                  label="Priority"
                  onChange={(e) => setEditingJob(prev => prev ? { ...prev, priority: e.target.value as MaintenanceJob['priority'] } : null)}
                >
                  <MenuItem value="low">Low</MenuItem>
                  <MenuItem value="medium">Medium</MenuItem>
                  <MenuItem value="high">High</MenuItem>
                </Select>
              </FormControl>
              <TextField
                fullWidth
                label="Start Date"
                type="date"
                value={editingJob?.startDate || ''}
                onChange={(e) => setEditingJob(prev => prev ? { ...prev, startDate: e.target.value } : null)}
                margin="normal"
                required
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                fullWidth
                label="End Date"
                type="date"
                value={editingJob?.endDate || ''}
                onChange={(e) => setEditingJob(prev => prev ? { ...prev, endDate: e.target.value } : null)}
                margin="normal"
                required
                InputLabelProps={{ shrink: true }}
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button type="submit" variant="contained" color="primary">
              {editingJob?.id ? 'Update' : 'Add'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </motion.div>
  );
};

export default MaintenanceJobs; 