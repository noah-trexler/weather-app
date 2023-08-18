import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject, map, switchMap } from 'rxjs';
import {
  dailyForecast,
  forecast,
  simpleForecast,
} from '../models/forecast.model';

@Injectable({
  providedIn: 'root',
})
export class WeatherService {
  forecastData = new Subject<dailyForecast[]>();

  constructor(private http: HttpClient) {}

  getForecastFromLocation() {
    navigator.geolocation.getCurrentPosition(
      (position: GeolocationPosition) => {
        this.getForecast(
          position.coords.latitude,
          position.coords.longitude
        ).subscribe((res) => this.forecastData.next(res));
      }
    );
  }

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
      .pipe(
        map((responseData) => {
          const forecast: dailyForecast[] = [];
          let f = responseData.properties.periods;
          for (let i = 0; i < f.length; i += 2) {
            let _data: dailyForecast = {
              name: f[i].name,
              hi_temp: f[i].temperature,
              lo_temp: f[i + 1].temperature,
              humidity: f[i].relativeHumidity.value,
              precip: f[i].probabilityOfPrecipitation.value,
            };
            forecast.push(_data);
          }
          return forecast;
          // const forecasts: simpleForecast[] = [];
          // for (let f of responseData.properties.periods) {
          //   let _data: simpleForecast = {
          //     isDaytime: f.isDaytime,
          //     temp: f.temperature,
          //     humidity: f.relativeHumidity.value,
          //     precip: f.probabilityOfPrecipitation.value,
          //   };
          //   forecasts.push(_data);
          // }
          // return forecasts;
        })
      );
  }
}
