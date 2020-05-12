import { Action } from '@ngrx/store';
import { Ingredient } from 'src/app/shared/ingredient.model';

export const ADD_ING= 'ADD_ING'

export class AddIng implements Action {
  readonly type = ADD_ING;
  payload: Ingredient;
}
