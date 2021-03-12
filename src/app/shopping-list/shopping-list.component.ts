import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { Ingredient } from '../shared/ingredient.model';
import { ShoppingListService } from './shopping-list.service';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.css']
})
export class ShoppingListComponent implements OnInit, OnDestroy{
  
  ingredients: Ingredient[]; 
  private subscription: Subscription

  constructor(private shoppingListService: ShoppingListService) { }

  ngOnInit() {
    /**
     * This calls the ingredients that are on the ShoppingListService (The initial ingredients)
     */
    this.ingredients = this.shoppingListService.getIngredients();
    /**
     * In here we are subscribing into the Service EventEmitter and we are updating 
     * the ingredients attribute with the ingredients that comes from the Event
     */
    this.subscription = this.shoppingListService.shoppingListener.subscribe((ingredient: Ingredient[]) => {
      this.ingredients = ingredient;
    })
  }
 
  onClickIngredient(index : number){
    /**
     * This method uses a subject in order to pass the information to "Shopping-edit.component"
     */
    this.shoppingListService.shoppingEditListener.next(index); 
  }

  ngOnDestroy(){
    /**
     * Destroy the subscription preventing a memory leak
     */
    this.subscription.unsubscribe();
  }

}
