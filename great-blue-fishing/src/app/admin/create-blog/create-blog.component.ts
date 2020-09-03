import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Blog } from './blog.model';
import { ActivatedRoute, ParamMap } from '@angular/router';

import { mimeType } from './mime-type.validator';
import { BlogService } from './blog.service';
import { Subscription } from 'rxjs';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-create-blog',
  templateUrl: './create-blog.component.html',
  styleUrls: ['./create-blog.component.css']
})
export class CreateBlogComponent implements OnInit, OnDestroy {

  isLoading = false;
  enteredContent = '';
  enteredTitle = '';
  private blogId: string;
  public blog: Blog;
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

  //for create vs edit mode
  private mode = 'create';


  constructor(public blogService: BlogService, public route: ActivatedRoute) { }

  ngOnInit() {
    //for mapping
    this.form = new FormGroup({
      'title': new FormControl(null, {validators: [Validators.required, Validators.minLength(3)]}),
      //added mie type validator
      'image': new FormControl(null, {validators: [Validators.required], asyncValidators: [mimeType]}),
      'content': new FormControl(null, {validators: [Validators.required]})
    });

    //for create vs edit mode
      //pulls the path that you are at to determine between /create and /edit/:postID
      this.route.paramMap
      //subscribes to observable
      .subscribe( (paramMap: ParamMap) => {
        //check if path exists
        if (paramMap.has('blogId')) {
          this.mode = 'edit';
          //sets blogId in the path equal to blogId variable
          this.blogId = paramMap.get('blogId');
          //spinner on load
          this.isLoading = true;
          //call overloaded getPost function that finds post in database that matches id
          this.blogService.getSingleBlog(this.blogId)
            //subscribe to observable
            .subscribe(blogData => {
              //stop spinner
              this.isLoading = false;
              this.blog = {id: blogData._id, title: blogData.title, content: blogData.content, imagePath: blogData.imagePath};
              //overite default form value on init
              this.form.setValue({'title': this.blog.title, 'content': this.blog.content, 'image': this.blog.imagePath});
            });
        } else {
          this.mode = 'create';
          this.blogId = null;
        }
      });

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
    if (this.mode === 'create'){
      this.blogService.addBlogPost(this.form.value.title, this.form.value.content, this.form.value.image);
      if (this.blogService.addBlogPost){
        this.isLoading = false;
        alert('Blog saved successfully');
      }
    } else {
      var confirmUpdate = confirm("Are you sure you want to update this blog post?");
      if (confirmUpdate == true){
        var blogUpdated = this.blogService.updateBlogPost(this.blogId, this.form.value.title, this.form.value.content, this.form.value.image);
        if (blogUpdated == true) {
          alert("Blog post has been updated!");
        }
      } else {
        return;
      }
    }
    this.form.reset();
  }

  onDelete(blogId: string){
    var confirmDelete = confirm("Are you sure you want to delete this post? This cannot be undone.");
    if (confirmDelete == true){
      this.isLoading = true;
      this.blogService.deleteBlogPost(blogId).subscribe( () => {
        //to update post list on frontend on delete
        this.blogService.getBlogs(this.blogsPerPage, this.currentPage);
      }, () => {
        //this method helps handle erros
        this.isLoading = false;
      });
    } else {
      return;
    }
  }

  onChangedPage(pageData: PageEvent){
    //for spinner
    this.isLoading = true;
    //values from page data
      //adding 1 becuase this index starts at zero
    this.currentPage = pageData.pageIndex + 1;
    this.blogsPerPage = pageData.pageSize;
    this.blogService.getBlogs(this.blogsPerPage, this.currentPage);
  }

  ngOnDestroy(){
    this.blogsSub.unsubscribe();
    // //unsubscribe to listener
    // this.authListenerSubscription.unsubscribe();
  }

}
