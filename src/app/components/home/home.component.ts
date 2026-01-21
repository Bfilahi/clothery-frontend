import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ProductCategoryComponent } from "../product-category/product-category.component";
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';
import { Hero } from '../../model/hero';
import { Observable } from 'rxjs';



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


  constructor(private httpClient: HttpClient){}


  public ngOnInit(): void {
    this.getHeroImages().subscribe(
      (response: Hero) => {
        this.leftImage = response.leftImgUrl;
        this.rightImage = response.rightImgUrl;
      }
    );
  }

  private getHeroImages(): Observable<Hero>{
    const url: string = `${this.baseUrl}/hero`;
    return this.httpClient.get<Hero>(url);
  }

}