import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, map, Observable, of, switchMap } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '@auth0/auth0-angular';
import { UserProfile } from '../interface/user-profile';

@Injectable({
  providedIn: 'root'
})
export class UserAccountService {

  public isLoggedIn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  public isOpen: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  private apiUrl = environment.BASE_URL;
  private userSyncUrl = `${this.apiUrl}/user/sync`;
  
  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }


  // Syncs the Auth0 user with the backend database
  public syncUserWithBackend(): Observable<any> {
    return this.authService.user$.pipe(
      map(user => {
        if (!user) {
          throw new Error('User not authenticated');
        }
        
        // Extract user information from Auth0 user
        const userProfile: UserProfile = {
          auth0Id: user.sub!,
          email: user.email || '',
          // getting first and last name from name by splitting
          firstName: user.given_name || (user.name ? user.name.split(' ')[0] : ''),
          lastName: user.family_name || (user.name && user.name.split(' ').length > 1 ? 
                      user.name.split(' ').slice(1).join(' ') : '')
        };
        
        return userProfile;
      }),
      switchMap(userProfile => this.http.post(this.userSyncUrl, userProfile)),
      catchError(error => {
        console.error('Error syncing user with backend:', error);
        return of({ status: 'error', message: error.message });
      })
    );
  }

}
