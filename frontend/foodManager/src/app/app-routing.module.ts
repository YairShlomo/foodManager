import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RecipesComponent } from './recipes/recipes.component';
import { ShoppingEditComponent } from './shopping-list/shopping-edit/shopping-edit.component';
import { RecipeStartComponent } from './recipes/recipe-start/recipe-start.component';
import { RecipeDetailComponent } from './recipes/recipe-detail/recipe-detail.component';
import { RecipeEditComponent } from './recipes/recipe-edit/recipe-edit.component';
import { ShoppingListComponent } from './shopping-list/shopping-list.component';


const routes: Routes = [
  { path: 'recipes', component: RecipesComponent, 
    children: [
     { path: 'new', component: RecipeEditComponent },
     { path: ':id', component: RecipeDetailComponent }, 
     { path: ':id/edit', component: RecipeEditComponent }, 
     { path: '', component: RecipeStartComponent }

     
     //{ path: '', component: RecipesComponent}, 
    ] },
  { path: 'shopping-list', component: ShoppingListComponent },
  { path: '', redirectTo: '/recipes' ,pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
