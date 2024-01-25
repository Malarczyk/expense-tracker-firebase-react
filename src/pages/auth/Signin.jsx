import './_index.scss'
import { useState } from 'react';
import { auth } from '../../config/firebase-config'
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { useNavigate } from 'react-router-dom'

const Signin = ({ setSigninVisible }) => {
  const [loginInput, setLoginInput] = useState("");
  const [passInput, setPassInput] = useState("");
  const [error, setError] = useState(""); // Dodano stan błędu

  const navigate = useNavigate()

  const handleSignup = async (event) => {
    event.preventDefault(); // Zatrzymuje domyślne zachowanie formularza
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, loginInput, passInput);
      // Wysyłanie e-maila weryfikacyjnego
      sendEmailVerification(userCredential.user)
        .then(() => {
          // E-mail weryfikacyjny został wysłany
          console.log("E-mail weryfikacyjny został wysłany");
          //navigate("/verify-email"); Możesz przekierować użytkownika do strony z informacją, żeby sprawdził skrzynkę e-mail
        })
        .catch((error) => {
          // Błąd podczas wysyłania e-maila weryfikacyjnego
          setError(error.message);
        });
    } catch (error) {
      console.error("Błąd podczas rejestracji: ", error.message);
      setError(error.message); // Ustawienie komunikatu błędu
    }
  };

  return (
    <>
      <div className="login__right__mobile --register">
        <i className="icon icon--arrow-left" onClick={setSigninVisible}></i>
        <h2>Zarejestruj się</h2>
      </div>
      <div className='loginForm'>

        <div className="loginForm__desc">
          <p>Podaj login i hasło, aby się zarejestrować</p>
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

      </div>
    </>
  )
}
export default Signin
