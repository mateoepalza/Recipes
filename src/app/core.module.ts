import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { AuthInterceptorService } from "./auth/auth-interceptor.service";
import { ResolverService } from "./recipes/recipe-detail/resolver.service";
import { RecipeService } from "./recipes/recipe.service";
import { ShoppingListService } from "./shopping-list/shopping-list.service";

/**
 * The idea of this module is simply to provide all the services that are application-wide
 * in here so we can have a leaner application because then we have a place where we can see all
 * this core services of the application
 * 
 * IMPORTANT
 * -> There is no need to export the services because services work differently than declarations,
 *    services are automatically injected on a root level. (services are an exception)
 */
@NgModule({
    declarations: [],
    imports: [],
    providers: [
        ShoppingListService,
        RecipeService,
        ResolverService,
        /**
         * We tell angular that we are using an interceptor
         * useClass -> The interceptor's class
         * multi -> If we want to use multiple interceptors
         */
        {
            provide: HTTP_INTERCEPTORS,
            useClass: AuthInterceptorService,
            multi: true
        }
    ]
})
export class CoreModule {

}