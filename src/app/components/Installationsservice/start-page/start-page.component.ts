import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { CheckPageComponent } from "../check-page/check-page.component";
import { FrequentQuestionsComponent } from "../frequent-questions/frequent-questions.component";
import { FooterComponent } from '../footer/footer.component';
import { BookingComponent } from '../booking/booking.component';
import { serviceOptions } from '../../../core/models/serviceOptions';
import { O2Service } from '../../../core/services/o2.service';
import { Router, ActivatedRoute } from '@angular/router';
import { AppUrls } from '../../../app.urls';
import { ContactDetails, Address } from '../../../core/models/booking';
import { StorageService } from '../../../core/services/storage.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-start-page',
  standalone: true,
  imports: [
    HeaderComponent,
    CheckPageComponent,
    FrequentQuestionsComponent,
    FooterComponent,
    BookingComponent,
    CommonModule,
  ],
  templateUrl: './start-page.component.html',
  styleUrl: './start-page.component.css'
})
export class StartPageComponent implements OnInit {
  fullName: string = '';
  showUserInfo: boolean = false;

  constructor(
    private o2Service: O2Service,
    private router: Router,
    private route: ActivatedRoute,
    private storageService: StorageService
  ) {
    this.route.queryParams.subscribe(params => {
      if (Object.keys(params).length > 0) {
        const booking = this.o2Service.getBooking();
        
        // Initialize address and contactDetails if not already present
        booking.address = booking.address || {} as Address;
        booking.contactDetails = booking.contactDetails || {} as ContactDetails;
        
        // Set customer information if parameters exist
        if (params['firstName']) booking.address.firstName = params['firstName'];
        if (params['lastName']) booking.address.lastName = params['lastName'];
        if (params['email']) booking.contactDetails.email = params['email'];
        if (params['phone']) booking.contactDetails.phoneNumber = params['phone'];
        if (params['postalcode']) booking.address.postalCode = params['postalcode'];
        if (params['street']) booking.address.street = params['street'];
        if (params['number']) booking.address.houseNumber = params['number'];
        if (params['gender'] !== undefined) {
          booking.address.salutation = params['gender'] === 'true' ? 'Frau' : 'Herr';
        }
        
        // Set the direct postal code and city properties for first step if provided
        if (params['postalcode']) booking.postalCode = params['postalcode'];
        if (params['city']) booking.city = params['city'];
        
        // Update the booking object
        this.o2Service.setBooking(booking);
      }      
      // Check route type regardless of query parameters
      this.checkRouteType();
    });

    this.loadUserInfo();
  }

  ngOnInit(): void {
    // No longer needed as checkRouteType is now called in constructor
  }

  // New method to check route type
  private checkRouteType(): void {
    // Check if the current route is the Kulanz route
    const currentUrl = this.router.url;
    // Convert URL to lowercase and remove any leading slash for comparison
    const normalizedUrl = currentUrl.toLowerCase().replace(/^\/+/, '');
    // Remove query parameters for route comparison
    const baseUrl = normalizedUrl.split('?')[0];
    
    const booking = this.o2Service.getBooking();
    
    this.o2Service.setBooking(booking);
  }

  selectedService = serviceOptions;

  get booking() {
    return this.o2Service.getBooking();
  }

  get currentStep() {
    return this.o2Service.getCurrentStep();
  }

  loadUserInfo(): void {
    const user = this.storageService.get<{role: number, firstname: string, lastname: string}>('user');
    if (user && user.firstname && user.lastname) {
      this.fullName = `${user.firstname} ${user.lastname}`;
      this.showUserInfo = true;
    }
  }

  toggleUserInfoDisplay(): void {
    this.showUserInfo = !this.showUserInfo;
  }
}