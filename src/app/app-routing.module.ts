import { NgModule } from "@angular/core";
import { PreloadAllModules, RouterModule } from "@angular/router";

const routes = [
    { path: '', redirectTo: '/recipes', pathMatch: 'full' },
    /**
     * In here we stablish the path that we deleted from the recipes-routing.module.ts
     * 
     * loadChildren -> tells angular to only load the code content or the module that 
     *                 we specify when any user visits this path here
     * 
     * loadChildren(path) -> We specify the path to the module that we want to load when the path 'recipes'
     *                       is visited
     *                    -> beside the path we need to add the name of the module (the class) in this case
     *                       "RecipesModule" because technicallly it will go to that path and then tried
     *                       to dynamically import a specific object from that file and theoretically it 
     *                       could be named anything. So we specify the name after #, so in this case is
     *                       #RecipesModule
     * 
     * how this works? -> When we use loadChildren we tell angular to take all the declarations of that
     *                    module that we specify and put them into a separate code bundle which is then
     *                    downloaded and parsed on demand as soon as a user visits this page but not sooner
     */
    // old approach
    { path: 'recipes', loadChildren: './recipes/recipes.module#RecipesModule'},
    { path: 'shopping-list', loadChildren: './shopping-list/shopping-list.module#ShoppingListModule'},
    { path: 'auth', loadChildren: './auth/auth.module#AuthModule' }

    // new approach -> i don't use it because we have to activate a flag
    /*{
        path: 'recipes', 
        loadChildren: () => import('./recipes/recipes.module').then(m => m.RecipesModule)
    }*/
];
@NgModule({
    /**
     * preloadAllModules => with this, we are telling angular that generally we are using lazy loading,
     *                      so it will not put all that code into one bundle, it will split it ,but it will
     *                      preload the bundles as soon as possible.
     * 
     * => So basically in this application this will load a first bundle that will be really small (so the
     *    initial loading phase is fast) but then when the user is browsing the page and we have some idle
     *    time anways, then we preload these additional code bundles to make sure that subsequent navigation
     *    requests are faster, so we are getting the best of both worlds, a fast initial load and thereafter
     *    , fast subsequents loads
     */
    imports: [RouterModule.forRoot(routes, {preloadingStrategy: PreloadAllModules})],
    exports: [RouterModule]
})
export class AppRoutingModule {}