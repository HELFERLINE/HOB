import { Injectable } from '@angular/core';
import { Booking } from '../models/booking';
import { HttpHeaders} from '@angular/common/http';
import { environment } from '../../environments/environment';
import { catchError, Observable, throwError } from 'rxjs';
import { ApiUrls } from '../../api.urls';
import { HttpService } from './http.service';
import { RequestBookTask } from '../models/Request/RequestBookTask';
import { serviceOptions } from '../models/serviceOptions';

@Injectable({
  providedIn: 'root'
})
export class onlineService {
  booking: Booking = new Booking();
  currentStep: number = 1;


  constructor(
    private http: HttpService,
  ) { }

  getBooking(): Booking {
    return this.booking;
  }
  setBooking(booking: Booking): void {
    this.booking = booking;
  }

  getCurrentStep(): number {
    return this.currentStep;
  }

  setCurrentStep(step: number): void {
    this.currentStep = step;
  }
  postBooking(booking: Booking): Observable<any> {
    // Mock successful response
    return new Observable(observer => {
      // Simulate network delay
      setTimeout(() => {
        // Emit successful response
        observer.next({
          success: true,
          message: 'Booking successfully created',
          bookingId: Math.floor(Math.random() * 10000),
          timestamp: new Date().toISOString()
        });
        observer.complete();
      }, 500);
    });
  }
}