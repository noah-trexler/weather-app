import { Component, EventEmitter, Output } from '@angular/core';
import { GeocodeService } from 'src/app/shared/services/geocode.service';

@Component({
  selector: 'app-location-display',
  templateUrl: './location-display.component.html',
  styleUrls: ['./location-display.component.css'],
})
export class LocationDisplayComponent {
  @Output() loadingGeocode = new EventEmitter<boolean>();
  constructor(private geocodeService: GeocodeService) {}
  onSubmit(address: string) {
    this.loadingGeocode.emit(true);
    this.geocodeService.geocode(address);
  }
}
