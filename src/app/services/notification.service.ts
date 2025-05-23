import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(private toastr: ToastrService) { }

  public showSuccess(message: string) {
    this.toastr.success(message, 'SUCCESS!');
  }

  public showError(message: string){
    this.toastr.error(message, 'ERROR!');
  }
}
