import { Recipe } from './recipe.model';
import { Injectable } from '@angular/core';
import { Ingredient } from '../shared/ingredient.model';
import { ShoppingListService } from '../shopping-list/shopping-list.service';
import { Subject } from 'rxjs';

@Injectable()
export class RecipeService {
  recipesChanged = new Subject<Recipe[]>();
  private recipes: Recipe[] = [
    new Recipe('A Test Recipe',
    'This is a test',
    'https://www.bbcgoodfood.com/sites/default/files/styles/recipe/public/recipe/recipe-image/2018/07/epic-summer-salad.jpg?itok=RbLJZDhs',
    [
      new Ingredient('salt',2),
      new Ingredient('sugar',3)
    ]),
    new Recipe('Another Test Recipe',
    'This is a test',
    'https://www.bbcgoodfood.com/sites/default/files/styles/recipe/public/recipe/recipe-image/2018/07/epic-summer-salad.jpg?itok=RbLJZDhs',
    [
      new Ingredient('pepper',3),
      new Ingredient('banana',1)
    ]),
  ];

  constructor(private sLService: ShoppingListService) { }

  getRecipes() {
    //slice for not changing the array from outside. returns copy array.
    return this.recipes.slice();
  }

  getRecipe(index: number) {
    return this.recipes[index];
  }

  addIngredientsToShoppingList(ingredients: Ingredient[]) {
    this.sLService.addIngredients(ingredients);
  }

  addRecipe(recipe: Recipe) {
    this.recipes.push(recipe);
    this.recipesChanged.next(this.recipes.slice());
  }

  updateRecipe(index:number,newRecipe: Recipe) {
    this.recipes[index] = newRecipe;
    this.recipesChanged.next(this.recipes.slice());
  
  }
}
