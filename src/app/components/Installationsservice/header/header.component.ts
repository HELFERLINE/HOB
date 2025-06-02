import { Component } from '@angular/core';
import { AppUrls } from '../../../app.urls';
import { Router, RouterModule } from '@angular/router';
import { O2Service } from '../../../core/services/o2.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    RouterModule
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  APPURLS = AppUrls;
  
  constructor(
    private router: Router,
    private o2service: O2Service
  ) {}
  
  get booking() {
    return this.o2service.getBooking();
  }

  reloadHomePage(): void {    
    // Default to regular installationsservice
    window.location.href = `/${this.APPURLS.InstallationService}`;
    
  }
}
