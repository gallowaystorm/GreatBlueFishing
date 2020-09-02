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

  navigateToHomePage(){
    this.router.navigate(["/"]);
  }

}
