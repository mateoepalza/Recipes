import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AuthGuard } from "../auth/auth.guard";
import { RecipeDetailComponent } from "./recipe-detail/recipe-detail.component";
import { ResolverService } from "./recipe-detail/resolver.service";
import { RecipeEditComponent } from "./recipe-edit/recipe-edit.component";
import { RecipeStartComponent } from "./recipe-start/recipe-start.component";
import { RecipesComponent } from "./recipes.component";

/**
 * Be aware that we are defining a different module for the routing of recipes
 */
const routes: Routes = [
    {
        /**
         * In order to apply the lazy loading it's important to having the routes registered
         * inside the module, in this case the recipes.module.ts (the feature module needs to
         * bring it's own routes config)
         * 
         * The path is now an empty path because in the app-routing.module.ts we are going to define
         * the path and we will tell aungular that it should load the recipes module
         */
        path: '', component: RecipesComponent,
        /**
         * we add canActivate key where we stablish our guard
         */
        canActivate: [AuthGuard],
        children: [
            /**
             * The folllowing path load automatically the component
             */
            { path: '', component: RecipeStartComponent },
            { path: 'new', component: RecipeEditComponent },
            {
                path: ':id', component: RecipeDetailComponent,
                resolve: {
                    recipeItem: ResolverService,
                }
            },
            {
                path: ':id/edit',
                component: RecipeEditComponent,
                resolve: {
                    recipeItem: ResolverService
                }
            }
        ]
    },

]
@NgModule({
    /**
     * In here be aware that we are defining .forChild() instead of  .forRoot()
     * 
     * forRoot() -> should be used once in the "base" module, in this case we are talking
     *              about the app module
     * 
     * forChild() -> should be use in the feature modules which you then plan on importing into
     *               your app module. This forChild() will automatically merge the child routing 
     *               configuration.
     */
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class RecipesRoutingModule { }

