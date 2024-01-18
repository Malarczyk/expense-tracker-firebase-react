import React from 'react';

const MyRadioInput = ({ name, value1, label1, checked1, onChange1, value2, label2, checked2, onChange2 }) => (
  <div className='myRadioInput'>
    <input
      type="radio"
      id={value1}
      name={name}
      value={value1}
      checked={checked1}
      onChange={onChange1}
    />
    <label htmlFor={value1}>{label1}</label>

    <input
      type="radio"
      id={value2}
      name={name}
      value={value2}
      checked={checked2}
      onChange={onChange2}
    />
    <label htmlFor={value2}>{label2}</label>
  </div>
);

export default MyRadioInput;
