import { Component, OnInit, OnDestroy, ɵConsole } from '@angular/core';
import { Ingredient } from '../shared/ingredient.model';
import { ShoppingListService } from './shopping-list.service';
import { Subscription, Subject } from 'rxjs';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.css']
})
export class ShoppingListComponent implements OnInit, OnDestroy {
  ingredients: Ingredient[];
  private ingChangedSub: Subscription;
  constructor(private sLService: ShoppingListService) {}

  ngOnInit(): void {
    this.ingredients = this.sLService.getIngredients();
    this.ingChangedSub = this.sLService.ingredientsChanged.subscribe(
      (ingredients: Ingredient[]) => {
        this.ingredients = ingredients;
      }
    );
  }

  onEditItem(index: number) {
    this.sLService.startedEditing.next(index);
  }

  ngOnDestroy(): void {
    this.ingChangedSub.unsubscribe();
  }

}
