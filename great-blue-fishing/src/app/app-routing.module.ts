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
import { CheckoutComponent } from './customer/checkout/checkout.component';
import { ReviewOrderComponent } from './customer/checkout/review-order/review-order.component';
import { OrderCreationStatusComponent } from './customer/checkout/order-creation-status/order-creation-status.component';
import { ManageGalleryComponent } from './admin/manage-gallery/manage-gallery.component';


const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'about', component: AboutComponent },
  { path: 'store', component: StoreComponent },
  { path: 'checkout', component: CheckoutComponent, canActivate: [GlobalAuthGuard] },
  { path: 'review', component: ReviewOrderComponent, canActivate: [GlobalAuthGuard]},
  { path: 'order-status', component: OrderCreationStatusComponent, canActivate: [GlobalAuthGuard]},
  { path: 'donations', component: DonationsComponent },
  { path: 'gallery', component: GalleryComponent },
  { path: 'blog', component: BlogComponent },
  { path: 'contact', component: ContactComponent},
  { path: 'register', component: RegistrationComponent },
  { path: 'login', component: LoginComponent },
  { path: 'admin/blog', component: CreateBlogComponent, canActivate: [GlobalAuthGuard, AdminAuthGuard]},
  { path: 'admin/edit/:blogId', component: CreateBlogComponent, canActivate: [GlobalAuthGuard, AdminAuthGuard] },
  { path: 'admin/products', component: ProductsComponent, canActivate: [GlobalAuthGuard, AdminAuthGuard] },
  { path: 'admin/products/edit/:productId', component: ProductsComponent, canActivate: [GlobalAuthGuard, AdminAuthGuard] },
  { path: 'admin/donations', component: ManageDonationsComponent, canActivate: [GlobalAuthGuard, AdminAuthGuard] },
  { path: 'admin/users', component: ManageUsersComponent, canActivate: [GlobalAuthGuard, AdminAuthGuard] },
  { path: 'admin/gallery', component: ManageGalleryComponent, canActivate: [GlobalAuthGuard, AdminAuthGuard] }
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
