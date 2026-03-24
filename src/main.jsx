import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import AppShell from './layouts/AppShell';
import AuthProvider from './auth/AuthProvider';
import { ToastProvider } from './components/Toast';
import './styles/global.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <ToastProvider>
          <AppShell />
        </ToastProvider>
      </BrowserRouter>
    </AuthProvider>
  </React.StrictMode>
);
