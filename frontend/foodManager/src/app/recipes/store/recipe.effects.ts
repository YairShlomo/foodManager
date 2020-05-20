import { Actions, Effect, ofType } from '@ngrx/effects'
import * as RecipesActions from './recipe.actions'
import { switchMap, map, withLatestFrom } from 'rxjs/operators'
import { HttpClient } from '@angular/common/http';
import { Recipe } from '../recipe.model';
import { environment } from 'src/environments/environment';
import { Injectable } from '@angular/core';
import * as fromApp from '../../store/app.reducer'
import { Store } from '@ngrx/store';
@Injectable()
export class RecipeEffects {
  @Effect()
  fetchRecipes = this.actions$.pipe(
    ofType(RecipesActions.FETCH_RECIPES),
    switchMap((recipeData: RecipesActions.FetchRecipes) => {
      return this.http
      .get<Recipe[]>(`${environment.JPA_API_URL}/users/${recipeData.payload}/recipes`)
    }),
    //map is rxjs operator
    map((recipes) => {
      //map is js array method
      return recipes.map((recipe) => {
        console.log("FETCH_RECIPES" +recipe.recipeId)

        return {
          ...recipe,
          ingredients: recipe.ingredients ? recipe.ingredients : [],
        };
      });
    }),
    map(recipes => {
      return new RecipesActions.SetRecipes(recipes);
    })
  );

  @Effect({dispatch:false})
  storeRecipe = this.actions$.pipe(ofType(RecipesActions.STORE_RECIPES),
  withLatestFrom(this.store.select('recipes'),
  this.store.select('auth')
  ),
   switchMap(([actionData,recipesState,authState]) => {
    console.log("kk");

    console.log("yay"+authState.user.email);
    //console.log("ing_id " +recipesState.recipes[0].ingredients[0].ing_id)
    //console.log("no"+recipesState.recipes[0].ingredients[0].ing_id);
    return this.http
      .put(`${environment.JPA_API_URL}/users/${authState.user.email}/recipes`, recipesState.recipes
      )
   })
  );
  constructor(
    private actions$: Actions,
    private http: HttpClient,
    private store: Store<fromApp.AppState>
  ) {}
}
