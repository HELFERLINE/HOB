import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { O2Service } from '../../../../core/services/o2.service';
import { serviceOptions } from '../../../../core/models/serviceOptions';
import { AddressService } from '../../../../core/services/address.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-address',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './address.component.html',
  styleUrls: ['./address.component.css', '../booking.component.css']
})
export class AddressComponent implements OnInit, OnDestroy {
  addressForm: FormGroup;
  formSubmitted = false;
  postalCodeError = false;
  private subscriptions: Subscription[] = [];

  get booking() {
    return this.o2Service.getBooking();
  }

  constructor(
    private fb: FormBuilder,
    private o2Service: O2Service,
    private addressService: AddressService
  ) {
    // Custom validator to check for whitespace-only input
    const noWhitespaceValidator = (control: AbstractControl): ValidationErrors | null => {
      if (control.value && control.value.trim().length === 0) {
        return { 'whitespace': true };
      }
      return null;
    };

    // Custom validator for names (only letters with international support, spaces, hyphens, apostrophes, minimum 2 chars)
    const nameValidator = (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null;
      
      const trimmedValue = control.value.trim();
      if (trimmedValue.length < 2) {
        return { 'minlength': { requiredLength: 2, actualLength: trimmedValue.length } };
      }
      
      // Allow Unicode letters (including accented characters), spaces, hyphens, and apostrophes
      // \p{L} matches any Unicode letter from any language
      const namePattern = /^[\p{L}\s\-']+$/u;
      if (!namePattern.test(trimmedValue)) {
        return { 'invalidName': true };
      }
      
      return null;
    };

    // Custom validator for street addresses (minimum 5 chars, allow letters, numbers, spaces, common symbols)
    const addressValidator = (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null;
      
      const trimmedValue = control.value.trim();
      if (trimmedValue.length < 5) {
        return { 'minlength': { requiredLength: 5, actualLength: trimmedValue.length } };
      }
      
      // Allow Unicode letters, numbers, spaces, and common address symbols
      const addressPattern = /^[\p{L}0-9\s\-.,/]+$/u;
      if (!addressPattern.test(trimmedValue)) {
        return { 'invalidAddress': true };
      }
      
      return null;
    };

    // Custom validator for house numbers (minimum 1 char, alphanumeric with common symbols)
    const houseNumberValidator = (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null;
      
      const trimmedValue = control.value.trim();
      if (trimmedValue.length < 1) {
        return { 'required': true };
      }
      
      // Allow Unicode letters, numbers, and common house number symbols
      const housePattern = /^[\p{L}0-9\s\-/]+$/u;
      if (!housePattern.test(trimmedValue)) {
        return { 'invalidHouseNumber': true };
      }
      
      return null;
    };

    // Custom validator for city names (minimum 2 chars, similar to names but allow more symbols)
    const cityValidator = (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null;
      
      const trimmedValue = control.value.trim();
      if (trimmedValue.length < 2) {
        return { 'minlength': { requiredLength: 2, actualLength: trimmedValue.length } };
      }
      
      // Allow Unicode letters, spaces, hyphens, apostrophes, and dots
      const cityPattern = /^[\p{L}\s\-'.]+$/u;
      if (!cityPattern.test(trimmedValue)) {
        return { 'invalidCity': true };
      }
      
      return null;
    };

    // Custom validator for company names (minimum 2 chars, allow business-appropriate characters)
    const companyValidator = (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null;
      
      const trimmedValue = control.value.trim();
      if (trimmedValue.length < 2) {
        return { 'minlength': { requiredLength: 2, actualLength: trimmedValue.length } };
      }
      
      // Allow Unicode letters, numbers, spaces, and common business symbols
      const companyPattern = /^[\p{L}0-9\s\-'.,&()]+$/u;
      if (!companyPattern.test(trimmedValue)) {
        return { 'invalidCompany': true };
      }
      
      return null;
    };

    // Custom validator for UID (specific format validation)
    const uidValidator = (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null;
      
      const trimmedValue = control.value.trim();
      // UID should start with country code and have specific format
      const uidPattern = /^[A-Z]{2}[A-Z0-9]{8,}$/;
      if (!uidPattern.test(trimmedValue)) {
        return { 'invalidUID': true };
      }
      
      return null;
    };

    this.addressForm = this.fb.group({
      salutation: ['', Validators.required],
      title: [''],
      firstName: ['', [Validators.required, nameValidator]],
      lastName: ['', [Validators.required, nameValidator]],
      street: ['', [Validators.required, addressValidator]],
      houseNumber: ['', [Validators.required, houseNumberValidator]],
      postalCode: ['', [Validators.required, Validators.pattern(/^\d{5}$/), noWhitespaceValidator]],
      city: ['', [Validators.required, cityValidator]],
      // B2B specific fields (initially without validators)
      companyName: [''],
      contactPerson: [''],
      billingEmail: [''],
      vatRequired: [''],
      uid: ['']
    });

    // Subscribe to postal code value changes
    const postalCodeControl = this.addressForm.get('postalCode');
    if (postalCodeControl) {
      this.subscriptions.push(
        postalCodeControl.valueChanges.subscribe(value => {
          if (value && value.length >= 4) {
            this.checkPostalCode();
          }
          // Update the booking with the new postalCode value
          this.updateBookingField('postalCode', value);
        })
      );
    }

    // Subscribe to vatRequired changes to add/remove UID validation and update booking
    const vatRequiredControl = this.addressForm.get('vatRequired');
    if (vatRequiredControl) {
      this.subscriptions.push(
        vatRequiredControl.valueChanges.subscribe(value => {
          const uidControl = this.addressForm.get('uid');
          if (value === 'Ja') {
            uidControl?.setValidators([Validators.required]);
          } else {
            uidControl?.clearValidators();
          }
          uidControl?.updateValueAndValidity();
          
          // Update the booking with the new vatRequired value
          this.updateBookingField('vatRequired', value);
        })
      );
    }

    // Subscribe to all other form fields to update booking in real-time
    const formFields = [
      'salutation', 'title', 'firstName', 'lastName', 'street', 'houseNumber', 
      'city', 'companyName', 'contactPerson', 'billingEmail', 'uid'
    ];

    formFields.forEach(field => {
      const control = this.addressForm.get(field);
      if (control) {
        this.subscriptions.push(
          control.valueChanges.subscribe(value => {
            this.updateBookingField(field, value);
          })
        );
      }
    });
  }

  ngOnInit(): void {
    // Set conditional validators for B2B fields
    this.setB2BValidators();

    if (this.booking) {
      // Get postal code and trim it to handle whitespace
      let postalCode = this.booking.address?.postalCode || this.booking.postalCode || '';
      postalCode = postalCode.trim();
      
      // Prefill all address fields
      this.addressForm.patchValue({
        salutation: this.booking.address?.salutation || '',
        title: this.booking.address?.title || '',
        firstName: this.booking.address?.firstName || '',
        lastName: this.booking.address?.lastName || '',
        street: this.booking.address?.street || '',
        houseNumber: this.booking.address?.houseNumber || '',
        postalCode: postalCode,
        city: this.booking.address?.city && this.booking.address.city !== ' ' ? 
          this.booking.address.city : (this.booking.city || ''),
        // B2B fields
        companyName: this.booking.address?.companyName || '',
        contactPerson: this.booking.address?.contactPerson || '',
        billingEmail: this.booking.address?.billingEmail || '',
        vatRequired: this.booking.address?.vatRequired || '',
        uid: this.booking.address?.uid || ''
      }, { emitEvent: false }); // Don't trigger valueChanges when initializing
      
      // If postalCode is valid but city is empty or just a space, check postal code immediately
      if (postalCode && postalCode.match(/^\d{5}$/) && 
         (!this.addressForm.get('city')?.value || this.addressForm.get('city')?.value === ' ')) {
        this.checkPostalCode().then(isValid => {
          if (isValid) {
            console.log('City updated during initialization:', this.addressForm.get('city')?.value);
            // Explicitly update the booking object with the city value after postal code check
            this.updateBookingField('city', this.addressForm.get('city')?.value || '');
          }
        });
      }
      
      // Always ensure the city is properly saved in the booking object
      const city = this.addressForm.get('city')?.value;
      if (city && city !== ' ') {
        this.updateBookingField('city', city);
      }

      // Subscribe to city value changes to ensure city is always up-to-date in booking
      const cityControl = this.addressForm.get('city');
      if (cityControl) {
        this.subscriptions.push(
          cityControl.valueChanges.subscribe(value => {
            this.updateBookingField('city', value);
          })
        );
      }
    }
  }

  ngOnDestroy(): void {
    // Clean up all subscriptions to prevent memory leaks
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  // Update a specific field in the booking object
  private updateBookingField(field: string, value: any): void {
    if (!this.booking.address) {
      this.booking.address = {
        salutation: '',
        firstName: '',
        lastName: '',
        street: '',
        houseNumber: '',
        postalCode: '',
        city: ''
      };
    }
    
    // Check if field exists in Address interface before updating
    if (field in this.booking.address || field === 'companyName' || 
        field === 'contactPerson' || field === 'billingEmail' || 
        field === 'vatRequired' || field === 'uid') {
      
      // Update the field in the booking.address object
      (this.booking.address as any)[field] = value;
      
      // For city field specifically, also update at root level for backward compatibility
      if (field === 'city') {
        this.booking.city = value;
      }
      
      // Similarly for postalCode - update at both levels
      if (field === 'postalCode') {
        this.booking.postalCode = value;
      }
      
      // Special handling for vatRequired field to ensure consistency
      if (field === 'vatRequired') {
        // If vatRequired is changed to 'Nein', also clear UID
        if (value === 'Nein') {
          (this.booking.address as any)['uid'] = '';
          this.addressForm.get('uid')?.setValue('', { emitEvent: false });
        }
      }
      
      // Save the updated booking 
      this.o2Service.setBooking(this.booking);
      
      // Log for debugging
      console.log(`Updated booking field ${field} to ${value}`);
    }
  }

  // Set validators for B2B specific fields based on isB2B status
  setB2BValidators(): void {
    if (this.booking.isB2B === true) {
      // Custom validator for company names
      const companyValidator = (control: AbstractControl): ValidationErrors | null => {
        if (!control.value) return null;
        
        const trimmedValue = control.value.trim();
        if (trimmedValue.length < 2) {
          return { 'minlength': { requiredLength: 2, actualLength: trimmedValue.length } };
        }
        
        const companyPattern = /^[\p{L}0-9\s\-'.,&()]+$/u;
        if (!companyPattern.test(trimmedValue)) {
          return { 'invalidCompany': true };
        }
        
        return null;
      };

      // Custom validator for contact person names
      const nameValidator = (control: AbstractControl): ValidationErrors | null => {
        if (!control.value) return null;
        
        const trimmedValue = control.value.trim();
        if (trimmedValue.length < 2) {
          return { 'minlength': { requiredLength: 2, actualLength: trimmedValue.length } };
        }
        
        const namePattern = /^[\p{L}\s\-']+$/u;
        if (!namePattern.test(trimmedValue)) {
          return { 'invalidName': true };
        }
        
        return null;
      };

      // Custom validator for UID
      const uidValidator = (control: AbstractControl): ValidationErrors | null => {
        if (!control.value) return null;
        
        const trimmedValue = control.value.trim();
        const uidPattern = /^[A-Z]{2}[A-Z0-9]{8,}$/;
        if (!uidPattern.test(trimmedValue)) {
          return { 'invalidUID': true };
        }
        
        return null;
      };

      this.addressForm.get('companyName')?.setValidators([Validators.required, companyValidator]);
      this.addressForm.get('contactPerson')?.setValidators([Validators.required, nameValidator]);
      this.addressForm.get('billingEmail')?.setValidators([
        Validators.required, 
        Validators.email,
        Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)
      ]);
      this.addressForm.get('vatRequired')?.setValidators([Validators.required]);
      
      // Update UID based on current vatRequired value
      if (this.addressForm.get('vatRequired')?.value === 'Ja') {
        this.addressForm.get('uid')?.setValidators([Validators.required, uidValidator]);
      }
    } else {
      // Clear validators if not B2B
      this.addressForm.get('companyName')?.clearValidators();
      this.addressForm.get('contactPerson')?.clearValidators();
      this.addressForm.get('billingEmail')?.clearValidators();
      this.addressForm.get('vatRequired')?.clearValidators();
      this.addressForm.get('uid')?.clearValidators();
    }

    // Update validity of all controls
    this.addressForm.get('companyName')?.updateValueAndValidity();
    this.addressForm.get('contactPerson')?.updateValueAndValidity();
    this.addressForm.get('billingEmail')?.updateValueAndValidity();
    this.addressForm.get('vatRequired')?.updateValueAndValidity();
    this.addressForm.get('uid')?.updateValueAndValidity();
  }

  saveAddress(): void {
    this.formSubmitted = true;
    if (this.addressForm.valid && !this.postalCodeError) {
      const formValue = this.addressForm.value;
      
      if (!this.booking.address) {
        this.booking.address = {
          salutation: '',
          firstName: '',
          lastName: '',
          street: '',
          houseNumber: '',
          postalCode: '',
          city: ''
        };
      }
      
      // Synchronize city data between root booking and address object
      if (this.booking.city && (!this.booking.address.city || this.booking.address.city === '')) {
        this.booking.address.city = this.booking.city;
        formValue.city = this.booking.city;
        this.addressForm.get('city')?.setValue(this.booking.city, { emitEvent: false });
      }
      
      // Transfer all form values to booking object
      Object.keys(formValue).forEach(key => {
        if (this.booking.address && (key in this.booking.address || key === 'companyName' || 
            key === 'contactPerson' || key === 'billingEmail' || 
            key === 'vatRequired' || key === 'uid')) {
          (this.booking.address as any)[key] = formValue[key];
          
          // Maintain data consistency for city and postal code
          if (key === 'city') {
            this.booking.city = formValue[key];
          }
          if (key === 'postalCode') {
            this.booking.postalCode = formValue[key];
          }
        }
      });
      
      // Final data consistency check
      if (this.booking.city && (!this.booking.address.city || this.booking.address.city === '')) {
        this.booking.address.city = this.booking.city;
      }
      
      this.o2Service.setBooking(this.booking);
    }
  }
  
  get currentStep(): number {
    return this.o2Service.getCurrentStep();
  }
  
  goBack(): void {
    if (this.currentStep > 1) {
      this.o2Service.setCurrentStep(this.currentStep - 1);
    } else {
      this.booking.selectedService = serviceOptions.unselected;
      this.o2Service.setBooking(this.booking);
    }
  }
  
  async checkPostalCode(): Promise<boolean> {
    const postalCodeRaw = this.addressForm.get('postalCode')?.value;
    const postalCode = postalCodeRaw ? postalCodeRaw.trim() : '';
    
    if (postalCode && postalCode.match(/^\d{4,6}$/)) {
      const cityResult = await this.addressService.checkPostalCode(postalCode);
      if (cityResult === ' ') {
        this.postalCodeError = true;
        // Clear city when postal code is invalid
        this.addressForm.get('city')?.setValue('');
        this.updateBookingField('city', '');
        return false;
      } else {
        this.postalCodeError = false;
        this.addressForm.get('city')?.setValue(cityResult);
        // Explicitly update both form and booking object
        this.updateBookingField('city', cityResult);
        // Make sure the booking object change persists immediately
        this.o2Service.setBooking(this.booking);
        return true;
      }
    } else {
      // Reset error state when postal code is empty or incomplete
      if (!postalCode || postalCode.length < 4) {
        this.postalCodeError = false;
      }
      return false;
    }
  }
  
  async goForward(): Promise<void> {
    this.formSubmitted = true;
    
    await this.checkPostalCode();
    
    if (this.addressForm.valid && !this.postalCodeError) {
      this.saveAddress();
      this.o2Service.setCurrentStep(this.currentStep + 1);
    } else {
      this.scrollToFirstInvalidControl();
    }
  }
  
  scrollToFirstInvalidControl(): void {
    const firstInvalidControl = document.querySelector('.ng-invalid');
    if (firstInvalidControl) {
      firstInvalidControl.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }
  
  get isFormValid(): boolean {
    return this.addressForm.valid && !this.postalCodeError;
  }
}
