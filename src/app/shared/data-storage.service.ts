import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { exhaustMap, map, take, tap } from "rxjs/operators";
import { AuthService } from "../auth/auth.service";
import { Recipe } from "../recipes/recipe.model";
import { RecipeService } from "../recipes/recipe.service";

@Injectable({
    providedIn: "root"
})
export class DataStorageService {
    constructor(private http: HttpClient, private recipeService: RecipeService, private authService: AuthService) {
    }

    storeRecipes() {
        /**
         * Get all the recipes
         */
        const recipes = this.recipeService.getRecipes();
        /**
         * update all the recipes into firebase
         */
        this.http.put(
            "https://ng-recipe-book-b388c-default-rtdb.firebaseio.com/recipes.json",
            recipes
        ).subscribe(response => {
            console.log(response);
        });

    }

    /**
     * It's important to understand that we need to send the token that was stored when we logged in
     * because from now on we will need that token in order to send a request to the server
     */
    fetchRecipes(){
        return this.http.get<Recipe[]>(
                "https://ng-recipe-book-b388c-default-rtdb.firebaseio.com/recipes.json",
        ).pipe(
            map( resRecipe =>{
                return resRecipe.map( recipeEleme =>{
                    return { ...recipeEleme, ingredient: recipeEleme.ingredients ? recipeEleme.ingredients : []}
                })
            }),
            tap( recipes => {
                this.recipeService.setRecipes(recipes);
            })
        )
    }
    /**fetchRecipes() {
        /**
         * -> In here we reached out to the BehaviorSubject but keep in mind that we don't want to be 
         *    notified in every update to the user object, we want to get the currently user just once,
         *    for that we are going to use a pipe operator called "take(n)", this operator is going to
         *    take n values from the observable and thereafter it should automatically unsubscribe 
         * 
         * -> Be aware that "authService.user" and "http.get" are different obsevables, and that we want
         *    the user value from the resolved service "authService.user" to do the second request on the
         *    observable "http.get" (so basically we want the first to finish in order to execute the 
         *    second one and we want to return the observable of the second one "http.get"). So in order
         *    to do that we will use another operator called "exhaustMap" which is going to wait for the 
         *    first obsevable, for the "authService.user" observable to complete, and thereafter it gives
         *    us the user that is passed in the "exhaustMap" as a parameter, and in that function we will
         *    return our second observable "http.get" which is going to replace our previous observable 
         *    in the entire observable chain (it is important to understand that it is replaced because 
         *    before "exhaustMap" we are using the "take(1)" which is going to unsubcribe after receiving
         *    one element in this case).
         * -> Now regarding to the Pipe operators of the get request be aware that we are using them
         *    in the first observable (the one that is outside)
         * -> we return the overall observable that in the end is converted into the "http.get" observable
         * 
         * -> Be also aware that we are sending the token as a parameter to firebase "auth"
         *
        return this.authService.user.pipe(take(1), exhaustMap(user => {
            return this.http.get<Recipe[]>(
                "https://ng-recipe-book-b388c-default-rtdb.firebaseio.com/recipes.json",
                {
                    params: new HttpParams().set('auth', user.token)
                }
            );
        }), /**
                 * We add the map operator with the purpose of check either the response have or not 
                 * a ingredients array, because if ones have it and others not we can
                 * have an error in another part of our application
                 *
            map(data => {
                /**
                 * be aware that we are using a method .map() that is created for arrays,
                 * map() => allows us to transform the element in an array, it takes an anonymous
                 * function which is executed for every element and we return the transformed recipe
                 *
                return data.map(recipe => {
                    return {
                        /**
                         * spread operator allows us to copy all the properties of recipe, to
                         * copy all the existing data 
                         *
                        ...recipe,
                        /**
                         * In here we check whether recipe.ingredients exists, if it exists we won't
                         * modify it's value, on the contrary we will create the element as a empty array
                         *
                        ingredient: recipe.ingredients ? recipe.ingredients : []
                    }
                });
            }),
            tap(recipes => {
                /**
                * Update the list of recipes
                *
                this.recipeService.setRecipes(recipes);
            })
        )
    }*/
}