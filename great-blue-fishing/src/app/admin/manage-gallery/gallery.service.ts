import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Gallery } from './gallery.model';

const BACKEND_URL = environment.apiUrl + '/gallery/'

@Injectable({ providedIn: 'root'})
export class GalleryService{

  private gallery: Gallery[] = [];
  private galleryUpdated = new Subject<{ gallery: Gallery[]}>();

  constructor(private http: HttpClient, private router: Router){}

  addGalleryImage(title: string, image: File){
    const galleryData = new FormData();
    //append the passed in information
    galleryData.append('title', title);
    //title is passed in as well to name image
    galleryData.append('image', image, title);
    this.http.post<{message: string, gallery: Gallery}>(BACKEND_URL, galleryData)
      .subscribe( (responseData) => {
        if (responseData) {
          return true
        } else {
          return false
        }
      });
  }

  getGallery(){
    this.http.get<{message: string, gallery: any }>(BACKEND_URL)
      //to change id to _id
      .pipe(map((galleryData => {
        //replace every post with...
        return { gallery: galleryData.gallery.map(gallery => {
          return {
            id: gallery._id,
            title: gallery.title,
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

  getSingleImage(galleryId: string){
    return this.http.get<{ _id: string, title: string, imagePath: string}>(BACKEND_URL + galleryId);
  }

  updateImage(id: string, title: string, image: File | string){
    let galleryData: Gallery | FormData;
    if(typeof(image) === 'object') {
      //create new form data object
      galleryData = new FormData();
      galleryData.append('id', id);
      galleryData.append('title', title);
      //title is passed in as well to name image
      galleryData.append('image', image, title);
    } else {
      //create new post data
      galleryData = {id: id, title: title, imagePath: image};
    }
    this.http.put(BACKEND_URL + id, galleryData).subscribe( response => {
      this.navigateToGalleryPage();
    });
    return true;
  }

  deleteImage(imageId: string){
    return this.http.delete(BACKEND_URL +  imageId);
  }

  navigateToGalleryPage(){
    this.router.navigate(["/admin/gallery"]);
  }

}
