import { Action } from '@ngrx/store';
import { Ingredient } from 'src/app/shared/ingredient.model';

export const ADD_ING= 'ADD_ING';
export const ADD_INGS= 'ADD_INGS';

export class AddIng implements Action {
  readonly type = ADD_ING;

  constructor(public payload: Ingredient) {}
}

export class AddIngs implements Action {
  readonly type = ADD_INGS;

  constructor(public payload: Ingredient[]) {}
}

export type ShoppingListActions = AddIng | AddIngs;
