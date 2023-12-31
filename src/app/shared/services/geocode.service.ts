import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { WeatherService } from './weather-service.service';
import { ErrorService } from './error.service';

@Injectable({
  providedIn: 'root',
})
export class GeocodeService {
  constructor(
    private http: HttpClient,
    private weatherService: WeatherService,
    private errorService: ErrorService
  ) {}

  // geoapify
  geocode(address: string) {
    this.http
      .get<{ lat: number; lon: number }>(
        'https://weather-app-api-235x.onrender.com/geocode',
        {
          params: new HttpParams({ fromObject: { text: address } }),
        }
      )
      .subscribe({
        next: (resData) => {
          this.weatherService.getForecastFromLocation({
            lat: resData.lat,
            lon: resData.lon,
          });
        },
        error: (e) => {
          this.errorService.emitError('Unable to interpret geocode data.');
        },
      });
  }
}
