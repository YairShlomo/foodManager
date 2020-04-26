import { Component , OnInit, OnDestroy} from '@angular/core';
import { DataStorageService } from '../shared/data-storage.service';
import { AuthService } from '../auth/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl:'./header.component.html',
  styleUrls:  []
})

export class HeaderComponent implements OnInit,OnDestroy {
  private userSub : Subscription;
  private email: String;
  isAuthenticate = false;

  constructor(private dataStorageService: DataStorageService,
    private authSrevice: AuthService) {}

  ngOnInit() {
    this.userSub = this.authSrevice.user.subscribe(user => {
      this.isAuthenticate = !!user;
    });
  }

  onSaveData() {
    this.dataStorageService.storeRecipes();
  }

  onFetchData() {
    this.dataStorageService.fetchRecipes().subscribe();
  }

  onSelectedPage($event) {
    console.log($event);
  }

  ngOnDestroy() {
    this.userSub.unsubscribe();
  }

  onLogOut() {
    this.authSrevice.logOut()
  }


}
