export const forecastResponseMock = JSON.stringify({
  city: {
    id: 3473648,
    name: 'Icaraí',
    coord: {
      lon: -43.09972,
      lat: -22.9,
    },
    country: 'BR',
    population: 0,
    sys: {
      population: 0,
    },
  },
  list: [
    {
      dt: 1483574400,
      main: {
        temp: 27.2,
        temp_min: 27.2,
        temp_max: 29.16,
      },
      weather: [
        {
          id: 802,
          main: 'Clouds',
          description: 'scattered clouds',
          icon: '03n',
        },
      ],
      dt_txt: '2017-01-05 12:00:00',
    },
    {
      dt: 1483606800,
      main: {
        temp: 24.98,
        temp_min: 24.98,
        temp_max: 25.47,
      },
      weather: [
        {
          id: 500,
          main: 'Rain',
          description: 'light rain',
          icon: '10d',
        },
      ],
      dt_txt: '2017-01-05 09:00:00',
    },
  ]
});

const weatherResponseMock = JSON.stringify({
  weather: [
    {
      id: 211,
      main: 'Thunderstorm',
      description: 'thunderstorm',
      icon: '11n',
    },
  ],
  main: {
    temp: 30.57,
    pressure: 1009,
    humidity: 59,
    temp_min: 28,
    temp_max: 33,
  },
  dt: 1483567200,
});

export {weatherResponseMock};

export function getIconMocks() {
  ['02d','03d','04d','09d','10d','11d','13d','50d','01n','02n','03n','04n','09n','10n','11n','13n','50n']
    .map(icon => {
      const res = Object.assign({}, weatherResponseMock)
      res.weather[0].icon = icon;
    });
}
