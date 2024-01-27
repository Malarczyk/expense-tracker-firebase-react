import React, { useRef, useEffect } from 'react';
import '../_index.scss';

const MyInput = ({name, label, value, type, onChange, error, required, focus, placeholder, click }) => {
  const inputRef = useRef(null);

  useEffect(() => {
    if (focus) {
      inputRef.current.focus();
    }
  }, [focus]);

  return (
    <div className='myInput' onClick={click}>
      <label>{label}</label>
      <input
      name={name}
        type={type}
        value={value}
        onChange={onChange}
        className={error ? 'error' : ''}
        ref={inputRef}
        required={required}
        placeholder={placeholder}
      />
      {error && <div className="error-message">{error}</div>}
    </div>
  );
};

export default MyInput;
