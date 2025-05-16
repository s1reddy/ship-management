import { Box, Avatar, Badge, Typography } from '@mui/material';
import {
  AdminPanelSettings as AdminIcon,
  Engineering as EngineerIcon,
  Assignment as InspectorIcon,
} from '@mui/icons-material';
import { useUser } from '../context/UserContext';

const Header = () => {
  const { user } = useUser();

  const getUserRoleIcon = () => {
    if (!user) return null;
    
    switch (user.role) {
      case 'admin':
        return <AdminIcon />;
      case 'engineer':
        return <EngineerIcon />;
      case 'inspector':
        return <InspectorIcon />;
      default:
        return null;
    }
  };

  const getUserRoleColor = () => {
    if (!user) return 'default';
    
    switch (user.role) {
      case 'admin':
        return 'error';
      case 'engineer':
        return 'primary';
      case 'inspector':
        return 'success';
      default:
        return 'default';
    }
  };

  if (!user) return null;

  return (
    <Box sx={{ 
      position: 'fixed', 
      top: 0, 
      right: 0, 
      p: 2, 
      zIndex: 1000,
      display: 'flex',
      alignItems: 'center',
      gap: 2,
      bgcolor: 'background.paper',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      borderRadius: '0 0 0 8px'
    }}>
      <Typography variant="subtitle1" color="text.secondary">
        {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
      </Typography>
      <Badge
        overlap="circular"
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        badgeContent={
          <Avatar
            sx={{
              bgcolor: `${getUserRoleColor()}.main`,
              width: 24,
              height: 24,
              border: '2px solid white'
            }}
          >
            {getUserRoleIcon()}
          </Avatar>
        }
      >
        <Avatar sx={{ width: 40, height: 40 }}>
          {getUserRoleIcon()}
        </Avatar>
      </Badge>
    </Box>
  );
};

export default Header; 