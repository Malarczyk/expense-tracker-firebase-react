import React, { useState, useEffect } from 'react';
import './_index.scss'
import Header from "../../components/Header"
import { useMenu } from "../../context/Menu/MenuContext"


const Stats = ({ isProfileVisible }) => {
  const { toggleMenu } = useMenu()

  const [isHeaderVisible, setHeaderVisible] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setHeaderVisible(scrollPosition < 60);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  return (
    <>
      <Header title={'Statystyki'} isVisible={isHeaderVisible} />
      <div className="stats">
        {isProfileVisible &&
          <div className="dashboard__profile">

            <div className="dashboard__profile__img">
              <span></span>
            </div>
            <div className="dashboard__profile__body">
              <span>Witaj z powrotem,</span>
              <h2>Piotr Kowalski!</h2>
            </div>
            <div className="dashboard__profile__hamburger" onClick={toggleMenu}>
              <i className="icon icon--hamburger"></i>
            </div>

          </div>}

        <div className="stats__section">

          <div className="section__title">
            <h1>Podsumowanie</h1>
            <div>
              <div className="imgWrap">
                <i className="icon icon--arrow-left"></i>
              </div>
              <div className="imgWrap">
                <i className="icon icon--arrow-right"></i>
              </div>
            </div>
          </div>

          <div className="stats__chart">
            <div></div>
          </div>
        </div>

        <div className="stats__section">

          <div className="section__title">
            <h1>Wydatki</h1>
            <div>
              <div className="imgWrap">
                <i className="icon icon--arrow-left"></i>
              </div>
              <div className="imgWrap">
                <i className="icon icon--arrow-right"></i>
              </div>
            </div>
          </div>

          <div className="stats__chart">
            <div></div>
          </div>
        </div>


        <div className="stats__section">

          <div className="section__title">
            <h1>Przychody</h1>
            <div>
              <div className="imgWrap">
                <i className="icon icon--arrow-left"></i>
              </div>
              <div className="imgWrap">
                <i className="icon icon--arrow-right"></i>
              </div>
            </div>
          </div>

          <div className="stats__chart">
            <div></div>
          </div>
        </div>



      </div>
    </>
  )
}

export default Stats