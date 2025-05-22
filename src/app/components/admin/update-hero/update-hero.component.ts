import { Component } from '@angular/core';
import { UtilityService } from '../../../services/utility.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Hero } from '../../../model/hero';
import { environment } from '../../../../environments/environment.development';
import { NotificationService } from '../../../services/notification.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-update-hero',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './update-hero.component.html',
  styleUrl: './update-hero.component.scss'
})
export class UpdateHeroComponent {
  private adminUrl: string = environment.ADMIN_URL;

  public l_isAnError: boolean = false;
  public r_isAnError: boolean = false;

  public correctLeftImageSize: boolean = false;
  public correctRightImageSize: boolean = false;
  public l_errorMessage: string = '';
  public r_errorMessage: string = '';
  public leftImageFile: File | null = null;
  public rightImageFile: File | null = null;

  constructor(
    private utilityService: UtilityService,
    private httpClient: HttpClient,
    private notificationService: NotificationService,
    private router: Router
  ){}


  public onLeftImageChange(event: Event){
    [this.l_isAnError, this.leftImageFile, this.l_errorMessage] = this.handleImages(event);
  }

  public onRightImageChange(event: Event){
    [this.r_isAnError, this.rightImageFile, this.r_errorMessage] = this.handleImages(event);
  }

  private handleImages(event: Event): [isError: boolean, type: File | null, errorMsg: string]{
    let image: File[] | null;
    let imageCheck: boolean | null;
    let message: string;
    let input: HTMLInputElement;

    [image, imageCheck, message, input] = this.utilityService.onImageChange(event);

    if(image == null || imageCheck == null){
      input.value = '';
      return [true, null, message];
    }

    return [false, image[0], ''];
  }


  public onFormSubmit(){
    const formData: FormData = this.createData(this.leftImageFile!, this.rightImageFile!);

    this.updateHero(formData).subscribe({
      next: (response: Hero) => {
        this.leftImageFile = this.rightImageFile = null;
        this.correctLeftImageSize = this.correctRightImageSize = false;
        this.notificationService.showSuccess(`${response.leftImage} and ${response.rightImage} were added successfully.`);
        this.router.navigateByUrl('/home');
      },
      error: (error: HttpErrorResponse) => {
        this.notificationService.showError(error.error.message);
        this.leftImageFile = this.rightImageFile = null;
        this.correctLeftImageSize = this.correctRightImageSize = false;
      }
    });
  }

  private createData(leftImage: File, rightImage: File){
    const formData = new FormData();

    formData.append('left_image', leftImage);
    formData.append('right_image', rightImage);

    return formData;
  }

  private updateHero(formData: FormData): Observable<Hero>{
    const url: string = `${this.adminUrl}/hero/add`
    return this.httpClient.post<Hero>(url, formData);
  }
}
