import React, { ReactNode } from "react";

interface FormGroupProps {
  label?: string;
  children: ReactNode;
  className?: string;
  labelClassName?: string;
}

const FormGroup: React.FC<FormGroupProps> = ({ label, children, className = "mb-3", labelClassName }) => (
  <div className={`form-group ${className}`}>
    {label && <label className={`form-label ${labelClassName}`}>{label}</label>}
    {children}
  </div>
);

export default FormGroup;
