import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { ShoppingListComponent } from "./shopping-list.component";

const routes: Routes = [
    { path: '', component: ShoppingListComponent },
]

@NgModule({
    /**
     * forChild() because we are in a feature module and we are appending to the forRoot() routes
     * defined in the app module
     */
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ShoppingListRoutingModule{

}