import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { mimeType } from '../create-blog/mime-type.validator';
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

  constructor(public galleryService: GalleryService) { }

  ngOnInit() {
    //for mapping
    this.form = new FormGroup({
      'title': new FormControl(null, {validators: [Validators.required, Validators.minLength(3)]}),
      //added mie type validator
      'image': new FormControl(null, {validators: [Validators.required], asyncValidators: [mimeType]})
    });
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
  }

}
