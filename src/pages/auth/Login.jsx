import initializeDefaultUserData from '../../utils/initializeDefaultUserData'
import { signInWithPopup, signInWithEmailAndPassword } from 'firebase/auth'
import { auth, provider, db } from '../../config/firebase-config'
import { collection, query, where, getDocs } from "firebase/firestore"
import { useGetUserInfo } from '../../hooks/useGetUserInfo'
import { useNavigate, Navigate } from 'react-router-dom'
import LogoGoogle from '../../assets/images/google.svg'
import { useState } from 'react'
import './_index.scss'

const Login = ({ setSigninVisible }) => {
  const [loginInput, setLoginInput] = useState("")
  const [passInput, setPassInput] = useState("")

  const navigate = useNavigate()
  const { isAuth } = useGetUserInfo()

  const signInWithGoogle = async () => {
    const results = await signInWithPopup(auth, provider)
    console.log(results.user);
    // Tuż po zalogowaniu sprawdzamy, czy użytkownik ma już zainicjalizowane dane
    const user = results.user;

    // Zdefiniuj referencję do kolekcji, gdzie przechowujesz dane użytkownika (na przykład kategorie)
    const userCategoriesRef = collection(db, 'categories');

    // Stwórz zapytanie, które sprawdza, czy istnieją jakieś kategorie dla danego uid użytkownika
    const querySnapshot = await getDocs(query(userCategoriesRef, where('userId', '==', user.uid)));

    if (querySnapshot.empty) {
      // Brak kategorii dla tego użytkownika, zainicjuj domyślne dane
      initializeDefaultUserData(user.uid);
    } else {
      // Dane dla tego użytkownika już istnieją, nie inicjuj ponownie
      console.log('Użytkownik posiada już dane, pomijam inicjalizację.');
    }

    const authInfo = {
      userID: results.user.uid,
      name: results.user.displayName,
      profilePhoto: results.user.photoURL,
      isAuth: true,
    }
    localStorage.setItem("auth", JSON.stringify(authInfo))
    navigate("/home")
  }

  const handleLogin = async (event) => {
    event.preventDefault(); // Zatrzymuje domyślne zachowanie formularza
    try {
      const userCredential = await signInWithEmailAndPassword(auth, loginInput, passInput);
      const user = userCredential.user;
  
      // Zdefiniuj referencję do kolekcji, gdzie przechowujesz dane użytkownika (na przykład kategorie)
      const userCategoriesRef = collection(db, 'categories');
  
      // Stwórz zapytanie, które sprawdza, czy istnieją jakieś kategorie dla danego uid użytkownika
      const querySnapshot = await getDocs(query(userCategoriesRef, where('userId', '==', user.uid)));
  
      if (querySnapshot.empty) {
        // Brak kategorii dla tego użytkownika, zainicjuj domyślne dane
        initializeDefaultUserData(user.uid);
      } else {
        // Dane dla tego użytkownika już istnieją, nie inicjuj ponownie
        console.log('Użytkownik posiada już dane, pomijam inicjalizację.');
      }
  
      // Przygotuj dane użytkownika do zapisania
      const authInfo = {
        userID: user.uid,
        name: user.displayName || "", // Użyj displayName lub pustego stringa, jeśli nie jest dostępny
        email: user.email, // Adres e-mail użytkownika
        profilePhoto: user.photoURL || "", // Użyj photoURL lub pustego stringa, jeśli nie jest dostępny
        isAuth: true,
      };
  
      // Zapisz dane w localStorage
      localStorage.setItem("auth", JSON.stringify(authInfo));
  
      // Przekieruj użytkownika
      navigate("/home");
    } catch (error) {
      console.error("Błąd podczas logowania: ", error.message);
      // Twoja obsługa błędów...
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
        <div className="loginForm__start">
          <h1>Zaczynamy!</h1>
        </div>
        <div className="btnGoogle" onClick={signInWithGoogle}>
          <div className="iconWrap"><img src={LogoGoogle} alt="" /></div>
          <span>Kontynuuj z Google</span>
        </div>
        <div className="loginForm__or">
          <span></span>
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
                type='password'
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