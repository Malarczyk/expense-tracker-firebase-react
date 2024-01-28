import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth'
import initializeDefaultUserData from '../../utils/initializeDefaultUserData'
import { auth } from '../../config/firebase-config'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import './_index.scss'

const Signin = ({ setSigninVisible }) => {
  const [loginInput, setLoginInput] = useState("")
  const [passInput, setPassInput] = useState("")
  const [error, setError] = useState("")
  const [signIn, setSignIn] = useState(false)

  const navigate = useNavigate()

  const handleSignup = async (event) => {
    event.preventDefault() // Zatrzymuje domyślne zachowanie formularza
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, loginInput, passInput)
      sendEmailVerification(userCredential.user)
        .then(() => {
          setSignIn(true)
        })
        .catch((error) => {
          setError(error.message)
        })
      initializeDefaultUserData(userCredential.user.uid)
    } catch (error) {
      console.error("Błąd podczas rejestracji: ", error.message)
      setError(error.message)
    }
  }

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
              <h1>Podaj adres e-mail oraz ustal hasło<br></br> aby się zarejestrować</h1>
            </div>

            <div className="loginForm__content">
              <form onSubmit={handleSignup}>

                <div className='myInput'>
                  <label>Login</label>
                  <input
                    type='text'
                    value={loginInput}
                    onChange={(e) => setLoginInput(e.target.value)}
                    className={error ? 'error' : ''}
                    required
                    placeholder='np. biuro@email.com'
                  />
                  {error && <div className="error-message">{error}</div>}
                </div>

                <div className='myInput'>
                  <label>Hasło</label>
                  <input
                    type='password' // Zmiana typu na 'password'
                    value={passInput}
                    onChange={(e) => setPassInput(e.target.value)}
                    className={error ? 'error' : ''}
                    required
                    placeholder="**************"
                  />
                  {error && <div className="error-message">{error}</div>}
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
