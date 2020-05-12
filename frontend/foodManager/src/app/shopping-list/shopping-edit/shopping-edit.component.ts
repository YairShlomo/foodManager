import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Ingredient } from 'src/app/shared/ingredient.model';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import * as ShoppingListActions from '../store/shopping-list.actions'
import * as fromApp from '../../store/app.reducer'


@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css']
})
export class ShoppingEditComponent implements OnInit, OnDestroy {
  @ViewChild('f', { static: false}) sLForm: NgForm;
  startEditSubs: Subscription;
  editMode = false;
  editedItem: Ingredient ;

  constructor(
    private store: Store<fromApp.AppState> ) {}

  ngOnInit(): void {
    this.startEditSubs =this.store.select('shoppingList').subscribe(stateData =>{
      if (stateData.editedIngredientIndex > -1) {
        this.editMode = true;
        this.editedItem = stateData.editedIngredient;
        this.sLForm.setValue({
          name: this.editedItem.name,
          amount: this.editedItem.amount
        });
      } else {
        this.editMode = false;
      }
    })
  }

  onSubmit(form: NgForm) {
    const value = form.value;
    const newIngredient = new Ingredient(null,value.name,value.amount);
    if (this.editMode) {
      this.store.dispatch(
        new ShoppingListActions.UpdateIng(newIngredient)
      );
    } else {
      this.store.dispatch(new ShoppingListActions.AddIng(newIngredient));
    }
    this.editMode = false;
    form.reset();
  }

  onClear() {
    this.sLForm.reset();
    this.editMode = false;
    this.store.dispatch(new ShoppingListActions.StopEdit());
  }

  onDelete() {
    this.store.dispatch(
      new ShoppingListActions.DeleteIng()
    );
   // this.editMode = false;
    this.onClear();
  }

  ngOnDestroy(): void {
    this.startEditSubs.unsubscribe();
    this.store.dispatch(new ShoppingListActions.StopEdit());
  }
}
