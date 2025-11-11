import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';
import { ClerkProvider } from '@clerk/clerk-react';
import { ToastProvider } from './provider/toastProvider';

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error('Missing Clerk publishable key');
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* BrowserRouter must wrap ClerkProvider */}
  
      <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/">
        <App />
        <ToastProvider/>
      </ClerkProvider>
   
  </StrictMode>
);
