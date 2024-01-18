import './_index.scss'
import { useNavigate } from 'react-router-dom'
import { useMenu } from '../../context/Menu/MenuContext'

const TopBar = ({ title, action }) => {
  const nav = useNavigate()

  const { toggleMenu } = useMenu()
  return (
    <div className="topBar">
      <i onClick={() => nav(-1)}className="icon icon--arrow-left"></i>
      <span className='title'>{title}</span>
      <i className="icon icon--hamburger" onClick={toggleMenu}></i>
    </div>
  )
}

export default TopBar