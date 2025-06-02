import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';
import { StorageKeys } from '../models/storageKeys';
import { ColorThemes } from '../models/colorThemes';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  
  private defaultColorTheme: ColorThemes = ColorThemes.Light;
  private currentColorTheme: ColorThemes = ColorThemes.None;

  constructor(private storageService: StorageService) {}

  detectModeFromWindow(): ColorThemes {
    let storageTheme = this.storageService.get<ColorThemes>(StorageKeys.Theme);

    if (storageTheme !== null && storageTheme !== undefined) {
      return storageTheme;
    }

    if (typeof window === 'undefined') {
      return this.defaultColorTheme;
    }

    let detectedColorTheme = this.defaultColorTheme;
    const isDarkMode =
      window.matchMedia &&
      window.matchMedia('(prefers-color-scheme: dark)').matches;
    const isLightMode =
      window.matchMedia &&
      window.matchMedia('(prefers-color-scheme: light)').matches;

    if (isDarkMode) {
      detectedColorTheme = ColorThemes.Dark;
    } else if (isLightMode) {
      detectedColorTheme = ColorThemes.Light;
    } 


    return detectedColorTheme;
  }

  setMode(newTheme: ColorThemes): void {
    this.currentColorTheme = newTheme;

    const darkModeElement = document.querySelector('.dark-mode .material-icons-sharp:nth-child(2)');
    const lightModeElement = document.querySelector('.dark-mode .material-icons-sharp:nth-child(1)');

    if (newTheme === ColorThemes.Dark) {
      document.documentElement.classList.add('dark-mode-theme');
      darkModeElement?.classList.add('active');
      lightModeElement?.classList.remove('active');
    } else {
      document.documentElement.classList.remove('dark-mode-theme');
      lightModeElement?.classList.add('active');
      darkModeElement?.classList.remove('active');
    }

    this.storageService.put(StorageKeys.Theme, newTheme);
    // todo: save theme in profile
  }

  toggleMode() {
    if (this.currentColorTheme === ColorThemes.Dark) {
      this.setMode(ColorThemes.Light);
    } else {
      this.setMode(ColorThemes.Dark);
  }}
}
