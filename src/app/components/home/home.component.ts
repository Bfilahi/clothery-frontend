import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ProductCategoryComponent } from "../product-category/product-category.component";
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';
import { Hero } from '../../model/hero';
import { map, Observable } from 'rxjs';



@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, ProductCategoryComponent, RouterModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit{

  private baseUrl: string = environment.BASE_URL;
  
  buttons = [
    {
      name: "SHOP MEN'S",
      gender: 'men'
    },
    {
      name: "SHOP WOMEN'S",
      gender: 'women'
    }
  ];

  public heroImages!: Hero[];

  public leftImage!: string ;
  public rightImage!: string;


  constructor(private httpClient: HttpClient){}


  public ngOnInit(): void {
    this.getHeroImages().subscribe(
      (response: Hero[]) => {
        this.heroImages = response;

        if(this.heroImages.length > 0){
          this.leftImage = this.heroImages[0].leftImage;
          this.rightImage = this.heroImages[0].rightImage;
        }
      }
    );
  }

  private getHeroImages(): Observable<Hero[]>{
    const url: string = `${this.baseUrl}/heroes`;
    return this.httpClient.get<GetResponseHero>(url).pipe(
      map(item => item._embedded.heroes)
    );
  }

}

interface GetResponseHero{
  _embedded: {
    heroes: Hero[]
  }
}