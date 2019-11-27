function trimData(userData, dateFrom, dateTo) {
  return userData.filter(
    userdatum =>
      new Date(userdatum.timestamp) > new Date(dateFrom) &&
      new Date(userdatum.timestamp) < new Date(dateTo)
  );
}

export default trimData;
