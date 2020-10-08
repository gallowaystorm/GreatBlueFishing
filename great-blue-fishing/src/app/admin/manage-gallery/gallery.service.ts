import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Gallery } from './gallery.model';

const BACKEND_URL = environment.apiUrl + '/gallery/'

@Injectable({ providedIn: 'root'})
export class GalleryService{

  constructor(private http: HttpClient){}

  addGalleryImage(title: string, image: File){
    const galleryData = new FormData();
    //append the passed in information
    galleryData.append('title', title);
    //title is passed in as well to name image
    galleryData.append('image', image, title);
    this.http.post<{message: string, gallery: Gallery}>(BACKEND_URL, galleryData)
      .subscribe( (responseData) => {
        console.log(responseData.gallery);
        return true;
      });
  }
}
