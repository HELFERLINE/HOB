import { Component } from '@angular/core';
import { AppUrls } from '../../../app.urls';
import { Router, RouterModule } from '@angular/router';
import { onlineService } from '../../../core/services/online.service';

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
    private onlineService: onlineService
  ) {}
  
  get booking() {
    return this.onlineService.getBooking();
  }

  reloadHomePage(): void {    
    // Default to regular installationsservice
    window.location.href = `/${this.APPURLS.InstallationService}`;
    
  }
}
