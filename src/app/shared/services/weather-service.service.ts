import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject, catchError, map, switchMap, throwError } from 'rxjs';
import { dailyForecast, forecast } from '../models/forecast.model';
import { ErrorService } from './error.service';

@Injectable({
  providedIn: 'root',
})
export class WeatherService {
  forecastData = new Subject<dailyForecast[] | null>();
  locationData = new Subject<{ city: string; state: string }>();

  constructor(private http: HttpClient, private errorService: ErrorService) {}

  getForecastFromLocation(coords?: { lat: number; lon: number }) {
    if (coords) {
      this.getForecast(coords.lat, coords.lon).subscribe({
        next: (v) => this.forecastData.next(v),
        error: (e) => this.errorService.emitError(e),
      });
    } else {
      navigator.geolocation.getCurrentPosition(
        (position: GeolocationPosition) => {
          this.getForecast(
            position.coords.latitude,
            position.coords.longitude
          ).subscribe({
            next: (v) => this.forecastData.next(v),
            error: (e) => this.errorService.emitError(e),
          });
        },
        (error) => {
          error.POSITION_UNAVAILABLE
            ? this.forecastData.next(null)
            : this.errorService.emitError(
                'Unable to retrieve location data. ' + error
              );
        }
      );
    }
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
        }),
        catchError((err) => {
          return throwError(() => new Error(err));
        })
      );
  }
}