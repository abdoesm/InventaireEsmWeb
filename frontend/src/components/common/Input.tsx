import React, { ChangeEvent } from 'react';

interface InputProps {
  label?: string;
  name: string;
  className?: string;
  placeholder?: string;
  type?: string;
  value: any;
  required?: boolean;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  error?: string; // Optional prop for error messages
}

const Input: React.FC<InputProps> = ({
  label,
  name,
  type = "text",
  className = "",
  placeholder,
  required = false,
  error,
  ...props
}) => {
  return (
    <div className={`mb-3 ${className}`}>
      {label && <label htmlFor={name} className="form-label">{label}</label>}
      <input
        id={name}
        name={name}
        type={type}
        className={`form-control ${error ? 'is-invalid' : ''}`}
        placeholder={placeholder}
        required={required}
        aria-required={required}
        {...props}
      />
      {error && <div className="invalid-feedback">{error}</div>}
    </div>
  );
};

export default Input;
