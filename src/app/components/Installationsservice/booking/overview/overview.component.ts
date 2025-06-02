import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { onlineService } from '../../../../core/services/online.service';

interface Device {
  id: number;
  name: string;
}

@Component({
  selector: 'app-overview',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.css', '../booking.component.css']
})
export class OverviewComponent implements OnInit {
  isSubmitting = false;
  errorMessage = '';

  constructor(private onlineService: onlineService) { }

  ngOnInit(): void {
    // Store current step for back navigation handling
    const currentStep = this.onlineService.getCurrentStep();
    localStorage.setItem('previousStep', currentStep.toString());
  }

  get booking() {
    return this.onlineService.getBooking();
  }

  private devices: Device[] = [
    { id: 1, name: 'Windows Computer' },
    { id: 2, name: 'Mac Computer' },
    { id: 3, name: 'Apple iPhone/iPad' },
    { id: 4, name: 'Android Smartphone' },
    { id: 5, name: 'Android Tablet' },
    { id: 6, name: 'Drucker' },
    { id: 7, name: 'Heimkino/Smart TV' },
    { id: 8, name: 'Smart Home Geräte' },
    { id: 9, name: 'Andere Geräte' },
    { id: 101, name: 'Windows Computer' },
    { id: 102, name: 'Mac Computer' },
    { id: 103, name: 'Android Smartphone' },
    { id: 104, name: 'Apple Device' },
    { id: 105, name: 'Andere' },
    { id: 106, name: 'Keine' }
  ];

  displayDevices(selectedDeviceIds: number[]): string {
    return selectedDeviceIds.map(id => {
      const numericId = typeof id === 'string' ? parseInt(id, 10) : id;
      return this.devices.find(device => device.id === numericId)?.name || id.toString();
    }).join(', ');
  }

  displayDate(date: Date): string {
    if (!date) return '';
    
    const dateObj = date instanceof Date ? date : new Date(date);
    
    // Format as DD.MM.YYYY
    const day = String(dateObj.getDate()).padStart(2, '0');
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const year = dateObj.getFullYear();
    
    return `${day}.${month}.${year}`;
  }

  displayTime(startTime: Date, endTime: Date): string {
    if (!startTime || !endTime) return '';
    return `${startTime} - ${endTime} Uhr`;
  }

  goBack(): void {
    // Set flag for navigation to appointment selection
    sessionStorage.setItem('fromOverview', 'true');
    
    // Navigate to step 3 (appointment component)
    this.onlineService.setCurrentStep(3);
  }

  goForward(): void {
    // Reset error message
    this.errorMessage = '';
    
    // Set submitting state to true to disable button
    this.isSubmitting = true;
    
    // Get the current booking from the service
    const currentBooking = this.onlineService.getBooking();
    
    // Log the full booking object for verification before submission
    console.log('Submitting booking:', currentBooking);
    

    this.onlineService.postBooking(currentBooking).subscribe({
      next: (response) => {
        console.log('Booking successful:', response);
        this.isSubmitting = false;
        const currentStep = this.onlineService.getCurrentStep();
        this.onlineService.setCurrentStep(currentStep + 1);
      },
      error: (error) => {
        console.error('Error during booking:', error);
        this.isSubmitting = false;
        // Display error message to user
        this.errorMessage = 'Bei der Buchung ist ein Fehler aufgetreten. Bitte versuche es erneut. Sollte das Problem weiterhin bestehen, bitten wir Dich, Deine Buchung mit uns telefonisch unter +49 3221 2302054 abzuschließen.';
        
      }
    });
  }
}
