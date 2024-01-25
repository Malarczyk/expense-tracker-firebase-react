import './_index.scss'
import { auth, provider } from '../../config/firebase-config'
import { signInWithPopup, signInWithEmailAndPassword } from 'firebase/auth'
import { useNavigate, Navigate } from 'react-router-dom'
import { useGetUserInfo } from '../../hooks/useGetUserInfo';
import LogoGoogle from '../../assets/images/google.svg'
import { useState } from 'react';

const Login = ({ setSigninVisible }) => {
  const [loginInput, setLoginInput] = useState("");
  const [passInput, setPassInput] = useState("");

  const navigate = useNavigate()
  const { isAuth } = useGetUserInfo()

  const signInWithGoogle = async () => {
    const results = await signInWithPopup(auth, provider)
    const authInfo = {
      userID: results.user.uid,
      name: results.user.displayName,
      profilePhoto: results.user.photoURL,
      isAuth: true,
    };
    localStorage.setItem("auth", JSON.stringify(authInfo));
    navigate("/home")
  };

  const handleLogin = async (event) => {
    event.preventDefault(); // Zatrzymuje domyślne zachowanie formularza
    try {
      const userCredential = await signInWithEmailAndPassword(auth, loginInput, passInput);
      console.log(userCredential.user); // Możesz tu dodać więcej logiki, np. przekierowanie lub wyświetlenie komunikatu
      // Przekierowanie po pomyślnym logowaniu
      navigate("/home");
    } catch (error) {
      console.error("Błąd podczas logowania: ", error.message);
      // Możesz tu dodać obsługę błędów, np. wyświetlenie komunikatu użytkownikowi
    }
  };

  if (isAuth) {
    return <Navigate to="/home" />
  }

  return (
    <>
      <div className="login__right__mobile">
        <h1 className='titleLogo'>Wismmo</h1>
        <p className='subTitleLogo'>What I spend my money on?</p>
      </div>
      <div className='loginForm'>
        <div className="btnGoogle" onClick={signInWithGoogle}>
          <div className="iconWrap"><img src={LogoGoogle} alt="" /></div>
          <span>Kontynuuj z Google</span>
        </div>
        <div className="loginForm__or">
          <span>Lub</span>
        </div>
        <div className="loginForm__content">
          <form onSubmit={handleLogin}>
            <div className='myInput'>
              <label>Login</label>
              <input
                type='text'
                value={loginInput}
                onChange={(e) => setLoginInput(e.target.value)}
                // className={error ? 'error' : ''}
                required
                placeholder='np. biuro@email.com'
              />
              {/* {error && <div className="error-message">{error}</div>} */}
            </div>

            <div className='myInput'>
              <label>Hasło</label>
              <input
                type='text'
                value={passInput}
                onChange={(e) => setPassInput(e.target.value)}
                // className={error ? 'error' : ''}
                required
                placeholder="**************"
              />
              {/* {error && <div className="error-message">{error}</div>} */}
            </div>
            <button className="btn btn--empty" type='submit'>Zaloguj się</button>
          </form>
        </div>
        <div className="loginForm__forget">
          <span className="link">Zapomniałeś hasła?</span>
        </div>
        <div className="loginForm__footer">
          <span>Nie masz jeszcze konta?</span>
          <span className='link' onClick={setSigninVisible}>Zerejestruj się</span>
        </div>

      </div></>
  )
}
export default Login