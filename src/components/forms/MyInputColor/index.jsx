import React, { useState } from 'react';
import '../_index.scss';

const MyInputColor = ({ setColor, setBgColor }) => {
  const [activeOption, setActiveOption] = useState(null); // Stan przechowujący indeks aktywnej opcji

  const handleSet = (color, bgColor, index) => {
    setColor(color);
    setBgColor(bgColor);
    setActiveOption(index); // Ustawienie indeksu aktywnej opcji po kliknięciu
  };

  const colorOptions = [
    { color: '--secondary-color', bgColor: '--secondary-bg-color' },
    { color: '--dark-purple-color', bgColor: '--dark-purple-bg-color' },
    { color: '--light-blue-color', bgColor: '--light-blue-bg-color' },
    { color: '--error-color', bgColor: '--error-bg-color' },
    { color: '--pink-color', bgColor: '--pink-bg-color' },
    { color: '--light-purple-color', bgColor: '--light-purple-bg-color' },
    { color: '--warning-color', bgColor: '--warning-bg-color' },
    { color: '--dark-green-color', bgColor: '--dark-green-bg-color' },
    { color: '--success-color', bgColor: '--success-bg-color' },
    { color: '--black-color', bgColor: '--black-bg-color' },
  ];

  return (
    <div className="myInputColor">
      <div className="myInputColor__name">
        <span>Wybierz kolor</span>
      </div>
      <div className="grid">
        {colorOptions.map((option, index) => (
          <div
            key={index}
            className={`rec ${activeOption === index ? 'active' : ''}`} // Dodanie klasy 'active' dla aktywnej opcji
            style={{ backgroundColor: `var(${option.color})` }}
            onClick={() => handleSet(option.color, option.bgColor, index)} // Przekazanie indeksu do funkcji handleSet
          ></div>
        ))}
      </div>
    </div>
  );
};

export default MyInputColor;
