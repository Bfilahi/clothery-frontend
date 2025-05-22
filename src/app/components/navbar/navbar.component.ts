import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SearchComponent } from "./search/search.component";
import { LoginStatusComponent } from "./login-status/login-status.component";
import { CartStatusComponent } from "./cart-status/cart-status.component";
import { CommonModule } from '@angular/common';
import { AuthRoleService } from '../../services/auth-role.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule, 
    SearchComponent, 
    LoginStatusComponent,
    CartStatusComponent
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent implements OnInit{

  public isAdmin: boolean = false;

  constructor(private authRole: AuthRoleService){}

  public ngOnInit(): void {
    this.authRole.isAdmin$().subscribe(
      response => this.isAdmin = response
    );
  }

  public onMenuToggle(adminMenu: HTMLElement){
    adminMenu.classList.toggle('toggle');
  }
}