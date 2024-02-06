import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth'
import initializeDefaultUserData from '../../utils/initializeDefaultUserData'
import { AlertContext } from '../../context/Alert/AlertContext'
import { auth } from '../../config/firebase-config'
import { useState, useContext } from 'react'
import './_index.scss'

const Signin = ({ setSigninVisible }) => {
  const [loginInput, setLoginInput] = useState("")
  const [passInput, setPassInput] = useState("")
  const [errorPass, setErrorPass] = useState("")
  const [signIn, setSignIn] = useState(false)
  const { showAlert } = useContext(AlertContext)

  const handleSignup = async (event) => {
    event.preventDefault()
    if (!validatePassword(passInput)) {
      setErrorPass('Hasło musi mieć co najmniej 8 znaków, przynajmniej jedną dużą i jedną małą literę, co najmniej jedną cyfrę oraz co najmniej jeden znak specjalny (!@#$%^&*()).');
      return;
    }
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, loginInput, passInput)
      sendEmailVerification(userCredential.user)
        .then(() => {
          setSignIn(true)
        })
        .catch((error) => {
          setSignIn(false)
          showAlert(error.message, 'error')
        })
      initializeDefaultUserData(userCredential.user.uid)
    } catch (error) {
      console.error("Błąd podczas rejestracji: ", error.message)
      showAlert(error.message, 'error')
    }
  }

  const validatePassword = (password) => {
    const minLength = 8;
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasDigit = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*()]/.test(password);

    if (password.length < minLength || !hasUppercase || !hasLowercase || !hasDigit || !hasSpecialChar) {
      return false;
    }

    return true;
  };


  return (
    <>
      <div className="login__right__mobile --register">
        <i className="icon icon--arrow-left" onClick={setSigninVisible}></i>
        <h2>Zarejestruj się</h2>
      </div>

      {signIn
        ? (<div className='loginForm --success'>
          <div className='loginForm__success'>
            <i className='icon icon--send-mail s64'></i>
            <h2>Mail Weryfikacyjny został wysłany!</h2>
            <p>Sprawdź swoją pocztę i kliknij w link aktywacyjny</p>
          </div>
        </div>)
        : (<>
          <div className='loginForm --register'>
            <div className="loginForm__start">
              <h1>Podaj adres e-mail oraz ustal hasło, aby się zarejestrować</h1>
            </div>

            <div className="loginForm__content">
              <form onSubmit={handleSignup}>

                <div className='myInput'>
                  <label>Login</label>
                  <input
                    type='text'
                    value={loginInput}
                    onChange={(e) => setLoginInput(e.target.value)}
                    required
                    placeholder='np. biuro@email.com'
                  />
                </div>

                <div className='myInput'>
                  <label>Hasło</label>
                  <input
                    type='password'
                    value={passInput}
                    onChange={(e) => setPassInput(e.target.value)}
                    className={errorPass ? 'error' : ''}
                    required
                    placeholder="**************"
                  />
                  {errorPass && <div className="error-message">{errorPass}</div>}
                </div>

                <button className="btn btn--empty" type='submit'>Zarejestruj się</button>
              </form>
            </div>
            <div className="loginForm__footer">
              <span>Masz juz konto?</span>
              <span className='link' onClick={setSigninVisible}>Zaloguj się</span>
            </div>
          </div></>)}
    </>
  )
}
export default Signin
