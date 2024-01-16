import { auth, provider } from '../../config/firebase-config'
import { signInWithPopup } from 'firebase/auth'
import { useNavigate, Navigate } from 'react-router-dom'
import { useGetUserInfo } from '../../hooks/useGetUserInfo';
import './_index.scss'
export const Auth = () => {

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
  if (isAuth) {
    return <Navigate to="/home" />
  }
  return (
    <div className="login">
      <div className="login__logo">
        <h1>Wismmo</h1>
        <p>What I spend my money on?</p>
      </div>
      <div className="login__content">
        <p>Sign in with google to cointue</p>
        <button onClick={signInWithGoogle}>{" "}Sign In</button>
      </div>

    </div>
  );
};