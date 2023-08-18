import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { switchMap } from 'rxjs';

// Forecast period interface
interface forecast {
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
    value: number | null;
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

@Injectable({
  providedIn: 'root',
})
export class WeatherService {
  constructor(private http: HttpClient) {}

  getForecast(latitude: number, longitude: number) {
    // Atlanta 33.7488,-84.3877
    return this.http
      .get<{ properties: { forecast: string }; else: any }>(
        `https://api.weather.gov/points/${latitude},${longitude}`
      )
      .pipe(
        switchMap((responseData) =>
          this.http.get<{ properties: { else: any; periods: forecast[] } }>(
            responseData.properties.forecast
          )
        )
      )
      .subscribe((res) => console.log(res.properties.periods));
  }

  // async getForecastData(latitude: number, longitude: number) {
  //   let _url = "";
  //   const url = await this.http.get(`https://api.weather.gov/points/${latitude},${longitude}`)
  //   .subscribe(responseData => {
  //     url = responseData.id
  //   });

  //   const forecast = await this.http.get(url);
  // }
}
