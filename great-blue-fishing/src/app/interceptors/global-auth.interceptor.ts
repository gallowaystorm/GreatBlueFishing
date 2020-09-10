import { HttpInterceptor, HttpRequest, HttpHandler } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GlobalAuthService } from '../global-auth.service';

//injectable allows us to inject other services into services
@Injectable()
//interceptors hook onto any outgoing http request we want it to, this helps with authorization
export class GlobalAuthInterceptor implements HttpInterceptor {

  //connstruct the auth service
  constructor(private globalAuthService: GlobalAuthService) {}
  //<any> gets any outoging request we want instead of certain types
  intercept(req: HttpRequest<any>, next: HttpHandler) {
    //inject token into method
    const authToken = this.globalAuthService.getToken();
    //manipulate request to hold token
    //clones request
    const authRequest = req.clone({
      //set adds a new header to the already existing headers
        //bearer is on the front of all tokens and headers (see check-auth.js for a comment explaining)
      headers: req.headers.set("Authorization", "Bearer " + authToken)
    });
    return next.handle(authRequest);
  };
}
