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
        this.router.navigate(["/admin/blog"]);
        return true;
      });
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
            imagePath: blog.imagePath,
            creator: blog.creator
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

  //delete single post

  deleteBlogPost(blogId: string){
    return this.http.delete(BACKEND_URL +  blogId);
  }

  navigateToHomePage(){
    this.router.navigate(["/"]);
  }

}
