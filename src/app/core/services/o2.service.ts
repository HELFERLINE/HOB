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
export class O2Service {
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
    const FullUrl = `${environment.booking.schema}://${environment.booking.host}:${environment.booking.port}/${environment.booking.path}/o2/${ApiUrls.BookTask}`;
    const headers = new HttpHeaders()
      .set('Accept', 'application/json')
      .set('Content-Type', 'application/json');

    // Make sure we're using the most current booking data
    const currentBooking = this.booking;

    const body: RequestBookTask = {
      subscriptionId: currentBooking.subscriptionId,
      isRemote: currentBooking.selectedService === serviceOptions.remoteService ? true : false,
      gender: currentBooking.address?.salutation === 'Herr' ? false : true,
      title: currentBooking.address?.title || '',
      firstName: currentBooking.address?.firstName || '',
      lastName: currentBooking.address?.lastName || '',
      street: currentBooking.address?.street || '',
      number: currentBooking.address?.houseNumber || '',
      zip: currentBooking.address?.postalCode || '',
      city: currentBooking.address?.city || '',
      phone: currentBooking.contactDetails?.phoneNumber || '',
      email: currentBooking.contactDetails?.email || '',
      orderTimes: currentBooking.appointmentSuggestions?.map(suggestion => {
      // Create Date objects for start and end times
      const startDateLocal = new Date(`${suggestion.date}T${suggestion.startTime}:00`);
      const endDateLocal = new Date(`${suggestion.date}T${suggestion.endTime}:00`);
      
      // Convert to UTC ISO strings and remove the 'Z' at the end
      const startUTC = startDateLocal.toISOString().slice(0, -1);
      const endUTC = endDateLocal.toISOString().slice(0, -1);
      
      return {
        from: startUTC,
        to: endUTC
      };
      }) || [],
      additionalTask: (currentBooking.selectedDeviceIds && currentBooking.selectedDeviceIds.length > 0) ? {
      skillIds: currentBooking.selectedDeviceIds,
      description: currentBooking.printerDetails?.description || ''
      } : null,
      customerNotification: currentBooking.contactType,
      customerNotificationPhoneNumber: currentBooking.contactDetails?.phoneNumber || '',
      goodwillInfo: currentBooking.isKulanz ? {
      salcusId: currentBooking.salcusId || '',
      reasonForGoodwill: currentBooking.kulanzReason || ''
      } : undefined,

      businessCustomerInfo: currentBooking.isB2B ? {
      billingEmail: currentBooking.address?.billingEmail || '',
      companyName: currentBooking.address?.companyName || '',
      contactPerson: currentBooking.address?.contactPerson || '',
      ust: currentBooking.address?.vatRequired === 'Ja', // Convert string 'Ja' to boolean true
      uid: currentBooking.address?.vatRequired === 'Ja' ? currentBooking.address?.uid : undefined
      } : undefined,

      employeeInfo: currentBooking.isEmployee ? {
        username: currentBooking.employeeUsername || ''
      } : undefined
    };

    // Log the request body for debugging
    console.log('Booking request body:', body);

    return this.http
      .post<RequestBookTask, any>(FullUrl, body, { headers: headers }, true)
      .pipe(
        catchError((error) => {
          console.error('Error posting booking:', error);
          return throwError(() => new Error('Failed to post booking'));
        })
      );
  }
  
}