import React from 'react';
import './_index.scss'

const BottomBar = ({ onButtonClick, onOpenModal, activeBtn }) => {
  return (
    <div className='bottomBar'>
      <div className={`bottomBar__btn ${activeBtn === 'dashboard' ? 'active' : undefined}`} onClick={() => onButtonClick('dashboard')}>
        <i className="icon icon--dashboard"></i>
        <span>Pulpit</span>
      </div>
      <div className="bottomBar__btn center" onClick={onOpenModal}>
        <div className="iconWrap">
          <i className="icon icon--add s40"></i>
        </div>
      </div>
      <div className={`bottomBar__btn ${activeBtn  === 'stats' ? 'active' : undefined}`} onClick={() => onButtonClick('stats')}>
        <i className="icon icon--stats"></i>
        <span>Statystyki</span>
      </div>
    </div>
  );
};

export default BottomBar;
