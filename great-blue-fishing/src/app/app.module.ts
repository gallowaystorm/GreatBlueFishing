import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatDialogModule } from '@angular/material/dialog'
import { MatCardModule } from '@angular/material/card'
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatInputModule } from '@angular/material/input';

import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HeaderComponent } from './header/header.component';
import { HomeComponent } from './customer/home/home.component';
import { AboutComponent } from './customer/about/about.component';
import { StoreComponent } from './customer/store/store.component';
import { DonationsComponent } from './customer/donations/donations.component';
import { GalleryComponent } from './customer/gallery/gallery.component';
import { BlogComponent } from './customer/blog/blog.component';
import { ContactComponent } from './customer/contact/contact.component';
import { CreateBlogComponent } from './admin/create-blog/create-blog.component';
import { ManageDonationsComponent } from './admin/manage-donations/manage-donations.component';
import { ManageUsersComponent } from './admin/manage-users/manage-users.component';
import { ProductsComponent } from './admin/products/products.component';
import { NgModule } from '@angular/core';




@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    HomeComponent,
    AboutComponent,
    StoreComponent,
    DonationsComponent,
    GalleryComponent,
    BlogComponent,
    ContactComponent,
    CreateBlogComponent,
    ManageDonationsComponent,
    ManageUsersComponent,
    ProductsComponent
   ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatInputModule,
    MatCardModule,
    MatButtonModule,
    MatToolbarModule,
    MatExpansionModule,
    MatProgressSpinnerModule,
    MatPaginatorModule,
    MatDialogModule

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
