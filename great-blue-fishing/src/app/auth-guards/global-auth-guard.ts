import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { GlobalAuthService } from '../global-auth.service';

@Injectable()
//can avitvate is for routing and auth guard
export class GlobalAuthGuard implements CanActivate{

  constructor(private globalAuthService: GlobalAuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot,
     state: RouterStateSnapshot): boolean | import("@angular/router").UrlTree | import("rxjs").Observable<boolean | import("@angular/router").UrlTree> | Promise<boolean | import("@angular/router").UrlTree> {
    //get authenticated status from auth-service
    const isAuth = this.globalAuthService.getIsAuth();
    if (!isAuth){
      this.router.navigate(['/login']);
      alert('You need to be logged in!');
    }
    return isAuth;
  }

}
