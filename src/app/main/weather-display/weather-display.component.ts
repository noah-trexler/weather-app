import { Component, Input } from '@angular/core';
import { NgForm } from '@angular/forms';
import { WeatherService } from 'src/app/shared/weather-service.service';

@Component({
  selector: 'app-weather-display',
  templateUrl: './weather-display.component.html',
  styleUrls: ['./weather-display.component.css'],
})
export class WeatherDisplayComponent {
  @Input() coords?: string;
  forecast?: any;

  constructor(private weatherService: WeatherService) {}

  onSubmit(input: string) {
    const _input = input.split(',');
    this.weatherService.getForecast(+_input[0], +_input[1]);
  }
}
