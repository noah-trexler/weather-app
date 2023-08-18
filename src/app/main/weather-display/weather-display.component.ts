import { Component, Input, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import {
  dailyForecast,
  simpleForecast,
} from 'src/app/shared/models/forecast.model';
import { WeatherService } from 'src/app/shared/services/weather-service.service';

@Component({
  selector: 'app-weather-display',
  templateUrl: './weather-display.component.html',
  styleUrls: ['./weather-display.component.css'],
})
export class WeatherDisplayComponent implements OnInit {
  @Input() coords: string = '33.7488,-84.3877';
  forecast: dailyForecast[] = [];
  forecastSubscription!: Subscription;

  location: { city: string; state: string } | null = null;
  locationSubscription!: Subscription;

  constructor(private weatherService: WeatherService) {}

  onSubmit() {
    this.weatherService.getForecastFromLocation();
  }

  ngOnInit(): void {
    this.forecastSubscription = this.weatherService.forecastData.subscribe(
      (forecast) => {
        this.forecast = forecast;
      }
    );

    this.locationSubscription = this.weatherService.locationData.subscribe(
      (location) => {
        this.location = location;
      }
    );
    this.weatherService.getForecastFromLocation();
  }
}
