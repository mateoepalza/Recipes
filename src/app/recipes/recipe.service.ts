import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { Ingredient } from "../shared/ingredient.model";
import { ShoppingListService } from "../shopping-list/shopping-list.service";
import { Recipe } from "./recipe.model";

@Injectable()
export class RecipeService{
    
  recipeListener = new Subject<Recipe[]>(); 

  private recipes: Recipe[] = [];
  /*private recipes: Recipe[] = [
    new Recipe(
      'A Test Recipe', 
      'This is simply a test', 
      'https://upload.wikimedia.org/wikipedia/commons/1/15/Recipe_logo.jpeg',
      [ 
        new Ingredient('Cheese',2),
        new Ingredient('Bread',2),
        new Ingredient('meat',3),
        new Ingredient('lettuce',2),
      ]),
    new Recipe(
      'Another Test Recipe',
      'This is simply a test', 
      'https://upload.wikimedia.org/wikipedia/commons/1/15/Recipe_logo.jpeg',
      [
        new Ingredient('rice',2),
        new Ingredient('french fries',2),
        new Ingredient('tomato',2),
        new Ingredient('cheese',2),
      ]
      )
  ];*/

  constructor(private shoppingListService: ShoppingListService){
  }

  setRecipes(recipes: Recipe[]){
    this.recipes = recipes;
    this.recipeListener.next(this.recipes.slice());
  }

  getRecipes(){
    /**
     * This slice() function creates a copy of the recipes 
    */
    return this.recipes.slice();
  }
  getRecipe(id: number){
    return this.recipes[id];
  }
  
  updateRecipe(recipe: Recipe, index: number){
    /**
     * We update the old recipe with the new one
     */
    this.recipes[index] = recipe;
    /**
     * Emit the new list o recipes to the recipe.list.component
     */
    this.recipeListener.next(this.recipes.slice());
  }
  
  addRecipe(recipe: Recipe){
    /**
     * add a new recipe to the list
     */
    this.recipes.push(recipe);
    /**
     * Emit the new list of recipes to the recipe.list.component
     */
    this.recipeListener.next(this.recipes.slice());
  }
  
  addIngredientsToShoppingList(ingredients: Ingredient[]){
    this.shoppingListService.addIngredients(ingredients);
  }
  
  deleteRecipe(index : number){
    /**
     * Delete the recipe in the "index" position
     */
    this.recipes.splice(index, 1);
    /**
     * Emit the new list of recipes to the recipes-list.component
     */
    this.recipeListener.next(this.recipes.slice());
  }
}