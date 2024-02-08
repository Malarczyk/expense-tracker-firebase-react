import React, { useContext } from 'react';
import { AlertContext } from '../../context/Alert/AlertContext';
import './_index.scss';

const Alert = () => {
  const { alert, hideAlert } = useContext(AlertContext);

  if (!alert.message) return null; // Nie wyświetlaj nic, jeśli nie ma wiadomości

  return (
    <div className="alertWrap">
      <div className={`alert ${alert.type}`}>
        <div className="alert__message">
          {alert.message}
        </div>
        <div className="alert__close" onClick={hideAlert}>
          <i className="icon icon--close"></i>
        </div>
      </div>
    </div>
  );
};

export default Alert;
