import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule, DOCUMENT } from '@angular/common';
import { AuthService } from '@auth0/auth0-angular';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-user-account',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './user-account.component.html',
  styleUrl: './user-account.component.scss'
})
export class UserAccountComponent implements OnInit{

  public userFullName: string = '';

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private authService: AuthService
  ){}

  public ngOnInit(): void {
    this.authService.user$.subscribe(
      response => this.userFullName = response?.name || ''
    );
  }

  public exitApp(){
    this.authService.logout({logoutParams: {returnTo: this.document.location.origin}})
  }

}
