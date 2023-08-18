import { Component, Input, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { simpleForecast } from 'src/app/shared/models/forecast.model';
import { WeatherService } from 'src/app/shared/services/weather-service.service';

@Component({
  selector: 'app-weather-display',
  templateUrl: './weather-display.component.html',
  styleUrls: ['./weather-display.component.css'],
})
export class WeatherDisplayComponent implements OnInit {
  @Input() coords: string = '33.7488,-84.3877';
  forecast?: simpleForecast[];
  forecastSubscription!: Subscription;

  constructor(private weatherService: WeatherService) {}

  onSubmit() {
    // const _input = this.coords.split(',');
    // this.weatherService.getForecast(+_input[0], +_input[1]).subscribe((res) => {
    //   console.log(res);
    //   this.forecast = res;
    // });
    this.weatherService.getForecastFromLocation();
  }

  ngOnInit(): void {
    this.forecastSubscription = this.weatherService.forecastData.subscribe(
      (forecast) => {
        this.forecast = forecast;
      }
    );
  }
}
