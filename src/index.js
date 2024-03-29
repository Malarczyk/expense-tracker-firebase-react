import React from 'react';
import ReactDOM from 'react-dom/client';
import { MenuProvider } from './context/Menu/MenuContext'
import App from './App';
import { AlertProvider } from './context/Alert/AlertContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AlertProvider>
      <MenuProvider>
        <App />
      </MenuProvider>
    </AlertProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
