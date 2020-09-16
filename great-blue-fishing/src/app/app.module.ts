import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatDialogModule } from '@angular/material/dialog'
import { MatCardModule } from '@angular/material/card'
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTableModule } from '@angular/material/table';
import { MatGridListModule } from '@angular/material/grid-list';

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
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { RegistrationComponent } from './customer/registration/registration.component';
import { LoginComponent } from './customer/login/login.component';
import { GlobalAuthInterceptor } from './interceptors/global-auth.interceptor';
import { ErrorsComponent } from './errors/errors.component';
import { ErrorInterceptor } from './interceptors/error-interceptor';




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
      ProductsComponent,
      RegistrationComponent,
      LoginComponent,
      ErrorsComponent
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
      MatDialogModule,
      HttpClientModule,
      ReactiveFormsModule,
      MatIconModule,
      MatMenuModule,
      MatTableModule,
      MatGridListModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: GlobalAuthInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true }
  ],
  bootstrap: [AppComponent],
  entryComponents: [ErrorsComponent]
})
export class AppModule { }
