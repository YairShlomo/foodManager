import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { throwError, Subject, BehaviorSubject } from 'rxjs';
import { User } from './user.model';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment'
export interface AuthResponseData {
    email: string;
    token: string;
    expirationDate: Date;
    username: string;
}

@Injectable({providedIn: 'root'})
export class AuthService {
    user = new BehaviorSubject<User>(null);
    private tokenExpirationTimer: any;
    constructor(private http: HttpClient,
        private router: Router) {}

    signUp(email: string, username: string, password: string) {
        var url = environment.API_URL + '/signUp';
        return this.http
            .post<AuthResponseData>(url,
                {
                'email' : email,
                'password' : password,
                'username' : username
                }
            ).pipe(catchError(this.handleError),
            tap(resData => {
              this.handleAuthentication(
                resData.email,
                resData.username,
                resData.token,
                resData.expirationDate
                );
            })
        );
    }


    logIn(username: string, password: string) {
        return this.http
            .post<AuthResponseData>(environment.API_URL + '/signIn',
                {
                'username' : username,
                'password' : password,
                }
            ).pipe(catchError(this.handleError),
            tap(resData => {
                this.handleAuthentication(
                  resData.email,
                  resData.username,
                  resData.token,
                  resData.expirationDate
                 );
             })
        );
    }

    autoLogIn() {
        const userData: {
            email: string;
            username: string;
            _token: string;
            _tokenExpirationDate: string;
        } = JSON.parse(localStorage.getItem('userData'));
        if (!userData) {
            return
        }
        const loadedUser = new User(
            userData.email,
            userData.username,
            userData._token,
            new Date(userData._tokenExpirationDate)
        );
        if (loadedUser.token) {
            this.user.next(loadedUser);
            const expirationDuration = new Date(
                userData._tokenExpirationDate).getTime() - new Date().getTime();
            this.autoLogOut(expirationDuration);
        }
    };

    private handleAuthentication(email: string, username: string, token:string, expirationDate: Date) {
        const user = new User(email,username,token,expirationDate);
        this.user.next(user);
        const expirationDuration = new Date(
          expirationDate).getTime() - new Date().getTime();
        this.autoLogOut(expirationDuration);
        localStorage.setItem('userData',JSON.stringify(user));
    }

    logOut() {
        this.user.next(null);
        this.router.navigate(['/auth']);
        localStorage.removeItem('userData');
        if (this.tokenExpirationTimer) {
            clearTimeout(this.tokenExpirationTimer);
        }
        this.tokenExpirationTimer = null;
    }

    autoLogOut(expirationDuration: number) {
        this.tokenExpirationTimer = setTimeout(() => {
            this.logOut();
        }, expirationDuration)
    }

    private handleError(errorRes: HttpErrorResponse) {
        let errorMessage = "An unknown error occured!";
        if (!errorRes.error) {
          return throwError(errorMessage);
        }
        switch (errorRes.error) {
            case 'USER_EXISTS':
                errorMessage = 'This user exists already';
                break;
            case 'EMAIL_NOT_FOUND':
                errorMessage = 'This email does not exist';
                break;
            case 'INVALID_PASSWORD':
                errorMessage = 'This password is wrong';
                break;
        }
        return throwError(errorMessage);
    }
}
