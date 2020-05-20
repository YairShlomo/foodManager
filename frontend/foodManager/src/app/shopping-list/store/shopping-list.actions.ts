import { Action } from '@ngrx/store';
import { Ingredient } from 'src/app/shared/ingredient.model';

export const ADD_ING = '[ShoppingList] Add Ing';
export const ADD_INGS = '[ShoppingList] Add Ings';
export const UPDATE_ING = '[ShoppingList] Update Ing';
export const DELETE_ING = '[ShoppingList] Delete Ing';
export const START_EDIT = '[ShoppingList] Start Edit';
export const STOP_EDIT = '[ShoppingList] Stop Edit';
export const FETCH_SL = '[ShoppingList] Fetch Sl';
export const STORE_SL = '[ShoppingList] Store Sl';
export const SET_SL = '[ShoppingList] Set Sl';


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

export class FetchShoppingList implements Action {
  readonly type = FETCH_SL;

  constructor(public payload: string) {}
}

export class StoreShoppingList implements Action {
  readonly type = STORE_SL;
}

export class SetShoppingList implements Action {
  readonly type = SET_SL;

  constructor(public payload: Ingredient[]) {}
}

export type ShoppingListActions =
| AddIng
| AddIngs
| UpdateIng
| DeleteIng
| StartEdit
| StopEdit
| FetchShoppingList
| StoreShoppingList
| SetShoppingList;
