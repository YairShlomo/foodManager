import { Ingredient } from '../shared/ingredient.model';
import { EventEmitter } from '@angular/core';

export class ShoppingListService {
  ingredientsChanged = new EventEmitter<Ingredient[]>();

  ingredients: Ingredient[] = [
    new Ingredient('Apples',5),
    new Ingredient('Bananas',3)
  ]

  constructor() { }

  getIngredients() {
    //slice for not changing the array from outside. returns copy array.
    return this.ingredients.slice();
  }

  addIngredient(ingredient: Ingredient) {
    this.ingredients.push(ingredient);
    this.ingredientsChanged.emit(this.ingredients.slice())
  }

  addIngredients(ingredients: Ingredient[]) {
    console.log(ingredients)
    this.ingredients.push(...ingredients);
    this.ingredientsChanged.emit(this.ingredients.slice())
  }
}
