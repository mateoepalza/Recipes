import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { Observable } from "rxjs";
import { map, take } from "rxjs/operators";
import { AuthService } from "./auth.service";

/**
 * A route guard allows us to run logic right before a route is loaded, and we can deny
 * access if a certain condition is not met
 */

@Injectable({ providedIn: 'root'})
export class AuthGuard implements CanActivate{

    /**
     * we inject the authService to check if there is a logged user
     * We inject the router to redirect to 'auth'
     */
    constructor(private authService: AuthService, private router:Router){}

    /**
     * We return a boolean, a Promise<booolean> or an Observable<boolean>
     * 
     */
    canActivate(
        route: ActivatedRouteSnapshot, 
        router: RouterStateSnapshot): boolean | UrlTree | Promise<boolean | UrlTree > | Observable<boolean | UrlTree> {
        /**
         * Be aware that we are not subscribing because the user by itself returns an obsevable
         * but that observable doesn't return a boolean instead a user, So we use the map operator
         * to transform the observable value here, so we want to return true or false, but be aware
         * that in this case we want to redirect the user to an specific place and the guards allows
         * us to return also a UrlTree that will end in redirecting automatically, that's why above in
         * the return data type we use UrlTree and below we return an UrlTree that will redirect to 'auth'
         * 
         * -> Be aware that we could have an ongoing subscription of the user Subject (it can emit 
         *    data more than once), but we want to look inside the user value for one time only an then not
         *    care about it anymore, that's why we are using the "take(1)" operator which will give us 
         *    the latest user value and then unsubscribe from that observable
         */
        return this.authService.user.pipe(
            take(1),
            map(user =>{
                /**
                 * checks if the user exists
                 */
                const isAuth = !!user;
                /**
                 * in case it exists we return true which means that the user can navigate to that url
                 */
                if(isAuth){
                    return true;
                }
                /**
                 * Otherwise we return a UrlTree which will redirect the user
                 */
                return this.router.createUrlTree(['/auth']);
            })
        );
    }

}