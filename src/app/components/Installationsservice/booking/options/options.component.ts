import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { O2Service } from '../../../../core/services/o2.service';
import { serviceOptions } from '../../../../core/models/serviceOptions';

@Component({
  selector: 'app-options',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './options.component.html',
  styleUrls: ['./options.component.css', '../booking.component.css']
})
export class OptionsComponent implements OnInit {
  optionsForm!: FormGroup;

  // Map device names to IDs
  deviceIdMap: {[key: string]: number} = {
    'windows': 1,
    'mac': 2,
    'iDevice': 3,
    'androidPhone': 4,
    'androidTablet': 5,
    'printer': 6,
    'homeTheater': 7,
    'smartHome': 8,
    'other': 9
  };

  // Map printer device names to IDs
  printerDeviceIdMap: {[key: string]: number} = {
    'windowsComputer': 101,
    'appleMac': 102,
    'androidSmartphone': 103,
    'appleDevice': 104,
    'andere': 105,
    'keine': 106
  };

  constructor(
    private o2Service: O2Service,
    private fb: FormBuilder
  ) { }

  get booking() {
    return this.o2Service.getBooking();
  }

  ngOnInit(): void {
    const currentBooking = this.o2Service.getBooking();
    
    this.optionsForm = this.fb.group({
      serviceOption: [currentBooking.needsExpertHelp ? 'expert' : 'basic'],
      devices: this.fb.group({
        windows: [false],
        mac: [false],
        iDevice: [false],
        androidPhone: [false],
        androidTablet: [false],
        printer: [false],
        homeTheater: [false],
        smartHome: [false],
        other: [false],
        description: [''],

        // Printer devices
        windowsComputer: [false],
        appleMac: [false],
        androidSmartphone: [false],
        appleDevice: [false],
        andere: [false],
        keine: [false],
      })
    });

    // Set values if they exist in current booking
    if (currentBooking.selectedDeviceIds && currentBooking.selectedDeviceIds.length > 0) {
      const deviceGroup = this.optionsForm.get('devices') as FormGroup;
      currentBooking.selectedDeviceIds.forEach(deviceId => {
      const controlName = this.getControlNameFromId(deviceId);
      if (controlName && deviceGroup.get(controlName)) {
        deviceGroup.get(controlName)?.setValue(true);
      }
      });
      
      // Prefill description if it exists in the booking
      if (currentBooking.printerDetails?.description) {
      deviceGroup.get('description')?.setValue(currentBooking.printerDetails.description);
      }
    }

    if (currentBooking.printerDetails && currentBooking.printerDetails.deviceIds && currentBooking.printerDetails.deviceIds.length > 0) {
      // Set printer checkbox to true if any printer device is selected
      this.optionsForm.get('devices')?.get('printer')?.setValue(true);
      
      // Update printer device checkboxes
      const deviceGroup = this.optionsForm.get('devices') as FormGroup;
      currentBooking.printerDetails.deviceIds.forEach(deviceId => {
        const controlName = this.getControlNameFromId(Number(deviceId), true);
        if (controlName && deviceGroup.get(controlName)) {
          deviceGroup.get(controlName)?.setValue(true);
        }
      });
      
      if (currentBooking.printerDetails.description) {
        deviceGroup.get('description')?.setValue(currentBooking.printerDetails.description);
      }
    }

    // Add listeners for form changes
    this.optionsForm.get('serviceOption')?.valueChanges.subscribe((value: string) => {
      this.updateValidators();
      this.ensureOnlyOnePrinterDeviceSelected();
    });

    this.optionsForm.get('devices')?.get('printer')?.valueChanges.subscribe((checked: boolean) => {
      this.updateValidators();
    });

    // Add listeners for device selection changes
    const deviceGroup = this.optionsForm.get('devices') as FormGroup;
    Object.keys(deviceGroup.controls).forEach(key => {
      if (['windowsComputer', 'appleMac', 'androidSmartphone', 'appleDevice', 'andere', 'keine'].includes(key)) {
        deviceGroup.get(key)?.valueChanges.subscribe((checked: boolean) => {
          if (checked) {
            this.ensureOnlyOnePrinterDeviceSelected(key);
          }
          this.updateBookingPrinterDevices();
        });
      } else if (key === 'description') {
        // Add listener for description changes
        deviceGroup.get(key)?.valueChanges.subscribe(() => {
          this.updateBookingPrinterDevices();
        });
      } else {
        deviceGroup.get(key)?.valueChanges.subscribe((checked: boolean) => {
          this.updateBookingDevices();
        });
      }
    });

    // Set default value to basic if not already set
    if (!currentBooking.needsExpertHelp) {
      this.optionsForm.get('serviceOption')?.setValue('basic');
    }

    // Initialize validators
    this.updateValidators();
  }

