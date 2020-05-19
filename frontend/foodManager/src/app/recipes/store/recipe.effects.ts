import { Actions, Effect, ofType } from '@ngrx/effects'
import * as RecipesActions from './recipe.actions'
import { switchMap, map } from 'rxjs/operators'
import { HttpClient } from '@angular/common/http';
import { Recipe } from '../recipe.model';
import { environment } from 'src/environments/environment';
import { Injectable } from '@angular/core';
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
  constructor(
    private actions$: Actions,
    private http: HttpClient
  ) {}
}
