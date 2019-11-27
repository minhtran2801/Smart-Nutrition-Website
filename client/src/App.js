import React, { Component } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';

import _ from 'lodash';
import M from 'materialize-css';
import axios from 'axios';

import NotFound from './components/NotFound';
import Modal from './components/Modal';
import NavBar from './components/NavBar';
import About from './components/About';
import Profile from './components/Profile';
import Chart from './components/Chart';
import LoginForm from './components/LoginForm';

import { formatDate } from './utils/timeHelperFunctions';
import periodSum from './utils/periodSum';
import minMax from './utils/minMax';
import trimData from './utils/trimData';
import prepareChart from './utils/prepareChart';

class App extends Component {
  state = {
    activePage: 'home',

    email: '',
    role: '',
    firstName: '',
    lastName: '',
    gender: '',
    weight: '',
    height: '',
    dob: '',
    loggedIn: false,

    selectedNutInfo: ['cal'],
    scale: 'gram',
    showMinMax: false,
    showCI: false,
    periodicity: 'per meal',
    dateTo: formatDate(new Date()),
    dateFrom: '',
    selectedDietData: 'user',
    selectedUser: '',
    selectedGenders: ['male', 'female'],
    heightFrom: 0.0,
    heightTo: 300.0,
    weightFrom: 0.0,
    weightTo: 300.0,
    numberOfRetrievedUsers: 0,
    annotation: {},

    allData: [],
    allDataWeeklySummed: [],
    allDataDailySummed: [],

    modalContent: {
      scanID: '',
      email: '',
      foodname: '',
      cal: '',
      fat: '',
      carb: '',
      prot: '',
      sensorID: '',
      timestamp: '',
      weight: '',
      img: '',
      WI: ''
    }
  };

  componentDidUpdate = () => {
    let datePickerFrom = document.getElementById('datepickerFrom');
    let datePickerTo = document.getElementById('datepickerTo');

    M.Datepicker.init(datePickerFrom, { onSelect: this.handleDateFromChange });
    M.Datepicker.init(datePickerTo, { onSelect: this.handleDateToChange });
  };

  authUser = loggedIn => {
    this.setState({
      loggedIn
    });
  };

  loadUser = user => {
    if (user.role === 'user') {
      this.setState(
        {
          email: user.email,
          role: user.role,
          firstName: user.firstName,
          lastName: user.lastName,
          gender: user.gender,
          weight: user.weight,
          height: user.height,
          dob: user.dob
        },
        () => {
          this.setDefaultPeriod();
          this.loadData([this.state.email]);
        }
      );
    } else {
      this.setState(
        {
          email: user.email,
          role: user.role,
          firstName: user.firstName,
          lastName: user.lastName
        },
        () => {
          this.setDefaultPeriod();
          this.loadData([this.state.email]);
        }
      );
    }
  };

  userInitials = () => {
    return this.state.firstName[0] + this.state.lastName[0];
  };

  logout = () => {
    this.setState(
      {
        activePage: 'home',

        email: '',
        role: '',
        firstName: '',
        lastName: '',
        gender: '',
        weight: '',
        height: '',
        dob: '',
        loggedIn: false
      },
      () => this.clearState()
    );
  };

  clearState = () => {
    this.setState({
      selectedNutInfo: ['cal'],
      scale: 'gram',
      showMinMax: false,
      showCI: false,
      periodicity: 'per meal',
      selectedDietData: 'user',
      selectedUser: '',
      selectedGenders: ['male', 'female'],
      heightFrom: 0.0,
      heightTo: 300.0,
      weightFrom: 0.0,
      weightTo: 300.0,
      numberOfRetrievedUsers: 0,
      annotation: {},

      allData: [],
      allDataWeeklySummed: [],
      allDataDailySummed: [],

      modalContent: {
        scanID: '',
        email: '',
        foodname: '',
        cal: '',
        fat: '',
        carb: '',
        prot: '',
        sensorID: '',
        timestamp: '',
        weight: '',
        img: '',
        WI: ''
      }
    });
  };

