import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Data, Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { Recipe } from '../recipe.model';
import { RecipeService } from '../recipe.service';

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.css']
})
export class RecipeDetailComponent implements OnInit, OnDestroy {
  recipe: Recipe;
  private recipeSubscription: Subscription;

  constructor(private route: ActivatedRoute, private router: Router, private recipeService: RecipeService) { }

  ngOnInit() {
    this.recipeSubscription = this.route.data.subscribe((data:Data) =>{
      this.recipe = data['recipeItem'];
    });
  }
  
  onEditRecipe(){
    this.router.navigate(['edit'],{relativeTo:this.route});
  }
  
  onAddToShoppingList(){
    this.recipeService.addIngredientsToShoppingList(this.recipe.ingredients);
  }
  
  onDeleteRecipe(){
    /**
     * Delete the recipe in the service
     */
    this.recipeService.deleteRecipe(this.route.params['id']);
    /**
     * Route to another place
     */
    this.router.navigate(['recipes']);
  }
  
  ngOnDestroy(){
    this.recipeSubscription.unsubscribe();
  }
}