  private ensureOnlyOnePrinterDeviceSelected(selectedKey?: string): void {
    if (!this.showPrinterOptions) return;
    
    const printerDeviceKeys = ['windowsComputer', 'appleMac', 'androidSmartphone', 'appleDevice', 'andere', 'keine'];
    const deviceGroup = this.optionsForm.get('devices') as FormGroup;
    
    if (selectedKey) {
      // If a key was selected, uncheck all others
      printerDeviceKeys.forEach(key => {
        if (key !== selectedKey && deviceGroup.get(key)?.value) {
          deviceGroup.get(key)?.setValue(false, { emitEvent: false });
        }
      });
    } else {
      // Check if more than one is selected and keep only the first one
      const selectedKeys = printerDeviceKeys.filter(key => deviceGroup.get(key)?.value);
      if (selectedKeys.length > 1) {
        selectedKeys.slice(1).forEach(key => {
          deviceGroup.get(key)?.setValue(false, { emitEvent: false });
        });
      }
    }
  }

  private getControlNameFromId(id: number, isPrinter: boolean = false): string | null {
    const map = isPrinter ? this.printerDeviceIdMap : this.deviceIdMap;
    for (const [key, value] of Object.entries(map)) {
      if (value === id) {
        return key;
      }
    }
    return null;
  }

  private getControlName(deviceName: string): string | null {
    // Convert device name to form control name
    const nameMap: {[key: string]: string} = {
      'Windows Computer': 'windows',
      'Apple Mac': 'mac',
      'iPhone, iPad oder iPod': 'iDevice',
      'Android Smartphone': 'androidPhone',
      'Android Tablet': 'androidTablet',
      'Drucker, Scanner oder Faxgerät': 'printer',
      'HiFi oder Heimkinosystem': 'homeTheater',
      'Smarthome': 'smartHome',
      'Andere': 'other',
      'Windows Computer oder Tablet': 'windowsComputer',
      'Android Smartphone, z.B. von Samsung, LG, Huawei, HTC': 'androidSmartphone',
      'Apple iPhone, iPad oder iPod Touch': 'appleDevice',
      'Keine, das Problem tritt unabhängig von einem Gerät auf': 'keine'
    };
    return nameMap[deviceName] || null;
  }

  private updateValidators(): void {
    const serviceOptionControl = this.optionsForm.get('serviceOption');
    const deviceGroup = this.optionsForm.get('devices') as FormGroup;
    
    if (!serviceOptionControl || !deviceGroup) {
      return;
    }
    
    // Always make description required with minimum 20 characters
    deviceGroup.get('description')?.setValidators([Validators.required, Validators.minLength(20)]);
    deviceGroup.get('description')?.updateValueAndValidity();
  }

  get currentStep(): number {
    return this.o2Service.getCurrentStep();
  }


  get showPrinterOptions(): boolean {
    return this.optionsForm.get('devices')?.get('printer')?.value;
  }

  private updateBookingDevices(): void {    
    const formValue = this.optionsForm.value;
    const currentBooking = this.o2Service.getBooking();
    
    // Get selected device IDs
    currentBooking.selectedDeviceIds = Object.entries(formValue.devices)
      .filter(([key, value]) => value === true && 
              key !== 'description' &&
              !['windowsComputer', 'appleMac', 'androidSmartphone', 'appleDevice', 'andere', 'keine'].includes(key))
      .map(([key, value]) => this.deviceIdMap[key]);
    
    // Always update description regardless of printer selection
    if (!currentBooking.printerDetails) {
      currentBooking.printerDetails = { deviceIds: [], description: '' };
    }
    currentBooking.printerDetails.description = formValue.devices.description || '';
    
    this.o2Service.setBooking(currentBooking);
  }

  private updateBookingPrinterDevices(): void {
    if (!this.showPrinterOptions) return;
    
    const formValue = this.optionsForm.value;
    const currentBooking = this.o2Service.getBooking();
    
    if (!currentBooking.printerDetails) {
      currentBooking.printerDetails = { deviceIds: [], description: '' };
    }
    
    // Get selected printer device IDs from devices group
    const devices = formValue.devices;
    const printerDeviceIds = ['windowsComputer', 'appleMac', 'androidSmartphone', 'appleDevice', 'andere', 'keine']
      .filter(key => devices[key] === true)
      .map(key => this.printerDeviceIdMap[key].toString());
    
    currentBooking.printerDetails.deviceIds = printerDeviceIds;
    // Always update the description even if no printer device is selected
    currentBooking.printerDetails.description = devices.description || '';
    
    this.o2Service.setBooking(currentBooking);
  }

  goBack(): void {
    if (this.currentStep > 1) {
      this.o2Service.setCurrentStep(this.currentStep - 1);
    } else {
      const currentBooking = this.o2Service.getBooking();
      currentBooking.selectedService = serviceOptions.unselected;
      this.o2Service.setBooking(currentBooking);
    }
  }

