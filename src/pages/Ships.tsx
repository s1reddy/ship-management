import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  MenuItem,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { useShips } from '../context/ShipContext';
import type { Ship } from '../types';

type ShipStatus = 'active' | 'maintenance' | 'inactive';

interface ShipFormData {
  name: string;
  type: string;
  registrationNumber: string;
  buildDate: string;
  status: ShipStatus;
}

const Ships = () => {
  const navigate = useNavigate();
  const { ships, addShip, updateShip, deleteShip } = useShips();
  const [open, setOpen] = useState(false);
  const [editingShip, setEditingShip] = useState<Ship | null>(null);
  const [formData, setFormData] = useState<ShipFormData>({
    name: '',
    type: '',
    registrationNumber: '',
    buildDate: '',
    status: 'active',
  });

  const handleOpen = (ship?: Ship) => {
    if (ship) {
      setEditingShip(ship);
      setFormData({
        name: ship.name,
        type: ship.type,
        registrationNumber: ship.registrationNumber,
        buildDate: ship.buildDate,
        status: ship.status,
      });
    } else {
      setEditingShip(null);
      setFormData({
        name: '',
        type: '',
        registrationNumber: '',
        buildDate: '',
        status: 'active',
      });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingShip(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingShip) {
      updateShip(editingShip.id, formData);
    } else {
      addShip(formData);
    }
    handleClose();
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this ship?')) {
      deleteShip(id);
    }
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Ships</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpen()}
        >
          Add Ship
        </Button>
      </Box>

      <Grid container spacing={3}>
        {ships.map((ship) => (
          <Grid item xs={12} sm={6} md={4} key={ship.id}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Typography variant="h6" gutterBottom>
                    {ship.name}
                  </Typography>
                  <Box>
                    <IconButton
                      size="small"
                      onClick={() => handleOpen(ship)}
                      sx={{ mr: 1 }}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleDelete(ship.id)}
                      color="error"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </Box>
                <Typography color="textSecondary" gutterBottom>
                  {ship.type}
                </Typography>
                <Typography variant="body2">
                  Registration: {ship.registrationNumber}
                </Typography>
                <Typography variant="body2">
                  Build Date: {new Date(ship.buildDate).toLocaleDateString()}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: ship.status === 'active' ? 'success.main' : 'warning.main',
                  }}
                >
                  Status: {ship.status}
                </Typography>
                <Button
                  variant="outlined"
                  size="small"
                  sx={{ mt: 2 }}
                  onClick={() => navigate(`/ships/${ship.id}`)}
                >
                  View Details
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <form onSubmit={handleSubmit}>
          <DialogTitle>
            {editingShip ? 'Edit Ship' : 'Add New Ship'}
          </DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Ship Name"
              fullWidth
              required
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
            <TextField
              margin="dense"
              label="Type"
              fullWidth
              required
              value={formData.type}
              onChange={(e) =>
                setFormData({ ...formData, type: e.target.value })
              }
            />
            <TextField
              margin="dense"
              label="Registration Number"
              fullWidth
              required
              value={formData.registrationNumber}
              onChange={(e) =>
                setFormData({ ...formData, registrationNumber: e.target.value })
              }
            />
            <TextField
              margin="dense"
              label="Build Date"
              type="date"
              fullWidth
              required
              value={formData.buildDate}
              onChange={(e) =>
                setFormData({ ...formData, buildDate: e.target.value })
              }
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              margin="dense"
              label="Status"
              select
              fullWidth
              required
              value={formData.status}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  status: e.target.value as ShipStatus,
                })
              }
            >
              <MenuItem value="active">Active</MenuItem>
              <MenuItem value="maintenance">Maintenance</MenuItem>
              <MenuItem value="inactive">Inactive</MenuItem>
            </TextField>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button type="submit" variant="contained">
              {editingShip ? 'Update' : 'Add'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default Ships; 