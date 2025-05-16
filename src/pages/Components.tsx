import { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  IconButton,
  Chip,
  Stack,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Avatar,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Build as ComponentIcon,
} from '@mui/icons-material';
import { useShips } from '../context/ShipContext';
import type { Component } from '../types';
import { useTheme } from '@mui/material/styles';

const Components = () => {
  const { ships, components, addComponent, updateComponent, deleteComponent } = useShips();
  const [open, setOpen] = useState(false);
  const [editingComponent, setEditingComponent] = useState<Component | null>(null);
  const [formData, setFormData] = useState<Omit<Component, 'id'>>({
    name: '',
    type: '',
    status: 'operational' as Component['status'],
    shipId: '',
    serialNumber: '',
    installationDate: '',
    lastMaintenance: '',
    nextMaintenance: '',
  });
  const theme = useTheme();

  const handleOpen = (component?: Component) => {
    if (component) {
      setEditingComponent(component);
      setFormData({
        name: component.name,
        type: component.type,
        status: component.status,
        shipId: component.shipId,
        serialNumber: component.serialNumber,
        installationDate: component.installationDate,
        lastMaintenance: component.lastMaintenance,
        nextMaintenance: component.nextMaintenance,
      });
    } else {
      setEditingComponent(null);
      setFormData({
        name: '',
        type: '',
        status: 'operational' as Component['status'],
        shipId: '',
        serialNumber: '',
        installationDate: '',
        lastMaintenance: '',
        nextMaintenance: '',
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
      addComponent(formData);
    }
    handleClose();
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this component?')) {
      deleteComponent(id);
    }
  };

  const getStatusColor = (status: Component['status']) => {
    switch (status) {
      case 'operational':
        return 'success';
      case 'maintenance_required':
        return 'warning';
      case 'out_of_service':
        return 'error';
      default:
        return 'default';
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Avatar
            sx={{
              bgcolor: theme.palette.primary.main,
              mr: 2,
              width: 48,
              height: 48
            }}
          >
            <ComponentIcon />
          </Avatar>
          <Box>
            <Typography variant="h4" fontWeight="bold" color="primary">
              Components
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              Manage ship components and their maintenance
            </Typography>
          </Box>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpen()}
          sx={{ 
            borderRadius: 2,
            px: 3,
            py: 1,
            boxShadow: '0 4px 14px rgba(0, 0, 0, 0.1)',
            transition: 'all 0.3s',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: '0 6px 20px rgba(0, 0, 0, 0.15)'
            }
          }}
        >
          Add Component
        </Button>
      </Box>

      <Stack spacing={2}>
        {components.length === 0 ? (
          <Typography variant="body1" color="text.secondary" align="center">
            No components found
          </Typography>
        ) : (
          components.map((component) => {
            const ship = ships.find(s => s.id === component.shipId);
            return (
              <Card key={component.id}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Box>
                      <Typography variant="h6" component="div">
                        {component.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Type: {component.type}
                      </Typography>
                      {ship && (
                        <Typography variant="body2" color="text.secondary">
                          Ship: {ship.name}
                        </Typography>
                      )}
                      <Typography variant="body2" color="text.secondary">
                        Last Maintenance: {new Date(component.lastMaintenance).toLocaleDateString()}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Next Maintenance: {new Date(component.nextMaintenance).toLocaleDateString()}
                      </Typography>
                    </Box>
                    <Box>
                      <Chip
                        label={component.status.replace('_', ' ')}
                        color={getStatusColor(component.status)}
                        size="small"
                      />
                      <IconButton
                        size="small"
                        onClick={() => handleOpen(component)}
                        color="primary"
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
                </CardContent>
              </Card>
            );
          })
        )}
      </Stack>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingComponent ? 'Edit Component' : 'Add Component'}
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
              select
              label="Ship"
              value={formData.shipId}
              onChange={(e) => setFormData({ ...formData, shipId: e.target.value })}
              margin="normal"
              required
            >
              {ships.map((ship) => (
                <MenuItem key={ship.id} value={ship.id}>
                  {ship.name}
                </MenuItem>
              ))}
            </TextField>
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
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editingComponent ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Components; 