import { Component , OnInit, OnDestroy} from '@angular/core';
import { Subscription } from 'rxjs';
import { Router, NavigationEnd} from '@angular/router';
import { Store } from '@ngrx/store';
import * as fromApp from '../store/app.reducer'
import { map } from 'rxjs/operators';
import * as AuthActions from '../auth/store/auth.actions';
import * as RecipeActions from '../recipes/store/recipe.actions';
import * as ShoppinglistActions from '../shopping-list/store/shopping-list.actions';

@Component({
  selector: 'app-header',
  templateUrl:'./header.component.html',
  styleUrls:  []
})

export class HeaderComponent implements OnInit,OnDestroy {
  private userSub : Subscription;
  private currPath : Subscription;
  private email: string;
  isAuthenticate = false;
  inRecipesBar = true;

  constructor(
    private router: Router,
    private store: Store<fromApp.AppState>
  ) {}

  ngOnInit() {
    this.userSub = this.store.select('auth').pipe(
      map(authState => authState.user))
      .subscribe(user => {
      if (user) {
        this.email = user.email;
      }
      this.isAuthenticate = !!user;
    });
    this.currPath = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd ) {
        if (event.url.includes("shopping-list")) {
          this.inRecipesBar = false;
        } else {
          this.inRecipesBar = true;
        }
      }
      }
    )
  }

  onSaveData() {
    console.log(this.inRecipesBar)
    if(this.inRecipesBar) {
      this.store.dispatch(new RecipeActions.StoreRecipes());
    } else {
      this.store.dispatch(new ShoppinglistActions.StoreShoppingList());
    }
  }

  onFetchData() {
    if(this.inRecipesBar) {
      this.store.dispatch(new RecipeActions.FetchRecipes(this.email));
    } else {
      this.store.dispatch(new ShoppinglistActions.FetchShoppingList(this.email));
    }
  }

  ngOnDestroy() {
    this.userSub.unsubscribe();
    this.currPath.unsubscribe();
  }

  onLogOut() {
    this.store.dispatch(new AuthActions.Logout());
  }


}
