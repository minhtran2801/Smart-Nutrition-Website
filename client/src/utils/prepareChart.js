function prepareChart(userData, selectedNutInfo, scale) {
  let xAxis = userData.map(userdatum => userdatum.timestamp);
  xAxis = xAxis.map(date => new Date(date));

  const datasets = [];

  selectedNutInfo.forEach(element => {
    let label = `${element.charAt(0).toUpperCase()}${element.slice(1)}. Intake`;

    const yAxis =
      scale === 'gram' || selectedNutInfo.includes('cal')
        ? userData.map(userdatum => userdatum[element])
        : userData.map(
            userdatum => (userdatum[element] / userdatum.weight) * 100.0
          );

    const data = [];
    for (let i = 0; i < xAxis.length; i++) {
      data.push({ t: xAxis[i], y: yAxis[i] });
    }

    let showLine = true;

    let borderColor = '';
    let backgroundColor = '';
    if (element === 'cal') {
      borderColor = ['rgb(0, 0, 255)'];
      backgroundColor = ['rgba(0, 0, 255, 0.13)'];
    } else if (element === 'fat') {
      borderColor = ['rgb(255, 255, 0)'];
      backgroundColor = ['rgba(255, 255, 0, 0.13)'];
    } else if (element === 'carb') {
      borderColor = ['rgb(0, 255, 0)'];
      backgroundColor = ['rgba(0, 255, 0, 0.13)'];
    } else if (element === 'prot') {
      borderColor = ['rgb(255, 0, 0)'];
      backgroundColor = ['rgb(255, 0, 0, 0.13)'];
    }

    let pointRadius = 7;
    const pointHoverRadius = 7;
    let pointStyle = 'circle';
    let png = new Image();

    if (element === 'minCalCI') {
      showLine = false;
      png.src = 'https://i.imgur.com/4rxSgbz.png';
      png.crossOrigin = 'anonymous';
      pointStyle = png;
      borderColor = ['rgb(0, 0, 0, 0)'];
      backgroundColor = ['rgb(0, 0, 0, 0)'];
      label = '';
    }

    if (element === 'maxCalCI') {
      showLine = false;
      png.src = 'https://i.imgur.com/BVke3q5.png';
      png.crossOrigin = 'anonymous';
      pointStyle = png;
      borderColor = ['rgb(0, 0, 0, 0)'];
      backgroundColor = ['rgb(0, 0, 0, 0)'];
      label = ' ';
    }

    if (element === 'minFatCI') {
      showLine = false;
      png.src = 'https://i.imgur.com/fXp2iYd.png';
      png.crossOrigin = 'anonymous';
      pointStyle = png;
      borderColor = ['rgb(0, 0, 0, 0)'];
      backgroundColor = ['rgb(0, 0, 0, 0)'];
      label = '  ';
    }

    if (element === 'maxFatCI') {
      showLine = false;
      png.src = 'https://i.imgur.com/t1erRm2.png';
      png.crossOrigin = 'anonymous';
      pointStyle = png;
      borderColor = ['rgb(0, 0, 0, 0)'];
      backgroundColor = ['rgb(0, 0, 0, 0)'];
      label = '   ';
    }

    if (element === 'minProtCI') {
      showLine = false;
      png.src = 'https://i.imgur.com/phzlgxE.png';
      png.crossOrigin = 'anonymous';
      pointStyle = png;
      borderColor = ['rgb(0, 0, 0, 0)'];
      backgroundColor = ['rgb(0, 0, 0, 0)'];
      label = '    ';
    }

    if (element === 'maxProtCI') {
      showLine = false;
      png.src = 'https://i.imgur.com/03ddcC4.png';
      png.crossOrigin = 'anonymous';
      pointStyle = png;
      borderColor = ['rgb(0, 0, 0, 0)'];
      backgroundColor = ['rgb(0, 0, 0, 0)'];
      label = '     ';
    }

    if (element === 'minCarbCI') {
      showLine = false;
      png.src = 'https://i.imgur.com/ntU1IeG.png';
      png.crossOrigin = 'anonymous';
      pointStyle = png;
      borderColor = ['rgb(0, 0, 0, 0)'];
      backgroundColor = ['rgb(0, 0, 0, 0)'];
      label = '      ';
    }

    if (element === 'maxCarbCI') {
      showLine = false;
      png.src = 'https://i.imgur.com/TFLmmdg.png';
      png.crossOrigin = 'anonymous';
      pointStyle = png;
      borderColor = ['rgb(0, 0, 0, 0)'];
      backgroundColor = ['rgb(0, 0, 0, 0)'];
      label = '       ';
    }

    if (element === 'minCal') {
      showLine = false;
      png.src = 'https://i.imgur.com/fb1q4Vf.png';
      png.crossOrigin = 'anonymous';
      pointStyle = png;
      borderColor = ['rgb(0, 0, 0, 0)'];
      backgroundColor = ['rgb(0, 0, 0, 0)'];
      label = '        ';
    }

    if (element === 'maxCal') {
      showLine = false;
      png.src = 'https://i.imgur.com/fb1q4Vf.png';
      png.crossOrigin = 'anonymous';
      pointStyle = png;
      borderColor = ['rgb(0, 0, 0, 0)'];
      backgroundColor = ['rgb(0, 0, 0, 0)'];
      label = '         ';
    }

    if (element === 'minFat') {
      showLine = false;
      png.src = 'https://i.imgur.com/I7pD4pV.png';
      png.crossOrigin = 'anonymous';
      pointStyle = png;
      borderColor = ['rgb(0, 0, 0, 0)'];
      backgroundColor = ['rgb(0, 0, 0, 0)'];
      label = '          ';
    }

    if (element === 'maxFat') {
      showLine = false;
      png.src = 'https://i.imgur.com/I7pD4pV.png';
      png.crossOrigin = 'anonymous';
      pointStyle = png;
      borderColor = ['rgb(0, 0, 0, 0)'];
      backgroundColor = ['rgb(0, 0, 0, 0)'];
      label = '           ';
    }

    if (element === 'minProt') {
      showLine = false;
      png.src = 'https://i.imgur.com/dQ4fWm6.png';
      png.crossOrigin = 'anonymous';
      pointStyle = png;
      borderColor = ['rgb(0, 0, 0, 0)'];
      backgroundColor = ['rgb(0, 0, 0, 0)'];
      label = '            ';
    }

    if (element === 'maxProt') {
      showLine = false;
      png.src = 'https://i.imgur.com/dQ4fWm6.png';
      png.crossOrigin = 'anonymous';
      pointStyle = png;
      borderColor = ['rgb(0, 0, 0, 0)'];
      backgroundColor = ['rgb(0, 0, 0, 0)'];
      label = '             ';
    }

    if (element === 'minCarb') {
      showLine = false;
      png.src = 'https://i.imgur.com/3CzDzLW.png';
      png.crossOrigin = 'anonymous';
      pointStyle = png;
      borderColor = ['rgb(0, 0, 0, 0)'];
      backgroundColor = ['rgb(0, 0, 0, 0)'];
      label = '              ';
    }

    if (element === 'maxCarb') {
      showLine = false;
      png.src = 'https://i.imgur.com/3CzDzLW.png';
      png.crossOrigin = 'anonymous';
      pointStyle = png;
      borderColor = ['rgb(0, 0, 0, 0)'];
      backgroundColor = ['rgb(0, 0, 0, 0)'];
      label = '               ';
    }

    datasets.push({
      label,
      data,
      showLine,
      borderColor,
      backgroundColor,
      pointRadius,
      pointHoverRadius,
      pointStyle
    });
  });

  return { datasets };
}

export default prepareChart;
