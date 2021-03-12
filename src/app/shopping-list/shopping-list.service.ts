import { Subject } from "rxjs";
import { Ingredient } from "../shared/ingredient.model";

export class ShoppingListService{
    
    private ingredients: Ingredient[] = [
        new Ingredient('Apples', 5),
        new Ingredient('Tomatoes', 10),
    ];
    
    shoppingListener = new Subject<Ingredient[]>();
    /**
     *  This is the Subject which will support the communication between
     *  Shopping-list.component and shopping-edit.component 
     */
    shoppingEditListener = new Subject<number>();
        
    getIngredients(){
        /**
         * This creates a copy of the list and returns the copy
         */
        return this.ingredients.slice();
    }

    /**
     * This method will return a copy of the ingredient int the index "index"
     */
    getIngredient(index: number){
        return this.ingredients[index];
    }
    /**
     * This method add a new ingredient that is passed as a parameter
     * and emit the new ingredients list using an EventEmitter
     */
    addIngredient(ingredient: Ingredient){
        this.ingredients.push(ingredient);
        this.shoppingListener.next(this.ingredients.slice());
    }
    /**
     * This function add multiple ingredients at a time using the spread operator (...)
     * which allows us to turn an array of elements into a list of elements
     */
    addIngredients(ingredients: Ingredient[]){
        this.ingredients.push(...ingredients);
        this.shoppingListener.next(this.ingredients.slice());
    }
    
    updateIngredient(index:number, newIngredient: Ingredient){
        /**
         * Updating the ingredient
         */
        this.ingredients[index] = newIngredient;
        this.shoppingListener.next(this.ingredients.slice());
    }
    
    deleteIngredient(index: number){
        /**
         * Delete the ingredient
         */
        this.ingredients.splice(index,1);
        /**
         * Emit the ingredient after deleting one element 
         * to the shopping-list.component.ts
         */
        this.shoppingListener.next(this.ingredients.slice());
    }

}