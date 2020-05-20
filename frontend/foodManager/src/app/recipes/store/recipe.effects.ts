import { Actions, Effect, ofType } from '@ngrx/effects';
import * as RecipesActions from './recipe.actions';
import { switchMap, map, withLatestFrom } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Recipe } from '../recipe.model';
import { environment } from 'src/environments/environment';
import { Injectable } from '@angular/core';
import * as fromApp from '../../store/app.reducer';
import { Store } from '@ngrx/store';
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

  @Effect({ dispatch: false })
  storeRecipe = this.actions$.pipe(
    ofType(RecipesActions.STORE_RECIPES),
    withLatestFrom(this.store.select('recipes'), this.store.select('auth')),
    switchMap(([actionData, recipesState, authState]) => {
      return this.http.put(
        `${environment.JPA_API_URL}/users/${authState.user.email}/recipes`,
        recipesState.recipes
      );
    })
  );
  constructor(
    private actions$: Actions,
    private http: HttpClient,
    private store: Store<fromApp.AppState>
  ) {}
}
