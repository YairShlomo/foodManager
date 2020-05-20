/*
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



@Injectable()
export class RecipeEffects {
  @Effect()
  fetchRecipes = this.actions$.pipe(
    ofType(RecipesActions.FETCH_RECIPES),
    switchMap((recipeData: RecipesActions.FetchRecipes) => {
      return this.http.get<Recipe[]>(
        `${environment.JPA_API_URL}/users/${recipeData.payload}/recipes`
      );
    }),
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
    map((recipes) => {
      const id = null;
      const setRecipes = [...recipes];
      for (var i = 0; i < setRecipes.length; i++) {
        const updatedRecipe = { ...setRecipes[i], recipeId: id };
        setRecipes[i] = updatedRecipe;
      }
      return new RecipesActions.SetRecipes(setRecipes);
    })
  );
*/

import { HttpClient } from '@angular/common/http';
import { Store } from '@ngrx/store';
import * as fromApp from '../../store/app.reducer';
import { Actions, Effect, ofType } from '@ngrx/effects';
import * as ShoppingListActions from '../store/shopping-list.actions';
import { environment } from 'src/environments/environment';
import { Ingredient } from 'src/app/shared/ingredient.model';
import { switchMap, map, withLatestFrom } from 'rxjs/operators';
import { Injectable } from '@angular/core';

@Injectable()
export class ShoppingListEffects {
  @Effect()
  fetchShoppingList = this.actions$.pipe(
    ofType(ShoppingListActions.FETCH_SL),
    switchMap((slData: ShoppingListActions.FetchShoppingList) => {
      return this.http.get<Ingredient[]>(
        `${environment.JPA_API_URL}/users/${slData.payload}/ingredients`
      );
    }),
    map((ingredients) => {
      return new ShoppingListActions.SetShoppingList(ingredients);
    })
  );

  @Effect({ dispatch: false })
  storeShoppingList = this.actions$.pipe(
    ofType(ShoppingListActions.STORE_SL),
    withLatestFrom(this.store.select('shoppingList'), this.store.select('auth')),
    switchMap(([actionData, slState, authState]) => {
      return this.http.put(`${environment.JPA_API_URL}/users/${authState.user.email}/ingredients`,slState.ingredients
      );
    })
  );

  constructor(
    private actions$: Actions,
    private http: HttpClient,
    private store: Store<fromApp.AppState>
  ) {}
}
