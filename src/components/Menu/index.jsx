import './_index.scss'
import { signOut } from "firebase/auth"
import { auth } from "../../config/firebase-config"
import { useNavigate } from "react-router-dom"

const Menu = ({changeTheme}) => {
  const navigate = useNavigate()

  const signUserOut = async () => {
    try {
      await signOut(auth)
      localStorage.clear()
      navigate('/')
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <>
      <aside className='app__menu'>

        <div className="app__menu__logo">
          Logo Wismmo
        </div>

        <div className="app__menu__nav">
          <div className="app__menu__nav__btn" onClick={() => navigate('/transactions')}>Transakcje</div>
          <div className="app__menu__nav__btn" onClick={() => navigate('/categories')}>Kategorie</div>
          <div className="app__menu__nav__btn" onClick={() => navigate('/wallets')}>Portfele</div>
          <div className="app__menu__nav__btn" onClick={() => navigate('/budgets')}>Budzety</div>
          <div className="app__menu__nav__btn" onClick={changeTheme}>Ustawienia</div>
        </div>

        <div className="app__menu__logout">
          <span onClick={() => signUserOut()}>Wyloguj się</span>
        </div>

      </aside>
    </>
  )
}

export default Menu