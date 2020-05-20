import { Component, OnInit, OnDestroy} from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import * as fromApp from '../store/app.reducer'
import * as AuthActions from './store/auth.actions'
@Component({
    selector: 'app-auth',
    templateUrl: './auth.component.html'
})
export class AuthComponent implements OnInit, OnDestroy {
    isLoginMode = true;
    authForm: FormGroup;
    isLoading = false;
    error: string = null;

    private storeSub: Subscription;

    constructor(
      private store: Store<fromApp.AppState>
    ) {}

    ngOnInit() {
        this.authForm = new FormGroup({
            'email': new FormControl(null),
            'password': new FormControl(null,[Validators.required,Validators.minLength(6)]),
            'username': new FormControl(null,[Validators.required])
        });
        this.storeSub = this.store.select('auth').subscribe(authState =>{
          this.isLoading = authState.loading;
          this.error = authState.authError
        })
    }

    onSwitchMode() {
        this.isLoginMode = !this.isLoginMode;
        this.authForm.reset();
        if (!this.isLoginMode) {
          this.authForm.controls['email'].setValidators([Validators.required,Validators.email]);
        } else {
          this.authForm.controls['email'].clearValidators();
        }
        this.authForm.controls['email'].updateValueAndValidity()
    }

    onSubmit() {
        if (!this.authForm.valid) {
            return;
        }
        const email = this.authForm.value.email;
        const password = this.authForm.value.password;
        const username = this.authForm.value.username;
        this.isLoading = true;
        if (this.isLoginMode) {
            this.store.dispatch(new AuthActions.LoginStart({ username: username, password: password }));
        } else {
            this.store.dispatch(new AuthActions.SignupStart({ email: email, username: username, password: password }));
        }
        this.authForm.reset();
    }

    onHandleError() {
        this.store.dispatch(new AuthActions.ClearError());
    }

    ngOnDestroy() {
      if (this.storeSub) {
        this.storeSub.unsubscribe();
      }
    }
}
