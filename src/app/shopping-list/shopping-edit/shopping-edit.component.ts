import {
  Component,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { LogginService } from 'src/app/loggin.service';

import { Ingredient } from '../../shared/ingredient.model';
import { ShoppingListService } from '../shopping-list.service';

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css']
})
export class ShoppingEditComponent implements OnInit, OnDestroy {

  /**
   * i get to the reference of the form created in the HTML
   */
  @ViewChild('f') shoppingForm: NgForm; 
  editmode = false;
  editedItemIndex: number;
  editedItem : Ingredient;
  /**
   * we keep the subscription, because we need to destroy it when the
   * lifecycle hook "OnDestroy" is executed 
   */
  subscription: Subscription;

  constructor(private shoppingListService: ShoppingListService, private logginService: LogginService) { }

  ngOnInit() {

    /**
     * This subscription receive an index of the ingredients array
     */
    this.subscription = this.shoppingListService.shoppingEditListener.subscribe((index: number)=>{
      this.editmode = true;
      this.editedItemIndex = index;
      /**
       * The ingredient is returned
       */
      this.editedItem = this.shoppingListService.getIngredient(index);
      /**
       * The Form is updated with the ingredient that was selected
       */
      this.shoppingForm.setValue({
        'name': this.editedItem.name,
        'amount': this.editedItem.amount
      })
    });
    
    
    this.logginService.printLog("Hello from shopping-listComponent ngOnInit");
  }

  onAddItem() {
    /**
     * Get the value of the controls
     */
    const ingName = this.shoppingForm.value.name;
    const ingAmount = this.shoppingForm.value.amount;
    const newIngredient = new Ingredient(ingName, ingAmount);

    if(this.editmode){
      /**
       * In case the editmode is activated we should update the ingredient
       */
      this.shoppingListService.updateIngredient(this.editedItemIndex, newIngredient)
      
    }else{
      /**
       * Take the new Ingredient and call the method from the ShoppingListService
       * that adds a new ingredient into the list 
       */
      this.shoppingListService.addIngredient(newIngredient);
    }

      /**
       * Update the status of the form
       */
      this.editmode = false;

    /**
     * This is form resetting the form
     */
    this.shoppingForm.reset();
    
  }
  
  onClear(){
    /**
     * This reset the form and change the form to a "normal" mode
     */
    this.shoppingForm.reset();
    this.editmode = false;
  }

  onDelete(){
    /**
     * This deletes the ingredient that is listed into the the "editItemIndex"
     */
    this.shoppingListService.deleteIngredient(this.editedItemIndex);
    /**
     * Clear the form after deleting the ingredient
     */
     this.shoppingForm.reset();
    /**
     * Update the editmode
     */
    this.editmode = false;
  }
  
  ngOnDestroy(){
    /**
     * Destroy the subscription
     */
    this.subscription.unsubscribe();
  }

}
