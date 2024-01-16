import './_index.scss'
import { useNavigate } from 'react-router-dom'

const TopBar = ({ title, action }) => {
  const nav = useNavigate()
  return (
    <div className="topBar">
      <span onClick={() => nav(-1)}>Wstecz</span>
      <span>{title}</span>
      <span onClick={action}>Dodaj</span>
    </div>
  )
}

export default TopBar