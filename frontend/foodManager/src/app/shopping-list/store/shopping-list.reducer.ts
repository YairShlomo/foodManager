import { Ingredient } from '../../shared/ingredient.model';
import * as ShoppingListActions from './shopping-list.actions'

export interface AppState {
  shoppingList: State;
}

export interface State {
  ingredients: Ingredient[];
  editedIngredient : Ingredient;
  editedIngredientIndex: number;
}

const initialState: State = {
  ingredients: [],
  editedIngredient : null,
  editedIngredientIndex: -1
};
export function shoppingListRducer(state = initialState, action: ShoppingListActions.ShoppingListActions) {
  switch (action.type) {
    case ShoppingListActions.ADD_ING:
      return {
        ...state,
        ingredients: [...state.ingredients, action.payload]
      }
    case ShoppingListActions.ADD_INGS:
      return {
        ...state,
        ingredients: [...state.ingredients, ...action.payload]
      }
    case ShoppingListActions.UPDATE_ING:
      const ingredient = state.ingredients[state.editedIngredientIndex];
      const updatedIng = {
        ...ingredient,
        ...action.payload
      };
      const updatedIngs = [...state.ingredients];
      updatedIngs[state.editedIngredientIndex] = updatedIng;

      return {
        ...state,
        ingredients: updatedIngs,
        editedIngredientIndex: -1,
        editedIngredient: null
      }
    case ShoppingListActions.DELETE_ING:
      return {
        ...state,
        ingredients: state.ingredients.filter((ing , ingIndex) => {
          return ingIndex !== state.editedIngredientIndex;
        })
      }
    case ShoppingListActions.START_EDIT:
      return {
        //copying the state
        ...state,
        editedIngredientIndex: action.payload,
        editedIngredient: { ...state.ingredients[action.payload] }
      };
    case ShoppingListActions.STOP_EDIT:
      return {
        //copying the state
        ...state,
        editedIngredientIndex: -1,
        editedIngredient: null
      };
    default:
      return state;
  }
}
