import { Component , OnInit, OnDestroy} from '@angular/core';
import { DataStorageService } from '../shared/data-storage.service';
import { AuthService } from '../auth/auth.service';
import { Subscription } from 'rxjs';
import { Router, NavigationEnd} from '@angular/router';
import { Store } from '@ngrx/store';
import * as fromApp from '../store/app.reducer'
import { map } from 'rxjs/operators';
import * as AuthActions from '../auth/store/auth.actions'

@Component({
  selector: 'app-header',
  templateUrl:'./header.component.html',
  styleUrls:  []
})

export class HeaderComponent implements OnInit,OnDestroy {
  private userSub : Subscription;
  private currPath : Subscription;
  //private email: String;
  isAuthenticate = false;
  inRecipesBar = true;

  constructor(private dataStorageService: DataStorageService,
    private authSrevice: AuthService,
    private router: Router,
    private store: Store<fromApp.AppState>

  ) {}

  ngOnInit() {
    this.userSub = this.store.select('auth').pipe(
      map(authState => authState.user))
      .subscribe(user => {
      if (user) {
        this.dataStorageService.email = user.email;
      }
      this.isAuthenticate = !!user;
    });
    this.currPath = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd ) {
        if (event.url.includes("recipes")) {
          this.inRecipesBar = true;
        } else {
          this.inRecipesBar = false;
        }
      }
      }
    )
  }

  onSaveData() {
    if(this.inRecipesBar) {
      this.dataStorageService.storeRecipes();
    } else {
      //this.dataStorageService.storeShoppingList();
    }
  }

  onFetchData() {
    if(this.inRecipesBar) {
      this.dataStorageService.fetchRecipes().subscribe();
    } else {
      //this.dataStorageService.fetchShoppingList().subscribe();
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
