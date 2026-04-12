import React, { useState } from 'react';

const FloatingLabelInput = ({
  label,
  type = 'text',
  value,
  onChange,
  onFocus,
  onBlur,
  placeholder = '',
  required = false,
  disabled = false,
  error = '',
  icon: Icon,
  ...rest
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const hasValue = value !== undefined && value !== null && String(value).trim() !== '';

  return (
    <div className="mb-4">
      <div className="input-wrapper">
        <div className="input-group relative">
          <input
            type={type}
            value={value}
            onChange={onChange}
            onFocus={(e) => {
              setIsFocused(true);
              if (onFocus) onFocus(e);
            }}
            onBlur={(e) => {
              setIsFocused(false);
              if (onBlur) onBlur(e);
            }}
            placeholder={isFocused || hasValue ? placeholder : ''}
            disabled={disabled}
            className={`input ${error ? 'border-lost-color focus:box-shadow-lost' : ''}`}
            {...rest}
          />
          <label className="input-label">{label}</label>
          {Icon && <Icon className="input-icon" size={20} />}
        </div>
      </div>
      {error && <p className="text-lost-color text-xs mt-2">{error}</p>}
    </div>
  );
};

export default FloatingLabelInput;
