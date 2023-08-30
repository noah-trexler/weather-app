import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Subject, catchError, map, throwError } from 'rxjs';
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
        error: (e) =>
          this.errorService.emitError('Unable to process forecast data.'),
      });
    } else {
      navigator.geolocation.getCurrentPosition(
        (position: GeolocationPosition) => {
          this.getForecast(
            position.coords.latitude,
            position.coords.longitude
          ).subscribe({
            next: (v) => this.forecastData.next(v),
            error: (e) =>
              this.errorService.emitError('Unable to process forecast data.'),
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
        message: string;
        locationData: {
          city: string;
          state: string;
        };
        forecastData: forecast[];
      }>('https://weather-app-api-235x.onrender.com/forecast', {
        params: new HttpParams({
          fromObject: { lat: latitude, lon: longitude },
        }),
      })
      .pipe(
        map((responseData) => {
          this.locationData.next(responseData.locationData);
          const forecast: dailyForecast[] = [];
          const f = responseData.forecastData;
          for (let i = 0; i < f.length; i += 2) {
            const _data: dailyForecast = {
              name: f[i].name,
              hi_temp: f[i].temperature,
              lo_temp: f[i + 1].temperature,
              humidity: f[i].relativeHumidity.value,
              precip: f[i].probabilityOfPrecipitation.value,
              icon: f[i].icon,
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