  handleActivePage = page => {
    this.setState({
      activePage: page
    });
  };

  loadData =async emails => {
    const allData = [];
    let allDataWeeklySummed = [];
    let allDataDailySummed = [];

    let userData;
    let userDataWeeklySummed;
    let userDataDailySummed;

    for (let i = 0; i < emails.length; i++) {
      userData = [];
      userDataWeeklySummed = [];
      userDataDailySummed = [];

      const {data:userScans} = await axios.get(`http://localhost:5000/scans/${emails[i]}`);
      const {data:userAnalyses} = await axios.get(`http://localhost:5000/analyses/${emails[i]}`);

      userScans.forEach(userScan => {
        let found = userAnalyses.find(
          userAnalysis => userScan.img === userAnalysis.imgid
        );
        if (found) {
          allData.push({
            ...found,
            timestamp: userScan.timestamp,
            weight: userScan.weight,
            img: userScan.img,
            WI: userScan.WI,
            sensorID: userScan.sensorID,
            scanID: userScan.scanID
          });

          userData.push({
            ...found,
            timestamp: userScan.timestamp,
            weight: userScan.weight,
            img: userScan.img,
            WI: userScan.WI,
            sensorID: userScan.sensorID,
            scanID: userScan.scanID
          });
        }
      });

      userDataWeeklySummed = periodSum([...userData], 'weekly');
      userDataDailySummed = periodSum([...userData], 'daily');

      allDataWeeklySummed = [...allDataWeeklySummed, ...userDataWeeklySummed];
      allDataDailySummed = [...allDataDailySummed, ...userDataDailySummed];
    }

    const sorted = _.orderBy(allData, ['timestamp'], ['asc']);
    const sortedWeekly = _.orderBy(allDataWeeklySummed, ['timestamp'], ['asc']);
    const sortedDaily = _.orderBy(allDataDailySummed, ['timestamp'], ['asc']);

    this.setState({ showCI: false, showMinMax: false });
    let selectedNutInfo;
    selectedNutInfo = ['cal'];

    this.setState({
      allData: sorted,
      allDataWeeklySummed: sortedWeekly,
      allDataDailySummed: sortedDaily,
      selectedNutInfo
    });

    this.loadAnnotation();
  };

