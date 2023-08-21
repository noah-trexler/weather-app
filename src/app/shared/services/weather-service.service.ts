import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject, map, switchMap } from 'rxjs';
import { dailyForecast, forecast } from '../models/forecast.model';

@Injectable({
  providedIn: 'root',
})
export class WeatherService {
  forecastData = new Subject<dailyForecast[]>();
  locationData = new Subject<{ city: string; state: string }>();

  constructor(private http: HttpClient) {}

  getForecastFromLocation() {
    navigator.geolocation.getCurrentPosition(
      (position: GeolocationPosition) => {
        this.getForecast(
          position.coords.latitude,
          position.coords.longitude
        ).subscribe((res) => this.forecastData.next(res));
      },
      (error) => {
        console.log('Error retrieving data. ' + error);
      }
    );
  }

  getForecast(latitude: number, longitude: number) {
    // Atlanta 33.7488,-84.3877
    return this.http
      .get<{
        properties: {
          relativeLocation: { properties: { city: string; state: string } };
          forecast: string;
        };
      }>(`https://api.weather.gov/points/${latitude},${longitude}`)
      .pipe(
        switchMap((responseData) => {
          this.locationData.next(
            responseData.properties.relativeLocation.properties
          );
          return this.http.get<{ properties: { periods: forecast[] } }>(
            responseData.properties.forecast
          );
        })
      )
      .pipe(
        map((responseData) => {
          const forecast: dailyForecast[] = [];
          const f = responseData.properties.periods;
          for (let i = 0; i < f.length; i += 2) {
            const _data: dailyForecast = {
              name: f[i].name,
              hi_temp: f[i].temperature,
              lo_temp: f[i + 1].temperature,
              humidity: f[i].relativeHumidity.value,
              precip: f[i].probabilityOfPrecipitation.value,
            };
            forecast.push(_data);
          }
          return forecast;
        })
      );
  }
}
