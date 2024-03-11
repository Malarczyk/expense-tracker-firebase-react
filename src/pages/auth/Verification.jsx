import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { getAuth, applyActionCode, confirmPasswordReset } from 'firebase/auth'

const Verification = () => {
  const [verified, setVerified] = useState(false)
  const [resetPassword, setResetPassword] = useState(false)
  const [error, setError] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [errorPass, setErrorPass] = useState('')
  const location = useLocation()
  const navigate = useNavigate()
  const auth = getAuth()

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search)
    const mode = urlParams.get('mode')
    const actionCode = urlParams.get('oobCode')

    if (mode === 'verifyEmail') {
      applyActionCode(auth, actionCode)
        .then(() => {
          setVerified(true)
        })
        .catch((error) => {
          setError('Error in email verification: ' + error.message)
        })
    } else if (mode === 'resetPassword') {
      setResetPassword(true)
    }
  }, [auth, location.search])

  const validatePassword = (password) => {
    const minLength = 8
    const hasUppercase = /[A-Z]/.test(password)
    const hasLowercase = /[a-z]/.test(password)
    const hasDigit = /[0-9]/.test(password)
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password)

    return password.length >= minLength && hasUppercase && hasLowercase && hasDigit && hasSpecialChar
  }

  const handleResetPassword = async (e) => {
    e.preventDefault()
    setError('')
    setErrorPass('')

    if (newPassword !== confirmPassword) {
      setErrorPass('Hasła nie są identyczne.')
      return
    }

    if (!validatePassword(newPassword)) {
      setErrorPass('Hasło musi zawierać co najmniej 8 znaków, w tym wielką literę, małą literę, cyfrę i znak specjalny.')
      return
    }

    const urlParams = new URLSearchParams(location.search)
    const oobCode = urlParams.get('oobCode')

    try {
      await confirmPasswordReset(auth, oobCode, newPassword)
      navigate('/')
    } catch (error) {
      setError('Error resetting password: ' + error.message)
    }
  }

  return (
    <div className='verification'>
      {resetPassword ? (
        <div className="reset-password-form">
          <h2>Resetowanie hasła</h2>
          <form onSubmit={handleResetPassword}>
            <div className='myInput'>
              <label>Nowe hasło</label>
              <input
                type='password'
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className={errorPass ? 'error' : ''}
                required
                placeholder="**************"
                autoComplete='new-password'
              />
            </div>
            <div className='myInput'>
              <label>Potwierdź nowe hasło</label>
              <input
                type='password'
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={errorPass ? 'error' : ''}
                required
                placeholder="**************"
                autoComplete='new-password'
              />
              {errorPass && <div className="error-message">{errorPass}</div>}
            </div>
            <button type="submit" className="btn btn--blue">Zresetuj hasło</button>
            {error && <div className="error-message">{error}</div>}
          </form>
        </div>
      ) : (
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
                <button onClick={() => navigate('/')} className='btn btn--blue'>
                  {verified ? 'Przejdź do logowania' : error ? 'Wróć do rejestracji' : ''}
                </button>)
              : ('')}
          </div>
        </div>
      )}
    </div>
  )
}

export default Verification