  goForward(): void {
    if (!this.isFormValid()) {
      // Mark all controls as touched to show validation errors
      this.markFormGroupTouched(this.optionsForm);
      return;
    }

    // Save form data to booking
    const formValue = this.optionsForm.value;
    const currentBooking = this.o2Service.getBooking();
    
    currentBooking.needsExpertHelp = formValue.serviceOption === 'expert';
    
    if (currentBooking.needsExpertHelp) {
      // Get selected device IDs
      currentBooking.selectedDeviceIds = Object.entries(formValue.devices)
        .filter(([key, value]) => value === true && 
                key !== 'description' && 
                !['windowsComputer', 'appleMac', 'androidSmartphone', 'appleDevice', 'andere', 'keine'].includes(key))
        .map(([key, value]) => this.deviceIdMap[key]);
      
      // Always create printerDetails if in expert mode to save description
      currentBooking.printerDetails = {
        deviceIds: [],
        description: formValue.devices.description || ''
      };
      
      // Get printer device IDs if printer is selected
      if (formValue.devices.printer) {
        currentBooking.printerDetails.deviceIds = ['windowsComputer', 'appleMac', 'androidSmartphone', 'appleDevice', 'andere', 'keine']
          .filter(key => formValue.devices[key] === true)
          .map(key => this.printerDeviceIdMap[key].toString());
      }
    } else {
      // Remove expert help related data if basic option selected
      delete currentBooking.selectedDeviceIds;
      delete currentBooking.printerDetails;
    }

    this.o2Service.setBooking(currentBooking);
    this.o2Service.setCurrentStep(this.currentStep + 1);
  }

  isFormValid(): boolean {
    if (this.optionsForm.invalid) {
      return false;
    }
    
    const devices = this.optionsForm.get('devices')?.value;
    if (!devices) {
      return false;
    }
    
    // Check if at least one device is selected (excluding description and printer sub-options)
    const anyDeviceSelected = Object.entries(devices)
      .filter(([key, value]) => 
        value === true && 
        key !== 'description' && 
        !['windowsComputer', 'appleMac', 'androidSmartphone', 'appleDevice', 'andere', 'keine'].includes(key)
      ).length > 0;
      
    if (!anyDeviceSelected) {
      return false;
    }
    
    // If printer is selected, check if at least one printer device is selected
    if (devices.printer) {
      const printerDeviceSelected = ['windowsComputer', 'appleMac', 'androidSmartphone', 'appleDevice', 'andere', 'keine']
        .filter(key => devices[key] === true).length > 0;
        
      if (!printerDeviceSelected) {
        return false;
      }
    }
    
    // Always check if description meets minimum length requirement
    if (!devices.description || devices.description.trim().length < 20) {
      return false;
    }
    
    return true;
  }

  private getDeviceName(controlName: string): string {
    const nameMap: { [key: string]: string } = {
      'windows': 'Windows Computer',
      'mac': 'Apple Mac',
      'iDevice': 'iPhone, iPad oder iPod',
      'androidPhone': 'Android Smartphone',
      'androidTablet': 'Android Tablet',
      'printer': 'Drucker, Scanner oder Faxgerät',
      'homeTheater': 'HiFi oder Heimkinosystem',
      'smartHome': 'Smarthome',
      'other': 'Andere',
      'windowsComputer': 'Windows Computer oder Tablet',
      'appleMac': 'Apple Mac',
      'androidSmartphone': 'Android Smartphone, z.B. von Samsung, LG, Huawei, HTC',
      'appleDevice': 'Apple iPhone, iPad oder iPod Touch',
      'andere': 'Andere',
      'keine': 'Keine, das Problem tritt unabhängig von einem Gerät auf'
    };
    return nameMap[controlName] || controlName;
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  // Updated to check if at least one printer device is selected (not exactly one)
  get isPrinterDeviceSelected(): boolean {
    if (!this.showPrinterOptions) return true;
    
    const devices = this.optionsForm.get('devices')?.value;
    if (!devices) return false;
    
    const selectedCount = ['windowsComputer', 'appleMac', 'androidSmartphone', 'appleDevice', 'andere', 'keine']
      .filter(key => devices[key] === true).length;
      
    return selectedCount > 0;
  }

  get hasAnyDeviceSelected(): boolean {
    const devices = this.optionsForm.get('devices')?.value;
    if (!devices) return false;
    
    return Object.entries(devices)
      .filter(([key, value]) => 
        value === true && 
        key !== 'description' && 
        !['windowsComputer', 'appleMac', 'androidSmartphone', 'appleDevice', 'andere', 'keine'].includes(key)
      ).length > 0;
  }
}
