import { Component, OnDestroy, OnInit} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { Recipe } from '../recipe.model';
import { RecipeService } from '../recipe.service';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.css']
})
export class RecipeListComponent implements OnInit, OnDestroy {
  
  recipes : Recipe[];
  subscription : Subscription;

  constructor(private recipeService: RecipeService, private router:Router, private route: ActivatedRoute) { }

  /**
   * In here we are calling the getter of the recipe on the RecipeService
   */
  ngOnInit() {
    /**
     * Get the inital recipes
     */
    this.recipes = this.recipeService.getRecipes();
    /**
     * Create a subscription which will tell me when the recipe list was updated
     */
    this.subscription = this.recipeService.recipeListener.subscribe((data: Recipe[])=>{
      this.recipes = data;
    });
  }
  
  ngOnDestroy(){
    /**
     * We delete the subscription just to make sure that there's not a memory leak
     */
    this.subscription.unsubscribe();
  }

  onNewRecipe(){
    this.router.navigate(['new'], {relativeTo: this.route});
  }
}
