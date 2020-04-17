import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
    selector: 'app-auth',
    templateUrl: './auth.component.html'
})
export class AuthComponent implements OnInit{
    isLoginMode = true;
    authForm: FormGroup;

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
        this.authForm.reset();
    }
}