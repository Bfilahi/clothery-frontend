import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Category } from '../../../model/category';
import { HttpErrorResponse } from '@angular/common/http';
import { NotificationService } from '../../../services/notification.service';
import { Router } from '@angular/router';
import { CategoryService } from '../../../services/category-service';
import { UtilityService } from '../../../services/utility.service';




@Component({
  selector: 'app-update-category',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './update-category.component.html',
  styleUrl: './update-category.component.scss'
})
export class UpdateCategoryComponent implements OnInit{

  private currentCategory!: Category;

  public categoryImage: File | null = null;
  public categoryName: string = '';
  public categoryType: string = '';
  public gender: string = '';
  public correctImageSize: boolean = false;
  public errorMessage: string = '';
  public isAnError: boolean = false;


  public constructor(
    private categoryService: CategoryService,
    private notificationService: NotificationService,
    private utilityService: UtilityService,
    private router: Router
  ){}


  public ngOnInit(): void {
    this.categoryService.categoryToUpdate.subscribe(
      data => {
        this.currentCategory = data;

        if(this.currentCategory)
          this.fillForm(this.currentCategory);
      }
    );
  }


  public fillForm(currentCategory: Category){
    this.categoryName = currentCategory.categoryName;
    this.categoryType = currentCategory.type;
    this.gender = currentCategory.gender;
  }


  public onImageChange(event: Event){
    let image: File[] | null;
    let imageCheck: boolean | null;
    let message: string;
    let input: HTMLInputElement;

    [image, imageCheck, message, input] = this.utilityService.onImageChange(event);

    if(image == null || imageCheck == null){
      input.value = '';
      this.isAnError = true;
      this.errorMessage = message;
      return;
    }

    this.isAnError = false;
    this.categoryImage = image[0];
    this.correctImageSize = imageCheck;
  }


  public onUpdateCategory(ngForm: NgForm){
    const formData: FormData = this.categoryService.createCategoryData(ngForm.value, this.categoryImage!);

    this.categoryService.updateCategory(formData).subscribe({
      next: (response: Category) => {
        this.categoryImage = null;
        this.correctImageSize = false;
        this.notificationService.showSuccess(`${response.categoryName} was added successfully.`);
        this.router.navigateByUrl('/home');
      },
      error: (error: HttpErrorResponse) => {
        this.notificationService.showError(error.error.message);
        this.categoryImage = null;
        this.correctImageSize = false;
      }
    })
  }
}