  loadAnnotation = () => {
    let annotation = { annotations: [] };

    if (
      (this.state.role === 'user' ||
        (this.state.role !== 'user' &&
          this.state.selectedDietData === 'user')) &&
      this.state.periodicity === 'daily' &&
      (this.state.scale === 'gram' ||
        this.state.selectedNutInfo.includes('cal'))
    ) {
      if (this.state.selectedNutInfo.includes('cal')) {
        const age =
          new Date().getFullYear() - new Date(this.state.dob).getFullYear();
        const s = this.state.gender === 'male' ? 5 : -161;
        const bmr =
          10.0 * this.state.weight + 6.25 * this.state.height - 5.0 * age + s;

        annotation.annotations.push({
          drawTime: 'afterDatasetsDraw',
          type: 'line',
          mode: 'horizontal',
          scaleID: 'y-axis-1',
          value: bmr,
          borderColor: 'blue',
          borderWidth: 2
        });
      }

      if (this.state.selectedNutInfo.includes('prot')) {
        annotation.annotations.push({
          drawTime: 'afterDatasetsDraw',
          type: 'line',
          mode: 'horizontal',
          scaleID: 'y-axis-1',
          value: 0.66 * this.state.weight,
          borderColor: 'red',
          borderWidth: 2
        });
      }

      if (this.state.selectedNutInfo.includes('fat')) {
        annotation.annotations.push(
          {
            drawTime: 'afterDatasetsDraw',
            type: 'line',
            mode: 'horizontal',
            scaleID: 'y-axis-1',
            value: this.state.gender === 'male' ? 28 : 14,
            borderColor: 'yellow',
            borderWidth: 2
          },
          {
            drawTime: 'afterDatasetsDraw',
            type: 'line',
            mode: 'horizontal',
            scaleID: 'y-axis-1',
            value: this.state.gender === 'male' ? 40 : 20,
            borderColor: 'yellow',
            borderWidth: 2
          }
        );
      }

      if (this.state.selectedNutInfo.includes('carb')) {
        annotation.annotations.push({
          drawTime: 'afterDatasetsDraw',
          type: 'line',
          mode: 'horizontal',
          scaleID: 'y-axis-1',
          value: 100,
          borderColor: 'rgb(0, 255, 0)',
          borderWidth: 2
        });
      }
    }

    if (
      (this.state.role === 'user' ||
        (this.state.role !== 'user' &&
          this.state.selectedDietData === 'user')) &&
      this.state.periodicity === 'weekly' &&
      (this.state.scale === 'gram' ||
        this.state.selectedNutInfo.includes('cal'))
    ) {
      if (this.state.selectedNutInfo.includes('cal')) {
        const age =
          new Date().getFullYear() - new Date(this.state.dob).getFullYear();
        const s = this.state.gender === 'male' ? 5 : -161;
        const bmr =
          10.0 * this.state.weight + 6.25 * this.state.height - 5.0 * age + s;

        annotation.annotations.push({
          drawTime: 'afterDatasetsDraw',
          type: 'line',
          mode: 'horizontal',
          scaleID: 'y-axis-1',
          value: bmr * 7.0,
          borderColor: 'blue',
          borderWidth: 2
        });
      }

      if (this.state.selectedNutInfo.includes('prot')) {
        annotation.annotations.push({
          drawTime: 'afterDatasetsDraw',
          type: 'line',
          mode: 'horizontal',
          scaleID: 'y-axis-1',
          value: 0.66 * this.state.weight * 7.0,
          borderColor: 'red',
          borderWidth: 2
        });
      }

      if (this.state.selectedNutInfo.includes('fat')) {
        annotation.annotations.push(
          {
            drawTime: 'afterDatasetsDraw',
            type: 'line',
            mode: 'horizontal',
            scaleID: 'y-axis-1',
            value: this.state.gender === 'male' ? 28 * 7.0 : 14 * 7.0,
            borderColor: 'yellow',
            borderWidth: 2
          },
          {
            drawTime: 'afterDatasetsDraw',
            type: 'line',
            mode: 'horizontal',
            scaleID: 'y-axis-1',
            value: this.state.gender === 'male' ? 40 * 7.0 : 20 * 7.0,
            borderColor: 'yellow',
            borderWidth: 2
          }
        );
      }

      if (this.state.selectedNutInfo.includes('carb')) {
        annotation.annotations.push({
          drawTime: 'afterDatasetsDraw',
          type: 'line',
          mode: 'horizontal',
          scaleID: 'y-axis-1',
          value: 100 * 7.0,
          borderColor: 'rgb(0, 255, 0)',
          borderWidth: 2
        });
      }
    }

    this.setState({
      annotation
    });
  };

  loadChartData = () => {
    const {
      allData,
      allDataWeeklySummed,
      allDataDailySummed,
      periodicity,
      numberOfRetrievedUsers,
      dateFrom,
      dateTo,
      selectedNutInfo,
      scale
    } = this.state;

    let chartData = [...allData];

    if (periodicity === 'daily' && numberOfRetrievedUsers < 2)
      chartData = [...allDataDailySummed];

    if (periodicity === 'weekly' && numberOfRetrievedUsers < 2)
      chartData = [...allDataWeeklySummed];

    if (periodicity === 'daily' && numberOfRetrievedUsers > 1) {
      chartData = minMax(
        [...allDataDailySummed],
        'daily',
        numberOfRetrievedUsers
      );
    }

    if (periodicity === 'weekly' && numberOfRetrievedUsers > 1) {
      chartData = minMax(
        [...allDataWeeklySummed],
        'weekly',
        numberOfRetrievedUsers
      );
    }

    chartData = trimData(chartData, dateFrom, dateTo);

    return prepareChart(chartData, selectedNutInfo, scale);
  };

