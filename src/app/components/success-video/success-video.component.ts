import { Component } from '@angular/core';
import { HeaderComponent } from '../Installationsservice/header/header.component';
import { ConfirmationComponent } from '../Installationsservice/booking/confirmation/confirmation.component';
import { FooterComponent } from '../Installationsservice/footer/footer.component';
import { StatebarComponent } from '../Installationsservice/booking/statebar/statebar.component';
import { O2Service } from '../../core/services/o2.service';
import { serviceOptions } from '../../core/models/serviceOptions';

@Component({
  selector: 'app-success-video',
  imports: [
    HeaderComponent,
    StatebarComponent,
    ConfirmationComponent,
    FooterComponent
  ],
  templateUrl: './success-video.component.html',
  styleUrl: './success-video.component.css'
})
export class SuccessVideoComponent {

  constructor(
    private o2service: O2Service
  ) {
    this.o2service.setCurrentStep(5);
    const currentBooking = this.o2service.getBooking();
    currentBooking.selectedService = serviceOptions.remoteService;
    this.o2service.setBooking(currentBooking);
  }

  get booking() {
    return this.o2service.getBooking();
  }

  ngOnInit(): void {
    // Take params from URL and make Booking than chnge Text
  }
  
}
