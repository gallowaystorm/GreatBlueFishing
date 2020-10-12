import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Gallery } from 'src/app/admin/manage-gallery/gallery.model';
import { GalleryService } from 'src/app/admin/manage-gallery/gallery.service';

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.css']
})
export class GalleryComponent implements OnInit, OnDestroy {

  isLoading = false;
  private galleryId: string;
  public galleryImage: Gallery;

  gallery: Gallery[] = [];
  private gallerySub: Subscription;

  constructor(public galleryService: GalleryService) { }

  ngOnInit() {
    this.getGallery();
  }

  getGallery(){
    //for gallery list
    this.galleryService.getGallery();
    //gallery posts subscription
    this.gallerySub = this.galleryService.getGalleryUpdateListener().subscribe((galleryData: { gallery: Gallery[] }) => {
      this.isLoading = false;
      this.gallery = galleryData.gallery;
      });
  }

  ngOnDestroy(){
    this.gallerySub.unsubscribe();
  }

}
