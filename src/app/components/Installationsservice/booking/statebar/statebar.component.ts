import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { O2Service } from '../../../../core/services/o2.service';
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
      private o2Service: O2Service,
  ) {}

  get previousStep(): number {
    return this.o2Service.getCurrentStep() - 1;
  }

  get currentStep(): number {
    return this.o2Service.getCurrentStep();
  }

  get booking() {
    return this.o2Service.getBooking();
  }

  ngOnInit() {
  }


}