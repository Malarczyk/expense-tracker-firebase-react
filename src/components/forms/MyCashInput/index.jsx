import React, { useRef } from 'react';
import '../_index.scss';

const MyCashInput = ({ name, label, value, onChange, error, required, placeholder }) => {
  const inputRef = useRef(null);


  const handleInputChange = (e) => {
    const inputValue = e.target.value;

    const regex = /^[1-9][0-9]*(\.[0-9]{0,2})?$/;

    if (regex.test(inputValue) || inputValue === '') {
      onChange(e);
    }
  };

  return (
    <div className='myInput'>
      <label>{label}</label>
      <input
        name={name}
        type="text"
        value={value}
        placeholder={placeholder}
        onChange={handleInputChange}
        className={error ? 'error' : ''}
        ref={inputRef}
        required={required}
      />
      {error && <div className="error-message">{error}</div>}
    </div>
  );
};

export default MyCashInput;
