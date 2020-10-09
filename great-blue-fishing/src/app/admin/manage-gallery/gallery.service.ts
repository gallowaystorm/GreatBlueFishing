import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Gallery } from './gallery.model';

const BACKEND_URL = environment.apiUrl + '/gallery/'

@Injectable({ providedIn: 'root'})
export class GalleryService{

  private gallery: Gallery[] = [];
  private galleryUpdated = new Subject<{ gallery: Gallery[]}>();

  constructor(private http: HttpClient){}

  addGalleryImage(title: string, image: File){
    const galleryData = new FormData();
    //append the passed in information
    galleryData.append('title', title);
    //title is passed in as well to name image
    galleryData.append('image', image, title);
    this.http.post<{message: string, gallery: Gallery}>(BACKEND_URL, galleryData)
      .subscribe( (responseData) => {
        return true;
      });
  }

  getGallery(){
    this.http.get<{message: string, gallery: any }>(BACKEND_URL)
      //to change id to _id
      .pipe(map((galleryData => {
        //replace every post with...
        return { gallery: galleryData.gallery.map(gallery => {
          return {
            title: gallery.title,
            id: gallery._id,
            imagePath: gallery.imagePath
          };
        })};
      })))
      //subscribe to observable with remapped posts
      .subscribe( (transformedGalleryData) => {
        this.gallery = transformedGalleryData.gallery;
        this.galleryUpdated.next( { gallery: [...this.gallery] } );
      });
  }

  getGalleryUpdateListener(){
    return this.galleryUpdated.asObservable();
  }

  deleteImage(imageId: string){
    return this.http.delete(BACKEND_URL +  imageId);
  }
}
