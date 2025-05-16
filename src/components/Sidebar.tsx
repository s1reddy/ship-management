import { FC } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Dashboard,
  DirectionsBoat,
  Build,
  CalendarMonth,
  Notifications,
  People,
  Logout,
  Brightness4 as DarkModeIcon,
  Brightness7 as LightModeIcon,
  ChevronLeft,
  ChevronRight,
} from '@mui/icons-material';
import {
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  useTheme,
  alpha,
  Typography,
  Avatar,
  IconButton,
  Badge,
  Divider,
  Tooltip,
} from '@mui/material';
import { useUser } from '../context/UserContext';
import { useThemeContext } from '../theme';

interface MenuItem {
  text: string;
  icon: JSX.Element;
  path: string;
}

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

const Sidebar: FC<SidebarProps> = ({ sidebarOpen, setSidebarOpen }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useUser();
  const theme = useTheme();
  const { mode, toggleColorMode } = useThemeContext();

  const menuItems: MenuItem[] = [
    { text: 'Dashboard', icon: <Dashboard />, path: '/' },
    { text: 'Ships', icon: <DirectionsBoat />, path: '/ships' },
    { text: 'Components', icon: <Build />, path: '/components' },
    { text: 'Maintenance Jobs', icon: <Build />, path: '/maintenance-jobs' },
    { text: 'Calendar', icon: <CalendarMonth />, path: '/calendar' },
    ...(user?.role === 'admin' ? [{ text: 'Users', icon: <People />, path: '/users' }] : []),
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Box
      sx={{
        width: sidebarOpen ? 240 : 70,
        flexShrink: 0,
        borderRight: `1px solid ${theme.palette.divider}`,
        height: '100vh',
        bgcolor: theme.palette.background.paper,
        transition: theme.transitions.create(['width', 'margin'], {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen,
        }),
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Box sx={{ p: 2, borderBottom: `1px solid ${theme.palette.divider}`, display: 'flex', alignItems: 'center', justifyContent: sidebarOpen ? 'flex-end' : 'center' }}>
        <IconButton onClick={() => setSidebarOpen(!sidebarOpen)}>
          {sidebarOpen ? <ChevronLeft /> : <ChevronRight />}
        </IconButton>
      </Box>
      <List sx={{ pt: 2, flex: 1 }}>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding sx={{ display: 'block' }}>
            <Tooltip title={!sidebarOpen ? item.text : ''} placement="right">
              <ListItemButton
                onClick={() => navigate(item.path)}
                selected={location.pathname === item.path}
                sx={{
                  mx: 1,
                  borderRadius: 1,
                  mb: 0.5,
                  minHeight: 48,
                  justifyContent: sidebarOpen ? 'initial' : 'center',
                  px: sidebarOpen ? 2 : 1,
                  '&.Mui-selected': {
                    bgcolor: alpha(theme.palette.primary.main, 0.1),
                    '&:hover': {
                      bgcolor: alpha(theme.palette.primary.main, 0.15),
                    },
                    '& .MuiListItemIcon-root': {
                      color: theme.palette.primary.main,
                    },
                    '& .MuiListItemText-primary': {
                      color: theme.palette.primary.main,
                      fontWeight: 600,
                    },
                  },
                  '&:hover': {
                    bgcolor: alpha(theme.palette.action.hover, 0.1),
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 40,
                    color: location.pathname === item.path
                      ? theme.palette.primary.main
                      : theme.palette.text.secondary,
                    justifyContent: 'center',
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                {sidebarOpen && (
                  <ListItemText
                    primary={item.text}
                    primaryTypographyProps={{
                      fontSize: '0.875rem',
                      fontWeight: location.pathname === item.path ? 600 : 400,
                      color: location.pathname === item.path
                        ? theme.palette.primary.main
                        : theme.palette.text.primary,
                    }}
                  />
                )}
              </ListItemButton>
            </Tooltip>
          </ListItem>
        ))}
      </List>
      <Box sx={{ p: 2, borderTop: `1px solid ${theme.palette.divider}` }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <IconButton
            onClick={() => navigate('/notifications')}
            sx={{
              color: theme.palette.text.primary,
              bgcolor: alpha(theme.palette.primary.main, 0.1),
              '&:hover': {
                bgcolor: alpha(theme.palette.primary.main, 0.2),
              },
            }}
          >
            <Badge badgeContent={3} color="error">
              <Notifications />
            </Badge>
          </IconButton>
          {sidebarOpen && (
            <Typography variant="body2" color="text.secondary">
              Notifications
            </Typography>
          )}
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <IconButton
            onClick={toggleColorMode}
            sx={{
              color: theme.palette.text.primary,
              bgcolor: alpha(theme.palette.primary.main, 0.1),
              '&:hover': {
                bgcolor: alpha(theme.palette.primary.main, 0.2),
              },
            }}
          >
            {mode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
          </IconButton>
          {sidebarOpen && (
            <Typography variant="body2" color="text.secondary">
              {mode === 'dark' ? 'Light Mode' : 'Dark Mode'}
            </Typography>
          )}
        </Box>
        <Divider sx={{ my: 1 }} />
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
          <Avatar
            sx={{
              width: 32,
              height: 32,
              bgcolor: theme.palette.primary.main,
              fontSize: '0.875rem',
            }}
          >
            {user?.name?.[0]?.toUpperCase() || 'U'}
          </Avatar>
          {sidebarOpen && (
            <Box sx={{ flex: 1 }}>
              <Typography variant="body2" fontWeight={500}>
                {user?.name || 'User'}
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'capitalize' }}>
                {user?.role || 'User'}
              </Typography>
            </Box>
          )}
        </Box>
        <ListItemButton
          onClick={handleLogout}
          sx={{
            borderRadius: 1,
            color: theme.palette.error.main,
            '&:hover': {
              bgcolor: alpha(theme.palette.error.main, 0.1),
            },
          }}
        >
          <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}>
            <Logout />
          </ListItemIcon>
          {sidebarOpen && (
            <ListItemText
              primary="Logout"
              primaryTypographyProps={{
                fontSize: '0.875rem',
                fontWeight: 500,
                color: 'inherit',
              }}
            />
          )}
        </ListItemButton>
      </Box>
    </Box>
  );
};

export default Sidebar; 