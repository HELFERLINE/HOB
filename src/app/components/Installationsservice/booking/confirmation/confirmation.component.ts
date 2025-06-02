import { Component } from '@angular/core';
import { onlineService } from '../../../../core/services/online.service';
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
    private onlineService: onlineService,
  ) { }

  get booking() {
    return this.onlineService.getBooking();
  }

}
