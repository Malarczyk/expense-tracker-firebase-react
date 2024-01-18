import './_index.scss'
import { signOut } from "firebase/auth"
import { useLocation } from 'react-router-dom';
import { auth } from "../../config/firebase-config"
import { useNavigate } from "react-router-dom"

const MenuDesktop = ({ changeTheme }) => {
  const navigate = useNavigate()

  const location = useLocation();

  const isActive = (path) => location.pathname === path;
  const signUserOut = async () => {
    try {
      await signOut(auth)
      localStorage.clear()
      navigate('/')
    } catch (err) {
      console.error(err)
    }
  }

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <>
      <aside className='menuDesktop'>

        <div className="menuDesktop__logo">
          <div className="logo">
            Wismmo
          </div>
          <div className="back">
            <div className="iconWrap">
            <i className="icon icon--arrow-left"></i>
            </div>
          </div>
        </div>

        <div className="menuDesktop__profile">
          <div className="dashboard__profile">

            <div className="dashboard__profile__img">
              <span></span>
            </div>
            <div className="dashboard__profile__body">
              <span>Witaj z powrotem,</span>
              <h2>Piotr Kowalski!</h2>
            </div>
          </div>
        </div>

        <div className="menuDesktop__nav">
          <div className={`menuDesktop__nav__btn ${isActive('/home') && 'active'}`} onClick={() => handleNavigation('/home')}>
            <i className="icon icon--dashboard"></i>
            <span>Pulpit</span>
          </div>
          <div className={`menuDesktop__nav__btn ${isActive('/transactions') && 'active'}`} onClick={() => handleNavigation('/transactions')}>
            <i className="icon icon--transactions"></i>
            <span>Transakcje</span>
          </div>
          <div className={`menuDesktop__nav__btn ${isActive('/categories') && 'active'}`} onClick={() => handleNavigation('/categories')}>
            <i className="icon icon--categories"></i>
            <span>Kategorie</span>
          </div>
          <div className={`menuDesktop__nav__btn ${isActive('/wallets') && 'active'}`} onClick={() => handleNavigation('/wallets')}>
            <i className="icon icon--wallets"></i>
            <span>Portfele</span>
          </div>
          <div className={`menuDesktop__nav__btn ${isActive('/budgets') && 'active'}`} onClick={() => handleNavigation('/budgets')}>
            <i className="icon icon--budgets"></i>
            <span>Budżety</span>
          </div>
          <div className="divider"></div>
          <div className="menuDesktop__nav__btn" onClick={changeTheme}>
            <i className="icon icon--settings"></i>
            <span>Ustawienia</span>
          </div>
          <div className="menuDesktop__nav__btn" onClick={() => signUserOut()}>
            <i className="icon icon--logout"></i>
            <span>Wyloguj się</span>
          </div>
        </div>

      </aside>
    </>
  )
}

export default MenuDesktop