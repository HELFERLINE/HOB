import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { onlineService } from '../../../../core/services/online.service';
import { serviceOptions } from '../../../../core/models/serviceOptions';
import { CalEmbedComponent } from '../../../shared/cal-embed/cal-embed.component';

@Component({
  selector: 'app-appointment',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, CalEmbedComponent],
  templateUrl: './appointment.component.html',
  styleUrls: ['./appointment.component.css', '../booking.component.css']
})
export class AppointmentComponent implements OnInit {
  appointmentForm: FormGroup;
  formSubmitted = false;
  detailsValidated = false;

  serviceOptions = serviceOptions;

  // Time slots with 30-minute intervals from 07:00 to 22:00
  timeSlots: string[] = [];

  // Maximum number of appointment slots allowed
  readonly maxAppointments = 4;

  // Add a flag to track if we're coming back from the overview
  comingFromOverview = false;

  // Get today's date for min input attribute
  minDate: string = this.formatDateForInput(new Date());
  
  
  // Get minimum valid date (today + 2 days)
  get minValidDate(): string {
    const today = new Date();
    const futureDate = new Date(today);
    futureDate.setDate(today.getDate() + 2);
    return this.formatDateForInput(futureDate);
  }

  get booking() {
    return this.onlineService.getBooking();
  }

  // Add working hours constraints
  readonly minWorkingHour = '07:00';
  readonly maxWorkingHour = '22:00';

  constructor(
    private fb: FormBuilder,
    private onlineService: onlineService
  ) {
    this.appointmentForm = this.fb.group({
      phoneNumber: ['', [
      Validators.required, 
      Validators.pattern(/^\+[0-9]{1,4}[0-9\s]{6,14}$/)
      ]],
      email: ['', [
      Validators.required, 
      Validators.email
      ]],
      appointments: this.fb.array([]),
      notificationMethod: ['sms', Validators.required], // Default to sms instead of phone
      notificationNumber: ['', [
      Validators.required,
      Validators.pattern(/^\+[0-9]{1,4}[0-9\s]{6,14}$/)
      ]]
    });
  
    // Initialize with 3 default appointment slots
    this.addAppointment();
    this.addAppointment();
    this.addAppointment();

    // Generate time slots with 30-minute intervals
    this.generateTimeSlots();

    // Initialize notificationNumber with phoneNumber when it changes
    // This ensures when a user enters a phone number, it will be copied to notification number
    this.appointmentForm.get('phoneNumber')?.valueChanges.subscribe(value => {
      // Only update notification number if user has not manually modified it yet
      const notificationControl = this.appointmentForm.get('notificationNumber');
      if (value && notificationControl && !notificationControl.dirty) {
        notificationControl.setValue(value);
      }
    });
  }

  // Generate time slots from 07:00 to 22:00 with 30-minute intervals
  generateTimeSlots(): void {
    const start = new Date();
    start.setHours(7, 0, 0); // Start at 07:00
    
    const end = new Date();
    end.setHours(22, 0, 0); // End at 22:00
    
    while (start <= end) {
      // Format the time as HH:MM
      const hours = start.getHours().toString().padStart(2, '0');
      const minutes = start.getMinutes().toString().padStart(2, '0');
      this.timeSlots.push(`${hours}:${minutes}`);
      
      // Add 30 minutes
      start.setMinutes(start.getMinutes() + 30);
    }
  }

  // Validate date is not in the past and is at least 2 days in the future
  validateAppointmentDate(control: AbstractControl): ValidationErrors | null {
    const selectedDate = new Date(control.value);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Check if date is in the past
    if (selectedDate < today) {
      return { pastDate: true };
    }
    
    // Require date to be at least 2 days in the future
    const minDate = new Date(today);
    minDate.setDate(today.getDate() + 2);
    minDate.setHours(0, 0, 0, 0);
    
    if (selectedDate < minDate) {
      return { beforeMinimumDays: true };
    }
    
    return null;
  }

  // Validate that time window is at least 2 hours
  validateTimeWindow(startTime: string, endTime: string): boolean {
    if (!startTime || !endTime) return false;
    
    const start = new Date(`1970-01-01T${startTime}`);
    const end = new Date(`1970-01-01T${endTime}`);
    
    // Calculate difference in milliseconds
    const diff = end.getTime() - start.getTime();
    
    // Convert to hours and check if at least 2 hours
    return diff >= 2 * 60 * 60 * 1000;
  }
  
  // Validate that time is within working hours (07:00 - 22:00)
  validateTimeRange(control: AbstractControl): ValidationErrors | null {
    const timeValue = control.value;
    
    if (!timeValue) return null;
    
    // Check if time is outside of working hours
    if (timeValue < this.minWorkingHour || timeValue > this.maxWorkingHour) {
      return { outsideWorkingHours: true };
    }
    
    return null;
  }

