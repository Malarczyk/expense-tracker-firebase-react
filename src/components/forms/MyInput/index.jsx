import React, { useRef, useEffect } from 'react';
import '../_index.scss';

const MyInput = ({ name, label, value, type, onChange, error, required, focus, placeholder, click, isIcon }) => {
  const inputRef = useRef(null);

  useEffect(() => {
    if (focus) {
      inputRef.current.focus();
    }
  }, [focus]);

  const readOnly = click ? true : false;

  return (
    <>
      <div className={`myInput ${click ? 'clickable' : ''} ${isIcon ? 'isicon' : ''} ${error ? 'error' : ''}`} onClick={click}>
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
          readOnly={readOnly}
        />
        {isIcon && <div className={`inputIcon ${error ? 'error' : ''}`}>{value ? <i className={`icon icon--${value}`}></i> : <span>Wybierz ikonę</span>}</div>}
        {click && <div className={`iconWrap ${error ? 'error' : ''}`}><i className='icon icon--arrow-right'></i></div>}
        {error && <div className="error-message">{error}</div>}
      </div>
    </>);
};

export default MyInput;
