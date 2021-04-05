
import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { SharedModule } from "../shared/shared.module";

/**
 * It's important to have these imports only in here because if we add those imports
 * in another module we will be loading those imports in the bundle created by that module,
 * so the lazy loading wouldn't have the same effect because we would be loading the same
 * element twice or more
 */
import { RecipeDetailComponent } from "./recipe-detail/recipe-detail.component";
import { RecipeEditComponent } from "./recipe-edit/recipe-edit.component";
import { RecipeItemComponent } from "./recipe-list/recipe-item/recipe-item.component";
import { RecipeListComponent } from "./recipe-list/recipe-list.component";
import { RecipeStartComponent } from "./recipe-start/recipe-start.component";
import { RecipesRoutingModule } from "./recipes-routing.module";
import { RecipesComponent } from "./recipes.component";

@NgModule({
    /**
     * In here we declare all the components, directives and custom pipes that are part of this module
     */
    declarations: [
        RecipesComponent,
        RecipeListComponent,
        RecipeDetailComponent,
        RecipeItemComponent,
        RecipeStartComponent,
        RecipeEditComponent,
    ],
    /**
     * Something really important here is that everything we use in our components such as Router, Forms,
     * ngIf or ngFor, pipes, etc.. we gotta import it here because each module works for it's own, so nothing 
     * that we use in the app component we can use it here. (The only exception are services)
     * 
     * CommonModule -> allows us to use ngIf, ngFor, etc.. (Be aware that in the app module we import the
     *                 BrowserModule that uses the CommonModule inside and other things)
     * 
     * ReactiveModule -> we import it again because in some components of the recipe module we use the
     *                   ReactiveForms approach
     */

    imports:[
        RecipesRoutingModule, 
        ReactiveFormsModule,
        SharedModule
    ],
    /**
     * In here we specify all the element that other modules (Other components in other modules) will use
     */
    exports: [
        
    ]
})
export class RecipesModule {

}