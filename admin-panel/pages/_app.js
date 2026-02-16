import '../styles/globals.css';
import { ThemeProvider } from '../context/ThemeContext';
import { AuthProvider } from '../context/AuthContext';
import { Toaster } from 'react-hot-toast';
import { NotificationProvider } from '../context/NotificationContext';
import NotificationDrawer from '../components/NotificationDrawer';

function MyApp({ Component, pageProps }) {
  return (
    <AuthProvider>
      <NotificationProvider>
        <ThemeProvider>
          <NotificationDrawer />
          <Toaster />
          <Component {...pageProps} />
        </ThemeProvider>
      </NotificationProvider>
    </AuthProvider>
  );
}


export default MyApp;
