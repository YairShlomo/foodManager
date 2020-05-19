import { Actions, ofType, Effect } from '@ngrx/effects';
import * as AuthActions from './auth.actions';
import { switchMap, catchError, map, tap } from 'rxjs/operators';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { of } from 'rxjs';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../user.model';
import { AuthService } from '../auth.service';

export interface AuthResponseData {
  email: string;
  token: string;
  expirationDate: Date;
  username: string;
}

const handleAuthentication = (
  email: string,
  username: string,
  token: string,
  expirationDate: Date
) => {
  const user = new User(email, username, token, expirationDate);
  localStorage.setItem('userData', JSON.stringify(user));
  return new AuthActions.AuthenticateSuccess({
    email: email,
    username: username,
    token: token,
    expirationDate: expirationDate,
    redirect: true
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
      return this.http
        .post<AuthResponseData>(url, {
          email: signupAction.payload.email,
          password: signupAction.payload.password,
          username: signupAction.payload.username,
        })
        .pipe(
          tap(resData => {
            const expirationDuration = new Date(
              resData.expirationDate).getTime() - new Date().getTime();
            this.authService.setLogOutTimer(expirationDuration);
          }),
          //map wrap the return object to observable
          map((resData) => {
            return handleAuthentication(
              resData.email,
              resData.username,
              resData.token,
              resData.expirationDate
            );
          }),
          catchError((errorRes) => {
            return handleError(errorRes);
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
          tap(resData => {
            const expirationDuration = new Date(
              resData.expirationDate).getTime() - new Date().getTime();
            this.authService.setLogOutTimer(expirationDuration);
          }),
          //map wrap the return object to observable
          map((resData) => {
            return handleAuthentication(
              resData.email,
              resData.username,
              resData.token,
              resData.expirationDate
            );
          }),
          catchError((errorRes) => {
            return handleError(errorRes);
          })
        );
    })
  );

  @Effect({ dispatch: false })
  authRedirect = this.actions$.pipe(
    ofType(AuthActions.AUTHENTICATE_SUCCESS),
    tap((authSuccessAction: AuthActions.AuthenticateSuccess) => {
      if (authSuccessAction.payload.redirect) {
        this.router.navigate(['/']);
      }
    })
  );

  @Effect()
  autoLogin = this.actions$.pipe(
    ofType(AuthActions.AUTO_LOGIN),
    map(() => {
      const userData: {
        email: string;
        username: string;
        _token: string;
        _tokenExpirationDate: string;
    } = JSON.parse(localStorage.getItem('userData'));
    if (!userData) {
      return { type: 'DUMMY' };
    }
    const loadedUser = new User(
        userData.email,
        userData.username,
        userData._token,
        new Date(userData._tokenExpirationDate)
    );
    if (loadedUser.token) {
        const expirationDuration = new Date(
          userData._tokenExpirationDate).getTime() - new Date().getTime();
        this.authService.setLogOutTimer(expirationDuration);
        return new AuthActions.AuthenticateSuccess({
          email: loadedUser.email,
          username: loadedUser.username,
          token: loadedUser.token,
          expirationDate: new Date(userData._tokenExpirationDate),
          redirect: false
          }
        );
    }
    return { type: 'DUMMY' };
    })
  );

  @Effect({ dispatch: false })
  authLogout = this.actions$.pipe(
    ofType(AuthActions.LOGOUT),
    tap(() => {
      this.authService.clearLogoutTimer();
      localStorage.removeItem('userData');
      this.router.navigate(['/auth']);
    })
  );

  constructor(
    private actions$: Actions,
    private http: HttpClient,
    private router: Router,
    private authService: AuthService
  ) {}
}
