import { Action } from '@ngrx/store';
import { Ingredient } from 'src/app/shared/ingredient.model';

export const ADD_ING = 'ADD_ING';
export const ADD_INGS = 'ADD_INGS';
export const UPDATE_ING = 'UPDATE_ING';
export const DELETE_ING = 'DELETE_ING';

export class AddIng implements Action {
  readonly type = ADD_ING;

  constructor(public payload: Ingredient) {}
}

export class AddIngs implements Action {
  readonly type = ADD_INGS;

  constructor(public payload: Ingredient[]) {}
}

export class UpdateIng implements Action {
  readonly type = UPDATE_ING;

  constructor(public payload: {index:number, ingredient: Ingredient}) {}
}
export class DeleteIng implements Action {
  readonly type = DELETE_ING;

  constructor(public payload: number) {}
}

export type ShoppingListActions =
AddIng | AddIngs | UpdateIng | DeleteIng;
