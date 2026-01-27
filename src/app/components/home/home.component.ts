import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ProductCategoryComponent } from "../product-category/product-category.component";
import { RouterModule } from '@angular/router';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';
import { Hero } from '../../model/hero';
import { Observable } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';




@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, ProductCategoryComponent, RouterModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit{

  private baseUrl: string = environment.BASE_URL;
  
  public buttons = [
    {
      name: "SHOP MEN'S",
      gender: 'men'
    },
    {
      name: "SHOP WOMEN'S",
      gender: 'women'
    }
  ];

  public leftImage: string = '';
  public rightImage!: string;


  constructor(private httpClient: HttpClient, private spinnerService: NgxSpinnerService){}


  public ngOnInit(): void {
    this.spinnerService.show();
    this.getHeroImages().subscribe({
      next: (response: Hero) => {
        this.leftImage = response.leftImgUrl;
        this.rightImage = response.rightImgUrl;
        this.spinnerService.hide();
      },
      error: (err: HttpErrorResponse) => {
        console.error(err);
        this.spinnerService.hide();
      },
    });
  }

  private getHeroImages(): Observable<Hero>{
    const url: string = `${this.baseUrl}/hero`;
    return this.httpClient.get<Hero>(url);
  }

}