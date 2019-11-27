import React, { Component } from "react";
import M from "materialize-css";

class Select extends Component {
  componentDidUpdate = () => {
    let selects = document.querySelectorAll("select");
    M.FormSelect.init(selects, {});
  };

  render() {
    const { name, label, options, value, error, handleChange } = this.props;
    return (
      <div className="input-field col s12">
        <select id={name} onChange={handleChange}>
          <option value="" />
          {options.map(option => (
            <option
              key={option._id}
              value={option._id}
              selected={value === option._id ? "selected" : ""}
            >
              {option.name}
            </option>
          ))}
        </select>
        <label htmlFor={name}>{label}</label>
        {error && <div className="red-text">{error}</div>}
      </div>
    );
  }
}

export default Select;
