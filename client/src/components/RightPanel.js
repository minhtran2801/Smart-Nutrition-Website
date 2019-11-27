import React from 'react';

const RightPanel = ({
  handleCollectionChange,
  periodicity,
  handleDateChange,
  dateFrom,
  dateTo
}) => {
  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
  ];
  let dateFromFormatted = new Date(dateFrom);
  dateFromFormatted = `${
    months[dateFromFormatted.getMonth()]
  } ${dateFromFormatted.getDate()}, ${dateFromFormatted.getFullYear()}`;
  let dateToFormatted = new Date(dateTo);
  dateToFormatted = `${
    months[dateToFormatted.getMonth()]
  } ${dateToFormatted.getDate()}, ${dateToFormatted.getFullYear()}`;
  return (
    <div className="col s2">
      <ul className="collection">
        <li
          onClick={() => handleCollectionChange('per meal')}
          className={
            periodicity === 'per meal'
              ? 'collection-item active'
              : 'collection-item'
          }>
          Per meal
        </li>
        <li
          onClick={() => handleCollectionChange('daily')}
          className={
            periodicity === 'daily'
              ? 'collection-item active'
              : 'collection-item'
          }>
          Daily
        </li>
        <li
          onClick={() => handleCollectionChange('weekly')}
          className={
            periodicity === 'weekly'
              ? 'collection-item active'
              : 'collection-item'
          }>
          Weekly
        </li>
      </ul>
      <br /> <br /> <br /> <br /> <br /> <hr />
      <span>From</span>
      <input
        type="text"
        className="datepicker"
        id="datepickerFrom"
        value={dateFromFormatted}
      />
      <span>To</span>
      <input
        type="text"
        className="datepicker"
        id="datepickerTo"
        value={dateToFormatted}
      />
    </div>
  );
};

export default RightPanel;
