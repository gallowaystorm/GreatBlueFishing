import { Component, OnDestroy, OnInit } from '@angular/core';
import { Blog } from 'src/app/admin/create-blog/blog.model';
import { Subscription } from 'rxjs';
import { BlogService } from 'src/app/admin/create-blog/blog.service';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.css']
})
export class BlogComponent implements OnInit, OnDestroy {

  blogs: Blog[] = [];
  private blogsSub: Subscription;
  isLoading = false;
  //for paginator
  totalBlogs = 0;
  blogsPerPage = 5;
  pageSizeOptions = [1, 2, 5, 10];
  currentPage = 1;

  constructor(public blogService: BlogService) { }

  ngOnInit() {
    //blog posts subscription
    this.blogsSub = this.blogService.getBlogPostUpdateListener().subscribe((blogData: { blogs: Blog[]; blogCount: number }) => {
      this.isLoading = false;
      //to set total posts on paginator
      this.totalBlogs = blogData.blogCount;
      this.blogs = blogData.blogs;
    });
    //for posts list
    this.blogService.getBlogs(this.blogsPerPage, this.currentPage);
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
