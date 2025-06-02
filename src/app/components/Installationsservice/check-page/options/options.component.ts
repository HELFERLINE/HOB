import { Component} from '@angular/core';
import { serviceOptions } from '../../../../core/models/serviceOptions';
import { O2Service } from '../../../../core/services/o2.service';

@Component({
  selector: 'app-options',
  standalone: true,
  imports: [],
  templateUrl: './options.component.html',
  styleUrl: './options.component.css'
})
export class OptionsComponent {

  constructor(
    private o2Service: O2Service,
  ) { }

  get booking() {
    return this.o2Service.getBooking();
  }

  installationService(): void {
    const currentBooking = this.o2Service.getBooking();
    currentBooking.selectedService = serviceOptions.installationService;
    this.o2Service.setBooking(currentBooking);
  }

  remoteService(): void {
    const currentBooking = this.o2Service.getBooking();
    currentBooking.selectedService = serviceOptions.remoteService;
    this.o2Service.setBooking(currentBooking);
    this.o2Service.setCurrentStep(3);
  }
}