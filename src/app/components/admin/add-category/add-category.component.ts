import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Category } from '../../../model/category';
import { NotificationService } from '../../../services/notification.service';
import { HttpErrorResponse } from '@angular/common/http';
import { CategoryService } from '../../../services/category-service';
import { UtilityService } from '../../../services/utility.service';
import { CommonModule } from '@angular/common';



@Component({
  selector: 'app-category',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-category.component.html',
  styleUrl: './add-category.component.scss'
})
export class AddCategoryComponent{

  private categoryImage: File | null = null;
  
  public defaultGender: string = "M";
  public correctImageSize: boolean | null = false;
  public errorMessage: string = '';
  public isAnError: boolean = false;


  constructor(
    private categoryService: CategoryService,
    private notification: NotificationService,
    private utitlityService: UtilityService
  ){}


  public onImageChange(event: Event){
    let image: File[] | null;
    let imageCheck: boolean | null;
    let message: string;
    let input: HTMLInputElement;

    [image, imageCheck, message, input] = this.utitlityService.onImageChange(event);

    if(image == null || imageCheck == null){
      input.value = '';
      this.errorMessage = message;
      this.isAnError = true;
      return;
    }

    this.isAnError = false;
    this.categoryImage = image[0];
    this.correctImageSize = imageCheck;
  }

  public onAddNewCategory(categoryForm: NgForm){
    const formData: FormData = this.categoryService.createCategoryData(categoryForm.value, this.categoryImage!);

    this.categoryService.addCategory(formData).subscribe({
      next: (response: Category) => {
        this.categoryImage = null;
        this.correctImageSize = false;
        categoryForm.reset({
          gender: this.defaultGender
        });
        this.notification.showSuccess(`${response.categoryName} was added successfully.`);
      },
      error: (error: HttpErrorResponse) => {
        this.notification.showError(error.error.message);
        categoryForm.reset({
          gender: this.defaultGender
        })
        this.categoryImage = null;
        this.correctImageSize = false;
      }
    });
  }
}