import { Ingredient } from '../../shared/ingredient.model';
import * as ShoppingListActions from './shopping-list.actions'
const initialState = {
  ingredients: []
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
      const ingredient = state.ingredients[action.payload.index];
      const updatedIng = {
        ...ingredient,
        ...action.payload.ingredient
      };
      const updatedIngs = [...state.ingredients];
      updatedIngs[action.payload.index] = updatedIng;

      return {
        ...state,
        ingredients: updatedIngs
      }
    case ShoppingListActions.DELETE_ING:
      return {
        ...state,
        ingredients: state.ingredients.filter((ing , ingIndex) => {
          return ingIndex !== action.payload.index;
        })
      }
    default:
      return state;
  }
}
