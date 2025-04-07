import React, { ChangeEvent } from "react";
import { FaSearch } from "react-icons/fa";

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
<>
  <div>
        <div className="input-group">
  <input
    type="search"
    className={className}
    placeholder={placeholder}
    value={value}
    onChange={onChange} // Correctly passing the event
  />
   <span className="input-group-text">
     <FaSearch />
  </span>

  </div>
  </div>
</>
);




export default SearchInput;
