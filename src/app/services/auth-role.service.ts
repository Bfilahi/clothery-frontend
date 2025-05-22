import { Injectable } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { jwtDecode } from 'jwt-decode';
import { map, Observable, of, switchMap } from 'rxjs';
import { CustomJwtPayload } from '../interface/custom-jwt-payload';

@Injectable({
  providedIn: 'root'
})
export class AuthRoleService {

  constructor(private authService: AuthService) { }

  public isAdmin$(): Observable<boolean>{
    return this.authService.isAuthenticated$.pipe(
      switchMap(isAuth => {
        if (!isAuth) return of(false);

        return this.authService.getAccessTokenSilently().pipe(
          map(token => {
            const decoded = jwtDecode<CustomJwtPayload>(token);
            return decoded.permissions?.includes('edit-delete:pages') ?? false;
          })
        );
      })
    );
  }

}