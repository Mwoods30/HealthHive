import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import AppShell from './layouts/AppShell';
import AuthProvider from './auth/AuthProvider';
import { DemoDataProvider } from './data/DemoDataProvider';
import './styles/global.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <DemoDataProvider>
        <BrowserRouter>
          <AppShell />
        </BrowserRouter>
      </DemoDataProvider>
    </AuthProvider>
  </React.StrictMode>
);
