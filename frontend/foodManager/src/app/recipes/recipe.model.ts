import { Ingredient } from '../shared/ingredient.model';

export class Recipe {
    public recipeId: number;
    public name: string;
    public description: string;
    public imagePath: string;
    public ingredients: Ingredient[];

    constructor(id: number, name: string, desc: string, imagePath: string, ingredients: Ingredient[]) {
      this.recipeId = id;
      this.name = name
      this.description = desc
      this.imagePath = imagePath
      this.ingredients = ingredients;
    }
}