  updateModalContent = modalContent => {
    this.setState({ modalContent });
  };

  getDataByTime = time => {
    return this.state.allData.find(
      datum => new Date(datum.timestamp).getTime() === time.getTime()
    );
  };

  handleRadioChange = e => {
    const { showCI, showMinMax } = this.state;
    if (e.target.value === 'cal') {
      let selectedNutInfo = [];
      if (this.state.numberOfRetrievedUsers < 2) {
        selectedNutInfo = ['cal'];
      } else {
        if (showMinMax === true && showCI === true) {
          selectedNutInfo = ['cal', 'minCal', 'maxCal', 'maxCalCI', 'minCalCI'];
        }
        if (showMinMax === true && showCI === false) {
          selectedNutInfo = ['cal', 'minCal', 'maxCal'];
        }
        if (showMinMax === false && showCI === true) {
          selectedNutInfo = ['cal', 'maxCalCI', 'minCalCI'];
        }
        if (showMinMax === false && showCI === false) {
          selectedNutInfo = ['cal'];
        }
      }
      this.setState({ selectedNutInfo, scale: 'gram' }, () =>
        this.loadAnnotation()
      );
    }

    if (e.target.value === 'nut') {
      let selectedNutInfo = [];
      if (this.state.numberOfRetrievedUsers < 2) {
        selectedNutInfo = ['carb', 'fat', 'prot'];
      } else {
        if (showMinMax === true && showCI === true) {
          selectedNutInfo = [
            'carb',
            'minCarb',
            'maxCarb',
            'minCarbCI',
            'maxCarbCI',
            'fat',
            'minFat',
            'maxFat',
            'minFatCI',
            'maxFatCI',
            'prot',
            'minProt',
            'maxProt',
            'minProtCI',
            'maxProtCI'
          ];
        }
        if (showMinMax === true && showCI === false) {
          selectedNutInfo = [
            'carb',
            'minCarb',
            'maxCarb',
            'fat',
            'minFat',
            'maxFat',
            'prot',
            'minProt',
            'maxProt'
          ];
        }
        if (showMinMax === false && showCI === true) {
          selectedNutInfo = [
            'carb',
            'minCarbCI',
            'maxCarbCI',
            'fat',
            'minFatCI',
            'maxFatCI',
            'prot',
            'minProtCI',
            'maxProtCI'
          ];
        }
        if (showMinMax === false && showCI === false) {
          selectedNutInfo = ['carb', 'fat', 'prot'];
        }
      }
      this.setState({ selectedNutInfo }, () => this.loadAnnotation());
    }
  };

  handleCheckBoxChange = e => {
    const item = e.target.value;
    if (e.target.checked) {
      let selectedNutInfo = [...this.state.selectedNutInfo];
      selectedNutInfo.push(item);
      if (this.state.numberOfRetrievedUsers > 1) {
        if (this.state.showMinMax) {
          selectedNutInfo.push(
            `min${item.charAt(0).toUpperCase() + item.slice(1)}`
          );
          selectedNutInfo.push(
            `max${item.charAt(0).toUpperCase() + item.slice(1)}`
          );
        }
        if (this.state.showCI) {
          selectedNutInfo.push(
            `min${item.charAt(0).toUpperCase() + item.slice(1)}CI`
          );
          selectedNutInfo.push(
            `max${item.charAt(0).toUpperCase() + item.slice(1)}CI`
          );
        }
      }

      selectedNutInfo = selectedNutInfo.filter(e => e !== 'cal');
      selectedNutInfo = selectedNutInfo.filter(e => e !== 'minCal');
      selectedNutInfo = selectedNutInfo.filter(e => e !== 'maxCal');
      selectedNutInfo = selectedNutInfo.filter(e => e !== 'minCalCI');
      selectedNutInfo = selectedNutInfo.filter(e => e !== 'maxCalCI');

      this.setState({ selectedNutInfo }, () => this.loadAnnotation());
    } else {
      let selectedNutInfo = [...this.state.selectedNutInfo];
      selectedNutInfo = selectedNutInfo.filter(e => e !== item);
      selectedNutInfo = selectedNutInfo.filter(
        e => e !== `min${item.charAt(0).toUpperCase() + item.slice(1)}`
      );
      selectedNutInfo = selectedNutInfo.filter(
        e => e !== `max${item.charAt(0).toUpperCase() + item.slice(1)}`
      );
      selectedNutInfo = selectedNutInfo.filter(
        e => e !== `min${item.charAt(0).toUpperCase() + item.slice(1)}CI`
      );
      selectedNutInfo = selectedNutInfo.filter(
        e => e !== `max${item.charAt(0).toUpperCase() + item.slice(1)}CI`
      );

      this.setState({ selectedNutInfo }, () => this.loadAnnotation());
    }
  };

