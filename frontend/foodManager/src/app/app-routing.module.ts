import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RecipesComponent } from './recipes/recipes.component';
import { ShoppingEditComponent } from './shopping-list/shopping-edit/shopping-edit.component';
import { RecipeStartComponent } from './recipes/recipe-start/recipe-start.component';
import { RecipeDetailComponent } from './recipes/recipe-detail/recipe-detail.component';
import { RecipeEditComponent } from './recipes/recipe-edit/recipe-edit.component';
import { ShoppingListComponent } from './shopping-list/shopping-list.component';
import { RecipesResolverService } from './recipes/recipes-resolver.service';
import { AuthComponent } from './auth/auth.component';


const routes: Routes = [
  { path: 'recipes', component: RecipesComponent, 
    children: [
     { path: 'new', component: RecipeEditComponent },
     { path: ':id', component: RecipeDetailComponent, resolve: [RecipesResolverService]}, 
     { path: ':id/edit', component: RecipeEditComponent, resolve: [RecipesResolverService]}, 
     { path: '', component: RecipeStartComponent }
    ] },
  { path: 'shopping-list', component: ShoppingListComponent },
  { path: '', redirectTo: '/recipes' ,pathMatch: 'full'},
  { path: 'auth', component: AuthComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
