import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http'
import { map } from 'rxjs/operators';

import { Blog } from './blog.model';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

const BACKEND_URL = environment.apiUrl + '/blog/'

@Injectable({providedIn: 'root'})
export class BlogService{

  private blogs: Blog[] = [];
  private blogsUpdated = new Subject<{ blogs: Blog[], blogCount: number}>();

  constructor(private http: HttpClient, private router: Router){}

  addBlogPost(title: string, content: string, image: File){
    const blogData = new FormData();
    //append the passed in information
    blogData.append('title', title);
    blogData.append('content', content);
    //title is passed in as well to name image
    blogData.append('image', image, title);
    this.http.post<{message: string, blog: Blog}>(BACKEND_URL, blogData)
      .subscribe( (responseData) => {
        this.navigateToBlogPage();
        return true;
      });
  }

  //get single blog post
  getSingleBlog(blogId: string){
    //returned this way because it is asynchronous
    return this.http.get<{ _id: string, title: string, content: string, imagePath: string }>(BACKEND_URL + blogId);
  }

  //get all blog posts
  getBlogs(blogsPerPage: number, currentPage: number){
    //for paginator
      //using backticks for query params
      const queryParams = `?pagesize=${blogsPerPage}&page=${currentPage}`
      this.http.get<{message: string, blogs: any, maxBlogs: number }>(BACKEND_URL + queryParams)
      //to change id to _id
      .pipe(map((blogData => {
        //replace every post with...
        return { blogs: blogData.blogs.map(blog => {
          return {
            title: blog.title,
            content: blog.content,
            id: blog._id,
            imagePath: blog.imagePath
          };
        }), maxblogs: blogData.maxBlogs
      };
      })))
      //subscribe to observable with remapped posts
      .subscribe( (transformedBlogData) => {
        this.blogs = transformedBlogData.blogs;
        this.blogsUpdated.next( { blogs: [...this.blogs], blogCount:  transformedBlogData.maxblogs } );
      });
  }

  getBlogPostUpdateListener(){
    return this.blogsUpdated.asObservable();
  }

  //update single post
  updateBlogPost(id: string, title: string, content: string, image: File | string){
    let blogData: Blog | FormData;
    if(typeof(image) === 'object') {
      //create new form data object
      blogData = new FormData();
      blogData.append('id', id);
      blogData.append('title', title);
      blogData.append('content', content);
      //pass in title as well to help name the image
      blogData.append('image', image, title);
    } else {
      //create new post data
      blogData = {id: id, title: title, content: content, imagePath: image};
    }
    this.http.put(BACKEND_URL + id, blogData)
    //subscribe to obervable
    .subscribe( response => {
      this.navigateToBlogPage();
    });
    return true;
  }

  //delete single post
  deleteBlogPost(blogId: string){
    return this.http.delete(BACKEND_URL +  blogId);
  }



  //navigation functions

  navigateToHomePage(){
    this.router.navigate(["/"]);
  }

  navigateToBlogPage(){
    this.router.navigate(["/admin/blog"]);
    window.location.reload();
  }

}
