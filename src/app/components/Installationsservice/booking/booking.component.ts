import { Component} from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatebarComponent } from './statebar/statebar.component';
import { OptionsComponent } from './options/options.component';
import { serviceOptions } from '../../../core/models/serviceOptions';
import { onlineService } from '../../../core/services/online.service';
import { AddressComponent } from './address/address.component';
import { AppointmentComponent } from './appointment/appointment.component';
import { ConfirmationComponent } from './confirmation/confirmation.component';
import { OverviewComponent } from './overview/overview.component';

@Component({
  selector: 'app-booking',
  standalone: true,
  imports: [
    CommonModule,
    StatebarComponent,
    OptionsComponent,
    AddressComponent,
    AppointmentComponent,
    OverviewComponent,
    ConfirmationComponent,
  ],
  templateUrl: './booking.component.html',
  styleUrl: './booking.component.css'
})
export class BookingComponent {

  serviceOptions = serviceOptions;

  constructor(
    private onlineService: onlineService,
  ) { }

  get currentStep(): number {
    return this.onlineService.getCurrentStep();
  }

  get booking(): any {
    return this.onlineService.getBooking();
  }

  goBack(): void {
    if (this.currentStep > 1) {
      this.onlineService.setCurrentStep(this.currentStep - 1);
    } else {
      const currentBooking = this.onlineService.getBooking();
      currentBooking.selectedService = serviceOptions.unselected;
      this.onlineService.setBooking(currentBooking);
    }
  }

  goForward(): void {
    this.onlineService.setCurrentStep(this.currentStep + 1);
  }
}