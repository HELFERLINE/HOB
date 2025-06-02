import { Component } from '@angular/core';
import { O2Service } from '../../../../core/services/o2.service';
import { serviceOptions } from '../../../../core/models/serviceOptions';

@Component({
  selector: 'app-confirmation',
  imports: [],
  templateUrl: './confirmation.component.html',
  styleUrl: './confirmation.component.css'
})
export class ConfirmationComponent {
  serviceOptions = serviceOptions
  constructor(
    private o2Service: O2Service,
  ) { }

  get booking() {
    return this.o2Service.getBooking();
  }

}
