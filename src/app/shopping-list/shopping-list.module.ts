import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { LogginService } from "../loggin.service";
import { SharedModule } from "../shared/shared.module";

import { ShoppingEditComponent } from "./shopping-edit/shopping-edit.component";
import { ShoppingListRoutingModule } from "./shopping-list-routing.module";
import { ShoppingListComponent } from "./shopping-list.component";

@NgModule({
    declarations: [
        ShoppingListComponent,
        ShoppingEditComponent,
    ],
    imports: [
        FormsModule,
        ShoppingListRoutingModule,
        SharedModule
    ],
    exports: [],
    providers: [
        //LogginService
    ]
})
export class ShoppingListModule {

}