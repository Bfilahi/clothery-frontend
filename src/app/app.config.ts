import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { HTTP_INTERCEPTORS, provideHttpClient, withFetch, withInterceptorsFromDi } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideToastr } from 'ngx-toastr';

import { provideAuth0 } from '@auth0/auth0-angular';
import { AuthInterceptorService } from './services/auth-interceptor.service';
import { environment } from '../environments/environment.development';




export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes), 
    provideHttpClient(withFetch(), withInterceptorsFromDi()),
    provideAnimations(),
    provideToastr(),

    provideAuth0({
      domain: environment.OKTA_DOMAIN,
      clientId: environment.OKTA_CLIENT_ID,
      useRefreshTokens: true,
      cacheLocation: 'localstorage',
      authorizationParams: {
        redirect_uri: window.location.origin,
		audience: environment.OKTA_AUDIENCE,
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
