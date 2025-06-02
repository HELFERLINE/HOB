import { Component} from '@angular/core';
import { serviceOptions } from '../../../../core/models/serviceOptions';
import { onlineService } from '../../../../core/services/online.service';

@Component({
  selector: 'app-options',
  standalone: true,
  imports: [],
  templateUrl: './options.component.html',
  styleUrl: './options.component.css'
})
export class OptionsComponent {

  constructor(
    private onlineService: onlineService,
  ) { }

  get booking() {
    return this.onlineService.getBooking();
  }

  installationService(): void {
    const currentBooking = this.onlineService.getBooking();
    currentBooking.selectedService = serviceOptions.installationService;
    this.onlineService.setBooking(currentBooking);
  }

  remoteService(): void {
    const currentBooking = this.onlineService.getBooking();
    currentBooking.selectedService = serviceOptions.remoteService;
    this.onlineService.setBooking(currentBooking);
    this.onlineService.setCurrentStep(3);
  }
}