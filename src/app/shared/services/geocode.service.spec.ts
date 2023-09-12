import { of } from 'rxjs';
import { GeocodeService } from './geocode.service';
import { HttpParams } from '@angular/common/http';

describe('Geocode service', () => {
  let geocodeService: GeocodeService;
  let httpClientSpy: any;
  let weatherServiceSpy: any;
  let errorServiceSpy: any;

  beforeEach(() => {
    httpClientSpy = {
      get: jest.fn(),
    };
    weatherServiceSpy = {
      getForecastFromLocation: jest.fn(),
    };
    errorServiceSpy = {
      emitError: jest.fn(),
    };
    geocodeService = new GeocodeService(
      httpClientSpy,
      weatherServiceSpy,
      errorServiceSpy
    );
  });

  it('should be created', () => {
    expect(geocodeService).toBeTruthy();
  });

  it('should test geocode', () => {
    const res = { lat: 33.7488, lon: -84.3877 };
    jest.spyOn(httpClientSpy, 'get').mockReturnValue(of(res));
    geocodeService.geocode('Atlanta');
    expect(httpClientSpy.get).toHaveBeenCalledTimes(1);
    expect(httpClientSpy.get).toHaveBeenCalledWith(
      'https://weather-app-api-235x.onrender.com/geocode',
      { params: new HttpParams({ fromObject: { text: 'Atlanta' } }) }
    );
  });
});
