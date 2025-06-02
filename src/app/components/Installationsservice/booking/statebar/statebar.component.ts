import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { onlineService } from '../../../../core/services/online.service';
import { serviceOptions } from '../../../../core/models/serviceOptions';

@Component({
  selector: 'app-statebar',
  imports: [CommonModule],
  templateUrl: './statebar.component.html',
  styleUrl: './statebar.component.css'
})
export class StatebarComponent {

  serviceOptions = serviceOptions
  constructor(
      private onlineService: onlineService,
  ) {}

  get previousStep(): number {
    return this.onlineService.getCurrentStep() - 1;
  }

  get currentStep(): number {
    return this.onlineService.getCurrentStep();
  }

  get booking() {
    return this.onlineService.getBooking();
  }

  ngOnInit() {
  }


}