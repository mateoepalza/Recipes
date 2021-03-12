import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { AuthComponent } from "./auth/auth.component";
import { AuthGuard } from "./auth/auth.guard";
import { RecipeDetailComponent } from "./recipes/recipe-detail/recipe-detail.component";
import { ResolverService } from "./recipes/recipe-detail/resolver.service";
import { RecipeEditComponent } from "./recipes/recipe-edit/recipe-edit.component";
import { RecipeStartComponent } from "./recipes/recipe-start/recipe-start.component";
import { RecipesComponent } from "./recipes/recipes.component";
import { ShoppingListComponent } from "./shopping-list/shopping-list.component";

const routes = [
    { path: '', redirectTo: '/recipes', pathMatch: 'full' },
    {
        path: 'recipes', component: RecipesComponent, 
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
    { path: 'shopping-list', component: ShoppingListComponent },
    { path: 'auth', component: AuthComponent }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {

}