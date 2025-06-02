import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AddressService {

  constructor() { }

  /**
   * Checks the validity or retrieves information based on a postal code.
   * This method reads from an Excel file in the public folder to find the city 
   * associated with the given postal code.
   * 
   * @param postalCode - The postal code to check or process
   * @returns A Promise<string> representing the city associated with the postal code
   */
  async checkPostalCode(postalCode: string): Promise<string> {
    console.log('Checking postal code:', postalCode);
    try {
      // Using fetch to get the Excel file from public folder
      const response = await fetch('PLZ-Liste-Vor-Ort-Service.xlsx');
      
      if (!response.ok) {
        throw new Error('Failed to load postal code data');
      }
      
      // You'll need to install and import a library like xlsx
      // npm install xlsx
      const xlsx = await import('xlsx');
      
      const arrayBuffer = await response.arrayBuffer();
      const workbook = xlsx.read(new Uint8Array(arrayBuffer), { type: 'array' });
      
      // Assuming first sheet contains the data
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      
      // Convert sheet to JSON
      const data = xlsx.utils.sheet_to_json(worksheet);
      
      // Define interface for the row structure
      interface PostalCodeRow {
        PLZ: string | number;
        Name: string;
        [key: string]: any;
      }
      
      // Find the matching postal code entry
      // Ensure postal codes are compared as strings with leading zeros preserved
      const formattedPostalCode = postalCode.padStart(5, '0');
      const match = data.find((row: any) => {
        // Convert row.PLZ to string and ensure it has 5 digits with leading zeros
        const rowPostalCode = typeof row.PLZ === 'number' 
          ? row.PLZ.toString().padStart(5, '0') 
          : (row.PLZ?.toString() || '').padStart(5, '0');
        
        return rowPostalCode === formattedPostalCode;
      }) as PostalCodeRow | undefined;
      
      if (match) {
        return match['Name'] || 'Unknown';
      }
      
      return ' ';
    } catch (error) {
      console.error('Error checking postal code:', error);
      return 'Error retrieving location';
    }
  }
}
