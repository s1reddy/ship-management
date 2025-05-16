import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  TextField,
  Typography,
  Tabs,
  Tab,
  MenuItem,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  ArrowBack as ArrowBackIcon,
} from '@mui/icons-material';
import { useShips } from '../context/ShipContext';
import { useJobs } from '../context/JobContext';
import Layout from '../components/Layout';
import type { Component, MaintenanceJob } from '../types';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`ship-tabpanel-${index}`}
      aria-labelledby={`ship-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
};

const ShipDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { ships, components, addComponent, updateComponent, deleteComponent } = useShips();
  const { getJobsByShip } = useJobs();
  const [tabValue, setTabValue] = useState(0);
  const [open, setOpen] = useState(false);
  const [editingComponent, setEditingComponent] = useState<Component | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    serialNumber: '',
    installationDate: '',
    lastMaintenance: '',
    nextMaintenance: '',
    status: 'operational' as Component['status'],
  });

  const ship = ships.find((s) => s.id === id);
  const shipComponents = components.filter((c) => c.shipId === id);
  const shipJobs = getJobsByShip(id || '');

  if (!ship) {
    return (
      <Layout>
        <Box sx={{ p: 3 }}>
          <Typography variant="h5">Ship not found</Typography>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/ships')}
            sx={{ mt: 2 }}
          >
            Back to Ships
          </Button>
        </Box>
      </Layout>
    );
  }

  const handleOpen = (component?: Component) => {
    if (component) {
      setEditingComponent(component);
      setFormData({
        name: component.name,
        type: component.type,
        serialNumber: component.serialNumber,
        installationDate: component.installationDate,
        lastMaintenance: component.lastMaintenance,
        nextMaintenance: component.nextMaintenance,
        status: component.status,
      });
    } else {
      setEditingComponent(null);
      setFormData({
        name: '',
        type: '',
        serialNumber: '',
        installationDate: '',
        lastMaintenance: '',
        nextMaintenance: '',
        status: 'operational',
      });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingComponent(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingComponent) {
      updateComponent(editingComponent.id, formData);
    } else {
      addComponent({ ...formData, shipId: id || '' });
    }
    handleClose();
  };

  const handleDelete = (componentId: string) => {
    if (window.confirm('Are you sure you want to delete this component?')) {
      deleteComponent(componentId);
    }
  };

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const renderJobCard = (job: MaintenanceJob) => (
    <Card key={job.id} sx={{ mb: 2 }}>
      <CardContent>
        <Typography variant="h6">{job.title}</Typography>
        <Typography color="textSecondary" gutterBottom>
          Status: {job.status}
        </Typography>
        <Typography variant="body2">{job.description}</Typography>
        <Typography variant="body2">
          Priority: {job.priority}
        </Typography>
        <Typography variant="body2">
          Start Date: {new Date(job.startDate).toLocaleDateString()}
        </Typography>
      </CardContent>
    </Card>
  );

  return (
    <Layout>
      <Box sx={{ flexGrow: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <IconButton onClick={() => navigate('/ships')} sx={{ mr: 2 }}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h4">{ship.name}</Typography>
        </Box>

        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle1">Type</Typography>
                <Typography variant="body1">{ship.type}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle1">Registration Number</Typography>
                <Typography variant="body1">{ship.registrationNumber}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle1">Build Date</Typography>
                <Typography variant="body1">
                  {new Date(ship.buildDate).toLocaleDateString()}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle1">Status</Typography>
                <Typography
                  variant="body1"
                  sx={{
                    color: ship.status === 'active' ? 'success.main' : 'warning.main',
                  }}
                >
                  {ship.status}
                </Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={handleTabChange}>
            <Tab label="Components" />
            <Tab label="Maintenance Jobs" />
          </Tabs>
        </Box>

        <TabPanel value={tabValue} index={0}>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => handleOpen()}
            >
              Add Component
            </Button>
          </Box>

          <Grid container spacing={3}>
            {shipComponents.map((component) => (
              <Grid item xs={12} sm={6} md={4} key={component.id}>
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <Typography variant="h6" gutterBottom>
                        {component.name}
                      </Typography>
                      <Box>
                        <IconButton
                          size="small"
                          onClick={() => handleOpen(component)}
                          sx={{ mr: 1 }}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => handleDelete(component.id)}
                          color="error"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    </Box>
                    <Typography variant="body2">
                      Serial Number: {component.serialNumber}
                    </Typography>
                    <Typography variant="body2">
                      Installation Date: {new Date(component.installationDate).toLocaleDateString()}
                    </Typography>
                    <Typography variant="body2">
                      Last Maintenance: {new Date(component.lastMaintenance).toLocaleDateString()}
                    </Typography>
                    <Typography variant="body2">
                      Next Maintenance: {new Date(component.nextMaintenance).toLocaleDateString()}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: component.status === 'operational' ? 'success.main' : 'warning.main',
                      }}
                    >
                      Status: {component.status}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          {shipJobs.length > 0 ? (
            shipJobs.map(renderJobCard)
          ) : (
            <Typography>No maintenance jobs found for this ship.</Typography>
          )}
        </TabPanel>

        <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
          <form onSubmit={handleSubmit}>
            <DialogTitle>
              {editingComponent ? 'Edit Component' : 'Add New Component'}
            </DialogTitle>
            <DialogContent>
              <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
                <TextField
                  fullWidth
                  label="Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  margin="normal"
                  required
                />
                <TextField
                  fullWidth
                  label="Type"
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  margin="normal"
                  required
                />
                <TextField
                  fullWidth
                  label="Serial Number"
                  value={formData.serialNumber}
                  onChange={(e) => setFormData({ ...formData, serialNumber: e.target.value })}
                  margin="normal"
                  required
                />
                <TextField
                  fullWidth
                  label="Installation Date"
                  type="date"
                  value={formData.installationDate}
                  onChange={(e) => setFormData({ ...formData, installationDate: e.target.value })}
                  margin="normal"
                  required
                  InputLabelProps={{ shrink: true }}
                />
                <TextField
                  fullWidth
                  label="Last Maintenance"
                  type="date"
                  value={formData.lastMaintenance}
                  onChange={(e) => setFormData({ ...formData, lastMaintenance: e.target.value })}
                  margin="normal"
                  required
                  InputLabelProps={{ shrink: true }}
                />
                <TextField
                  fullWidth
                  label="Next Maintenance"
                  type="date"
                  value={formData.nextMaintenance}
                  onChange={(e) => setFormData({ ...formData, nextMaintenance: e.target.value })}
                  margin="normal"
                  required
                  InputLabelProps={{ shrink: true }}
                />
                <TextField
                  fullWidth
                  select
                  label="Status"
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as Component['status'] })}
                  margin="normal"
                  required
                >
                  <MenuItem value="operational">Operational</MenuItem>
                  <MenuItem value="maintenance_required">Maintenance Required</MenuItem>
                  <MenuItem value="out_of_service">Out of Service</MenuItem>
                </TextField>
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose}>Cancel</Button>
              <Button onClick={handleSubmit} variant="contained" color="primary">
                {editingComponent ? 'Update' : 'Add'}
              </Button>
            </DialogActions>
          </form>
        </Dialog>
      </Box>
    </Layout>
  );
};

export default ShipDetails; 