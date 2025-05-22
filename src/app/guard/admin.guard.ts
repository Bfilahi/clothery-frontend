import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '@auth0/auth0-angular';
import { jwtDecode } from 'jwt-decode';
import { CustomJwtPayload } from '../interface/custom-jwt-payload'

export const adminGuard: CanActivateFn = (route, state) => {

  const authService = inject(AuthService);
  const router = inject(Router);

  authService.isAuthenticated$.subscribe(
    response => {
      let isAuthenticated = response;

      if(isAuthenticated){
        authService.getAccessTokenSilently().subscribe(token => {
          const accessToken = jwtDecode<CustomJwtPayload>(token) || '';

          if(accessToken.permissions?.includes('edit-delete:pages'))
            return true;
          else{
            router.navigate(['/']);
            return false;
          }
        });
      }
    }
  );

  return true;
};