import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from "@angular/common/http";
import { httpErrorInterceptor } from "./core/interceptors/http-error.interceptor";

import { RoutesConfig } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';


export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(
      withInterceptors([httpErrorInterceptor])
    ),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(RoutesConfig),
    provideClientHydration(withEventReplay()),
  ],
};
