import { Actions, ofType, Effect } from '@ngrx/effects';
import * as AuthActions from './auth.actions';
import { switchMap, catchError, map, tap } from 'rxjs/operators';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { of } from 'rxjs';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

export interface AuthResponseData {
  email: string;
  token: string;
  expirationDate: Date;
  username: string;
}

@Injectable()
export class AuthEffects {
  @Effect()
  authLogin = this.actions$.pipe(
    ofType(AuthActions.LOGIN_START),
    switchMap((authData: AuthActions.LoginStart) => {
      return this.http
        .post<AuthResponseData>(environment.API_URL + '/signIn', {
          username: authData.payload.username,
          password: authData.payload.password,
        })
        .pipe(
          //map wrap the return object to observable
          map((resData) => {
            return new AuthActions.Login({
              email: resData.email,
              username: resData.username,
              token: resData.token,
              expirationDate: resData.expirationDate,
            });
          }),
          catchError((errorRes) => {
            let errorMessage = 'An unknown error occured!';
            if (!errorRes.error) {
              return of(new AuthActions.LoginFail(errorMessage));
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
            return of(new AuthActions.LoginFail(errorMessage));
          })
        );
    })
  );

  @Effect({ dispatch: false })
  authSuccess = this.actions$.pipe(
    ofType(AuthActions.LOGIN),
    tap(() => {
      this.router.navigate(['/']);
    })
  );

  constructor(
    private actions$: Actions,
    private http: HttpClient,
    private router: Router
  ) {}
}
