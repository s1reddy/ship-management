import { useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Avatar,
  useTheme,
  Paper,
} from '@mui/material';
import {
  DirectionsBoat as ShipIcon,
  Build as ComponentIcon,
  Pending as PendingIcon,
  CheckCircle as CompletedIcon,
} from '@mui/icons-material';
import { PieChart, BarChart, pieArcLabelClasses, DefaultizedPieValueType } from '@mui/x-charts';
import { useShips } from '../context/ShipContext';
import { useJobs } from '../context/JobContext';

interface ChartDataItem {
  id?: number;
  value: number;
  label?: string;
  category?: string;
  [key: string]: string | number | undefined;
}

const Dashboard = () => {
  const { ships, components } = useShips();
  const { jobs } = useJobs();
  const theme = useTheme();

  // Calculate KPIs
  const totalShips = ships.length;
  const overdueComponents = components.filter(
    component => new Date(component.nextMaintenance) < new Date()
  ).length;
  const jobsInProgress = jobs.filter(job => job.status === 'in_progress').length;
  const completedJobs = jobs.filter(job => job.status === 'completed').length;

  // Prepare data for charts
  const jobStatusData = useMemo<ChartDataItem[]>(() => [
    { id: 0, value: jobs.filter(job => job.status === 'pending').length, label: 'Pending' },
    { id: 1, value: jobsInProgress, label: 'In Progress' },
    { id: 2, value: completedJobs, label: 'Completed' },
    { id: 3, value: jobs.filter(job => job.status === 'cancelled').length, label: 'Cancelled' },
  ], [jobs, jobsInProgress, completedJobs]);

  const shipStatusData = useMemo<ChartDataItem[]>(() => [
    { category: 'Active', value: ships.filter(ship => ship.status === 'active').length },
    { category: 'Maintenance', value: ships.filter(ship => ship.status === 'maintenance').length },
    { category: 'Inactive', value: ships.filter(ship => ship.status === 'inactive').length },
  ], [ships]);

  const chartColors = [
    theme.palette.primary.main,
    theme.palette.secondary.main,
    theme.palette.success.main,
    theme.palette.error.main,
  ];

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
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight="bold" color="primary">
          Dashboard
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Overview of your ship maintenance system
        </Typography>
      </Box>
      
      {/* KPI Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <motion.div variants={itemVariants}>
            <Card sx={{ 
              borderRadius: 2,
              transition: 'transform 0.3s, box-shadow 0.3s',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 8px 20px rgba(0, 0, 0, 0.1)'
              }
            }}>
              <CardContent sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                p: 2.5 
              }}>
                <Avatar 
                  sx={{ 
                    bgcolor: theme.palette.primary.main,
                    width: 56,
                    height: 56,
                    mr: 2
                  }}
                >
                  <ShipIcon fontSize="large" />
                </Avatar>
                <Box>
                  <Typography variant="h4" fontWeight="bold">
                    {totalShips}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Ships
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <motion.div variants={itemVariants}>
            <Card sx={{ 
              borderRadius: 2,
              transition: 'transform 0.3s, box-shadow 0.3s',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 8px 20px rgba(0, 0, 0, 0.1)'
              }
            }}>
              <CardContent sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                p: 2.5 
              }}>
                <Avatar 
                  sx={{ 
                    bgcolor: theme.palette.warning.main,
                    width: 56,
                    height: 56,
                    mr: 2
                  }}
                >
                  <ComponentIcon fontSize="large" />
                </Avatar>
                <Box>
                  <Typography variant="h4" fontWeight="bold">
                    {overdueComponents}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Overdue Components
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <motion.div variants={itemVariants}>
            <Card sx={{ 
              borderRadius: 2,
              transition: 'transform 0.3s, box-shadow 0.3s',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 8px 20px rgba(0, 0, 0, 0.1)'
              }
            }}>
              <CardContent sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                p: 2.5 
              }}>
                <Avatar 
                  sx={{ 
                    bgcolor: theme.palette.info.main,
                    width: 56,
                    height: 56,
                    mr: 2
                  }}
                >
                  <PendingIcon fontSize="large" />
                </Avatar>
                <Box>
                  <Typography variant="h4" fontWeight="bold">
                    {jobsInProgress}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Jobs in Progress
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <motion.div variants={itemVariants}>
            <Card sx={{ 
              borderRadius: 2,
              transition: 'transform 0.3s, box-shadow 0.3s',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 8px 20px rgba(0, 0, 0, 0.1)'
              }
            }}>
              <CardContent sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                p: 2.5 
              }}>
                <Avatar 
                  sx={{ 
                    bgcolor: theme.palette.success.main,
                    width: 56,
                    height: 56,
                    mr: 2
                  }}
                >
                  <CompletedIcon fontSize="large" />
                </Avatar>
                <Box>
                  <Typography variant="h4" fontWeight="bold">
                    {completedJobs}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Completed Jobs
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>
      </Grid>

      {/* Charts */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <motion.div variants={itemVariants}>
            <Paper 
              elevation={2}
              sx={{ 
                p: 3, 
                height: 400, 
                borderRadius: 2,
                transition: 'transform 0.3s, box-shadow 0.3s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)'
                }
              }}
            >
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Job Status Distribution
              </Typography>
              <Box sx={{ width: '100%', height: 320, position: 'relative' }}>
                <PieChart
                  series={[
                    {
                      data: jobStatusData,
                      highlightScope: { fade: 'global', highlight: 'item' },
                      faded: { innerRadius: 30, additionalRadius: -30, color: 'gray' },
                      arcLabel: (item: DefaultizedPieValueType) => `${item.label} (${item.value || 0})`,
                      arcLabelMinAngle: 45,
                      innerRadius: 0,
                      outerRadius: 120,
                      paddingAngle: 2,
                      cornerRadius: 4,
                    },
                  ]}
                  colors={chartColors}
                  sx={{
                    [`& .${pieArcLabelClasses.root}`]: {
                      fill: 'white',
                      fontWeight: 'bold',
                    },
                  }}
                  height={320}
                  margin={{ right: 5 }}
                />
              </Box>
            </Paper>
          </motion.div>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <motion.div variants={itemVariants}>
            <Paper 
              elevation={2}
              sx={{ 
                p: 3, 
                height: 400, 
                borderRadius: 2,
                transition: 'transform 0.3s, box-shadow 0.3s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)'
                }
              }}
            >
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Ship Status Distribution
              </Typography>
              <Box sx={{ width: '100%', height: 320 }}>
                <BarChart
                  dataset={shipStatusData}
                  xAxis={[{ scaleType: 'band', dataKey: 'category' }]}
                  series={[{ 
                    dataKey: 'value', 
                    label: 'Ships', 
                    valueFormatter: (value: number | null) => (value || 0).toString() 
                  }]}
                  colors={[theme.palette.primary.main]}
                  height={320}
                  margin={{ top: 20, bottom: 30, left: 40, right: 10 }}
                />
              </Box>
            </Paper>
          </motion.div>
        </Grid>
      </Grid>
    </motion.div>
  );
};

export default Dashboard; 