import React from 'react';

function Profile({
  email,
  role,
  firstName,
  lastName,
  gender,
  weight,
  height,
  dob
}) {
  return (
    <div>
      <div className="col s12 m8 offset-m2 l6 offset-l3">
        <div className="card-panel grey lighten-5 z-depth-1">
          <div className="row valign-wrapper">
            <div className="col s2">
              <img
                src="/fpo_avatar.png"
                alt=""
                className="circle responsive-img"
              />
            </div>
            <div className="col s10">
              <h1 className="black-text">{`${firstName} ${lastName}`}</h1>
              <span>{`${email} - ${role.charAt(0).toUpperCase()}${role.slice(
                1
              )}`}</span>
            </div>
          </div>
        </div>
      </div>

      {role === 'user' && (
        <div className="col s12 m8 offset-m2 l6 offset-l3">
          <div className="card-panel grey lighten-5 z-depth-1">
            <div className="row valign-wrapper">
              <div className="col s2">
                <i className="material-icons medium">wc</i>
              </div>
              <div className="col s10">
                {gender.charAt(0).toUpperCase() + gender.slice(1)}
              </div>
            </div>
            <div className="row valign-wrapper">
              <div className="col s2">
                <h5>Weight</h5>
              </div>
              <div className="col s10">{weight} cm</div>
            </div>
            <div className="row valign-wrapper">
              <div className="col s2">
                <h5>Height</h5>
              </div>
              <div className="col s10">{height} kg</div>
            </div>
            <div className="row valign-wrapper">
              <div className="col s2">
                <h5>Date of Birth</h5>
              </div>
              <div className="col s10">{dob}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Profile;
