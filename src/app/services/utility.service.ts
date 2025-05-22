import { Injectable } from '@angular/core';

const MAX_SIZE_MB: number = 2;
const MAX_BYTES: number = MAX_SIZE_MB * 1024 * 1024;


@Injectable({
  providedIn: 'root'
})
export class UtilityService {
  private maxImages: number = 4;
  
  constructor() { }

  public onImageChange(event: Event): [File[] | null, boolean | null, string, HTMLInputElement]{
    let imageFiles: File[] = [];
    let correctImageSize: boolean = false;

    const input = event.target as HTMLInputElement;


    if(input.files && input.files.length > 0){
      if(input.files.length > this.maxImages)
        return [null, null, `You can only upload up to ${this.maxImages} images.`, input];
      
      for(let i = 0; i < input.files.length; i++){
        if(input.files[i].size > MAX_BYTES){
          return [null, null, `Image "${input.files[i].name} exceeds ${MAX_SIZE_MB}MB limit.`, input];
        }
        correctImageSize = true;
        imageFiles?.push(input.files[i]);
      }
    }
    return [imageFiles, correctImageSize, 'success', input];
  }
}