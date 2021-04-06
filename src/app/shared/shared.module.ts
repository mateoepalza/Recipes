import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { LogginService } from "../loggin.service";
import { AlertComponent } from "./alert/alert.component";
import { DropdownDirective } from "./dropdown.directive";
import { LoadingSpinnerComponent } from "./loading-spinner/loading-spinner.component";

/**
 * The idea here is that you still now declare or import anything into this module
 * that might be used by other modules but since each module works alone, it's needed to
 * also export all these things which we are importing. So another modules can use the components
 * that we use here
 *
 * Now the idea is that whenever we import the shared module, we have access to all these features
 * which we initialize here. So in other modules, where we want to use one or all of these features,
 * we don't have to add them to their module we just have to import the shred module and we got access
 * because we are exporting all these stuff
 * 
 * IMPORTANT
 * It's important to understant that we can only define or declare components, directives and pipes once,
 * you can't do that multiple times, if we need a component in multiple modules we can instead import the 
 * module in which we defined the component in the exports[] array
 *
 */
@NgModule({
    declarations: [
        LoadingSpinnerComponent,
        DropdownDirective,
        AlertComponent
    ],
    imports: [
        CommonModule
    ],
    exports: [
        LoadingSpinnerComponent,
        AlertComponent,
        DropdownDirective,
        CommonModule
    ],
    providers: [
        LogginService
    ]
})
export class SharedModule {

}