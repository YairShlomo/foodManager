import { Ingredient } from '../../shared/ingredient.model';
import * as ShoppingListActions from './shopping-list.actions'
const initialState = {
  ingredients: []
};
export function shoppingListRducer(state = initialState, action: ShoppingListActions.AddIng) {
  switch (action.type) {
    case ShoppingListActions.ADD_ING:
      return {
        ...state,
        ingredients: [...state.ingredients, action.payload]
      }
    default:
      return state;
  }
}
