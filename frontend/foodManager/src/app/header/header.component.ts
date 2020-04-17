import { Component ,EventEmitter, Output} from '@angular/core';
import { DataStorageService } from '../shared/data-storage.service';

@Component({
  selector: 'app-header',
  templateUrl:'./header.component.html',
  styleUrls:  []
})

export class HeaderComponent {    
  constructor(private dataStorageService: DataStorageService) {}
  collapsed = true;
  @Output() selectedFeature = new EventEmitter<string>();

  onSelect(feature: string) {
    this.selectedFeature.emit(feature);
  }
  
  onSaveData() {
    this.dataStorageService.storeRecipes();
  }

  onFetchData() {
    this.dataStorageService.fetchRecipes()
    .subscribe();
  }

}