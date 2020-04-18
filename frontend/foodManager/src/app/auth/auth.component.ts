import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService, AuthResponseData } from './auth.service';
import { Observable } from 'rxjs';

@Component({
    selector: 'app-auth',
    templateUrl: './auth.component.html'
})
export class AuthComponent implements OnInit{
    isLoginMode = true;
    authForm: FormGroup;
    isLoading = false;
    error: string = null;

    constructor(private authService: AuthService) {}

    ngOnInit() {
        this.authForm = new FormGroup({
            'email': new FormControl(null,[Validators.required,Validators.email]),
            'password': new FormControl(null,[Validators.required,Validators.minLength(6)])
        });
    }

    onSwitchMode() {
        this.isLoginMode = !this.isLoginMode;
    }

    onSubmit() {
        if (!this.authForm.valid) {
            return;
        }
        const email = this.authForm.value.email;
        const password = this.authForm.value.password;
        let authObs: Observable<AuthResponseData>;

        this.isLoading = true;
        if (this.isLoginMode) {
            authObs = this.authService.logIn(email,password);
        } else {
            authObs = this.authService.signUp(email, password);
        }
        authObs.subscribe(
            resData => {
                this.isLoading = false;
                    console.log(resData);
            },
            errorMessage => {
                this.error = errorMessage;
                this.isLoading = false;
            }
        );
        this.authForm.reset();
    }
}