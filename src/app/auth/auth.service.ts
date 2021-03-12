import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { BehaviorSubject, Subject, throwError } from "rxjs";
import { catchError, tap } from "rxjs/operators";
import { User } from "./user.model";

/**
 * We create an interface for the response of the request made in the signUp method
 */
export interface AuthResponseData {
    kind: string;
    idToken: string;
    email: string;
    refreshToken: string;
    expiresIn: string;
    localId: string;
    resgistered?: boolean;
}

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    /**
     * We want to store the user
     * -> the idea here is that we emit a new user. Whenever we have one (we login or 
     *    also when we logout, we clear the user, when the user becomes expired or the 
     *    token expired)
     *   
     * -> It's important to understand the new Object called "BehaviorSubject", 
     * -> we use this object because now we need the user token on-demand (whenever we 
     *    need it, not only when we emit the value).
     * -> The object works similar to "Subject" in which we can call next to emit a value 
     *    and we can subscribe to it to be informed abour new values, The difference is that
     *    BehaviorSubject also gives subscribers inmediate access to the previously value even
     *    if they haven't subscribed at the point of time the value was emitted, this means that
     *    we can get access to the currently active user even if we only subscribe after that user has
     *    been emitted
     * -> Therefore BehaviorSubject has to be initialized with a starting value
     */
    user = new BehaviorSubject<User>(null);

    /**
     *  This property will store our timer (setTimeout), so we can clear it when the user clicks by 
     *  himself the logout button
     */
    private tokenExpirationTimer: any;


    constructor(private http: HttpClient, private router: Router) {
    }

    /**
     *  This method will signUp out new user into firebase 
     * @param email Email provided by the user
     * @param password Password provided by the user
     * @returns An observable that will resolve to an AuthResponseData
     */
    signUp(email: string, password: string) {
        return this.http.post<AuthResponseData>(
            /**
             * This url is stablished by firebase
             */
            "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyDa5mwVQNhthwnOEljboIi0ak4zH2LaOdA",
            {
                /**
                 * This parameters are stablish by firebase
                 */
                email: email,
                password: password,
                returnSecureToken: true
            }
        ).pipe(
            /**
             * catchError operator allows us to modify
             * 
             * we pass the method that handles the error
             */
            catchError(this.handleError),
            tap(resData => {
                /**
                 * We handle the authentication
                 */
                this.handleAuthentication(
                    resData.email,
                    resData.localId,
                    resData.idToken,
                    +resData.expiresIn);
            }));
    }

    login(email: String, password: string) {
        return this.http.post<AuthResponseData>(
            "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyDa5mwVQNhthwnOEljboIi0ak4zH2LaOdA",
            {
                email: email,
                password: password,
                returnSecureToken: true
            }
        ).pipe(
            /**
             * catchError operator allows us to modify
             * 
             * we pass the method that handles the error
             */
            catchError(this.handleError),
            tap(resData => {
                /**
                 * we handle the authentication
                 */
                this.handleAuthentication(
                    resData.email,
                    resData.localId,
                    resData.idToken,
                    +resData.expiresIn);
            })
        );
    }

    /**
     * This method automatically will log the user when the applications starts, it will search
     * into the storage and check whether there is an existing user snapshot stored
     */
    autoLogin() {
        /**
         * Get the userData and parse that string
         */
        const userData: {
            email: string;
            id: string;
            _token: string;
            _tokenExpirationDate: string;
        } = JSON.parse(localStorage.getItem('userData'));

        /**
         * We check if the element exists
         */
        if (!userData) {
            return;
        }

        /**
         * We create a user object
         */
        const loadedUSer = new User(
            userData.email,
            userData.id,
            userData._token,
            new Date(userData._tokenExpirationDate)
        );

        /**
         * We check the token
         */
        if (loadedUSer.token) {
            /**
             * In case it hasn't been expired
             */
            this.user.next(loadedUSer);
            /**
             * -> We call autoLogout so we can start with the timer
             * -> Be aware that we substract our "_tokenExpirationDate" - "out current date" (both) 
             *    in miliseconds to get the amount of miliseconds that we should pass to the 
             *    "autoLogout()" function
             */
            const expiradtionDuration = new Date(userData._tokenExpirationDate).getTime() - new Date().getTime();
            this.autoLogout(expiradtionDuration);
        } else {
            /**
             * In case it has been expired
             */
            this.user.next(null);
        }
    }

    /**
     *  This method log us out 
     */
    logout() {
        /**
         * If we don't have a user we are already logged out
         */
        this.user.next(null);
        /**
         * we redirect here because we could logout in multiple ways or components
         */
        this.router.navigate(['/auth']);
        /**
         * We clear the item in the localstorage 
         */
        localStorage.removeItem('userData');

        /**
         * check if the timer exits
         */
        if (this.tokenExpirationTimer) {
            /**
             * we cleat our timeout
             */
            clearTimeout(this.tokenExpirationTimer);
        }

        /**
         * we set the attribute back to null
         */
        this.tokenExpirationTimer = null;
    }

    /**
     * When the token is expired our application logs us out
     * 
     * expirationDuration -> the amount of miliseconds until the token is invalid
     */
    autoLogout(expirationDuration: number) {
        /**
         * setTimeout() -> will execute after n time of miliseconds
         */
        this.tokenExpirationTimer = setTimeout(() => {
            this.logout();
        }, expirationDuration);
    }

    /**
     * This method handles the authentication
     */
    private handleAuthentication(email: string, localId: string, token: string, expiresIn: number) {
        /**
         * We create our user
         */
        /**
         * expiresIn -> has the number of seconds until the token expires
         * new Date.getTime() -> It's the current timestamp in miliseconds since the beginning
         *                       of time (1970) 
         * expirationDate -> takes the current timestamp in miliseconds and add the number of SECONDS 
         * until the token expires multiplied by * 1000 (to convert it in miliseconds), so finally we
         * have the expiration date in miliseconds which is passed as an argument to the Date object
         */
        const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
        const user = new User(
            email,
            localId,
            token,
            expirationDate);
        /**
         * We emit our user
         */
        this.user.next(user);

        /**
         * -> We call autoLogout so we can start with the timer
         * -> Be aware that we multiply "expiresIn" * 1000 with the purpose of converting the seconds
         *    to miliseconds
         */
        this.autoLogout(expiresIn * 1000);
        /**
         * -> Store the token in the localStorage
         * -> We storage the user data as a string
         */
        localStorage.setItem('userData', JSON.stringify(user));
    }
    /**
     * This method handles all errors from the requests made to the server
     */
    private handleError(errorRes: HttpErrorResponse) {
        console.log(errorRes);
        /**
         * Default message
         */
        let errorMessage = 'An unknown error occured!';
        /**
         * In here we check if the errorRes have not the error and the error.error key, 
         * if that is the case we will return our default message
         */
        if (!errorRes.error || !errorRes.error.error) {
            /**
             * throwError creates a new observable that wraps the error, because rjxs always
             * has to retrieve an error, so in the component we can subscribe and display the
             * error message that we stablish here
             */
            return throwError(errorMessage)
        }

        /**
         * We check for the error
         */
        switch (errorRes.error.error.message) {
            case 'EMAIL_EXISTS':
                errorMessage = 'This email exists already';
                break;
            case 'EMAIL_NOT_FOUND':
                errorMessage = 'This email does not exists';
                break;
            case 'INVALID_PASSWORD':
                errorMessage = 'this password is not correct';
                break;
        }

        return throwError(errorMessage);

    }
}