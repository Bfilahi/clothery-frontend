import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Category } from '../../model/category';
import { CustomHttpResponse } from '../../model/custom-http-response';
import { NotificationService } from '../../services/notification.service';
import { Router, RouterModule } from '@angular/router';
import { CategoryService } from '../../services/category-service';
import { AuthRoleService } from '../../services/auth-role.service';


@Component({
  selector: 'app-product-category',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './product-category.component.html',
  styleUrl: './product-category.component.scss'
})
export class ProductCategoryComponent implements OnInit{

  public isAdmin: boolean = false;

  public categories: Category[] = [];

  public constructor(
    private categoryService: CategoryService,
    private notificationService: NotificationService,
    private router: Router,
    private authRole: AuthRoleService
  ){}

  public ngOnInit(): void {

    this.authRole.isAdmin$().subscribe(
      response => this.isAdmin = response
    );

    this.listProductCategories();
  }

  public listProductCategories(){
    this.categoryService.getProductCategories().subscribe(
      data => this.categories = data
    );
  }

  public onDelete(category: Category){
    let confirmation: boolean = confirm(`Are you sure you want to delete: ${category.categoryName}?`);

    if(!confirmation)
      return;
    
    this.categoryService.deleteCategory(category.type, category.gender).subscribe({
      next: (response: CustomHttpResponse) => {
        this.notificationService.showSuccess(`${category.categoryName}  ${response.message} `);
        this.listProductCategories();
      },
      error: (error: CustomHttpResponse) => {
        this.notificationService.showError(error.message);
      }
    });
  }

  public goToUpdate(category: Category){
    this.categoryService.setCategoryToUpdate(category);
    this.router.navigateByUrl('/admin/update-category');
  }
}