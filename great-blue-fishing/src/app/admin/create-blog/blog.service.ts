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

  addBlogPost(title: string, content: string, image: File){

  }

}
