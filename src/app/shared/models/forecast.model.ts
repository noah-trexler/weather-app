export interface forecast {
  number: number;
  name: string;
  startTime: string;
  endTime: string;
  isDaytime: boolean;
  temperature: number;
  temperatureUnit: string;
  temperatureTrend: string | null;
  probabilityOfPrecipitation: {
    unitCode: string;
    value: number;
  };
  dewpoint: {
    unitCode: string;
    value: number;
  };
  relativeHumidity: {
    unitCode: string;
    value: number;
  };
  windSpeed: string;
  windDirection: string;
  icon: string;
  shortForecast: string;
  detailedForecast: string;
}

export interface simpleForecast {
  isDaytime: boolean;
  temp: number;
  humidity: number;
  precip: number;
}

export interface dailyForecast {
  name: string;
  hi_temp: number;
  lo_temp: number;
  humidity: number;
  precip: number;
  icon: string;
}
