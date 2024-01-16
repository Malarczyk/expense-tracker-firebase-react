import React, { useRef, useEffect } from 'react'
import '../_index.scss'

const MyInput = ({ label, value, type, onChange, error, required, focus, placeholder }) => {
  const inputRef = useRef(null)

  useEffect(() => {
    if (focus) {
      inputRef.current.focus()
    }
  }, [focus])

  return (
    <div className='myInput'>
      <label>{label}</label>
      <input
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
  )
}

export default MyInput
