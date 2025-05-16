import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  useTheme,
  InputAdornment,
  IconButton,
  Avatar,
  Grid,
} from '@mui/material';
import {
  Email as EmailIcon,
  Lock as LockIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  DirectionsBoat as ShipIcon,
  Login as LoginIcon,
} from '@mui/icons-material';
import { useUser } from '../context/UserContext';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useUser();
  const theme = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login(email, password);
      const from = (location.state as any)?.from?.pathname || '/';
      navigate(from, { replace: true });
    } catch (err) {
      setError('Invalid email or password');
    } finally {
      setIsLoading(false);
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

  const shipVariants = {
    initial: { x: -100, opacity: 0 },
    animate: {
      x: 0,
      opacity: 1,
      transition: {
        duration: 1,
        ease: "easeOut"
      }
    },
    hover: {
      y: -20,
      transition: {
        duration: 0.3,
        ease: "easeInOut"
      }
    }
  };

  const waveVariants = {
    initial: { scale: 0, opacity: 0 },
    animate: {
      scale: 1,
      opacity: 0.5,
      transition: {
        duration: 2,
        repeat: Infinity,
        repeatType: "reverse" as const
      }
    }
  };

  return (
    <Container component="main" maxWidth="lg" sx={{ height: '100vh', display: 'flex', alignItems: 'center' }}>
      <Grid container spacing={4} alignItems="center">
        <Grid item xs={12} md={6}>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <Paper
              elevation={3}
              sx={{
                p: 4,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                borderRadius: 2,
                background: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(10px)',
              }}
            >
              <motion.div variants={itemVariants}>
                <Avatar sx={{ m: 1, bgcolor: theme.palette.primary.main, width: 56, height: 56 }}>
                  <LoginIcon fontSize="large" />
                </Avatar>
              </motion.div>
              <motion.div variants={itemVariants}>
                <Typography component="h1" variant="h4" fontWeight="bold" color="primary" gutterBottom>
                  Ship Maintenance
                </Typography>
              </motion.div>
              <motion.div variants={itemVariants}>
                <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                  Sign in to manage your fleet
                </Typography>
              </motion.div>
              <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: '100%' }}>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <Alert severity="error" sx={{ mb: 2 }}>
                      {error}
                    </Alert>
                  </motion.div>
                )}
                <motion.div variants={itemVariants}>
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="email"
                    label="Email Address"
                    name="email"
                    autoComplete="email"
                    autoFocus
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoading}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <EmailIcon color="action" />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                      },
                    }}
                  />
                </motion.div>
                <motion.div variants={itemVariants}>
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    name="password"
                    label="Password"
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LockIcon color="action" />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={() => setShowPassword(!showPassword)}
                            edge="end"
                            disabled={isLoading}
                          >
                            {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                      },
                    }}
                  />
                </motion.div>
                <motion.div variants={itemVariants}>
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    disabled={isLoading}
                    sx={{
                      mt: 3,
                      mb: 2,
                      py: 1.5,
                      borderRadius: 2,
                      textTransform: 'none',
                      fontSize: '1.1rem',
                    }}
                  >
                    {isLoading ? 'Signing in...' : 'Sign In'}
                  </Button>
                </motion.div>
              </Box>
            </Paper>
          </motion.div>
        </Grid>
        <Grid item xs={12} md={6}>
          <Box sx={{ position: 'relative', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <motion.div
              variants={shipVariants}
              initial="initial"
              animate="animate"
              whileHover="hover"
              style={{ position: 'relative', zIndex: 2 }}
            >
              <ShipIcon sx={{ fontSize: 200, color: theme.palette.primary.main }} />
            </motion.div>
            <motion.div
              variants={waveVariants}
              initial="initial"
              animate="animate"
              style={{
                position: 'absolute',
                width: 300,
                height: 300,
                borderRadius: '50%',
                background: `radial-gradient(circle, ${theme.palette.primary.light} 0%, transparent 70%)`,
                zIndex: 1
              }}
            />
            <motion.div
              variants={waveVariants}
              initial="initial"
              animate="animate"
              style={{
                position: 'absolute',
                width: 400,
                height: 400,
                borderRadius: '50%',
                background: `radial-gradient(circle, ${theme.palette.secondary.light} 0%, transparent 70%)`,
                zIndex: 1
              }}
            />
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Login; 