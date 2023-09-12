import { Component, Input } from '@angular/core';
import { dailyForecast } from 'src/app/shared/models/forecast.model';

@Component({
  selector: 'app-weather-panel',
  templateUrl: './weather-panel.component.html',
  styleUrls: ['./weather-panel.component.css'],
})
export class WeatherPanelComponent {
  @Input() forecast!: dailyForecast;
  onClick() {
    console.log('clicked');
  }
}
