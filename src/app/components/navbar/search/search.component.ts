import { DOCUMENT } from '@angular/common';
import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ProductService } from '../../../services/product.service';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss'
})
export class SearchComponent implements OnInit{

  @ViewChild('overlay') overlay: ElementRef | undefined;
  @ViewChild('searchBarSm') searchBar: ElementRef | undefined;

  public sharedKeyword: string = '';


  constructor(
    private router: Router,
    private productService: ProductService,
    @Inject(DOCUMENT) private document: Document
  ){}


  public ngOnInit(): void {
    this.productService.keyword.subscribe(
      data => this.sharedKeyword = data
    );
  }

  public doSearch(value: string){
    if(value.trim() != ''){
      this.router.navigateByUrl(`/search/${value}`);
      this.overlay?.nativeElement.classList.remove('active');
      this.document.body.classList.remove('block-scrollbar');
    }
  }

  public handleSearchBtn(){
    this.overlay?.nativeElement.classList.add('active');
    this.document.body.classList.add('block-scrollbar');
  }

  public handleCloseBtn(){
    this.overlay?.nativeElement.classList.remove('active');
    this.document.body.classList.remove('block-scrollbar');
  }
}
