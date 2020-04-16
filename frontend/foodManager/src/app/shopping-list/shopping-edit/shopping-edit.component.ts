import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Ingredient } from 'src/app/shared/ingredient.model';
import { ShoppingListService } from '../shopping-list.service';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css']
})
export class ShoppingEditComponent implements OnInit, OnDestroy {
  @ViewChild('f', { static: false}) sLForm: NgForm; 
  startEditSubs: Subscription;
  editMode = false;
  editedItemIndex: number;
  editedItem: Ingredient;

  constructor(private sLService: ShoppingListService) {}

  ngOnInit(): void {
    this.startEditSubs = this.sLService.startedEditing.
    subscribe(
      (index: number) => {
        this.editedItemIndex = index
        this.editMode = true;
        this.editedItem = this.sLService.getIngredient(index);
        this.sLForm.setValue({
          name: this.editedItem.name,
          amount: this.editedItem.amount
        })
      }
    );
  }

  onSubmitItem(form: NgForm) {
    const value = form.value;
    const newIngredient = new Ingredient(value.name,value.amount);
    if (this.editMode) {
      this.sLService.updateIngredient(this.editedItemIndex,newIngredient)
    } else {
      this.sLService.addIngredient(newIngredient);
    }
    this.editMode = false;
    form.reset();
  }

  onClear() {
    this.sLForm.reset();
    this.editMode = false;
  }

  onDelete() {
    this.sLService.deleteIngredient(this.editedItemIndex);
    this.editMode = false;
    this.onClear();
  }

  ngOnDestroy(): void {
    this.startEditSubs.unsubscribe();
  }
}
