import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

interface AuthResponseData {
    kind: string,
    idToken: string,
    email: string,
    refreshToken: string,
    expiresIn: string,
    localId: string
}

@Injectable({providedIn: 'root'})
export class AuthService {
    constructor(private htttp: HttpClient) {}
    signUp(email: string, password: string) {
        return this.htttp.post<AuthResponseData>('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyB_k2Boiqq11pY2WS-FL_F66xD7I19ikZg',{
            'email' : email,
            'password' : password,
            'returnSecureToken' : true
            }
        ).pipe(catchError(errorRes => {
            let errorMessage = "An unknown error occured!";
            if (!errorRes.error || !errorRes.error.error) {
                return throwError(errorMessage);
            }
            switch (errorRes.error.error.message) {
                case 'EMAIL_EXISTS':
                    errorMessage = 'This email exists already';
            }
            return throwError(errorMessage);
            })
        );
    }
}