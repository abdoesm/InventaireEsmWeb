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
  <form className="d-flex input-group w-auto ms-lg-3 my-3 my-lg-0">
  <input
    type="search"
    className={className}
    placeholder={placeholder}
    value={value}
    onChange={onChange} // Correctly passing the event
  />
  </form>
);




export default SearchInput;
