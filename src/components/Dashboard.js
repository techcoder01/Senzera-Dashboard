"use client";
import React, { useState, useEffect } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TablePagination from '@mui/material/TablePagination';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import { Calendar, DollarSign, Briefcase, MapPin, Edit, Trash2, Search, TrendingUp, PieChart, BarChart2, Check, Clock, X, Plus } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, PieChart as ReChartsPieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer } from 'recharts';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { alpha } from '@mui/material/styles';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

// Create a custom theme
const customTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#3b82f6', // Bright blue
    },
    secondary: {
      main: '#10b981', // Emerald green
    },
    background: {
      default: '#0f172a', // Very dark blue (bg-slate-900)
      paper: '#1e293b', // Dark blue-gray (bg-slate-800)
    },
    text: {
      primary: '#f1f5f9', // Very light gray-blue
      secondary: '#94a3b8', // Light gray-blue
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
          padding: '10px 20px',
          fontWeight: 600,
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
          },
        },
        contained: {
          backgroundColor: '#3b82f6',
          '&:hover': {
            backgroundColor: '#2563eb',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
          backgroundColor: '#1e293b', // bg-slate-800
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: '#475569', // slate-600
            },
            '&:hover fieldset': {
              borderColor: '#64748b', // slate-500
            },
            '&.Mui-focused fieldset': {
              borderColor: '#3b82f6', // blue-500
            },
          },
        },
      },
    },
  },
});


const MetricCard = ({ title, value, icon: Icon, color }) => (
  <Card sx={{ height: '100%', bgcolor: alpha(color, 0.1), border: `1px solid ${alpha(color, 0.2)}` }}>
    <CardContent sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" component="div" color={color}>
          {title}
        </Typography>
        <Icon color={color} size={24} />
      </Box>
      <Typography variant="h4" component="div" sx={{ fontWeight: 'bold', color, mt: 'auto' }}>
        {value}
      </Typography>
    </CardContent>
  </Card>
);