  // Check if this appointment overlaps with other appointments on the same date
  checkForOverlap(index: number, date: string, startTime: string, endTime: string): boolean {
    if (!date || !startTime || !endTime) return false;
    
    const currentStart = new Date(`${date}T${startTime}`);
    const currentEnd = new Date(`${date}T${endTime}`);
    
    // Return true if there's an overlap
    for (let i = 0; i < this.appointmentsArray.length; i++) {
      // Skip comparing with self
      if (i === index) continue;
      
      const appointment = this.appointmentsArray.at(i);
      const otherDate = appointment.get('appointmentDate')?.value;
      
      // Only check appointments on the same date
      if (otherDate === date) {
        const otherStartTime = appointment.get('startTime')?.value;
        const otherEndTime = appointment.get('endTime')?.value;
        
        if (otherStartTime && otherEndTime) {
          const otherStart = new Date(`${date}T${otherStartTime}`);
          const otherEnd = new Date(`${date}T${otherEndTime}`);
          
          // Check for overlap
          // (Start time is before other end AND end time is after other start)
          if (currentStart < otherEnd && currentEnd > otherStart) {
            return true;
          }
        }
      }
    }
    
    return false;
  }

  // Format date for HTML input (YYYY-MM-DD)
  formatDateForInput(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  get currentStep(): number {
    return this.onlineService.getCurrentStep();
  }

  ngOnInit(): void {
    // Check if we're coming back from overview
    const fromOverviewFlag = sessionStorage.getItem('fromOverview');
    
    // Always prefill form fields if data exists
    const currentBooking = this.onlineService.getBooking();
    if (currentBooking.contactDetails) {
      this.appointmentForm.patchValue({
        phoneNumber: currentBooking.contactDetails.phoneNumber,
        email: currentBooking.contactDetails.email,
      });
      
      if (currentBooking.contactDetails.phoneNumber) {
        this.appointmentForm.patchValue({
          notificationNumber: currentBooking.contactDetails.phoneNumber
        });
      }
      
      // Set notification method from booking if available
      if (currentBooking.contactType !== undefined) {
        const notificationMethod = currentBooking.contactType === 0 ? 'sms' : 'phone';
        this.appointmentForm.patchValue({
          notificationMethod: notificationMethod
        });
      }
    }
    
    // Handle navigation based on where we're coming from
    if (fromOverviewFlag === 'true') {
      // Coming from overview - show appointment selection part
      sessionStorage.removeItem('fromOverview');
      this.detailsValidated = true;
    } else if (sessionStorage.getItem('goingBack') === 'true') {
      // Coming back from appointment selection to contact info
      sessionStorage.removeItem('goingBack');
      this.detailsValidated = false;
    } else if (currentBooking.contactDetails?.phoneNumber && 
               currentBooking.contactDetails?.email && 
               !sessionStorage.getItem('editContactDetails')) {
      // Normal flow, with existing contact details
      this.detailsValidated = true;
    }
    
    // Load any saved appointments
    if (currentBooking.appointmentSuggestions && currentBooking.appointmentSuggestions.length > 0) {
      // Clear default appointments first
      this.appointmentsArray.clear();
      
      // Then add the saved ones
      currentBooking.appointmentSuggestions.forEach(appointment => {
        this.appointmentsArray.push(this.createAppointmentFormGroup(
          typeof appointment.date === 'string' ? appointment.date : this.formatDateForInput(new Date(appointment.date)), 
          typeof appointment.startTime === 'string' ? appointment.startTime : appointment.startTime.toString(), 
          typeof appointment.endTime === 'string' ? appointment.endTime : appointment.endTime.toString()
        ));
      });
    }

    // When activation date changes, update all appointment validations
    if (this.formSubmitted && this.booking.activationDate) {
      this.updateAppointmentValidations();
    }
  }
  
  // Update validations on all appointment date controls
  updateAppointmentValidations(): void {
    for (let i = 0; i < this.appointmentsArray.length; i++) {
      const dateControl = this.appointmentsArray.at(i).get('appointmentDate');
      if (dateControl) {
        // Trigger validation
        dateControl.updateValueAndValidity();
      }
    }
  }
  
  // Getter for the form array of appointments
  get appointmentsArray(): FormArray {
    return this.appointmentForm.get('appointments') as FormArray;
  }
  
  // Create a form group for an appointment
  createAppointmentFormGroup(date = '', startTime = '', endTime = ''): FormGroup {
    const formGroup = this.fb.group({
      appointmentDate: [date as string, [
        Validators.required,
        (control: AbstractControl): ValidationErrors | null => this.validateAppointmentDate(control)
      ]],
      startTime: [startTime as string, [
        Validators.required,
        (control: AbstractControl): ValidationErrors | null => this.validateTimeRange(control)
      ]],
      endTime: [endTime as string, [
        Validators.required,
        (control: AbstractControl): ValidationErrors | null => this.validateTimeRange(control)
      ]]
    }, { validators: this.validateAppointmentTimes() });
    
    // Add value change listeners to ensure endTime is after startTime
    const startTimeControl = formGroup.get('startTime');
    if (startTimeControl) {
      startTimeControl.valueChanges.subscribe(value => {
        if (value) {
          const endTimeControl = formGroup.get('endTime');
          if (endTimeControl && endTimeControl.value && endTimeControl.value <= value) {
            // If end time is before or equal to start time, 
            // automatically set end time to at least 2 hours after start time
            const startDate = new Date(`1970-01-01T${value}`);
            startDate.setHours(startDate.getHours() + 2);
            const newEndHours = startDate.getHours().toString().padStart(2, '0');
            const newEndMinutes = startDate.getMinutes().toString().padStart(2, '0');
            const newEndTime = `${newEndHours}:${newEndMinutes}`;
            
            // Find the next available time slot that's at least 2 hours later
            const nextValidSlot = this.timeSlots.find(slot => slot >= newEndTime);
            if (nextValidSlot) {
              endTimeControl.setValue(nextValidSlot);
            }
          }
        }
      });
    }
    
    return formGroup;
  }
  
  // Custom validator for appointment times
  validateAppointmentTimes() {
    return (group: AbstractControl): ValidationErrors | null => {
      const startTime = group.get('startTime')?.value;
      const endTime = group.get('endTime')?.value;
      const date = group.get('appointmentDate')?.value;
      
      // Skip validation if any field is empty
      if (!startTime || !endTime || !date) {
        return null;
      }
      
      // Check for minimum 2-hour window
      if (!this.validateTimeWindow(startTime, endTime)) {
        return { timeWindowTooShort: true };
      }
      
      // Find the index of this form group in the form array
      const index = this.appointmentsArray?.controls.findIndex(control => control === group);
      
      // Check for overlaps with other appointments on the same date
      if (index !== -1 && this.checkForOverlap(index, date, startTime, endTime)) {
        return { appointmentOverlap: true };
      }
      
      return null;
    };
  }
  
  // Add a new appointment slot
  addAppointment(): void {
    if (this.appointmentsArray.length < this.maxAppointments) {
      this.appointmentsArray.push(this.createAppointmentFormGroup());
    }
  }
  
  // Check if we can add more appointments
  canAddMoreAppointments(): boolean {
    return this.appointmentsArray.length < this.maxAppointments;
  }
  
  // Remove an appointment slot
  removeAppointment(index: number): void {
    // Always keep at least 3 appointment slots
    if (this.appointmentsArray.length > 3) {
      this.appointmentsArray.removeAt(index);
    }
  }

  validateContactDetails(): void {
    this.formSubmitted = true;
    
    if (this.appointmentForm.get('phoneNumber')?.valid && this.appointmentForm.get('email')?.valid) {
      // Store contact details in booking object
      const currentBooking = this.onlineService.getBooking();
      currentBooking.contactDetails = {
        phoneNumber: this.appointmentForm.get('phoneNumber')?.value,
        email: this.appointmentForm.get('email')?.value
      };
      
      this.onlineService.setBooking(currentBooking);
      
      // Move to appointment selection
      this.detailsValidated = true;
    } else {
      // Scroll to first invalid control
      this.scrollToFirstInvalidControl();
    }
  }
  
  goBack(): void {
    if (this.booking.selectedService === serviceOptions.remoteService) {
      // Reset the selected service to unselected option
      this.booking.selectedService = serviceOptions.unselected;
      this.onlineService.setBooking(this.booking);
      this.onlineService.setCurrentStep(1);
    } else {
      if (this.currentStep > 1) {
        if (this.detailsValidated) {
          // If we're in appointment selection, go back to contact details
          sessionStorage.setItem('goingBack', 'true');
          // Reload the current component to show contact details
          this.detailsValidated = false;
        } else {
          // If we're in contact details, go to previous step
          this.onlineService.setCurrentStep(this.currentStep - 1);
        }
      }
    }
  }
  
  goBackInside(): void {
    console.log('Going back inside appointment selection');
    // Simply set detailsValidated to false to go back to contact details
    this.detailsValidated = false;
    
    // Reset activation date retrieval attempts if needed
    this.formSubmitted = false;
  }
  
  goForward(): void {
    if (this.appointmentForm.get('phoneNumber')?.valid && this.appointmentForm.get('email')?.valid) {
      // Store contact details in booking object
      const currentBooking = this.onlineService.getBooking();
      currentBooking.contactDetails = {
        phoneNumber: this.appointmentForm.get('phoneNumber')?.value,
        email: this.appointmentForm.get('email')?.value
      };
      
      // Save notification method and number
      const notificationMethod = this.appointmentForm.get('notificationMethod')?.value;
      currentBooking.contactType = notificationMethod === 'sms' ? 0 : 1;
      currentBooking.contactDetails.phoneNumber = this.appointmentForm.get('notificationNumber')?.value;
      
      this.onlineService.setBooking(currentBooking);
      
      // Move to appointment selection
      this.detailsValidated = true;
      this.formSubmitted = true;
      
      // Update appointment validations
      this.updateAppointmentValidations();
    } else {
      // Form is invalid, scroll to first invalid element
      this.scrollToFirstInvalidControl();
    }
  }
  
  goNext(): void {
    // Set formSubmitted to true to show validation errors
    this.formSubmitted = true;
    
    // Then check if form is valid
    if (this.appointmentForm.valid) {
      // Get the current booking
      const currentBooking = this.onlineService.getBooking();
      
      // Make sure we preserve any previously set contact details
      if (!currentBooking.contactDetails) {
        currentBooking.contactDetails = {
          phoneNumber: this.appointmentForm.get('phoneNumber')?.value,
          email: this.appointmentForm.get('email')?.value
        };
      } else {
        // Update the existing object
        currentBooking.contactDetails.phoneNumber = this.appointmentForm.get('phoneNumber')?.value;
        currentBooking.contactDetails.email = this.appointmentForm.get('email')?.value;
      }
      
      // Save appointment suggestions
      currentBooking.appointmentSuggestions = this.appointmentsArray.controls.map(control => {
        return {
          date: control.get('appointmentDate')?.value,
          startTime: control.get('startTime')?.value,
          endTime: control.get('endTime')?.value
        };
      });
      
      // Save notification method and number
      const notificationMethod = this.appointmentForm.get('notificationMethod')?.value;
      currentBooking.contactType = notificationMethod === 'sms' ? 0 : 1;
      currentBooking.contactDetails.phoneNumber = this.appointmentForm.get('notificationNumber')?.value;
      
      // Log saved data for debugging
      console.log('Saved appointment data:', {
        contactDetails: currentBooking.contactDetails,
        appointmentSuggestions: currentBooking.appointmentSuggestions,
        contactType: currentBooking.contactType
      });
      
      this.onlineService.setBooking(currentBooking);
      
      // Move to next step
      this.onlineService.setCurrentStep(this.currentStep + 1);
    } else {
      // Form is invalid, scroll to first invalid control
      this.scrollToFirstInvalidControl();
    }
  }
  
  scrollToFirstInvalidControl(): void {
    const firstInvalidControl = document.querySelector('.ng-invalid');
    if (firstInvalidControl) {
      firstInvalidControl.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }
  
  // Helper to check if form is valid for button state
  get isFormValid(): boolean {
    return this.appointmentForm.valid;
  }

  // Helper methods to check for specific validation errors - only show on submission
  hasTimeWindowError(index: number): boolean {
    return this.formSubmitted && 
           (this.appointmentsArray.at(index).hasError('timeWindowTooShort') === true);
  }

  hasOverlapError(index: number): boolean {
    return this.formSubmitted && 
           (this.appointmentsArray.at(index).hasError('appointmentOverlap') === true);
  }

  hasTimeRangeError(index: number): boolean {
    return this.formSubmitted && 
           (this.appointmentsArray.at(index).get('startTime')?.hasError('outsideWorkingHours') === true ||
            this.appointmentsArray.at(index).get('endTime')?.hasError('outsideWorkingHours') === true);
  }

  // Get appropriate error message for an appointment
  getAppointmentErrorMessage(index: number): string {
    if (this.hasTimeWindowError(index)) {
      return 'Das gewählte Zeitfenster für den Termin muss mindestens 2 Stunden lang sein';
    }
    if (this.hasOverlapError(index)) {
      return 'Dieser Termin überschneidet sich mit einem anderen Termin am selben Tag.';
    }
    return '';
  }

  displayDate(date: Date | string): string {
    if (!date) return '';
    
    const dateObj = date instanceof Date ? date : new Date(date);
    
    // Format as DD.MM.YYYY
    const day = String(dateObj.getDate()).padStart(2, '0');
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const year = dateObj.getFullYear();
    
    return `${day}.${month}.${year}`;
  }
}