import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
} from '@mui/material';
import {
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
} from '@mui/icons-material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
  isWeekend,
} from 'date-fns';
import { useDispatch } from 'react-redux';
import { setBlockedDates, updateOperatingHours } from '../../store/slices/availabilitySlice';

const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const AvailabilityCalendar = ({
  propertyId,
  availability,
  blockedDates,
  operatingHours,
  loading,
  error,
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDates, setSelectedDates] = useState([]);
  const [blockDialog, setBlockDialog] = useState(false);
  const [blockReason, setBlockReason] = useState('');
  const [hoursDialog, setHoursDialog] = useState(false);
  const [tempOperatingHours, setTempOperatingHours] = useState(operatingHours);
  const dispatch = useDispatch();

  useEffect(() => {
    setTempOperatingHours(operatingHours);
  }, [operatingHours]);

  const handlePreviousMonth = () => {
    setCurrentDate(subMonths(currentDate, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1));
  };

  const handleDateClick = (date) => {
    if (selectedDates.some(d => isSameDay(d, date))) {
      setSelectedDates(selectedDates.filter(d => !isSameDay(d, date)));
    } else {
      setSelectedDates([...selectedDates, date]);
    }
  };

  const handleBlockDates = async () => {
    if (selectedDates.length > 0 && blockReason) {
      await dispatch(setBlockedDates({
        propertyId,
        dates: selectedDates,
        reason: blockReason,
      }));
      setSelectedDates([]);
      setBlockReason('');
      setBlockDialog(false);
    }
  };

  const handleOperatingHoursChange = (day, field, value) => {
    setTempOperatingHours(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        [field]: value,
      },
    }));
  };

  const handleSaveOperatingHours = async () => {
    await dispatch(updateOperatingHours({
      propertyId,
      operatingHours: tempOperatingHours,
    }));
    setHoursDialog(false);
  };

  const getDayStatus = (date) => {
    if (blockedDates.some(d => isSameDay(new Date(d.date), date))) {
      return 'blocked';
    }
    if (availability.some(a => isSameDay(new Date(a.date), date))) {
      return 'available';
    }
    return 'default';
  };

  const renderCalendarDays = () => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

    return days.map((day) => {
      const status = getDayStatus(day);
      const isSelected = selectedDates.some(d => isSameDay(d, day));
      const isWeekendDay = isWeekend(day);

      return (
        <Box
          key={day.toString()}
          onClick={() => handleDateClick(day)}
          sx={{
            width: 'calc(100% / 7)',
            height: 60,
            border: '1px solid',
            borderColor: 'divider',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            bgcolor: isSelected
              ? 'primary.light'
              : status === 'blocked'
              ? 'error.light'
              : status === 'available'
              ? 'success.light'
              : isWeekendDay
              ? 'grey.100'
              : 'background.paper',
            '&:hover': {
              bgcolor: 'action.hover',
            },
          }}
        >
          <Typography
            variant="body2"
            color={
              isSelected
                ? 'primary.main'
                : status === 'blocked'
                ? 'error.main'
                : status === 'available'
                ? 'success.main'
                : 'text.primary'
            }
          >
            {format(day, 'd')}
          </Typography>
        </Box>
      );
    });
  };

  return (
    <Paper sx={{ p: 3 }}>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h6">
          {format(currentDate, 'MMMM yyyy')}
        </Typography>
        <Box>
          <IconButton onClick={handlePreviousMonth}>
            <ChevronLeftIcon />
          </IconButton>
          <IconButton onClick={handleNextMonth}>
            <ChevronRightIcon />
          </IconButton>
        </Box>
      </Box>

      {/* Calendar Header */}
      <Box sx={{ display: 'flex', mb: 1 }}>
        {weekDays.map(day => (
          <Box
            key={day}
            sx={{
              width: 'calc(100% / 7)',
              textAlign: 'center',
              py: 1,
              bgcolor: 'grey.100',
            }}
          >
            <Typography variant="body2">{day}</Typography>
          </Box>
        ))}
      </Box>

      {/* Calendar Grid */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
        {renderCalendarDays()}
      </Box>

      {/* Action Buttons */}
      <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
        <Button
          variant="outlined"
          onClick={() => setBlockDialog(true)}
          disabled={selectedDates.length === 0}
        >
          Block Selected Dates
        </Button>
        <Button
          variant="outlined"
          onClick={() => setHoursDialog(true)}
        >
          Set Operating Hours
        </Button>
      </Box>

      {/* Block Dates Dialog */}
      <Dialog open={blockDialog} onClose={() => setBlockDialog(false)}>
        <DialogTitle>Block Dates</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Reason"
            value={blockReason}
            onChange={(e) => setBlockReason(e.target.value)}
            multiline
            rows={3}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setBlockDialog(false)}>Cancel</Button>
          <Button
            onClick={handleBlockDates}
            variant="contained"
            disabled={!blockReason}
          >
            Block Dates
          </Button>
        </DialogActions>
      </Dialog>

      {/* Operating Hours Dialog */}
      <Dialog
        open={hoursDialog}
        onClose={() => setHoursDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Set Operating Hours</DialogTitle>
        <DialogContent>
          {weekDays.map((day) => (
            <Box key={day} sx={{ mb: 2 }}>
              <Typography variant="subtitle1" gutterBottom>
                {day}
              </Typography>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <FormControl fullWidth>
                  <InputLabel>Opening Time</InputLabel>
                  <Select
                    value={tempOperatingHours[day]?.open || ''}
                    onChange={(e) => handleOperatingHoursChange(day, 'open', e.target.value)}
                    label="Opening Time"
                  >
                    {Array.from({ length: 24 }, (_, i) => (
                      <MenuItem key={i} value={`${i.toString().padStart(2, '0')}:00`}>
                        {`${i.toString().padStart(2, '0')}:00`}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControl fullWidth>
                  <InputLabel>Closing Time</InputLabel>
                  <Select
                    value={tempOperatingHours[day]?.close || ''}
                    onChange={(e) => handleOperatingHoursChange(day, 'close', e.target.value)}
                    label="Closing Time"
                  >
                    {Array.from({ length: 24 }, (_, i) => (
                      <MenuItem key={i} value={`${i.toString().padStart(2, '0')}:00`}>
                        {`${i.toString().padStart(2, '0')}:00`}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
            </Box>
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setHoursDialog(false)}>Cancel</Button>
          <Button
            onClick={handleSaveOperatingHours}
            variant="contained"
          >
            Save Hours
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default AvailabilityCalendar;