const EnhancedDashboard = () => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [service, setService] = useState('');
  const [location, setLocation] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [notificationType, setNotificationType] = useState('info');
  const [selectedAppointments, setSelectedAppointments] = useState([]);
  const [editingAppointment, setEditingAppointment] = useState(null);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const [openBulkActionDialog, setOpenBulkActionDialog] = useState(false);
  const [bulkAction, setBulkAction] = useState(null);

  const revenueData = [
    { name: 'Jan', value: 400 },
    { name: 'Feb', value: 300 },
    { name: 'Mar', value: 600 },
    { name: 'Apr', value: 800 },
    { name: 'May', value: 500 },
    { name: 'Jun', value: 700 },
  ];
  
  const appointmentData = [
    { id: 1, service: 'Haircut', date: '2024-10-16', time: '10:00 AM', location: 'New York', status: 'Completed', revenue: 50 },
    { id: 2, service: 'Manicure', date: '2024-10-16', time: '11:30 AM', location: 'Los Angeles', status: 'Scheduled', revenue: 30 },
    { id: 3, service: 'Massage', date: '2024-10-17', time: '2:00 PM', location: 'Chicago', status: 'Canceled', revenue: 0 },
    { id: 4, service: 'Facial', date: '2024-10-17', time: '3:30 PM', location: 'Miami', status: 'Completed', revenue: 75 },
    { id: 5, service: 'Haircut', date: '2024-10-18', time: '9:00 AM', location: 'New York', status: 'Scheduled', revenue: 50 },
  ];
  
  const servicePopularityData = [
      { name: 'Haircut', value: 40 },
      { name: 'Manicure', value: 30 },
      { name: 'Massage', value: 20 },
      { name: 'Facial', value: 10 },
    ];
  
    const areaDistributionData = [
      { name: 'New York', value: 35 },
      { name: 'Los Angeles', value: 25 },
      { name: 'Chicago', value: 20 },
      { name: 'Miami', value: 20 },
    ];


 const handleEditClick = (appointment) => {
    setEditingAppointment(appointment);
    setOpenEditDialog(true);
  };

  const handleEditDialogClose = () => {
    setOpenEditDialog(false);
    setEditingAppointment(null);
  };

  const handleEditSave = () => {
    // Implement the logic to save the edited appointment
    showNotificationfunc(`Appointment ${editingAppointment.id} updated`, 'success');
    handleEditDialogClose();
  };

  const handleStatusChange = (id, newStatus) => {
    setConfirmAction({ id, newStatus });
    setOpenConfirmDialog(true);
  };

  const handleConfirmStatusChange = () => {
    if (confirmAction) {
      const { id, newStatus } = confirmAction;
      // Implement the logic to update the appointment status
      showNotificationfunc(`Appointment ${id} ${newStatus}`, 'success');
      setOpenConfirmDialog(false);
      setConfirmAction(null);
    }
  };

  const handleConfirmDialogClose = () => {
    setOpenConfirmDialog(false);
    setConfirmAction(null);
  };

 const handleAppointmentSelect = (event, id) => {
    const selectedIndex = selectedAppointments.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selectedAppointments, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selectedAppointments.slice(1));
    } else if (selectedIndex === selectedAppointments.length - 1) {
      newSelected = newSelected.concat(selectedAppointments.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selectedAppointments.slice(0, selectedIndex),
        selectedAppointments.slice(selectedIndex + 1),
      );
    }

    setSelectedAppointments(newSelected);
  };

  const handleBulkActionClick = (action) => {
    setBulkAction(action);
    setOpenBulkActionDialog(true);
  };

  const handleBulkActionConfirm = () => {
    if (bulkAction) {
      // Implement the logic to update the appointments status in bulk
      showNotificationfunc(`${selectedAppointments.length} appointments ${bulkAction}`, 'success');
      setOpenBulkActionDialog(false);
      setBulkAction(null);
      setSelectedAppointments([]);
    }
  };

  const handleBulkActionDialogClose = () => {
    setOpenBulkActionDialog(false);
    setBulkAction(null);
  };


  // Simulated WebSocket for real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate a random status change
      const randomIndex = Math.floor(Math.random() * appointmentData.length);
      const newStatus = ['Scheduled', 'Completed', 'Canceled'][Math.floor(Math.random() * 3)];
      const updatedAppointments = [...appointmentData];
      updatedAppointments[randomIndex].status = newStatus;
      // In a real application, you would update the state here
      // setAppointmentData(updatedAppointments);
      
      showNotificationfunc(`Appointment ${randomIndex + 1} status changed to ${newStatus}`, 'info');
    }, 10000); // Update every 10 seconds

    return () => clearInterval(interval);
  }, []);

  const showNotificationfunc = (message, type) => {
    setNotificationMessage(message);
    setNotificationType(type);
    setShowNotification(true);
  };

  const handleCloseNotification = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setShowNotification(false);
  };

  const handleQuickAction = (id, action) => {
    // Implement quick action logic here
    showNotificationfunc(`${action} appointment ${id}`, 'success');
  };


  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const filteredAppointments = appointmentData.filter((appointment) =>
    appointment.service.toLowerCase().includes(searchTerm.toLowerCase()) ||
    appointment.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    appointment.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <ThemeProvider theme={customTheme}>
      <CssBaseline />
      <Box sx={{ flexGrow: 1, p: 3, bgcolor: 'background.default', minHeight: '100vh' }}>

        {/* Filters */}
        <Card sx={{ mb: 4, p: 3 }}>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} sm={6} md={3}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Start Date"
                  value={startDate}
                  onChange={(newValue) => setStartDate(newValue)}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="End Date"
                  value={endDate}
                  onChange={(newValue) => setEndDate(newValue)}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <TextField
                select
                fullWidth
                label="Service"
                value={service}
                onChange={(e) => setService(e.target.value)}
              >
                <MenuItem value="">All Services</MenuItem>
                <MenuItem value="Haircut">Haircut</MenuItem>
                <MenuItem value="Manicure">Manicure</MenuItem>
                <MenuItem value="Massage">Massage</MenuItem>
                <MenuItem value="Facial">Facial</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <TextField
                select
                fullWidth
                label="Location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              >
                <MenuItem value="">All Locations</MenuItem>
                <MenuItem value="New York">New York</MenuItem>
                <MenuItem value="Los Angeles">Los Angeles</MenuItem>
                <MenuItem value="Chicago">Chicago</MenuItem>
                <MenuItem value="Miami">Miami</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} md={2}>
              <Button variant="contained" fullWidth sx={{ height: '56px' }}>
                Apply Filters
              </Button>
            </Grid>
          </Grid>
        </Card>

        {/* Metric Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <MetricCard title="Total Appointments" value="124" icon={Calendar} color="#3b82f6" />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <MetricCard title="Revenue" value="$12,450" icon={DollarSign} color="#10b981" />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <MetricCard title="Services Booked" value="87" icon={Briefcase} color="#f59e0b" />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <MetricCard title="Areas Covered" value="15" icon={MapPin} color="#ef4444" />
          </Grid>
        </Grid>

      {/* Enhanced Analytics and Charts */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={6}>
            <Card sx={{ height: 400 }}>
              <CardContent>
                <Typography variant="h6" component="div" gutterBottom sx={{ color: 'text.primary', display: 'flex', alignItems: 'center' }}>
                  <TrendingUp size={24} style={{ marginRight: '8px', color: '#3b82f6' }} />
                  Revenue Trend
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                    <XAxis dataKey="name" stroke="#94a3b8" />
                    <YAxis stroke="#94a3b8" />
                    <RechartsTooltip />
                    <Legend />
                    <Line type="monotone" dataKey="value" name="Revenue" stroke="#3b82f6" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card sx={{ height: 400 }}>
              <CardContent>
                <Typography variant="h6" component="div" gutterBottom sx={{ color: 'text.primary', display: 'flex', alignItems: 'center' }}>
                  <PieChart size={24} style={{ marginRight: '8px', color: '#10b981' }} />
                  Service Popularity
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <ReChartsPieChart>
                    <Pie
                      data={servicePopularityData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {servicePopularityData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <RechartsTooltip />
                    <Legend />
                  </ReChartsPieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12}>
            <Card sx={{ height: 400 }}>
              <CardContent>
                <Typography variant="h6" component="div" gutterBottom sx={{ color: 'text.primary', display: 'flex', alignItems: 'center' }}>
                  <BarChart2 size={24} style={{ marginRight: '8px', color: '#f59e0b' }} />
                  Area Distribution
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={areaDistributionData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                    <XAxis dataKey="name" stroke="#94a3b8" />
                    <YAxis stroke="#94a3b8" />
                    <RechartsTooltip />
                    <Legend />
                    <Bar dataKey="value" name="Appointments" fill="#f59e0b" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>
        </Grid>


        {/* Appointment Status Monitoring */}
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Typography variant="h6" component="div" gutterBottom sx={{ color: 'text.primary', mb: 3 }}>
              Appointment Status
            </Typography>
            <Grid container spacing={2}>
              {['Scheduled', 'Completed', 'Canceled'].map((status) => (
                <Grid item xs={12} sm={4} key={status}>
                  <Card sx={{ bgcolor: status === 'Completed' ? alpha('#059669', 0.1) : status === 'Scheduled' ? alpha('#0284c7', 0.1) : alpha('#dc2626', 0.1) }}>
                    <CardContent>
                      <Typography variant="h6" color={status === 'Completed' ? '#059669' : status === 'Scheduled' ? '#0284c7' : '#dc2626'}>
                        {status}
                      </Typography>
                      <Typography variant="h4">
                        {appointmentData.filter((a) => a.status === status).length}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>


        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Typography variant="h6" component="div" gutterBottom sx={{ color: 'text.primary', mb: 3 }}>
              Appointments Management
            </Typography>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Search appointments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <Search color="#94a3b8" size={20} style={{ marginRight: '8px' }} />
                ),
              }}
              sx={{ mb: 3 }}
            />

            <TableContainer component={Paper} sx={{ maxHeight: 440, bgcolor: 'background.paper' }}>
              <Table stickyHeader aria-label="appointments table">
                <TableHead>
                  <TableRow>
                    <TableCell padding="checkbox">
                      <Checkbox
                        indeterminate={selectedAppointments.length > 0 && selectedAppointments.length < filteredAppointments.length}
                        checked={selectedAppointments.length === filteredAppointments.length}
                        onChange={(event) => {
                          if (event.target.checked) {
                            setSelectedAppointments(filteredAppointments.map((n) => n.id));
                          } else {
                            setSelectedAppointments([]);
                          }
                        }}
                      />
                    </TableCell>
                    <TableCell>Service</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell>Time</TableCell>
                    <TableCell>Location</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Revenue</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredAppointments
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row) => (
                      <TableRow
                        key={row.id}
                        hover
                        onClick={(event) => handleAppointmentSelect(event, row.id)}
                        role="checkbox"
                        aria-checked={selectedAppointments.indexOf(row.id) !== -1}
                        tabIndex={-1}
                        selected={selectedAppointments.indexOf(row.id) !== -1}
                      >
                        <TableCell padding="checkbox">
                          <Checkbox
                            checked={selectedAppointments.indexOf(row.id) !== -1}
                          />
                        </TableCell>
                        <TableCell>{row.service}</TableCell>
                        <TableCell>{row.date}</TableCell>
                        <TableCell>{row.time}</TableCell>
                        <TableCell>{row.location}</TableCell>
                        <TableCell>
                          <Box
                            sx={{
                              bgcolor: row.status === 'Completed' ? '#059669' : row.status === 'Scheduled' ? '#0284c7' : '#dc2626',
                              color: 'white',
                              px: 1,
                              py: 0.5,
                              borderRadius: 1,
                              display: 'inline-block',
                              fontSize: '0.75rem',
                              fontWeight: 'medium',
                            }}
                          >
                            {row.status}
                          </Box>
                        </TableCell>
                        <TableCell>${row.revenue}</TableCell>
                        <TableCell>
                          <Tooltip title="Edit">
                            <IconButton size="small" onClick={() => handleEditClick(row)}>
                              <Edit size={16} color="#94a3b8" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Complete">
                            <IconButton size="small" onClick={() => handleStatusChange(row.id, 'Completed')}>
                              <Check size={16} color="#059669" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Schedule">
                            <IconButton size="small" onClick={() => handleStatusChange(row.id, 'Scheduled')}>
                              <Clock size={16} color="#0284c7" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Cancel">
                            <IconButton size="small" onClick={() => handleStatusChange(row.id, 'Canceled')}>
                              <X size={16} color="#dc2626" />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={filteredAppointments.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 2 }}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => handleBulkActionClick('complete')}
              disabled={selectedAppointments.length === 0}
              sx={{ mr: 1 }}
            >
              Complete Selected
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={() => handleBulkActionClick('schedule')}
              disabled={selectedAppointments.length === 0}
              sx={{ mr: 1 }}
            >
              Schedule Selected
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={() => handleBulkActionClick('cancel')}
              disabled={selectedAppointments.length === 0}
            >
              Cancel Selected
            </Button>
          </Box>
        </Card>

        {/* Edit Appointment Dialog */}
        <Dialog open={openEditDialog} onClose={handleEditDialogClose}>
          <DialogTitle>Edit Appointment</DialogTitle>
          <DialogContent>
            {editingAppointment && (
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Service"
                    value={editingAppointment.service}
                    onChange={(e) => setEditingAppointment({ ...editingAppointment, service: e.target.value })}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Date"
                    value={editingAppointment.date}
                    onChange={(e) => setEditingAppointment({ ...editingAppointment, date: e.target.value })}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Time"
                    value={editingAppointment.time}
                    onChange={(e) => setEditingAppointment({ ...editingAppointment, time: e.target.value })}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Location"
                    value={editingAppointment.location}
                    onChange={(e) => setEditingAppointment({ ...editingAppointment, location: e.target.value })}
                  />
                </Grid>
              </Grid>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleEditDialogClose}>Cancel</Button>
            <Button onClick={handleEditSave} variant="contained">Save</Button>
          </DialogActions>
        </Dialog>

        {/* Confirm Status Change Dialog */}
        <Dialog open={openConfirmDialog} onClose={handleConfirmDialogClose}>
          <DialogTitle>Confirm Status Change</DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to change the status of appointment {confirmAction?.id} to {confirmAction?.newStatus}?
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleConfirmDialogClose}>Cancel</Button>
            <Button onClick={handleConfirmStatusChange} variant="contained">Confirm</Button>
          </DialogActions>
        </Dialog>

         {/* Bulk Action Confirmation Dialog */}
         <Dialog open={openBulkActionDialog} onClose={handleBulkActionDialogClose}>
          <DialogTitle>Confirm Bulk Action</DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to {bulkAction} {selectedAppointments.length} selected appointments?
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleBulkActionDialogClose}>Cancel</Button>
            <Button onClick={handleBulkActionConfirm} variant="contained">Confirm</Button>
          </DialogActions>
        </Dialog>

        {/* Notification System */}
        <Snackbar open={showNotification} autoHideDuration={6000} onClose={handleCloseNotification}>
          <Alert onClose={handleCloseNotification} severity={notificationType} sx={{ width: '100%' }}>
            {notificationMessage}
          </Alert>
        </Snackbar>

      </Box>
    </ThemeProvider>
  );
};

export default EnhancedDashboard;


