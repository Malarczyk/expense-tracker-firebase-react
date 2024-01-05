import { auth, provider }from "../../config/firebase-config"
import { signInWithPopup } from "firebase/auth"
import { useNavigate, Navigate } from "react-router-dom"
import { useGetUserInfo } from "../../hooks/useGetUserInfo";
export const Auth = () => {

  const navigate = useNavigate()
  const {isAuth} = useGetUserInfo()
  const signInWithGoogle = async () => {
    const results = await signInWithPopup(auth, provider)
    const authInfo = {
      userID: results.user.uid,
      name: results.user.displayName,
      profilePhoto: results.user.photoURL,
      isAuth: true,
    };
    localStorage.setItem("auth", JSON.stringify(authInfo));
    navigate("/expense-tracker")
  };
  if(isAuth){
    return <Navigate to="/expense-tracker" />
  }
  return (
    <div className="login">
      <p>Sign in with google to cointue</p>
      <button onClick={signInWithGoogle}>{" "}Sign In</button>
    </div>
  );
};