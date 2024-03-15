import { useState } from 'react';
import Illustration from '../../assets/images/illustration.svg'
import './_index.scss'
import Signin from './Signin';
import Login from './Login';
import RemindPass from './RemindPass';
export const Auth = ({ installEvent, setInstallEvent }) => {
  const [signinVisible, setSigninVisible] = useState(false)
  const [remindVisible, setRemindVisible] = useState(false)

  const handleInstallClick = () => {
    if (installEvent) {
      installEvent.prompt();
      installEvent.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('Aplikacja została zainstalowana');
        } else {
          console.log('Instalacja aplikacji została odrzucona');
        }
        setInstallEvent(null);
      });
    }
  };
  return (
    <div className="login">
      {installEvent && (
        <div className="install-button" onClick={handleInstallClick}>
          <div className="iconWrap">
            <i className='icon icon--do-install s24'></i>
          </div>
          <span>Psst... Chcesz zainstalować aplikację?</span>
          <span>Kliknij tutaj!</span>
        </div>
      )}
      <div className="login__left">
        <h1 className='titleLogo'>Wismmo</h1>
        <p className='subTitleLogo'>What I spend my money on?</p>
        <div className="imgWrap">
          <img src={Illustration} alt="" />
        </div>
      </div>
      <div className="login__right">
        {signinVisible
          ? <Signin setSigninVisible={() => setSigninVisible(false)} />
          : remindVisible
            ? <RemindPass setRemindVisible={() => setRemindVisible(false)} />
            : <Login setSigninVisible={() => setSigninVisible(true)} setRemindVisible={() => setRemindVisible(true)} />}

      </div>
    </div>
  );
};