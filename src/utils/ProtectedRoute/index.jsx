import React from 'react';
import { Navigate } from 'react-router-dom';
import { useGetUserInfo } from "../../hooks/useGetUserInfo"

const ProtectedRoute = ({ children }) => {
  const { isAuth } = useGetUserInfo();

  if (!isAuth) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default ProtectedRoute