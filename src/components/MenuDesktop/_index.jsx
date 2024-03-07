import { useLocation, useNavigate } from 'react-router-dom'
import { auth } from "../../config/firebase-config"
import { signOut } from "firebase/auth"
import Profile from '../Profile'
import './_index.scss'


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

  const nav = (path) => {
    navigate(path);
  }

  return (
    <>
      {location.pathname !== '/' && location.pathname !== '/verification' && 
      <aside className='menuDesktop'>

        <div className="menuDesktop__logo">
          <div className="logo">
            Logo
          </div>
          <div className="back">
            <div className="iconWrap">
            <i className="icon icon--arrow-left"></i>
            </div>
          </div>
        </div>

        <div className="menuDesktop__profile">
          <Profile isHamburger={false} />
        </div>

        <div className="menuDesktop__nav">
          <div className={`menuDesktop__nav__btn ${isActive('/home') && 'active'}`} onClick={() => nav('/home')}>
            <i className="icon icon--dashboard"></i>
            <span>Pulpit</span>
          </div>
          <div className={`menuDesktop__nav__btn ${isActive('/transactions') && 'active'}`} onClick={() => nav('/transactions')}>
            <i className="icon icon--transactions"></i>
            <span>Transakcje</span>
          </div>
          <div className={`menuDesktop__nav__btn ${isActive('/categories') && 'active'}`} onClick={() => nav('/categories')}>
            <i className="icon icon--categories"></i>
            <span>Kategorie</span>
          </div>
          <div className={`menuDesktop__nav__btn ${isActive('/wallets') && 'active'}`} onClick={() => nav('/wallets')}>
            <i className="icon icon--wallets"></i>
            <span>Portfele</span>
          </div>
          <div className={`menuDesktop__nav__btn ${isActive('/budgets') && 'active'}`} onClick={() => nav('/budgets')}>
            <i className="icon icon--budgets"></i>
            <span>Budżety</span>
          </div>
          <div className="divider"></div>
          <div className="menuDesktop__nav__btn" onClick={changeTheme}>
            <i className="icon icon--settings"></i>
            <span>Zmień motyw</span>
          </div>
          <div className="menuDesktop__nav__btn" onClick={() => signUserOut()}>
            <i className="icon icon--logout"></i>
            <span>Wyloguj się</span>
          </div>
        </div>

      </aside>}
    </>
  )
}

export default MenuDesktop