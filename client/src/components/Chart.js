import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Scatter } from 'react-chartjs-2';
import 'chartjs-plugin-annotation';
import LeftPanel from './LeftPanel';
import RightPanel from './RightPanel';
import DietPanel from './DietPanel';
import M from 'materialize-css';

class Chart extends Component {
  constructor(props) {
    super(props);
    this.chartRef = React.createRef();
  }

  componentDidMount = () => {
    let modal = document.querySelector('.modal');

    M.Modal.init(modal, {});

    document.querySelector('main .chartjs-render-monitor').onclick = e => {
      try {
        let index = this.chartRef.current.chartInstance.getElementsAtEvent(e)[0]
          ._index;
        let time = this.chartRef.current.chartInstance.getElementsAtEvent(e)[0]
          ._chart.chart.config.data.datasets[0].data[index].t;
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
        } = this.props.getDataByTime(time);
        this.props.updateModalContent({
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
        });

        M.Modal.getInstance(modal).open();
      } catch (ex) {}
    };
  };

  handleDownload = e => {
    e.target.href = ReactDOM.findDOMNode(this)
      .querySelector('.chartjs-render-monitor')
      .toDataURL('image/jpg');
  };

  render() {
    const {
      chartData,
      role,
      selectedNutInfo,
      scale,
      showMinMax,
      showCI,
      periodicity,
      dateFrom,
      dateTo,
      selectedDietData,
      selectedUser,
      selectedGenders,
      heightFrom,
      heightTo,
      weightFrom,
      weightTo,
      numberOfRetrievedUsers,
      annotation,
      handleChange,
      handleSubmit,
      handleRadioChange,
      handleCheckBoxChange,
      handleScaleChange,
      handleShowCIChange,
      handleShowMinMaxChange,
      handleCollectionChange,
      handleDietSwitch,
      handleGenderChange
    } = this.props;
    return (
      <div className="row">
        <div className="col s2">
          <LeftPanel
            handleRadioChange={handleRadioChange}
            handleCheckBoxChange={handleCheckBoxChange}
            handleScaleChange={handleScaleChange}
            selectedNutInfo={selectedNutInfo}
            scale={scale}
            handleShowCIChange={handleShowCIChange}
            handleShowMinMaxChange={handleShowMinMaxChange}
            showCI={showCI}
            showMinMax={showMinMax}
            numberOfRetrievedUsers={numberOfRetrievedUsers}
            periodicity={periodicity}
          />
          {(role === 'dietitian' || role === 'admin') && (
            <DietPanel
              handleDietSwitch={handleDietSwitch}
              selectedDietData={selectedDietData}
              selectedUser={selectedUser}
              handleChange={handleChange}
              selectedGenders={selectedGenders}
              handleGenderChange={handleGenderChange}
              weightFrom={weightFrom}
              weightTo={weightTo}
              heightFrom={heightFrom}
              heightTo={heightTo}
              numberOfRetrievedUsers={numberOfRetrievedUsers}
              handleSubmit={handleSubmit}
            />
          )}
        </div>
        <div className="chart col s8">
          <Scatter
            ref={this.chartRef}
            data={chartData}
            options={{
              annotation,
              scales: {
                xAxes: [
                  {
                    type: 'time',
                    time: {
                      unit: 'day'
                    }
                  }
                ]
              }
            }}
          />
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <a
              className="btn btn-small"
              onClick={this.handleDownload}
              download={`SmartFood-${selectedUser}.jpg`}
              href="#!">
              Download
            </a>
          </div>
        </div>
        <RightPanel
          handleCollectionChange={handleCollectionChange}
          periodicity={periodicity}
          dateFrom={dateFrom}
          dateTo={dateTo}
        />
      </div>
    );
  }
}

export default Chart;
