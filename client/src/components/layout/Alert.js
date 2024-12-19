import React from 'react';
import { useSelector } from 'react-redux';
import { Alert as MuiAlert, Snackbar } from '@mui/material';

const Alert = () => {
  const { message, type } = useSelector(state => state.alert);

  return (
    <Snackbar
      open={!!message}
      autoHideDuration={6000}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
    >
      {message && (
        <MuiAlert elevation={6} variant="filled" severity={type || 'info'}>
          {message}
        </MuiAlert>
      )}
    </Snackbar>
  );
};

export default Alert;
