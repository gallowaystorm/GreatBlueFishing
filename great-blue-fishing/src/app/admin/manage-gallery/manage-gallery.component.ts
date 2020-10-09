import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { mimeType } from '../create-blog/mime-type.validator';
import { Gallery } from './gallery.model';
import { GalleryService } from './gallery.service';

@Component({
  selector: 'app-manage-gallery',
  templateUrl: './manage-gallery.component.html',
  styleUrls: ['./manage-gallery.component.css']
})
export class ManageGalleryComponent implements OnInit {

  isLoading = false;
   //for reactive form of forms
  form: FormGroup;
   //for imagepreview
  imagePreview: string;

  gallery: Gallery[] = [];
  private gallerySub: Subscription;

  constructor(public galleryService: GalleryService) { }

  ngOnInit() {
    //for mapping
    this.form = new FormGroup({
      'title': new FormControl(null, {validators: [Validators.required, Validators.minLength(3)]}),
      //added mie type validator
      'image': new FormControl(null, {validators: [Validators.required], asyncValidators: [mimeType]})
    });

    this.getGallery();
  }

  onImagePicked(event: Event){
    //access file passed in
    const file = (event.target as HTMLInputElement).files[0];
    //target single control on form
    this.form.patchValue({image: file});
    //get access to image and update value and validate it
    this.form.get('image').updateValueAndValidity();
    //convert image to data url
    const reader = new FileReader();
    //executes when done loading
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    };
    reader.readAsDataURL(file);
 }

 onSaveImage(formDirective: FormGroupDirective){
    //check if form is complete
    if (this.form.invalid){
      return
    }
    this.isLoading = true;
    this.galleryService.addGalleryImage(this.form.value.title, this.form.value.image);
      if (this.galleryService.addGalleryImage){
        this.isLoading = false;
        alert('Gallery image saved successfully');
      }
    formDirective.resetForm();
    this.form.reset();
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

  onDelete(imageId: string) {
    var confirmDelete = confirm("Are you sure you want to delete this product? This cannot be undone.");
    if (confirmDelete){
      this.isLoading = true;
      this.galleryService.deleteImage(imageId).subscribe( () => {
        //to update product list on frontend on delete
        this.galleryService.getGallery();
      }, () => {
        //this method helps handle errors
        this.isLoading = false;
      });
    } else {
      return;
    }
  }

}
