import {
  getDateOfWeek,
  getWeekNumber,
  sameDay,
  sameWeek,
  formatDate
} from './timeHelperFunctions';

function minMax(data, periodicity, numberOfRetrievedUsers) {
  const newdata = [];
  let timestamp,
    weight,
    cal,
    maxCal,
    minCal,
    maxCalCI,
    minCalCI,
    carb,
    maxCarb,
    minCarb,
    maxCarbCI,
    minCarbCI,
    fat,
    maxFat,
    minFat,
    maxFatCI,
    minFatCI,
    prot,
    maxProt,
    minProt,
    maxProtCI,
    minProtCI;

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
    maxCal = cal;
    minCal = cal;
    const calPointData = [cal];
    carb = data[i].carb;
    maxCarb = carb;
    minCarb = carb;
    const carbPointData = [carb];
    fat = data[i].fat;
    maxFat = fat;
    minFat = fat;
    const fatPointData = [fat];
    prot = data[i].prot;
    maxProt = prot;
    minProt = prot;
    const protPointData = [prot];

    for (let j = i + 1; j < data.length; j++) {
      if (
        (sameDay(new Date(data[i].timestamp), new Date(data[j].timestamp)) &&
          periodicity === 'daily') ||
        (sameWeek(new Date(data[i].timestamp), new Date(data[j].timestamp)) &&
          periodicity === 'weekly')
      ) {
        weight += data[j].weight;
        cal += data[j].cal;
        calPointData.push(data[j].cal);
        carb += data[j].carb;
        carbPointData.push(data[j].carb);
        fat += data[j].fat;
        fatPointData.push(data[j].fat);
        prot += data[j].prot;
        protPointData.push(data[j].prot);

        if (data[j].cal > maxCal) maxCal = data[j].cal;
        if (data[j].cal < minCal) minCal = data[j].cal;

        if (data[j].carb > maxCarb) maxCarb = data[j].carb;
        if (data[j].carb < minCarb) minCarb = data[j].carb;

        if (data[j].fat > maxFat) maxFat = data[j].fat;
        if (data[j].fat < minFat) minFat = data[j].fat;

        if (data[j].prot > maxProt) maxProt = data[j].prot;
        if (data[j].prot < minProt) minProt = data[j].prot;

        data.splice(j, 1);
        j--;
      }
    }

    weight = weight / numberOfRetrievedUsers;

    let standardDeviation = 0;
    cal = cal / numberOfRetrievedUsers;
    calPointData.forEach(point => {
      standardDeviation += Math.pow(point - cal, 2);
    });
    standardDeviation = Math.sqrt(
      standardDeviation / (numberOfRetrievedUsers - 1)
    );
    minCalCI =
      cal - (1.282 * standardDeviation) / Math.sqrt(numberOfRetrievedUsers);
    maxCalCI =
      cal + (1.282 * standardDeviation) / Math.sqrt(numberOfRetrievedUsers);
    carb = carb / numberOfRetrievedUsers;

    standardDeviation = 0;
    carbPointData.forEach(point => {
      standardDeviation += Math.pow(point - carb, 2);
    });
    standardDeviation = Math.sqrt(
      standardDeviation / (numberOfRetrievedUsers - 1)
    );
    minCarbCI =
      carb - (1.282 * standardDeviation) / Math.sqrt(numberOfRetrievedUsers);
    maxCarbCI =
      carb + (1.282 * standardDeviation) / Math.sqrt(numberOfRetrievedUsers);
    fat = fat / numberOfRetrievedUsers;

    standardDeviation = 0;
    fatPointData.forEach(point => {
      standardDeviation += Math.pow(point - fat, 2);
    });
    standardDeviation = Math.sqrt(
      standardDeviation / (numberOfRetrievedUsers - 1)
    );
    minFatCI =
      fat - (1.282 * standardDeviation) / Math.sqrt(numberOfRetrievedUsers);
    maxFatCI =
      fat + (1.282 * standardDeviation) / Math.sqrt(numberOfRetrievedUsers);
    prot = prot / numberOfRetrievedUsers;

    standardDeviation = 0;
    protPointData.forEach(point => {
      standardDeviation += Math.pow(point - prot, 2);
    });
    standardDeviation = Math.sqrt(
      standardDeviation / (numberOfRetrievedUsers - 1)
    );
    minProtCI =
      prot - (1.282 * standardDeviation) / Math.sqrt(numberOfRetrievedUsers);
    maxProtCI =
      prot + (1.282 * standardDeviation) / Math.sqrt(numberOfRetrievedUsers);

    newdata.push({
      weight,
      cal,
      maxCal,
      minCal,
      maxCalCI,
      minCalCI,
      carb,
      maxCarb,
      minCarb,
      maxCarbCI,
      minCarbCI,
      fat,
      maxFat,
      minFat,
      maxFatCI,
      minFatCI,
      prot,
      maxProt,
      minProt,
      maxProtCI,
      minProtCI,
      timestamp
    });
  }
  return newdata;
}

export default minMax;
