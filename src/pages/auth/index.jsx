import { useState } from 'react';
import Illustration from '../../assets/images/illustration.svg'
import './_index.scss'
import Signin from './Signin';
import Login from './Login';
export const Auth = ({ installEvent, setInstallEvent }) => {
  const [signinVisible, setSigninVisible] = useState(false)

  const handleInstallClick = () => {
    if (installEvent) {
      installEvent.prompt(); // Wywołanie okna instalacji
      installEvent.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('Aplikacja została zainstalowana');
        } else {
          console.log('Instalacja aplikacji została odrzucona');
        }
        setInstallEvent(null); // Resetuj zdarzenie instalacji
      });
    }
  };
  return (
    <div className="login">
      {installEvent && (
        <button className="install-button" onClick={handleInstallClick}>
          Instaluj PWA
        </button>
      )}
      <div className="login__left">
        <h1 className='titleLogo'>Wismmo</h1>
        <p className='subTitleLogo'>What I spend my money on?</p>
        <div className="imgWrap">
          <img src={Illustration} alt="" />
        </div>
      </div>
      <div className="login__right">
        {signinVisible ? <Signin setSigninVisible={() => setSigninVisible(false)} /> : <Login setSigninVisible={() => setSigninVisible(true)} />}
      </div>
    </div>
  );
};