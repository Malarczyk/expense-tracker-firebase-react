import './_index.scss'
import { useMenu } from '../../context/Menu/MenuContext'

const Header = ({ title, isVisible }) => {
  const { toggleMenu } = useMenu()

  return (
      <div className={`header ${isVisible ? 'hidden' : 'visible'}`}>
        <span>{title}</span>
        <i onClick={toggleMenu} className="icon icon--hamburger"></i>
      </div>
  );
};

export default Header;
