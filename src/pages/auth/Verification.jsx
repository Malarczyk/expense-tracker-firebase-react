import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { getAuth, applyActionCode } from 'firebase/auth';

const Verification = () => {
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState('');
  const location = useLocation();
  const auth = getAuth();

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const mode = urlParams.get('mode');
    const actionCode = urlParams.get('oobCode');

    if (mode === 'verifyEmail') {
      applyActionCode(auth, actionCode)
        .then(() => {
          setVerified(true);
          // Email has been verified
          console.log('Email has been verified');
          // You can also redirect the user to other page
        })
        .catch((error) => {
          setError('Error in email verification: ' + error.message);
          console.error('Error in email verification', error);
        });
    }
  }, [location]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (verified) {
    return <div>Your email has been successfully verified!</div>;
  }

  return (
    <div>Verifying your email...</div>
  );
};

export default Verification;