  handleScaleChange = e => {
    if (e.target.checked) {
      this.setState(
        {
          scale: 'gram'
        },
        () => this.loadAnnotation()
      );
    } else {
      this.setState({ scale: 'percent' }, () => this.loadAnnotation());
    }
  };

  handleShowMinMaxChange = e => {
    let selectedNutInfo = [...this.state.selectedNutInfo];
    if (e.target.checked) {
      this.setState({
        showMinMax: true
      });
      if (this.state.selectedNutInfo.includes('cal')) {
        selectedNutInfo.push('minCal');
        selectedNutInfo.push('maxCal');
      }
      if (this.state.selectedNutInfo.includes('fat')) {
        selectedNutInfo.push('minFat');
        selectedNutInfo.push('maxFat');
      }
      if (this.state.selectedNutInfo.includes('carb')) {
        selectedNutInfo.push('minCarb');
        selectedNutInfo.push('maxCarb');
      }
      if (this.state.selectedNutInfo.includes('prot')) {
        selectedNutInfo.push('minProt');
        selectedNutInfo.push('maxProt');
      }
      this.setState({ selectedNutInfo });
    } else {
      this.setState({ showMinMax: false });
      if (this.state.selectedNutInfo.includes('cal')) {
        selectedNutInfo = selectedNutInfo.filter(e => e !== 'minCal');
        selectedNutInfo = selectedNutInfo.filter(e => e !== 'maxCal');
      }
      if (this.state.selectedNutInfo.includes('fat')) {
        selectedNutInfo = selectedNutInfo.filter(e => e !== 'minFat');
        selectedNutInfo = selectedNutInfo.filter(e => e !== 'maxFat');
      }
      if (this.state.selectedNutInfo.includes('carb')) {
        selectedNutInfo = selectedNutInfo.filter(e => e !== 'minCarb');
        selectedNutInfo = selectedNutInfo.filter(e => e !== 'maxCarb');
      }
      if (this.state.selectedNutInfo.includes('prot')) {
        selectedNutInfo = selectedNutInfo.filter(e => e !== 'minProt');
        selectedNutInfo = selectedNutInfo.filter(e => e !== 'maxProt');
      }
      this.setState({ selectedNutInfo });
    }
  };

