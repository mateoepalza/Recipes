import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from "@angular/router";
import { Observable } from "rxjs";
import { DataStorageService } from "src/app/shared/data-storage.service";
import { Recipe } from "../recipe.model";
import { RecipeService } from "../recipe.service";

@Injectable()
export class ResolverService implements Resolve<Recipe>{

    constructor(private recipeService: RecipeService, private dataStorageService: DataStorageService) { }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Recipe> | Promise<Recipe> | Recipe {
        /**
         * It's important to see that in here we are creating an observable that will be
         * complete once the recipe Array is fetch and loaded in the the Recipeservice
         * that's why we are using the subscribe to be notified when we should emit and
         * complete our observable 
         */
        return Observable.create((observer) => {
            const recipes = this.recipeService.getRecipes();
            /**
             * Be aware that if we already have some recipes there's no
             * need for retrieving again all the array of recipes
             */
            if (recipes.length > 0) {
                observer.next(this.recipeService.getRecipe(+route.params['id']));
                observer.complete();
            } else {
                this.dataStorageService.fetchRecipes().subscribe(() => {
                    observer.next(this.recipeService.getRecipe(+route.params['id']));
                    observer.complete();
                });
            }

        });

    }

}