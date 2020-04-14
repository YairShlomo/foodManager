import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RecipesComponent } from './recipes/recipes.component';
import { ShoppingEditComponent } from './shopping-list/shopping-edit/shopping-edit.component';


const routes: Routes = [
  { path: 'recipes', component: RecipesComponent, 
    children: [
     // { path: '', component: RecipesComponent}, 
     // { path: '', component: RecipesComponent}, 
    ] },
  { path: 'shopping-list', component: ShoppingEditComponent },
  { path: '', redirectTo: '/recipes' ,pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
