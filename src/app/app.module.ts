import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';
//import { RecipesModule } from './recipes/recipes.module';
//import { ShoppingListModule } from './shopping-list/shopping-list.module';
import { SharedModule } from './shared/shared.module';
import { CoreModule } from './core.module';
//import { AuthModule } from './auth/auth.module';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
  ],
  /**
   * Be aware that in here we are importing our RecipesModule and all the elements that we declared
   * in the exports[] array
   * 
   * The imports array in NgModule is there for Angular to add features of other NgModules into 
   * this NgModule
   */
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    /**
     * Be aware that we can not define the RecipeModule here because we are loading it lazily which means
     * that we are trying to load it on demand so we wouldn't want to load that from the beginning so
     * we should not have it in here
     */
    //RecipesModule,
    /**
     * We delete the element because we are not loading it right away, we are using lazy loading
     */
    //ShoppingListModule,
    /**
     * We import the SharedModule here because we are using the dropdown directive in the header component
     */
    SharedModule,
    /**
     * The idea of this module is to simply provide all the services that are application wide inside
     * of this module and the simply import that module
     */
    CoreModule,
    //AuthModule
    
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
