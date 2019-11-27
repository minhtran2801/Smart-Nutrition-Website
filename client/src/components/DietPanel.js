import React from 'react';

const DietPanel = ({
  handleDietSwitch,
  selectedDietData,
  selectedUser,
  handleChange,
  selectedGenders,
  handleGenderChange,
  weightFrom,
  weightTo,
  heightFrom,
  heightTo,
  numberOfRetrievedUsers,
  handleSubmit
}) => {
  const userForm = (
    <div className="input-field">
      <input
        disabled={selectedDietData === 'user' ? '' : 'disabled'}
        id="selectedUser"
        type="text"
        value={selectedUser}
        onChange={handleChange}
      />
      <label htmlFor="selectedUser">Enter user email</label>
    </div>
  );

  const groupForm = (
    <React.Fragment>
      <div className="row">
        <div className="col s6">
          <p>
            <label>
              <input
                onClick={handleGenderChange}
                checked={selectedGenders.includes('male') ? 'checked' : ''}
                type="checkbox"
                value="male"
              />
              <span>Male</span>
            </label>
          </p>
        </div>
        <div className="col s6">
          <p>
            <label>
              <input
                onClick={handleGenderChange}
                checked={selectedGenders.includes('female') ? 'checked' : ''}
                type="checkbox"
                value="female"
              />
              <span>Female</span>
            </label>
          </p>
        </div>
      </div>

      <div className="row">
        <div className="input-field col s6">
          <input
            id="heightFrom"
            type="text"
            value={heightFrom}
            onChange={handleChange}
          />
          <label
            className={heightFrom !== '' ? 'active' : ''}
            htmlFor="heightFrom">
            Height_from (cm)
          </label>
        </div>
        <div className="input-field col s6">
          <input
            id="heightTo"
            type="text"
            value={heightTo}
            onChange={handleChange}
          />
          <label className={heightTo !== '' ? 'active' : ''} htmlFor="heightTo">
            Height_to (cm)
          </label>
        </div>
      </div>

      <div className="row">
        <div className="input-field col s6">
          <input
            id="weightFrom"
            type="text"
            value={weightFrom}
            onChange={handleChange}
          />
          <label
            className={weightFrom !== '' ? 'active' : ''}
            htmlFor="weightFrom">
            Weight_from (kg)
          </label>
        </div>
        <div className="input-field col s6">
          <input
            id="weightTo"
            type="text"
            value={weightTo}
            onChange={handleChange}
          />
          <label className={weightTo !== '' ? 'active' : ''} htmlFor="weightTo">
            Weight_to (kg)
          </label>
        </div>
      </div>
    </React.Fragment>
  );

  return (
    <form onSubmit={handleSubmit}>
      <hr />
      <br />
      <div className="switch">
        <label>
          User Group ({numberOfRetrievedUsers})
          <input
            onClick={handleDietSwitch}
            checked={selectedDietData === 'user' ? 'checked' : ''}
            type="checkbox"
          />
          <span className="lever" />
          One User
        </label>
      </div>

      {selectedDietData === 'user' ? userForm : groupForm}

      <button className="btn waves-light" type="submit">
        Submit
      </button>
    </form>
  );
};

export default DietPanel;