  handleShowCIChange = e => {
    let selectedNutInfo = [...this.state.selectedNutInfo];
    if (e.target.checked) {
      this.setState({
        showCI: true
      });
      if (this.state.selectedNutInfo.includes('cal')) {
        selectedNutInfo.push('minCalCI');
        selectedNutInfo.push('maxCalCI');
      }
      if (this.state.selectedNutInfo.includes('fat')) {
        selectedNutInfo.push('minFatCI');
        selectedNutInfo.push('maxFatCI');
      }
      if (this.state.selectedNutInfo.includes('carb')) {
        selectedNutInfo.push('minCarbCI');
        selectedNutInfo.push('maxCarbCI');
      }
      if (this.state.selectedNutInfo.includes('prot')) {
        selectedNutInfo.push('minProtCI');
        selectedNutInfo.push('maxProtCI');
      }
      this.setState({ selectedNutInfo });
    } else {
      this.setState({ showCI: false });
      if (this.state.selectedNutInfo.includes('cal')) {
        selectedNutInfo = selectedNutInfo.filter(e => e !== 'minCalCI');
        selectedNutInfo = selectedNutInfo.filter(e => e !== 'maxCalCI');
      }
      if (this.state.selectedNutInfo.includes('fat')) {
        selectedNutInfo = selectedNutInfo.filter(e => e !== 'minFatCI');
        selectedNutInfo = selectedNutInfo.filter(e => e !== 'maxFatCI');
      }
      if (this.state.selectedNutInfo.includes('carb')) {
        selectedNutInfo = selectedNutInfo.filter(e => e !== 'minCarbCI');
        selectedNutInfo = selectedNutInfo.filter(e => e !== 'maxCarbCI');
      }
      if (this.state.selectedNutInfo.includes('prot')) {
        selectedNutInfo = selectedNutInfo.filter(e => e !== 'minProtCI');
        selectedNutInfo = selectedNutInfo.filter(e => e !== 'maxProtCI');
      }
      this.setState({ selectedNutInfo });
    }
  };

  handleCollectionChange = e => {
    this.setState({ periodicity: e }, () => {
      this.setDefaultPeriod();
      this.loadAnnotation();
    });
  };

  handleDateFromChange = e => {
    let dateFrom = formatDate(e);
    this.setState({ dateFrom });
  };

  handleDateToChange = e => {
    let dateTo = formatDate(e);
    this.setState({ dateTo });
  };

  setDefaultPeriod = () => {
    let dateTo = new Date();
    let dateFrom = new Date();

    if (this.state.periodicity === 'per meal') {
      dateFrom.setDate(dateFrom.getDate() - 7);
    } else if (this.state.periodicity === 'daily') {
      dateFrom.setDate(dateFrom.getDate() - 30);
    } else if (this.state.periodicity === 'weekly') {
      dateFrom.setDate(dateFrom.getDate() - 90);
    }
    dateFrom = formatDate(dateFrom);

    this.setState({ dateFrom, dateTo });
  };

  handleDietSwitch = e => {
    if (e.target.checked) {
      this.clearState();
      this.setState({ selectedDietData: 'user' });
    } else {
      this.clearState();
      this.setState({ selectedDietData: 'group' });
    }
  };

  handleGenderChange = e => {
    const item = e.target.value;
    if (e.target.checked) {
      let selectedGenders = [...this.state.selectedGenders];
      selectedGenders.push(item);
      this.setState({ selectedGenders });
    } else {
      let selectedGenders = [...this.state.selectedGenders];
      selectedGenders = selectedGenders.filter(e => e !== item);
      if (selectedGenders.length === 0 && item === 'male')
        selectedGenders.push('female');
      if (selectedGenders.length === 0 && item === 'female')
        selectedGenders.push('male');
      this.setState({ selectedGenders });
    }
  };

  handleChange = e => {
    this.setState({
      [e.target.id]: e.target.value
    });
  };

