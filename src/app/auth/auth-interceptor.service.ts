import { HttpHandler, HttpInterceptor, HttpParams, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { exhaustMap, take } from "rxjs/operators";
import { AuthService } from "./auth.service";

/**
 * This interceptor manipulate our requests with the purpose of 
 * attaching our token to all the requests made to the server
 */

@Injectable()
export class AuthInterceptorService implements HttpInterceptor{
    /**
     * We inject the authService to get the user token
     */
    constructor(private authService: AuthService) {
    }

    /**
     * We implement the method
     */
    intercept(req: HttpRequest<any>, next: HttpHandler) {
        /**
         * We subscripe to the user service but we use "exhasutMap" in order to 
         * return the modified request
         * 
         * -> We could also verify some endpoints and accept or reject 
         */
        return this.authService.user.pipe(
            take(1),
            exhaustMap( user => {
                
                /**
                 * we check if we don't have a user, this happens when we try to log in or sign up
                 */
                if(!user){
                    return next.handle(req);
                }

                /**
                 * we add the user token to the request as a parameter
                 */
                const modifiedReq = req.clone({
                    params: new HttpParams().set('auth', user.token)
                });

                /**
                 * We 'send' the new modified request
                 */
                return next.handle(modifiedReq);
            })
        );
    }
}