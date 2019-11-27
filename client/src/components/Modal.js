import React, { Component, Fragment } from 'react';
import { Doughnut } from 'react-chartjs-2';

class Modal extends Component {
  render() {
    const {
      scanID,
      email,
      foodname,
      cal,
      fat,
      carb,
      prot,
      sensorID,
      timestamp,
      weight,
      img,
      WI
    } = this.props.content;
    const data = {
      datasets: [
        {
          data: [carb, fat, prot],
          backgroundColor: ['rgb(0, 255, 0)', 'rgb(255,255,0)', 'rgb(255,0,0)']
        }
      ],

      labels: ['Carbohydrate', 'Fat', 'Protein']
    };

    return (
      <div id="modal1" className="modal">
        <div className="modal-content">
          <h5>
            {foodname.charAt(0).toUpperCase() + foodname.slice(1)} ({cal}{' '}
            calories)
          </h5>

          <Doughnut data={data} />

          <p>{email}</p>

          {this.props.role === 'admin' && (
            <Fragment>
              <p>timestamp: {timestamp}</p>
              <p>weight: {weight}</p>
              <p>scanID: {scanID}</p>
              <p>sensorID: {sensorID}</p>
              <p>WI: {WI}</p>
              <p>img: {img}</p>
            </Fragment>
          )}
        </div>
        <div className="modal-footer">
          <a
            href="#!"
            className="modal-close waves-effect waves-green btn-flat">
            Close
          </a>
        </div>
      </div>
    );
  }
}

export default Modal;
