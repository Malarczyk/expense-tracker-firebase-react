import React from 'react';
import { Navigate } from 'react-router-dom';
import { useGetUserInfo } from "../../hooks/useGetUserInfo"

const ProtectedRoute = ({ children }) => {
  const { isAuth } = useGetUserInfo();

  if (!isAuth) {
    // Użytkownik niezalogowany, przekierowuje na stronę główną (logowanie)
    return <Navigate to="/" replace />;
  }

  // Użytkownik zalogowany, renderuje żądany komponent
  return children;
}

export default ProtectedRoute