import React, { ChangeEvent } from 'react';

interface InputProps {
  label?: string;
  name: string;
  className?:string;
  placeholder?:string;
  type?: string;
  value: any;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

const Input: React.FC<InputProps> = ({ label, name, type = "text", ...props }) => {
  return (
    <div className="form-group">
      <label htmlFor={name}>{label}:</label>
      <input id={name} name={name} type={type} {...props} />
    </div>
  );
};

export default Input;
