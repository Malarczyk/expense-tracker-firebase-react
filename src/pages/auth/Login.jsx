import useInitializeDefaultUserData from '../../utils/useInitializeDefaultUserData'
import { collection, query, where, getDocs, onSnapshot } from "firebase/firestore"
import { signInWithPopup, signInWithEmailAndPassword } from 'firebase/auth'
import { auth, provider, db } from '../../config/firebase-config'
import { AlertContext } from '../../context/Alert/AlertContext'
import { useGetUserInfo } from '../../hooks/useGetUserInfo'
import { useNavigate, Navigate } from 'react-router-dom'
import LogoGoogle from '../../assets/images/google.svg'
import { useState, useContext } from 'react'
import './_index.scss'

const Login = ({ setSigninVisible, setRemindVisible }) => {
  const [loginInput, setLoginInput] = useState("")
  const [passInput, setPassInput] = useState("")

  const initializeDefaultUserData = useInitializeDefaultUserData()

  const navigate = useNavigate()
  const { isAuth } = useGetUserInfo()
  const { showAlert } = useContext(AlertContext)
  const categoriesCollectionRef = collection(db, 'categories')

  const checkCategories = async (userID, callback) => {
    try {
      const queryCategories = query(
        categoriesCollectionRef,
        where("userID", "==", userID)
      )

      onSnapshot(queryCategories, (snapshot) => {
        const thereAreCategories = snapshot.empty//((doc) => !!doc.data())
        if (thereAreCategories) {
          initializeDefaultUserData(userID)
        }
        callback()
      })

    } catch (err) {
      console.error(err)
      callback()
    }
  }

  const signInWithGoogle = async () => {
    provider.setCustomParameters({
      prompt: 'select_account'
    })

    try {
      const results = await signInWithPopup(auth, provider)
      const user = results.user

      console.log("przed sprawdzeniem bazy -> " + user.uid)

      const callback = () => {
        const authInfo = {
          userID: user.uid,
          name: user.displayName,
          profilePhoto: user.photoURL,
          isAuth: true,
        }
        localStorage.setItem("auth", JSON.stringify(authInfo))
        navigate("/home")
      }

      checkCategories(user.uid, callback)


    } catch (error) {
      console.error("Błąd podczas logowania: ", error.message)
    }
  }

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const userCredential = await signInWithEmailAndPassword(auth, loginInput, passInput)
      const user = userCredential.user

      const authInfo = {
        userID: user.uid,
        name: user.displayName || "",
        email: user.email,
        profilePhoto: user.photoURL || "",
        isAuth: true,
      }

      localStorage.setItem("auth", JSON.stringify(authInfo))
      navigate("/home")
    } catch (error) {
      console.error("Błąd podczas logowania: ", error.message)
      handleLoginError(error)
    }
  }

  const handleLoginError = (error) => {
    let errorMessage = 'Podane dane są nieprawidłowe.'

    switch (error.code) {
      case 'auth/invalid-email':
        errorMessage = 'Podany adres e-mail jest nieprawidłowy.'
        break
      case 'auth/user-disabled':
        errorMessage = 'Konto użytkownika jest nieaktywne.'
        break
      case 'auth/user-not-found':
        errorMessage = 'Nie znaleziono użytkownika z tym adresem e-mail.'
        break
      case 'auth/wrong-password':
        errorMessage = 'Podane hasło jest nieprawidłowe.'
        break
      case 'uth/popup-closed-by-user':
        errorMessage = 'Zamknięto okno wyboru konta Google'
        break
      default:
        break
    }
    showAlert(errorMessage, 'error')
  }

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
                required
                placeholder="**************"
                autoComplete='new-password'
              />
            </div>
            <button className="btn btn--empty" type='submit'>Zaloguj się</button>
          </form>
        </div>
        <div className="loginForm__forget">
          <span className="link" onClick={setRemindVisible}>Zapomniałeś hasła?</span>
        </div>
        <div className="loginForm__footer">
          <span>Nie masz jeszcze konta?</span>
          <span className='link' onClick={setSigninVisible}>Zerejestruj się</span>
        </div>

      </div></>
  )
}
export default Login