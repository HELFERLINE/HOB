import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AddressService } from '../../../core/services/address.service';
import { OptionsComponent } from './options/options.component';
import { serviceOptions } from '../../../core/models/serviceOptions';
import { O2Service } from '../../../core/services/o2.service';

@Component({
  selector: 'app-check-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, OptionsComponent],
  templateUrl: './check-page.component.html',
  styleUrls: ['./check-page.component.css'],
})
export class CheckPageComponent {
  serviceOptions = serviceOptions;

  postalCodeForm!: FormGroup;
  shakeInput = false;
  formSubmitted = false;
  cityName: string | undefined = undefined;
  selectedServiceOption: serviceOptions = serviceOptions.unselected;

  constructor(
    private addressService: AddressService,
    private o2Service: O2Service,
    private fb: FormBuilder
  ) {
    this.createForm();
  }

  createForm(): void {
    
    const formConfig: any = {
      postalCode: ['', [Validators.required, Validators.pattern(/^\d{5}$/)]],
    };
    
    this.postalCodeForm = this.fb.group(formConfig);
  }

  get booking() {
    return this.o2Service.getBooking();
  }

  ngOnInit(): void {
    const savedBooking = this.booking;
    
    if (this.booking.postalCode) {
      this.postalCodeForm.get('postalCode')?.setValue(this.booking.postalCode);
      // Validate postal code and fetch city data
      if (this.booking.postalCode.match(/^\d{5}$/)) {
        this.checkPostalCode().then(() => {
          if (this.cityName) {
            this.saveCity(this.cityName);
          }
        });
      } else if (this.booking.city) {
        this.cityName = this.booking.city;
      }
    }
    else if (savedBooking.postalCode) {
      this.postalCodeForm.get('postalCode')?.setValue(savedBooking.postalCode);
      if (savedBooking.postalCode.match(/^\d{5}$/)) {
        this.checkPostalCode().then(() => {
          if (this.cityName) {
            this.saveCity(this.cityName);
          }
        });
      } else if (savedBooking.city) {
        this.cityName = savedBooking.city;
        this.saveCity(this.cityName);
      }
    }
    
    // Preserve city information if it exists without postal code
    if (!this.booking.postalCode && !savedBooking.postalCode && this.booking.city) {
      this.cityName = this.booking.city;
    }
    
  }

  // Ensures city data is consistently stored at both booking root and address level
  private saveCity(cityName: string): void {
    const currentBooking = this.o2Service.getBooking();
    currentBooking.city = cityName;
    
    if (currentBooking.address) {
      currentBooking.address.city = cityName;
    }
    
    this.o2Service.setBooking(currentBooking);
  }

  async checkPostalCode(): Promise<void> {
    const postalCode = this.postalCodeForm.get('postalCode')?.value;
    if (postalCode && postalCode.match(/^\d{5}$/)) {
      this.cityName = await this.addressService.checkPostalCode(postalCode);
      
      const currentBooking = this.o2Service.getBooking();
      currentBooking.postalCode = postalCode;
      currentBooking.city = this.cityName;
      
      // Ensure data consistency between booking root and address object
      if (currentBooking.address) {
        currentBooking.address.postalCode = postalCode;
        currentBooking.address.city = this.cityName;
      }
      
      this.o2Service.setBooking(currentBooking);
    }
  }

  async onSubmit(): Promise<void> {
    this.formSubmitted = true;
    if (this.postalCodeForm.invalid) {
      return;
    }
    
    await this.checkPostalCode();
    
    const currentBooking = this.o2Service.getBooking();
    
    // Guarantee city data consistency before form submission
    if (this.cityName) {
      currentBooking.city = this.cityName;
      if (currentBooking.address) {
        currentBooking.address.city = this.cityName;
      }
    }
  
    
    this.o2Service.setBooking(currentBooking);
  }

  onFormChange(): void {
    this.formSubmitted = false;
  }
}