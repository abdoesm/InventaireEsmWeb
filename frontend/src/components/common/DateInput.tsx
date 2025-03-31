import React from 'react';

interface DateInputProps {
  label?: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const DateInput: React.FC<DateInputProps> = ({ label, name, value, onChange }) => {
  return (
    <div className="col-md-6">
      <div className="mb-3">
        <label htmlFor={name} className="form-label">
          {label}
        </label>
        <div className="input-group">
          <input
            id={name}
            type="date"
            className="form-control"
            name={name}
            value={value}
            onChange={onChange}
          />
          <span className="input-group-text">
            <i className="bi bi-calendar"></i> {/* Calendar icon */}
          </span>
        </div>
      </div>
    </div>
  );
};

export default DateInput;
