import React from 'react';
import { Provider } from 'react-redux';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import store from './store/store';
import theme from './theme';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Alert from './components/layout/Alert';
import AppRoutes from './AppRoutes';

// Styles
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './styles/global.css';

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="App" style={{ 
          display: 'flex', 
          flexDirection: 'column',
          minHeight: '100vh',
          width: '100%',
          overflow: 'hidden'
        }}>
          <Navbar />
          <Alert />
          <main style={{ flex: 1, width: '100%', overflowX: 'hidden' }}>
            <AppRoutes />
          </main>
          <Footer />
        </div>
      </ThemeProvider>
    </Provider>
  );
}

export default App;
