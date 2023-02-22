import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AuthContextProvider } from './context/AuthContext';
import { DateContextProvider } from './context/DateContext';
import { ModalContextProvider } from './context/ModalContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <AuthContextProvider>
    <ModalContextProvider>
      <DateContextProvider>
        <App />
      </DateContextProvider>
    </ModalContextProvider>
  </AuthContextProvider>
);