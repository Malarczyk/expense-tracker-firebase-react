import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { getAuth, applyActionCode } from 'firebase/auth'

const Verification = () => {
  const [verified, setVerified] = useState(false)
  const [error, setError] = useState('')
  const location = useLocation()
  const nav = useNavigate()
  const auth = getAuth()

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search)
    const mode = urlParams.get('mode')
    const actionCode = urlParams.get('oobCode')

    if (mode === 'verifyEmail') {
      applyActionCode(auth, actionCode)
        .then(() => {
          setVerified(true)
          // Email has been verified
          console.log('Email has been verified')
          // You can also redirect the user to other page
        })
        .catch((error) => {
          setError('Error in email verification: ' + error.message)
          console.error('Error in email verification', error)
        })
    }
  }, [location])

  return (
    <div className='verification'>
      <div className="verification__box">
        <div className="verification__box__body">
          <h2>
            {verified
              ? 'Email został zweryfikowany'
              : error
                ? 'Błąd weryfikacji'
                : 'Weryfikowanie...'}
          </h2>
        </div>
        <div className="verification__box__footer">
          {verified || error
            ? (
              <button onClick={nav('/')} className='btn btn--blue'>
                {verified ? 'Przejdź do logowania' : error ? 'Wróć do rejestracji' : ''}
              </button>)
            : ('')}
        </div>
      </div>
    </div>
  )
}

export default Verification
