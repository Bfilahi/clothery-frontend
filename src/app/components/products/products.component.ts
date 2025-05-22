import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Product } from '../../model/Product';
import { ProductService } from '../../services/product.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { NotificationService } from '../../services/notification.service';
import { HttpErrorResponse } from '@angular/common/http';
import { CustomHttpResponse } from '../../model/custom-http-response';
import { Category } from '../../model/category';
import { CategoryService } from '../../services/category-service';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { AuthRoleService } from '../../services/auth-role.service';




@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, RouterModule, NgxSpinnerModule],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss'
})
export class ProductsComponent implements OnInit{

  public isAdmin: boolean = false;

  private AllCategories: Category[] = [];
  private AllProducts: Product[] = [];

  public products: Product[] = [];
  public categories: Category[] = [];

  public selectedCategory!: number;
  public showFilter: boolean = true;

  public isLoading: boolean = false;


  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private route: ActivatedRoute,
    private router: Router,
    private notificationService: NotificationService,
    private spinnerService: NgxSpinnerService,
    private authRole: AuthRoleService
  ){}

  public ngOnInit(): void {
    this.authRole.isAdmin$().subscribe(
      response => this.isAdmin = response
    );
  
    this.route.paramMap.subscribe({
      next: () => {
        this.spinnerService.show();
        this.isLoading = true;
        this.listProducts();
      }
    });

    this.route.queryParamMap.subscribe({
      next: () => {
        this.spinnerService.show();
        this.isLoading = true;
        this.listProducts();
      }
    });
  }


  private listProducts(){
    this.categoryService.getProductCategories().subscribe(
      response => this.AllCategories = response
    );

    if(this.route.snapshot.paramMap.has('keyword')){
      this.showFilter = false;

      const keyword: string = this.route.snapshot.paramMap.get('keyword')!;

      this.productService.searchProduct(keyword).subscribe(
        response => {
          this.AllProducts = response;
          this.products = this.AllProducts;

          this.categories = this.AllCategories;

          this.spinnerService.hide();
          this.isLoading = false;
        }
      );
    }
    else if(this.route.snapshot.paramMap.has('gender')){
      this.showFilter = true;
      
      const gender: string = this.route.snapshot.paramMap.get('gender')!;
      let categoryGender: string = gender === 'men' ? 'M' : 'F';

      if(this.route.snapshot.queryParamMap.has('ofs')){
        this.selectedCategory = -2;
        this.products = this.AllProducts.filter(p => p.unitsInStock === 0);
        this.categories = this.AllCategories.filter(category => category.gender === categoryGender);

        this.spinnerService.hide();
        this.isLoading = false;
      }
      else if(this.route.snapshot.queryParamMap.has('id')){
        const id: number = +this.route.snapshot.queryParamMap.get('id')!;

        this.selectedCategory = id;

        this.productService.getProductsByCategory(id).subscribe(
          response => {
            this.products = response;
            this.categories = this.AllCategories.filter(category => category.gender === categoryGender);

            this.spinnerService.hide();
            this.isLoading = false;
          }
        );
      }
      else{
        const gender: string = this.route.snapshot.paramMap.get('gender')!;

        let categoryGender: string = gender === 'men' ? 'M' : 'F';
        this.selectedCategory = -1;

        this.productService.getProducts(gender).subscribe({
          next: (response: Product[]) => {
            this.AllProducts = response;
            this.products = this.AllProducts;
  
            this.categories = this.AllCategories.filter(category => category.gender === categoryGender);

            this.spinnerService.hide();
            this.isLoading = false;
          },
          error: (error: HttpErrorResponse) => {
            this.notificationService.showError(error.error.message);
          }
        });
      }
    }
  }

  public onDelete(product: Product){
    let confirmation: boolean = confirm(`Are you sure you want to delete: ${product.productName}?`);

    if(!confirmation)
      return;

    this.productService.deleteProduct(product.id).subscribe({
      next: (response: CustomHttpResponse) => {
        this.notificationService.showSuccess(`${product.productName} ${response.message}`);
        this.listProducts();
      },
      error: (error: CustomHttpResponse) => {
        this.notificationService.showError(error.message);
      }
    })
  }

  public filterProducts(category: Category){
    this.router.navigate([`/products/${category.gender === 'M' ? 'men' : 'women'}`], {queryParams: {id: category.id}});
  }

  public listAllProducts(){
    if(this.route.snapshot.paramMap.get('gender')){
      const gender: string = this.route.snapshot.paramMap.get('gender')!;
      this.router.navigateByUrl(`/products/${gender}`);
    }
  }

  public filterOutOfStock(){
    const gender: string = this.route.snapshot.paramMap.get('gender')!;

    this.router.navigate([`/products/${gender}`], {queryParams: {ofs: 'out-of-stock'}});
  }

  public goToUpdate(product: Product){
    this.productService.setProductToUpdate(product);
    this.router.navigateByUrl(`/admin/update-product/${product.id}`);
  }

}
