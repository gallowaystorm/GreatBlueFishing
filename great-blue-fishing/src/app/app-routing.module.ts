import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './customer/home/home.component';
import { AboutComponent } from './customer/about/about.component';
import { StoreComponent } from './customer/store/store.component';
import { DonationsComponent } from './customer/donations/donations.component';
import { GalleryComponent } from './customer/gallery/gallery.component';
import { BlogComponent } from './customer/blog/blog.component';
import { ContactComponent } from './customer/contact/contact.component';
import { CreateBlogComponent } from './admin/create-blog/create-blog.component';
import { ProductsComponent } from './admin/products/products.component';
import { ManageDonationsComponent } from './admin/manage-donations/manage-donations.component';
import { ManageUsersComponent } from './admin/manage-users/manage-users.component';
import { RegistrationComponent } from './customer/registration/registration.component';
import { LoginComponent } from './customer/login/login.component';
import { GlobalAuthGuard } from './auth-guards/global-auth-guard';
import { AdminAuthGuard } from './auth-guards/admin-auth-guard';


const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'about', component: AboutComponent },
  { path: 'store', component: StoreComponent },
  { path: 'donations', component: DonationsComponent },
  { path: 'gallery', component: GalleryComponent },
  { path: 'blog', component: BlogComponent },
  { path: 'contact', component: ContactComponent},
  { path: 'register', component: RegistrationComponent },
  { path: 'login', component: LoginComponent },
  { path: 'admin/blog', component: CreateBlogComponent, canActivate: [AdminAuthGuard]},
  { path: 'edit/:blogId', component: CreateBlogComponent },
  { path: 'admin/products', component: ProductsComponent },
  { path: 'admin/donations', component: ManageDonationsComponent },
  { path: 'admin/users', component: ManageUsersComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [
    GlobalAuthGuard,
    AdminAuthGuard
  ]
})
export class AppRoutingModule { }
