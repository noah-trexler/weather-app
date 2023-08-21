import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { dailyForecast } from 'src/app/shared/models/forecast.model';
import { WeatherService } from 'src/app/shared/services/weather-service.service';

@Component({
  selector: 'app-weather-display',
  templateUrl: './weather-display.component.html',
  styleUrls: ['./weather-display.component.css'],
})
export class WeatherDisplayComponent implements OnInit {
  loading = false;
  forecast: dailyForecast[] = [];
  forecastSubscription!: Subscription;

  location: { city: string; state: string } | null = null;
  locationSubscription!: Subscription;

  constructor(private weatherService: WeatherService) {}

  onSubmit() {
    this.weatherService.getForecastFromLocation();
  }

  ngOnInit(): void {
    this.loading = true;
    this.forecastSubscription = this.weatherService.forecastData.subscribe(
      (forecast) => {
        this.forecast = forecast;
        this.loading = false;
      }
    );

    this.locationSubscription = this.weatherService.locationData.subscribe(
      (location) => {
        this.location = location;
        this.loading = false;
      }
    );
    this.weatherService.getForecastFromLocation();
  }
}
