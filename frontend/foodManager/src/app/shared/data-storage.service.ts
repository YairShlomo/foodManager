import { Injectable, OnInit } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { RecipeService } from '../recipes/recipe.service';
import { Recipe } from '../recipes/recipe.model';
import { map, tap, take, exhaustMap } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';
import { environment } from '../../environments/environment';
import { User } from '../auth/user.model';
import { ShoppingListService } from '../shopping-list/shopping-list.service';
import { Ingredient } from './ingredient.model';
@Injectable({ providedIn: 'root' })
export class DataStorageService {
  public email: String;
  constructor(
    private http: HttpClient,
    private recipeService: RecipeService,
    private authService: AuthService,
    private shoppingListService: ShoppingListService
  ) {
    /*
    authService.user.subscribe((user) => {
      console.log(user.email)
      this.email = user.email;
    });
*/
  }

  storeRecipes() {
    const recipes = this.recipeService.getRecipes();
    this.http
      .put(`${environment.JPA_API_URL}/users/${this.email}/recipes`, recipes)
      .subscribe((response) => {
        console.log(response);
      });
  }

  fetchRecipes() {
    return this.http
      .get<Recipe[]>(`${environment.JPA_API_URL}/users/${this.email}/recipes`)
      .pipe(
        //map is rxjs operator
        map((recipes) => {
          //map is js array method
          return recipes.map((recipe) => {
            return {
              ...recipe,
              ingredients: recipe.ingredients ? recipe.ingredients : [],
            };
          });
        }),
        tap((recipes) => {
          this.recipeService.setRecipes(recipes);
        })
      );
  }

  storeShoppingList() {
    const ingredients = this.shoppingListService.getIngredients();
    for (let ing of ingredients) {
      console.log(ing.ing_id)
      console.log(ing.name)
      console.log(ing.amount)
    }
    this.http.put(`${environment.JPA_API_URL}/users/${this.email}/ingredients`,ingredients)
    .subscribe((response) =>{
      console.log(response);
    })
  }

  fetchShoppingList() {
    return this.http
    .get<Ingredient[]>(`${environment.JPA_API_URL}/users/${this.email}/ingredients`)
    .pipe(
      tap((ingredients) => {
        this.shoppingListService.setIngredients(ingredients);
      })
    )
  }
}
