import './_index.scss'
import { signOut } from "firebase/auth"
import { useLocation } from 'react-router-dom';
import { auth } from "../../config/firebase-config"
import { useNavigate } from "react-router-dom"
import { useMenu } from '../../context/Menu/MenuContext';

const Menu = ({ changeTheme }) => {
  const { toggleMenu } = useMenu()
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
    toggleMenu();
  }

  const handleNavigation = (path) => {
    navigate(path);
    toggleMenu(); // Zamknij menu po kliknięciu w przycisk nawigacyjny
  };

  return (
    <>
      {location.pathname !== '/' && location.pathname !== '/verification' &&
        <aside className='app__menu'>

          <div className="app__menu__logo">
            Logo Wismmo
          </div>

          <div className="app__menu__nav">
            <div className={`app__menu__nav__btn ${isActive('/home') && 'active'}`} onClick={() => handleNavigation('/home')}>
              <i className="icon icon--dashboard"></i>
              <span>Pulpit</span>
            </div>
            <div className="divider"><span></span></div>
            <div className={`app__menu__nav__btn ${isActive('/transactions') && 'active'}`} onClick={() => handleNavigation('/transactions')}>
              <i className="icon icon--transactions"></i>
              <span>Transakcje</span>
            </div>
            <div className={`app__menu__nav__btn ${isActive('/categories') && 'active'}`} onClick={() => handleNavigation('/categories')}>
              <i className="icon icon--categories"></i>
              <span>Kategorie</span>
            </div>
            <div className={`app__menu__nav__btn ${isActive('/wallets') && 'active'}`} onClick={() => handleNavigation('/wallets')}>
              <i className="icon icon--wallets"></i>
              <span>Portfele</span>
            </div>
            <div className={`app__menu__nav__btn ${isActive('/budgets') && 'active'}`} onClick={() => handleNavigation('/budgets')}>
              <i className="icon icon--budgets"></i>
              <span>Budżety</span>
            </div>
            <div className="divider"><span></span></div>
            <div className="app__menu__nav__btn" onClick={changeTheme}>
              <i className="icon icon--settings"></i>
              <span>Ustawienia</span>
            </div>
            <div className="divider"><span></span></div>
            <div className="app__menu__nav__btn" onClick={() => signUserOut()}>
              <i className="icon icon--logout"></i>
              <span>Wyloguj się</span>
            </div>
          </div>

        </aside>}
    </>
  )
}

export default Menu