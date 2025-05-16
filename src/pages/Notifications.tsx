import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Box,
  Card,
  CardContent,
  Typography,
  IconButton,
  Chip,
  Stack,
  Button,
  Avatar,
  Badge,
  Tooltip,
  useTheme,
  ButtonGroup,
} from '@mui/material';
import {
  Delete as DeleteIcon,
  CheckCircle as CheckCircleIcon,
  Notifications as NotificationIcon,
  NotificationsActive as NotificationsActiveIcon,
  Error as ErrorIcon,
  Info as InfoIcon,
  AddCircle as AddCircleIcon,
  Update as UpdateIcon,
} from '@mui/icons-material';
import { useJobs } from '../context/JobContext';
import type { Notification } from '../types';

const Notifications = () => {
  const { notifications, markNotificationAsRead, deleteNotification } = useJobs();
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const theme = useTheme();

  const filteredNotifications = notifications.filter(notification => 
    filter === 'all' || !notification.read
  ).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const getNotificationColor = (type: Notification['type']) => {
    switch (type) {
      case 'job_created':
        return theme.palette.primary;
      case 'job_updated':
        return theme.palette.info;
      case 'job_completed':
        return theme.palette.success;
      case 'job_overdue':
        return theme.palette.error;
      default:
        return {
          main: theme.palette.grey[500],
          light: theme.palette.grey[300],
          dark: theme.palette.grey[700]
        };
    }
  };

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'job_created':
        return <AddCircleIcon />;
      case 'job_updated':
        return <UpdateIcon />;
      case 'job_completed':
        return <CheckCircleIcon />;
      case 'job_overdue':
        return <ErrorIcon />;
      default:
        return <InfoIcon />;
    }
  };

  const formatDate = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.round(diffMs / 60000);
    const diffHours = Math.round(diffMs / 3600000);
    const diffDays = Math.round(diffMs / 86400000);
    
    if (diffMins < 60) {
      return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`;
    } else if (diffHours < 24) {
      return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    } else if (diffDays < 7) {
      return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
    } else {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
      });
    }
  };

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

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 300, damping: 24 }
    }
  };

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
          {filter === 'unread' ? 
            <NotificationsActiveIcon /> : 
            <NotificationIcon />
          }
        </Avatar>
        <Box>
          <Typography variant="h4" fontWeight="bold" color="primary">
            Notifications
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            {`${notifications.filter(n => !n.read).length} unread notification${notifications.filter(n => !n.read).length !== 1 ? 's' : ''}`}
          </Typography>
        </Box>
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 3 }}>
        <ButtonGroup variant="outlined">
          <Button
            variant={filter === 'all' ? 'contained' : 'outlined'}
            onClick={() => setFilter('all')}
          >
            All
          </Button>
          <Button
            variant={filter === 'unread' ? 'contained' : 'outlined'}
            onClick={() => setFilter('unread')}
            startIcon={<Badge 
              color="error" 
              badgeContent={notifications.filter(n => !n.read).length} 
              max={99}
            />}
            sx={{ ml: 0 }}
          >
            Unread
          </Button>
        </ButtonGroup>
      </Box>

      <Stack spacing={2} component={motion.div} variants={itemVariants}>
        {filteredNotifications.length === 0 ? (
          <Box sx={{ 
            p: 4, 
            borderRadius: 2,
            bgcolor: 'background.paper',
            textAlign: 'center',
            boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
          }}>
            <Typography variant="body1" color="text.secondary" align="center">
              No notifications found
            </Typography>
          </Box>
        ) : (
          filteredNotifications.map((notification) => (
            <motion.div key={notification.id} variants={itemVariants}>
              <Card sx={{ 
                borderRadius: 2,
                borderLeft: `5px solid ${getNotificationColor(notification.type).main}`,
                boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                position: 'relative',
                transition: 'all 0.3s',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 6px 16px rgba(0,0,0,0.1)'
                },
                ...(notification.read ? { opacity: 0.8 } : {})
              }}>
                {!notification.read && (
                  <Box 
                    sx={{ 
                      position: 'absolute', 
                      top: 16, 
                      right: 16,
                      width: 12,
                      height: 12,
                      borderRadius: '50%',
                      bgcolor: theme.palette.error.main,
                      animation: notification.read ? 'none' : 'pulse 2s infinite'
                    }}
                  />
                )}
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                    <Avatar
                      sx={{ 
                        bgcolor: `${getNotificationColor(notification.type).light}50`,
                        color: getNotificationColor(notification.type).main,
                        mr: 2
                      }}
                    >
                      {getNotificationIcon(notification.type)}
                    </Avatar>
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography 
                        variant="body1" 
                        component="div"
                        fontWeight={!notification.read ? 'bold' : 'normal'}
                      >
                        {notification.message}
                      </Typography>
                      <Typography 
                        variant="caption" 
                        color="text.secondary" 
                        sx={{ display: 'block', mt: 0.5 }}
                      >
                        {formatDate(notification.createdAt)}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 1, ml: 2 }}>
                      <Chip
                        label={notification.type.split('_').map(
                          word => word.charAt(0).toUpperCase() + word.slice(1)
                        ).join(' ')}
                        size="small"
                        sx={{ 
                          bgcolor: `${getNotificationColor(notification.type).light}20`,
                          color: getNotificationColor(notification.type).dark,
                          fontWeight: 'medium'
                        }}
                      />
                    </Box>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
                    {!notification.read && (
                      <Tooltip title="Mark as read">
                        <IconButton
                          size="small"
                          onClick={() => markNotificationAsRead(notification.id)}
                          sx={{ 
                            color: theme.palette.primary.main,
                            mr: 1
                          }}
                        >
                          <CheckCircleIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    )}
                    <Tooltip title="Delete">
                      <IconButton
                        size="small"
                        onClick={() => deleteNotification(notification.id)}
                        sx={{ color: theme.palette.error.main }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </CardContent>
              </Card>
            </motion.div>
          ))
        )}
      </Stack>
    </motion.div>
  );
};

export default Notifications; 