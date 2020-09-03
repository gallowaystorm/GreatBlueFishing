import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Blog } from './blog.model';

import { mimeType } from './mime-type.validator';
import { BlogService } from './blog.service';
import { Subscription } from 'rxjs';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-create-blog',
  templateUrl: './create-blog.component.html',
  styleUrls: ['./create-blog.component.css']
})
export class CreateBlogComponent implements OnInit {

  isLoading = false;
  enteredContent = '';
  enteredTitle = '';
  private postId: string;
  public post: Blog;
  //for reactive form of forms
  form: FormGroup;
  //for imagepreview
  imagePreview: string;

  //for blog lists
  blogs: Blog[] = [];
  private blogsSub: Subscription;

  //for paginator
  totalBlogs = 0;
  blogsPerPage = 2;
  pageSizeOptions = [1, 2, 5, 10];
  currentPage = 1;


  constructor(public blogService: BlogService) { }

  ngOnInit() {
    //for mapping
    this.form = new FormGroup({
      'title': new FormControl(null, {validators: [Validators.required, Validators.minLength(3)]}),
      //added mie type validator
      'image': new FormControl(null, {validators: [Validators.required], asyncValidators: [mimeType]}),
      'content': new FormControl(null, {validators: [Validators.required]})
    });
    this.postId = null;

    //for posts list
    this.blogService.getBlogs(this.blogsPerPage, this.currentPage);
    //blog posts subscription
    this.blogsSub = this.blogService.getBlogPostUpdateListener().subscribe((blogData: { blogs: Blog[]; blogCount: number }) => {
      this.isLoading = false;
      //to set total posts on paginator
      this.totalBlogs = blogData.blogCount;
      this.blogs = blogData.blogs;
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

  onSavePost(){
    //check if form is complete
    if (this.form.invalid){
      return
    }
    this.isLoading = true;
    this.blogService.addBlogPost(this.form.value.title, this.form.value.content, this.form.value.image);
    if (this.blogService.addBlogPost){
      this.isLoading = false;
      alert('Blog saved successfully');
      this.form.reset();
    }
  }

  onDelete(blogId: string){

  }

  onChangedPage(pageData: PageEvent){

  }

}
