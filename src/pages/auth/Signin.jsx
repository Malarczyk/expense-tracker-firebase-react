import { useState, useContext } from 'react';
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import useInitializeDefaultUserData from '../../utils/useInitializeDefaultUserData'; // Załóżmy, że custom hook został przeniesiony do folderu hooks
import { AlertContext } from '../../context/Alert/AlertContext';
import { auth } from '../../config/firebase-config';
import './_index.scss';

const Signin = ({ setSigninVisible }) => {
  const [loginInput, setLoginInput] = useState("");
  const [passInput, setPassInput] = useState("");
  const [repeatPassInput, setRepeatPassInput] = useState("");
  const [errorPass, setErrorPass] = useState("");
  const [signIn, setSignIn] = useState(false);
  const [userId, setUserId] = useState(null); 
  const { showAlert } = useContext(AlertContext);

  useInitializeDefaultUserData(userId);

  const handleSignup = async (event) => {
    event.preventDefault();


    if (passInput !== repeatPassInput) {
      showAlert('Hasła muszą być identyczne.', 'error');
      return; // Przerwij funkcję, jeśli hasła się różnią
    }

    if (!validatePassword(passInput)) {
      setErrorPass('Hasło musi zawierać co najmniej 8 znaków, w tym wielką literę, małą literę, cyfrę i znak specjalny.');
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, loginInput, passInput);
      await sendEmailVerification(userCredential.user);
      setUserId(userCredential.user.uid); // Ustawiamy userId po pomyślnej rejestracji, co uruchomi hook
      setSignIn(true);
    } catch (error) {
      console.error("Błąd podczas rejestracji: ", error.message);
      showAlert(error.message, 'error');
      setSignIn(false);
    }
  };

  const validatePassword = (password) => {
    const minLength = 8;
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasDigit = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*()]/.test(password);

    return password.length >= minLength && hasUppercase && hasLowercase && hasDigit && hasSpecialChar;
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
                    autoComplete='new-password'
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
                    autoComplete='new-password'
                  />
                  {errorPass && <div className="error-message">{errorPass}</div>}
                </div>

                <div className='myInput'>
                  <label>Powtórz hasło</label>
                  <input
                    type='password'
                    value={repeatPassInput}
                    onChange={(e) => setRepeatPassInput(e.target.value)}
                    className={errorPass ? 'error' : ''}
                    required
                    placeholder="**************"
                    autoComplete='new-password'
                  />
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
