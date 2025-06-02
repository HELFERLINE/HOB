import { Component} from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatebarComponent } from './statebar/statebar.component';
import { OptionsComponent } from './options/options.component';
import { serviceOptions } from '../../../core/models/serviceOptions';
import { O2Service } from '../../../core/services/o2.service';
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
    private o2Service: O2Service,
  ) { }

  get currentStep(): number {
    return this.o2Service.getCurrentStep();
  }

  get booking(): any {
    return this.o2Service.getBooking();
  }

  goBack(): void {
    if (this.currentStep > 1) {
      this.o2Service.setCurrentStep(this.currentStep - 1);
    } else {
      const currentBooking = this.o2Service.getBooking();
      currentBooking.selectedService = serviceOptions.unselected;
      this.o2Service.setBooking(currentBooking);
    }
  }

  goForward(): void {
    this.o2Service.setCurrentStep(this.currentStep + 1);
  }
}