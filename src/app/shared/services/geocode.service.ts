import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { WeatherService } from './weather-service.service';
import { ErrorService } from './error.service';

interface geocodeData {
  bbox: number[];
  geometry: unknown;
  properties: {
    lat: number;
    lon: number;
  };
  type: string;
}

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
      .get<{ features: geocodeData[] }>(
        'https://api.geoapify.com/v1/geocode/search',
        {
          params: new HttpParams({
            fromObject: {
              text: address,
              apiKey: '34bd87f959a0421bba9cbf37ca106a02',
            },
          }),
        }
      )
      .subscribe({
        next: (resData) => {
          resData.features.length > 0
            ? this.weatherService.getForecastFromLocation({
                lat: resData.features[0].properties.lat,
                lon: resData.features[0].properties.lon,
              })
            : this.errorService.emitError(
                'could not interpret location data response.'
              );
        },
        error: (e) => {
          this.errorService.emitError(e);
        },
      });
  }
}
