import { Component, EventEmitter, Output } from '@angular/core';
import { ErrorService } from 'src/app/shared/services/error.service';
import { GeocodeService } from 'src/app/shared/services/geocode.service';

@Component({
  selector: 'app-location-display',
  templateUrl: './location-display.component.html',
  styleUrls: ['./location-display.component.css'],
})
export class LocationDisplayComponent {
  @Output() loadingGeocode = new EventEmitter<boolean>();
  addr = '';
  constructor(
    private geocodeService: GeocodeService,
    private errorService: ErrorService
  ) {}
  onSubmit() {
    if (this.addr === '') return;
    this.loadingGeocode.emit(true);
    // this.errorService.emitError('');
    this.geocodeService.geocode(this.addr);
  }
}
