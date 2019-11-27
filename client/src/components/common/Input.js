import React from "react";

const Input = ({ name, label, type, value, error, handleChange }) => {
  return (
    <div className="row">
      <div className="input-field col s12">
        <input
          type={type}
          value={value}
          onChange={handleChange}
          id={name}
          className={error && "invalid"}
        />
        <label htmlFor={name} className={value ? "active" : ""}>
          {label}
        </label>
        <span className="helper-text" data-error={error} />
      </div>
    </div>
  );
};

export default Input;
