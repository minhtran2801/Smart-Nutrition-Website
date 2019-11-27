import {
  getDateOfWeek,
  getWeekNumber,
  sameDay,
  sameWeek,
  formatDate
} from './timeHelperFunctions';

function periodSum(data, periodicity) {
  const newdata = [];
  let timestamp, weight, cal, carb, fat, prot;

  for (let i = 0; i < data.length; i++) {
    if (periodicity === 'daily') {
      timestamp = formatDate(new Date(data[i].timestamp));
    } else if (periodicity === 'weekly') {
      timestamp = new Date(data[i].timestamp);
      timestamp = formatDate(
        getDateOfWeek(getWeekNumber(timestamp)[1], getWeekNumber(timestamp)[0])
      );
    }

    weight = data[i].weight;
    cal = data[i].cal;
    carb = data[i].carb;
    fat = data[i].fat;
    prot = data[i].prot;

    for (let j = i + 1; j < data.length; j++) {
      if (
        (sameDay(new Date(data[i].timestamp), new Date(data[j].timestamp)) &&
          periodicity === 'daily') ||
        (sameWeek(new Date(data[i].timestamp), new Date(data[j].timestamp)) &&
          periodicity === 'weekly')
      ) {
        weight += data[j].weight;
        cal += data[j].cal;
        carb += data[j].carb;
        fat += data[j].fat;
        prot += data[j].prot;
        data.splice(j, 1);
        j--;
      }
    }

    newdata.push({
      weight,
      cal,
      carb,
      fat,
      prot,
      timestamp
    });
  }

  return newdata;
}

export default periodSum;
