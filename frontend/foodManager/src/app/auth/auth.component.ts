import { Component, OnInit} from '@angular/core';
import { FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';
import { AuthService, AuthResponseData } from './auth.service';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { throwIfEmpty } from 'rxjs/operators';


@Component({
    selector: 'app-auth',
    templateUrl: './auth.component.html'
})
export class AuthComponent implements OnInit {
    isLoginMode = true;
    authForm: FormGroup;
    isLoading = false;
    error: string = null;

    constructor(private authService: AuthService,
        private router: Router) {}

    ngOnInit() {
        this.authForm = new FormGroup({
            'email': new FormControl(null),
            'password': new FormControl(null),
            'username': new FormControl(null,[Validators.required])
        });
    }

    onSwitchMode() {
        this.isLoginMode = !this.isLoginMode;
        this.authForm.reset();
        //var elem = document.getElementById("switch");
        if (!this.isLoginMode) {
          this.authForm.controls['email'].setValidators([Validators.required,Validators.email]);
        } else {
          this.authForm.controls['email'].setValidators([]);
        }
    }

    onSubmit() {
        if (!this.authForm.valid) {
            return;
        }
        const email = this.authForm.value.email;
        const password = this.authForm.value.password;
        const username = this.authForm.value.username;

        let authObs: Observable<AuthResponseData>;

        this.isLoading = true;
        if (this.isLoginMode) {
            authObs = this.authService.logIn(username,password);
        } else {
            authObs = this.authService.signUp(email,username, password);
        }
        authObs.subscribe(
            resData => {
                this.isLoading = false;
                this.router.navigate(['/recipes']);
            },
            errorMessage => {
                this.error = errorMessage;
                this.isLoading = false;
            }
        );
        this.authForm.reset();
    }

    onHandleError() {
        this.error = null;
    }
}
