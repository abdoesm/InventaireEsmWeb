import React from 'react'

const Input = ({ label, name, type = "text", ...props }) => {
  return (
    <div className="form-group">
        <label htmlFor={name}>{label}:</label>
        <input
            type={type}
            id={name}
            name={name}
            {...props}
        />
    </div>
  )
}

export default Input