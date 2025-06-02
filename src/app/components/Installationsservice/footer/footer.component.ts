import { Component } from '@angular/core';
import { AppUrls } from '../../../app.urls';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [
    RouterModule
  ],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent {
  APPURLS = AppUrls
}
