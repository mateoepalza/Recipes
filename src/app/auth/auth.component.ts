import { Component } from "@angular/core";
import { NgForm } from "@angular/forms";
import { Router } from "@angular/router";
import { Observable } from "rxjs";
import { AuthService } from "./auth.service";
import { AuthResponseData } from "./auth.service";

@Component({
    selector: 'app-auth',
    templateUrl: "./auth.component.html"
})
export class AuthComponent {
    /**
     * This property allows us to check if we are logging in or signing up
     */
    isLoginMode = true;
    /**
     * This property allows us to check is we are waiting for a response or not
     */
    isLoading = false;
    /**
     * We want to store the error message
     */
    error: string = null;

    constructor(private authService: AuthService, private router: Router) { }

    onSwitchMode() {
        this.isLoginMode = !this.isLoginMode;
    }

    onSubmit(form: NgForm) {
        /**
         * We check if the form is valid
         */
        if (!form.valid) {
            return;
        }
        /**
         * we get the properties of the form
         */
        const email = form.value.email;
        const password = form.value.password;

        /**
         *  because the login and the sign up have the same way of handling the observable
         *  we can create a variable of type Observable and use the same way of handling in 
         *  this element 
         */
        let authObs: Observable<AuthResponseData>;


        /**
         * Before doing the request we change the status of isLoading
         */
        this.isLoading = true;
        if (this.isLoginMode) {
            /**
             * we "save" the obsevable returned by the service
             */
            authObs = this.authService.login(email, password);
        } else {
            /**
             * we "save" the observable returned by the service
             */
            authObs = this.authService.signUp(email, password)
        }

        authObs.subscribe((resData) => {
            /**
             * we update the isLoading property to false
             */
            console.log(resData);
            this.isLoading = false;
            /**
             * Once the user is logged in we redirect the user to recipes
             */
            this.router.navigate(['/recipes']);
        },
            /**
             * The errorMessage is simply a message that we stablished in the service
             */
            errorMessage => {
                console.log(errorMessage)
                /**
                 * Update our message attribute
                 */
                this.error = errorMessage;
                /**
                 * We udpate the isLoading property to false
                 */
                this.isLoading = false;
            });


        /**
         * We reset the form
         */
        form.reset();
    }
    
    onHandleError(){
        this.error = null;
    }
}