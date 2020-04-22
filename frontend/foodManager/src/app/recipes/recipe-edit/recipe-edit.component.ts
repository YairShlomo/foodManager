import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { FormGroup, FormControl, FormArray, Validators } from '@angular/forms';
import { RecipeService } from '../recipe.service';
import { Ingredient } from 'src/app/shared/ingredient.model';
import { Recipe } from '../recipe.model';

@Component({
  selector: 'app-recipe-edit',
  templateUrl: './recipe-edit.component.html',
  styleUrls: ['./recipe-edit.component.css']
})
export class RecipeEditComponent implements OnInit {
  id: number;
  editMode = false;
  recipeForm: FormGroup;
  recipeId: number = -1;
  mailOwner: string = 'yyaaiirr1@gmail.com';
  constructor(private route: ActivatedRoute,
    private recipeService: RecipeService,
    private router: Router) { }

  ngOnInit(): void {
    this.route.params
    .subscribe(
      (params: Params) => {
        this.id = +params['id'];
        this.editMode = params['id'] != null;
        this.initForm();
      }
    )
  }

  private initForm() {
    let recipeName = '';
    let recipeImagePath = '';
    let recipeDesc = '';
    let recipeIngredients = new FormArray([]);

    if (this.editMode) {
      const recipe = this.recipeService.getRecipe(this.id)
      this.recipeId = recipe.id
      this.mailOwner = recipe.mailOwner
      recipeName = recipe.name;
      recipeImagePath = recipe.imagePath;
      recipeDesc = recipe.description;
      if (recipe['ingredients']) {
        for (let ing of recipe.ingredients) {
          recipeIngredients.push(
            new FormGroup({
              'name': new FormControl(ing.name, Validators.required),
              'amount': new FormControl(ing.amount, [
                Validators.required, Validators.pattern(/^[1-9]+[0-9]*$/)
              ])
            })
          );
        }
      }
      recipeDesc = recipe.description;
    }
    this.recipeForm = new FormGroup({
      'name': new FormControl(recipeName, Validators.required),
      'imagePath': new FormControl(recipeImagePath, Validators.required),
      'description': new FormControl(recipeDesc, Validators.required),
      'ingredients': recipeIngredients
    });
  }

  onSubmit() {
    var recipe: Recipe = this.createRecipe(this.recipeForm.value);
    console.log(recipe);
    if (this.editMode) {
      this.recipeService.updateRecipe(this.id,recipe)
    } else {
      this.recipeService.addRecipe(recipe)
    }
    this.onCancel();
  }

  createRecipe(formVal) {
    //var id: number = this.recipeForm.value['id'];
    var name: string = this.recipeForm.value['name'];
    var desc: string = this.recipeForm.value['description'];
    var imagePath: string = this.recipeForm.value['imagePath'];
    var ingredients: Ingredient[] = this.recipeForm.value['ingredients'];

    return new Recipe(this.recipeId,
      this.mailOwner,
      name,
      desc,
      imagePath,
      ingredients)
  }

  get controls() { // a getter!
    return (<FormArray>this.recipeForm.get('ingredients')).controls;
  }

  onAddIngredient() {
    (<FormArray>this.recipeForm.get('ingredients')).push(
      new FormGroup({
        'name': new FormControl(null, Validators.required),
        'amount': new FormControl(null,[
          Validators.required, Validators.pattern(/^[1-9]+[0-9]*$/)
        ])
      })
    )
  }

  onCancel() {
    this.router.navigate(['../'], {relativeTo: this.route});
  }

  onDeleteIngredient(index: number) {
    (<FormArray>this.recipeForm.get('ingredients')).removeAt(index);
  }
}
