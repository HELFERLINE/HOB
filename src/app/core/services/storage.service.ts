import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor() { }

  /**
   * Stores a value in localStorage with the specified key
   * @param key Storage key
   * @param value Value to store
   */
  put<T>(key: string, value: T): void {
    try {
      const stringValue = JSON.stringify(value);
      localStorage.setItem(key, stringValue);
      console.log(`Stored value for key: ${key}`);
    } catch (error) {
      console.error(`Error storing value for key ${key}:`, error);
    }
  }

  /**
   * Retrieves a value from localStorage using the specified key
   * @param key Storage key
   * @returns The stored value, or null if not found
   */
  get<T>(key: string): T | null {
    try {
      const item = localStorage.getItem(key);
      if (item === null) {
        return null;
      }
      
      const value = JSON.parse(item) as T;
      return value;
    } catch (error) {
      console.error(`Error retrieving value for key ${key}:`, error);
      return null;
    }
  }

  /**
   * Removes a value from localStorage
   * @param key Storage key to remove
   */
  remove(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing value for key ${key}:`, error);
    }
  }

  /**
   * Clears all values from localStorage
   */
  clear(): void {
    try {
      localStorage.clear();
    } catch (error) {
      console.error('Error clearing localStorage:', error);
    }
  }
}
