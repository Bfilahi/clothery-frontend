import { CommonModule, DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { UserAccountService } from '../../../services/user-account.service';
import { CartService } from '../../../services/cart.service';
import { AuthService } from '@auth0/auth0-angular';




@Component({
  selector: 'app-login-status',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './login-status.component.html',
  styleUrl: './login-status.component.scss'
})
export class LoginStatusComponent implements OnInit {

  public isAuthenticated: boolean = false;
  public userFullname: string = '';
  public isOpen: boolean = false;

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private userAccountService: UserAccountService,
    private cartService: CartService,
    private authService: AuthService
  ){}



  public ngOnInit(): void {

    this.authService.isAuthenticated$.subscribe(
      response => {
        this.isAuthenticated = response;

        if(this.isAuthenticated)
          this.syncUser();
      }
    );

    this.authService.user$.subscribe(
      response => {
        this.userFullname = response?.name!;
      }
    );

    this.userAccountService.isOpen.subscribe(
      data => this.isOpen = data
    );

    this.document.addEventListener('click', (event) =>{
      const target = event.target as HTMLElement;

      if(target.closest('.container'))
        return;

      this.userAccountService.isOpen.next(false);
    });
  }

  private syncUser(): void {
    this.userAccountService.syncUserWithBackend().subscribe({
      error: (error) => {
        console.error('Error syncing user with backend:', error);
      }
    });
  }

  public logIn(){
    this.authService.loginWithRedirect();
  }


  public logOut() {
    this.authService.logout({logoutParams: {returnTo: this.document.location.origin}});
  }

  public display(){
    this.cartService.isOpen.next(false);
    this.userAccountService.isOpen.next(true);
    this.isOpen = true;
  }

  public closeQuickCart(){
    this.isOpen = false;
    this.userAccountService.isOpen.next(false);
  }
}