import { useGetUserInfo } from '../../hooks/useGetUserInfo'
import { useMenu } from '../../context/Menu/MenuContext'
import { useEffect, useState } from 'react'
import './_index.scss'

const Profile = ({ isHamburger }) => {
  const { toggleMenu } = useMenu()
  const { name, email, profilePhoto } = useGetUserInfo()
  const [imageSrc, setImageSrc] = useState('');

  useEffect(() => {
    if (profilePhoto) {
      setImageSrc(profilePhoto);
    }
  }, [profilePhoto]);

  return (
    <div className="dashboard__profile">

      <div className="dashboard__profile__img">
      {profilePhoto ? (
          <img src={imageSrc} alt="Profile" />
        ) : (
          <i className='icon icon--user' />  // Pokaż ten tekst, jeśli URL zdjęcia nie jest dostępny
        )}
      </div>
      <div className="dashboard__profile__body">
        <span>Witaj z powrotem,</span>
        <h2>{name ? name : email}!</h2>
      </div>
      {isHamburger &&
        <div className="dashboard__profile__hamburger" onClick={toggleMenu}>
          <i className="icon icon--hamburger"></i>
        </div>
      }
    </div>
  )
}

export default Profile