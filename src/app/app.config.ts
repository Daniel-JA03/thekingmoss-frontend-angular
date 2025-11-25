import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptorInterceptor } from './interceptors/auth.interceptor';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { provideToastr } from 'ngx-toastr';

import { NgxStripeModule } from 'ngx-stripe';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(
      withInterceptors([authInterceptorInterceptor])
    ),
    // configurar NgxStripeModule (Angular Standalone)
    importProvidersFrom(
      BrowserAnimationsModule,
      NgxStripeModule.forRoot('pk_test_51SWiSXFjHofjkUwZkR6bv9OCfMEAX4U0few6lmmsuiMdct96tGrhvkaGmn9Uh6UsLl04KCdG0W8jSSpdbZAPalH700uAEM17Zd')
    ),

    provideToastr()
  ]
};
