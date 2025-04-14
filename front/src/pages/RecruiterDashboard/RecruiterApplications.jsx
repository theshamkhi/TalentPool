import { useEffect, useState } from 'react';
import { 
  Container,
  Typography,
  CircularProgress,
  Alert,
  Grid,
  Card,
  CardContent,
  CardActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Link,
  Box,
  Button,
  Chip,
  Skeleton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Snackbar,
  IconButton,
  Collapse,
  useTheme
} from '@mui/material';
import {
  ExpandMore,
  ExpandLess,
  Close,
  Description,
  CheckCircle,
  Cancel,
  AccessTime,
  Visibility
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import api from '../../api/axios';

const StatusChip = styled(Chip)(({ theme, status }) => ({
  backgroundColor: {
    pending: theme.palette.warning.light,
    reviewed: theme.palette.info.light,
    accepted: theme.palette.success.light,
    rejected: theme.palette.error.light
  }[status],
  color: theme.palette.getContrastText(theme.palette.primary.main)
}));

const ApplicationCard = styled(Card)(({ theme }) => ({
  transition: 'transform 0.2s, box-shadow 0.2s',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: theme.shadows[4]
  }
}));

const RecruiterApplications = () => {
  const theme = useTheme();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [snackbar, setSnackbar] = useState({ open: false, message: '' });
  const [confirmDialog, setConfirmDialog] = useState({ open: false, appId: null, newStatus: '' });
  const [expandedAppId, setExpandedAppId] = useState(null);
  const [localLoading, setLocalLoading] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get('/recruiter/applications', {
          params: { status: selectedStatus === 'all' ? null : selectedStatus }
        });
        setApplications(response.data.data);
      } catch (err) {
        setError('Failed to load applications');
        showSnackbar('Error loading applications');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [selectedStatus]);

  const handleStatusChange = async (appId, newStatus) => {
    setLocalLoading(prev => ({ ...prev, [appId]: true }));
    try {
      await api.put(`/applications/${appId}/updateStatus`, { status: newStatus });
      setApplications(prev => prev.map(app => 
        app.id === appId ? { ...app, status: newStatus } : app
      ));
      showSnackbar('Status updated successfully');
    } catch (err) {
      showSnackbar('Failed to update status', 'error');
    } finally {
      setLocalLoading(prev => ({ ...prev, [appId]: false }));
    }
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleConfirmStatusChange = (appId, newStatus) => {
    if (newStatus === 'rejected') {
      setConfirmDialog({ open: true, appId, newStatus });
    } else {
      handleStatusChange(appId, newStatus);
    }
  };

  const statusIcons = {
    pending: <AccessTime fontSize="small" />,
    reviewed: <Visibility fontSize="small" />,
    accepted: <CheckCircle fontSize="small" />,
    rejected: <Cancel fontSize="small" />
  };

  if (loading) return (
    <Box sx={{ p: 3 }}>
      {[...Array(3)].map((_, i) => (
        <Skeleton key={i} variant="rounded" height={150} sx={{ mb: 2 }} />
      ))}
    </Box>
  );

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1">
          Manage Applications
        </Typography>
        
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Filter by Status</InputLabel>
          <Select
            value={selectedStatus}
            label="Filter by Status"
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            <MenuItem value="all">All Applications</MenuItem>
            {['pending', 'reviewed', 'accepted', 'rejected'].map(status => (
              <MenuItem key={status} value={status}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  {statusIcons[status]}
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </Box>
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        {applications.map(app => (
          <Grid item xs={12} key={app.id}>
            <ApplicationCard>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box>
                    <Typography variant="h6" component="div">
                      {app.candidate.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {app.offer.title}
                    </Typography>
                  </Box>
                  <StatusChip
                    label={app.status}
                    status={app.status}
                    icon={statusIcons[app.status]}
                  />
                </Box>

                <Box sx={{ mt: 2, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  <Chip
                    label={`Applied: ${new Date(app.created_at).toLocaleDateString()}`}
                    variant="outlined"
                  />
                  <Chip
                    label={`Experience: ${app.candidate.experience || 'N/A'} years`}
                    variant="outlined"
                  />
                </Box>

                <Collapse in={expandedAppId === app.id} collapsedSize={56}>
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="subtitle2" gutterBottom>
                      Cover Letter:
                    </Typography>
                    <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                      {app.letter || 'No cover letter provided'}
                    </Typography>
                  </Box>
                </Collapse>

                <IconButton
                  sx={{ mt: 1 }}
                  onClick={() => setExpandedAppId(prev => prev === app.id ? null : app.id)}
                >
                  {expandedAppId === app.id ? <ExpandLess /> : <ExpandMore />}
                </IconButton>
              </CardContent>

              <CardActions sx={{ px: 2, pb: 2, gap: 2 }}>
                <FormControl sx={{ minWidth: 150 }} size="small">
                  <InputLabel>Update Status</InputLabel>
                  <Select
                    value={app.status}
                    label="Update Status"
                    onChange={(e) => handleConfirmStatusChange(app.id, e.target.value)}
                    disabled={localLoading[app.id]}
                  >
                    {['pending', 'reviewed', 'accepted', 'rejected'].map(status => (
                      <MenuItem key={status} value={status}>
                        {localLoading[app.id] ? (
                          <CircularProgress size={20} />
                        ) : (
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            {statusIcons[status]}
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                          </Box>
                        )}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <Button
                  variant="outlined"
                  startIcon={<Description />}
                  href={`${api.defaults.baseURL}/storage/${app.cv}`}
                  target="_blank"
                >
                  View CV
                </Button>
              </CardActions>
            </ApplicationCard>
          </Grid>
        ))}
      </Grid>

      <Dialog
        open={confirmDialog.open}
        onClose={() => setConfirmDialog({ open: false, appId: null, newStatus: '' })}
      >
        <DialogTitle>Confirm Rejection</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to reject this application? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDialog({ open: false, appId: null, newStatus: '' })}>
            Cancel
          </Button>
          <Button
            color="error"
            onClick={() => {
              handleStatusChange(confirmDialog.appId, confirmDialog.newStatus);
              setConfirmDialog({ open: false, appId: null, newStatus: '' });
            }}
          >
            Confirm Rejection
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          severity={snackbar.severity}
          action={
            <IconButton
              size="small"
              onClick={() => setSnackbar(prev => ({ ...prev, open: false }))}
            >
              <Close fontSize="small" />
            </IconButton>
          }
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      {!loading && applications.length === 0 && (
        <Box sx={{ textAlign: 'center', p: 4 }}>
          <Typography variant="h6" color="text.secondary">
            No applications found matching the current filters
          </Typography>
        </Box>
      )}
    </Container>
  );
};

export default RecruiterApplications;