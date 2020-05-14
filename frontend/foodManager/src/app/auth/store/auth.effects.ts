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

const handleAuthentication = (
  email: string,
  username: string ,
  token: string,
  expirationDate: Date
) => {
  return new AuthActions.AuthenticateSuccess({
    email: email,
    username: username,
    token: token,
    expirationDate: expirationDate,
  });
};

const handleError = (errorRes) => {
  let errorMessage = 'An unknown error occured!';
  if (!errorRes.error) {
    return of(new AuthActions.AuthenticateFail(errorMessage));
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
  return of(new AuthActions.AuthenticateFail(errorMessage));
};

@Injectable()
export class AuthEffects {
  @Effect()
  authSignup = this.actions$.pipe(
    ofType(AuthActions.SIGNUP_START),
    switchMap((signupAction: AuthActions.SignupStart) => {
      var url = environment.API_URL + '/signUp';
      return this.http.post<AuthResponseData>(url, {
        email: signupAction.payload.email,
        password: signupAction.payload.password,
        username: signupAction.payload.username,
      })
      .pipe(
        //map wrap the return object to observable
        map(resData => {
          return handleAuthentication(
            resData.email,
            resData.username,
            resData.token,
            resData.expirationDate
          );
        }),
        catchError(errorRes => {
          return handleError(errorRes)
        })
      );
    })
  );

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
          map(resData => {
            return handleAuthentication(
              resData.email,
              resData.username,
              resData.token,
              resData.expirationDate
            );
          }),
          catchError(errorRes => {
            return handleError(errorRes)
          })
        );
    })
  );

  @Effect({ dispatch: false })
  authRedirect = this.actions$.pipe(
    ofType(AuthActions.AUTHENTICATE_SUCCESS, AuthActions.LOGOUT),
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
