import React, { Fragment } from 'react';

const LeftPanel = ({
  handleRadioChange,
  selectedNutInfo,
  handleCheckBoxChange,
  handleScaleChange,
  scale,
  handleShowCIChange,
  showCI,
  handleShowMinMaxChange,
  showMinMax,
  numberOfRetrievedUsers,
  periodicity
}) => {
  return (
    <React.Fragment>
      <p>
        <label>
          <input
            onClick={handleRadioChange}
            checked={selectedNutInfo[0] === 'cal' ? 'checked' : ''}
            type="radio"
            value="cal"
          />
          <span>Calorie</span>
        </label>
      </p>
      <p>
        <label>
          <input
            onClick={handleRadioChange}
            checked={selectedNutInfo[0] === 'cal' ? '' : 'checked'}
            type="radio"
            value="nut"
          />
          <span>Nutrients</span>
        </label>
      </p>
      <p>
        <label>
          <input
            onClick={handleCheckBoxChange}
            checked={selectedNutInfo.includes('carb') ? 'checked' : ''}
            type="checkbox"
            value="carb"
          />

          <span>Carbohydrate</span>
        </label>
      </p>
      <p>
        <label>
          <input
            onClick={handleCheckBoxChange}
            checked={selectedNutInfo.includes('fat') ? 'checked' : ''}
            type="checkbox"
            value="fat"
          />

          <span>Fat</span>
        </label>
      </p>
      <p>
        <label>
          <input
            onClick={handleCheckBoxChange}
            checked={selectedNutInfo.includes('prot') ? 'checked' : ''}
            type="checkbox"
            value="prot"
          />
          <span>Protein</span>
        </label>
      </p>
      {selectedNutInfo[0] !== 'cal' && (
        <div className="switch">
          <label>
            %
            <input
              onClick={handleScaleChange}
              checked={scale === 'gram' ? 'checked' : ''}
              disabled={selectedNutInfo[0] === 'cal' ? 'disabled' : ''}
              type="checkbox"
            />
            <span className="lever" />
            gram
          </label>
        </div>
      )}
      {(periodicity === 'weekly' || periodicity === 'daily') &&
        numberOfRetrievedUsers > 1 && (
          <Fragment>
            
            <div className="switch">
              <label>
                Show CI
                <input
                  onClick={handleShowCIChange}
                  checked={showCI ? 'checked' : ''}
                  type="checkbox"
                />
                <span className="lever" />
              </label>
            </div>
          </Fragment>
        )}
      <br />
    </React.Fragment>
  );
};

export default LeftPanel;
