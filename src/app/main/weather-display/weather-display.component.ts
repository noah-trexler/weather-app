import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { dailyForecast } from 'src/app/shared/models/forecast.model';
import { ErrorService } from 'src/app/shared/services/error.service';
import { WeatherService } from 'src/app/shared/services/weather-service.service';

@Component({
  selector: 'app-weather-display',
  templateUrl: './weather-display.component.html',
  styleUrls: ['./weather-display.component.css'],
})
export class WeatherDisplayComponent implements OnInit, OnDestroy {
  loading = false;
  forecast: dailyForecast[] = [];
  forecastSubscription!: Subscription;

  location: { city: string; state: string } | null = null;
  locationSubscription!: Subscription;
  error = '';

  errorSubscription!: Subscription;

  constructor(
    private weatherService: WeatherService,
    private errorService: ErrorService
  ) {}

  onReset() {
    this.location = null;
    this.error = '';
    this.forecast = [];
    this.loading = true;
    this.weatherService.getForecastFromLocation();
  }

  ngOnInit(): void {
    this.loading = true;
    this.errorSubscription = this.errorService.error.subscribe((err) => {
      this.error = err;
      this.loading = false;
    });
    this.forecastSubscription = this.weatherService.forecastData.subscribe(
      (forecast) => {
        if (forecast) {
          this.forecast = forecast;
          this.error = '';
        }
        this.loading = false;
      }
    );

    this.locationSubscription = this.weatherService.locationData.subscribe(
      (location) => {
        this.location = location;
        this.loading = false;
        this.error = '';
      }
    );
    this.weatherService.getForecastFromLocation();
  }

  ngOnDestroy() {
    this.forecastSubscription.unsubscribe();
    this.locationSubscription.unsubscribe();
  }
}
