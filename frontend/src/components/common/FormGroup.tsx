import React, { ReactNode } from "react";

interface FormGroupProps {
  label?: string;
  children: ReactNode;
  className?: string;
}

const FormGroup: React.FC<FormGroupProps> = ({ label, children, className = "mb-3" }) => (
  <div className={`form-group ${className}`}>
    {label && <label className="form-label">{label}</label>}
    {children}
  </div>
);

export default FormGroup;