  handleSubmit = async e => {
    const {
      selectedDietData,
      selectedUser,
      selectedGenders,
      heightFrom,
      heightTo,
      weightFrom,
      weightTo
    } = this.state;

    e.preventDefault();

    if (selectedDietData === 'user') {
      this.setDefaultPeriod();
      this.loadData([selectedUser]);

      const {data:{gender, weight, height, dob}} = await axios.get(`http://localhost:5000/users/${selectedUser}`)

      this.setState({ gender, weight, height, dob }, () =>
        this.loadAnnotation()
      );
    } else if (selectedDietData === 'group') {
      let genQuery;
      if (selectedGenders.includes('male') && !selectedGenders.includes('female')){
        genQuery = 'm';
      }
      if (selectedGenders.includes('male') && selectedGenders.includes('female')){
        genQuery = 'mf';
      }
      if (!selectedGenders.includes('male') && selectedGenders.includes('female')){
        genQuery = 'f';
      }
      const {data:retrievedUsers} = await axios.get(`http://localhost:5000/users?g=${genQuery}&wfrom=${weightFrom}&wto=${weightTo}&hfrom=${heightFrom}&hto=${heightTo}`);

      this.setState({ numberOfRetrievedUsers: retrievedUsers.length });
      this.setDefaultPeriod();
      this.loadData(retrievedUsers);
    }
  };

  render() {
    const {
      modalContent,
      email,
      role,
      firstName,
      lastName,
      gender,
      weight,
      height,
      dob,
      loggedIn,
      activePage,
      selectedNutInfo,
      scale,
      showMinMax,
      showCI,
      periodicity,
      dateTo,
      dateFrom,
      selectedDietData,
      selectedUser,
      selectedGenders,
      heightFrom,
      heightTo,
      weightFrom,
      weightTo,
      numberOfRetrievedUsers,
      annotation
    } = this.state;
    return (
      <React.Fragment>
        <Modal content={modalContent} role={role} />
        <NavBar
          loggedIn={loggedIn}
          activePage={activePage}
          handleActivePage={this.handleActivePage}
          userInitials={this.userInitials()}
          logout={this.logout}
        />
        <main>
          <Switch>
            <Route
              path="/login"
              render={props => (
                <LoginForm
                  {...props}
                  authUser={this.authUser}
                  loadUser={this.loadUser}
                />
              )}
            />
            <Route path="/about" component={About} />
            <Route path="/not-found" component={NotFound} />
            {loggedIn ? (
              <React.Fragment>
                <Route
                  path="/"
                  exact
                  render={props => (
                    <Chart
                      {...props}
                      chartData={this.loadChartData()}
                      role={this.state.role}
                      getDataByTime={this.getDataByTime}
                      updateModalContent={this.updateModalContent}
                      selectedNutInfo={selectedNutInfo}
                      scale={scale}
                      showMinMax={showMinMax}
                      showCI={showCI}
                      periodicity={periodicity}
                      dateFrom={dateFrom}
                      dateTo={dateTo}
                      selectedDietData={selectedDietData}
                      selectedUser={selectedUser}
                      selectedGenders={selectedGenders}
                      weightFrom={weightFrom}
                      weightTo={weightTo}
                      heightFrom={heightFrom}
                      heightTo={heightTo}
                      numberOfRetrievedUsers={numberOfRetrievedUsers}
                      annotation={annotation}
                      handleRadioChange={this.handleRadioChange}
                      handleCheckBoxChange={this.handleCheckBoxChange}
                      handleScaleChange={this.handleScaleChange}
                      handleShowCIChange={this.handleShowCIChange}
                      handleShowMinMaxChange={this.handleShowMinMaxChange}
                      handleCollectionChange={this.handleCollectionChange}
                      handleDietSwitch={this.handleDietSwitch}
                      handleGenderChange={this.handleGenderChange}
                      handleChange={this.handleChange}
                      handleSubmit={this.handleSubmit}
                    />
                  )}
                />
                <Route
                  path="/profile"
                  render={props => (
                    <Profile
                      {...props}
                      email={email}
                      role={role}
                      firstName={firstName}
                      lastName={lastName}
                      gender={gender}
                      weight={weight}
                      height={height}
                      dob={dob}
                    />
                  )}
                />
              </React.Fragment>
            ) : (
              <Redirect
                from="/"
                exact
                to="/login"
                render={props => (
                  <LoginForm {...props} authUser={this.authUser} />
                )}
              />
            )}
            <Redirect to="/not-found" />
          </Switch>
        </main>
      </React.Fragment>
    );
  }
}

export default App;
