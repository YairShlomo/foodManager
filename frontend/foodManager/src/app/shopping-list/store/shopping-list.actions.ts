import { Action } from '@ngrx/store';
import { Ingredient } from 'src/app/shared/ingredient.model';

export const ADD_ING = '[ShoppingList] Add Ing';
export const ADD_INGS = '[ShoppingList] Add Ings';
export const UPDATE_ING = '[ShoppingList] Update Ing';
export const DELETE_ING = '[ShoppingList] Delete Ing';
export const START_EDIT = '[ShoppingList] Start Edit';
export const STOP_EDIT = '[ShoppingList] Stop Edit';

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

  constructor(public payload: Ingredient) {}
}
export class DeleteIng implements Action {
  readonly type = DELETE_ING;
}

export class StartEdit implements Action {
  readonly type = START_EDIT;

  constructor(public payload: number) {}
}
export class StopEdit implements Action {
  readonly type = STOP_EDIT;
}
export type ShoppingListActions =
AddIng | AddIngs | UpdateIng | DeleteIng | StartEdit | StopEdit;
