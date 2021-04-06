import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Recipe } from '../recipe.model';
import { RecipeService } from '../recipe.service';

@Component({
  selector: 'app-recipe-edit',
  templateUrl: './recipe-edit.component.html',
  styleUrls: ['./recipe-edit.component.css']
})
export class RecipeEditComponent implements OnInit {

  id:number;
  editMode = false;
  formRecipeEdit: FormGroup;

  constructor(private route: ActivatedRoute, private recipeService: RecipeService, private router: Router) { }

  get ingredientsControls(){
    // we stablish a getter which will return all the controls in the ingredients of the FormArray
    return (this.formRecipeEdit.get('ingredients') as FormArray).controls;
  }

  ngOnInit(): void {
    /**
     * We subscribe to the params in case the URL change whe we
     * are currently in it
     */
    this.route.params.subscribe((params: Params) => {
      this.id = +params['id'];
      /**
       * We compare if the id exists, in case that it does
       * the value assigned is true otherwise the value is false
       */
      this.editMode = params['id'] != null;
      /**
       * We call he method which will create the form
       */
      this.initForm();
    })
  }

  initForm(){
    
    /**
     * In here we create our own form which depends if the editmode
     * is true or not, in case is true we have to call our recipeService
     * querying all the data of the recipe id
     */
    let recipeName="";
    let recipeImagePath = "";
    let recipeDescription = "";
    let recipeIngredients = new FormArray([]);

    if(this.editMode){
      /**
       * Search the recipe via it's id in the recipeService 
       */
      const recipe = this.recipeService.getRecipe(this.id); 
      recipeName = recipe.name;
      recipeImagePath = recipe.imagePath;
      recipeDescription = recipe.description;
      /**
       * if there are ingredients, we should loop over all of them
       */
      if (recipe['ingredients']){
        for (let ingredient of recipe.ingredients){
          /**
           * Be aware that a ingredient is compose of name and amount
           * so they should be group in a FormGroup, and inside the formGroup
           * we should define the name control and the amount control
           */
          recipeIngredients.push(new FormGroup({
            'name': new FormControl(ingredient.name, [Validators.required]),
            'amount' : new FormControl(ingredient.amount, [Validators.required, Validators.pattern(/^[1-9]+[0-9]*$/)])
          }))
        }
      }
    }

    /**
     * In here we create our form for the recipe, be aware that
     * we are assigning a default value either "" or "something"
     * that is return from the recipeService
     */
    this.formRecipeEdit = new FormGroup({
      'name':new FormControl(recipeName,[Validators.required]),
      'imagePath' : new FormControl(recipeImagePath, [Validators.required]),
      'description' : new FormControl(recipeDescription, [Validators.required]),
      'ingredients' : recipeIngredients
    });
  }
  
  /**
   * this is the method once the form is submitted
   */
  onSubmit(){
    /**
     * We create a new recipe that will be use as a new recipe or it will be
     * updating an old recipe
     */
    const nRecipe = new Recipe(
      this.formRecipeEdit.value['name'], 
      this.formRecipeEdit.value['description'], 
      this.formRecipeEdit.value['imagePath'], 
      this.formRecipeEdit.value['ingredients']);
    
    if(this.editMode){
      /**
       * if editmode is activated
       */
      this.recipeService.updateRecipe(nRecipe,this.id);

    }else{
      /**
       * if the editmode is not activated
       */
      this.recipeService.addRecipe(nRecipe);
    }
    
    this.router.navigate(['../'], {relativeTo: this.route});
  }

  onCancelSubmit(){
    this.router.navigate(['../'], {relativeTo: this.route});
  }
  
  /**
   * Adding new ingredients
   */

  onAddIngredients(){
    /**
     * Create a new FormGroup that should use the controls 'name' and 'amount',
     * and add them into the ingredients.list
     */
    (<FormArray>this.formRecipeEdit.get('ingredients')).push(new FormGroup({
      'name' : new FormControl(null, [Validators.required]),
      'amount': new FormControl(null, [Validators.required, Validators.pattern(/^[1-9]+[0-9]*$/)])
    }));
  }
  
  onDeleteIngredient(index: number){
    /**
     * This removes the formControl at the position "index"
     */
    (<FormArray>this.formRecipeEdit.get("ingredients")).removeAt(index);
    /**
     * if for some reason  we need to delete all the items in a FormArray
     * we could use the following:
     * (<FormArray> this.formRecipeEdit.get("ingredients")).clear()
     */
  }
}
