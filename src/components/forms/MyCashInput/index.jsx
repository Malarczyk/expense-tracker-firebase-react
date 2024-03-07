import React, { useState, useEffect } from 'react';
import { NumericFormat } from 'react-number-format';

const MyCashInput = ({ name, label, value, onChange, error, required, placeholder, canZero }) => {
  const [inputValue, setInputValue] = useState(value);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  const handleValueChange = (values) => {
    const { floatValue, value: formattedValue } = values;
    if (formattedValue === '' || floatValue >= 0 || (canZero && floatValue === 0)) {
      setInputValue(formattedValue);
      onChange({target: {name, value: formattedValue}});
    }
  };

  return (
    <div className='myInput'>
      <label>{label}</label>
      <NumericFormat
        name={name}
        thousandSeparator={false}
        decimalScale={2}
        fixedDecimalScale={true}
        allowNegative={false}
        value={inputValue}
        placeholder={placeholder}
        onValueChange={handleValueChange}
        className={`input ${error ? 'error' : ''}`}
        required={required}
      />
      <span className='currency'>zł</span>
      {error && <div className="error-message">{error}</div>}
    </div>
  );
};

export default MyCashInput;
