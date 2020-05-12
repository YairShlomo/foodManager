import { Component, OnInit, OnDestroy, ɵConsole } from '@angular/core';
import { Ingredient } from '../shared/ingredient.model';
import { ShoppingListService } from './shopping-list.service';
import { Subscription, Subject, Observable } from 'rxjs';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.css']
})
export class ShoppingListComponent implements OnInit, OnDestroy {
  ingredients: Observable<{ ingredients: Ingredient[] }>;
  constructor(
    private sLService: ShoppingListService,
    private store: Store<{shoppingList: {ingredients: Ingredient[]}}>) {}

  ngOnInit(): void {
    this.ingredients = this.store.select('shoppingList')
  }

  onEditItem(index: number) {
    this.sLService.startedEditing.next(index);
  }

  ngOnDestroy(): void {
  }

}
