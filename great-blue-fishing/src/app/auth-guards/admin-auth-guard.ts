import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { AdminAuthService } from '../admin/admin-auth.service';

@Injectable()
//can avitvate is for routing and auth guard
export class AdminAuthGuard implements CanActivate{

  constructor(private adminAuthService: AdminAuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot,
     state: RouterStateSnapshot): boolean | import("@angular/router").UrlTree | import("rxjs").Observable<boolean | import("@angular/router").UrlTree> | Promise<boolean | import("@angular/router").UrlTree> {

    const isAdmin = this.adminAuthService.getIsAdmin();
    if (!isAdmin){
      this.router.navigate(['/login']);
      alert('You are not authorized to view this page!')
    }
    return isAdmin;
  }

}
