import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from './auth.service';

@Component({
    selector: 'app-auth',
    templateUrl: './auth.component.html'
})
export class AuthComponent implements OnInit{
    isLoginMode = true;
    authForm: FormGroup;

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
        if (!this.isLoginMode) {
            this.authService.signUp(email,password)
            .subscribe(resData => {
            console.log(resData);
            },
            error => {
            console.log(error);
            }
        );
        }
        this.authForm.reset();
    }
}