import React, { ChangeEvent } from "react";

interface InputProps {
  name?: string;
  className?: string;
  placeholder?: string;
  type?: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void; // Correct type
}

const SearchInput: React.FC<InputProps> = ({
  placeholder,
  value,
  onChange,
  className = "form-control mb-2",
}) => (
  <input
    type="text"
    className={className}
    placeholder={placeholder}
    value={value}
    onChange={onChange} // Correctly passing the event
  />
);

export default SearchInput;
