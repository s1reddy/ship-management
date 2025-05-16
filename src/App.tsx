import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { CssBaseline, CircularProgress, Box } from '@mui/material';
import { ThemeProvider } from './theme';
import { UserProvider, useUser } from './context/UserContext';
import { JobProvider } from './context/JobContext';
import { ShipProvider } from './context/ShipContext';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Ships from './pages/Ships';
import ShipDetails from './pages/ShipDetails';
import Components from './pages/Components';
import MaintenanceJobs from './pages/MaintenanceJobs';
import Calendar from './pages/Calendar';
import Notifications from './pages/Notifications';
import Login from './pages/Login';
import Users from './pages/Users';

const LoadingScreen = () => (
  <Box
    sx={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      bgcolor: 'background.default'
    }}
  >
    <CircularProgress size={60} thickness={4} />
  </Box>
);

const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, loading } = useUser();
  const location = useLocation();

  if (loading) {
    return <LoadingScreen />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Layout>{children}</Layout>;
};

const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, loading } = useUser();
  const location = useLocation();

  if (loading) {
    return <LoadingScreen />;
  }

  if (isAuthenticated) {
    const from = (location.state as any)?.from?.pathname || '/';
    return <Navigate to={from} replace />;
  }

  return <>{children}</>;
};

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <UserProvider>
        <ShipProvider>
          <JobProvider>
            <Router>
              <Routes>
                <Route
                  path="/login"
                  element={
                    <PublicRoute>
                      <Login />
                    </PublicRoute>
                  }
                />
                <Route
                  path="/"
                  element={
                    <PrivateRoute>
                      <Dashboard />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/ships"
                  element={
                    <PrivateRoute>
                      <Ships />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/ships/:id"
                  element={
                    <PrivateRoute>
                      <ShipDetails />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/components"
                  element={
                    <PrivateRoute>
                      <Components />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/maintenance-jobs"
                  element={
                    <PrivateRoute>
                      <MaintenanceJobs />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/calendar"
                  element={
                    <PrivateRoute>
                      <Calendar />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/notifications"
                  element={
                    <PrivateRoute>
                      <Notifications />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/users"
                  element={
                    <PrivateRoute>
                      <Users />
                    </PrivateRoute>
                  }
                />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Router>
          </JobProvider>
        </ShipProvider>
      </UserProvider>
    </ThemeProvider>
  );
};

export default App;
