import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { HTTP_INTERCEPTORS, provideHttpClient, withFetch, withInterceptorsFromDi } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideToastr } from 'ngx-toastr';

import { provideAuth0 } from '@auth0/auth0-angular';
import { AuthInterceptorService } from './services/auth-interceptor.service';




export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes), 
    provideHttpClient(withFetch(), withInterceptorsFromDi()),
    provideAnimations(),
    provideToastr(),

    provideAuth0({
      domain: 'dev-whcz4g0gwv3v4vle.eu.auth0.com',
      clientId: 'BlDvveqd10pHrHAYMfuC4ejwFsFixniW',
      useRefreshTokens: true,
      cacheLocation: 'localstorage',
      authorizationParams: {
        redirect_uri: window.location.origin,
        audience: 'https://clothery-app',
        scope: 'openid profile email'
      }
    }),

    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptorService,
      multi: true
    }
  ]
};
