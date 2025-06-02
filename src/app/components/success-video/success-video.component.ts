import { Component } from '@angular/core';
import { HeaderComponent } from '../Installationsservice/header/header.component';
import { ConfirmationComponent } from '../Installationsservice/booking/confirmation/confirmation.component';
import { FooterComponent } from '../Installationsservice/footer/footer.component';
import { StatebarComponent } from '../Installationsservice/booking/statebar/statebar.component';
import { onlineService } from '../../core/services/online.service';
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
    private onlineService: onlineService
  ) {
    this.onlineService.setCurrentStep(5);
    const currentBooking = this.onlineService.getBooking();
    currentBooking.selectedService = serviceOptions.remoteService;
    this.onlineService.setBooking(currentBooking);
  }

  get booking() {
    return this.onlineService.getBooking();
  }

  ngOnInit(): void {
    // Take params from URL and make Booking than chnge Text
  }
  
}
