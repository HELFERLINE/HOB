import { Component, OnInit } from '@angular/core';
import { CommonModule, DOCUMENT } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { O2Service } from '../../../core/services/o2.service';
import { Booking } from '../../../core/models/booking';
import { StorageService } from '../../../core/services/storage.service';

@Component({
  selector: 'app-cal-embed',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="cal-container">
      <iframe 
        [src]="calEmbedUrl" 
        frameborder="0" 
        width="100%" 
        height="800px"
        style="border: 1px solid #e5e7eb; border-radius: 8px;">
      </iframe>
    </div>
  `,
  styles: [`
    .cal-container {
      width: 100%;
      margin-bottom: 20px;
    }
  `]
})



export class CalEmbedComponent implements OnInit {
  calEmbedUrl: SafeResourceUrl;

  constructor(
    private storageService: StorageService,
    private o2service: O2Service,
    private sanitizer: DomSanitizer
  ) {
    const booking = this.o2service.booking;
    // Determine funnel type based on booking properties
    const getFunnel = (booking: Booking): string => {
      if (booking.isB2B) {
      return 'B2B';
      } else if (booking.isKulanz) {
      return 'Kulanz';
      } else if (booking.isEmployee) {
      return 'Mitarbeiter';
      } else {
      return 'B2C';
      }
    };

    const funnel = getFunnel(booking);
    
    let calUrl = `https://cal.com/helferline/o2-installationsservice-per-videosupport?embed=true&layout=month_view&theme=auto&hideBranding=true&Stadt=${booking.city || ''}&postleitzahl=${booking.postalCode || ''}&email=${booking.contactDetails?.email || ''}&funnel=${funnel}`;
    
    // Add conditional parameters based on funnel type
    if (booking.isEmployee) {
      calUrl += `&username=${booking.employeeUsername}`;
    }
    
    if (booking.isB2B) {
      calUrl += `&billingEmail=${booking.address?.billingEmail || ''}`;
      calUrl += `&companyName=${booking.address?.companyName || ''}`;
      calUrl += `&contactPerson=${booking.address?.contactPerson || ''}`;
      calUrl += `&uid=${booking.address?.uid || ''}`;
    }
    
    if (booking.isKulanz) {
      calUrl += `&salcusId=${booking.salcusId || ''}`;
      calUrl += `&reasonForGoodwill=${booking.kulanzReason || ''}`;
    }
    
    
    this.calEmbedUrl = this.sanitizer.bypassSecurityTrustResourceUrl(calUrl);
    console.log('Cal embed URL:', this.calEmbedUrl);
  }


  ngOnInit(): void {
    console.log('Cal embed component initialized with iframe approach');
  }
}
