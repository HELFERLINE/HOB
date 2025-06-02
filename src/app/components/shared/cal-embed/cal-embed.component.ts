import { Component, OnInit } from '@angular/core';
import { CommonModule, DOCUMENT } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { onlineService } from '../../../core/services/online.service';

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
    private onlineService: onlineService,
    private sanitizer: DomSanitizer
  ) {
    const booking = this.onlineService.booking;
    // Determine funnel type based on booking properties
  

    
    let calUrl = `https://cal.com/helferline/o2-installationsservice-per-videosupport?embed=true&layout=month_view&theme=auto&hideBranding=true`;
    

    
    
    this.calEmbedUrl = this.sanitizer.bypassSecurityTrustResourceUrl(calUrl);
    console.log('Cal embed URL:', this.calEmbedUrl);
  }


  ngOnInit(): void {
    console.log('Cal embed component initialized with iframe approach');
  }
}
