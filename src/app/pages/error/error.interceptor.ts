import { Injectable, inject } from '@angular/core';
import { HttpErrorResponse, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import {catchError, filter, switchMap, take, window} from 'rxjs/operators';
import { BehaviorSubject, throwError } from 'rxjs';
import { Router } from '@angular/router';


@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  private isRefreshing$ = new BehaviorSubject<boolean>(false);
  private readonly router = inject(Router);
  // private readonly authService = inject(AuthService);
  private refreshTokenSubject = new BehaviorSubject<string | null>(null);

  intercept(request: HttpRequest<unknown>, next: HttpHandler): any {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse): any => this.handleHttpError(error, request, next))
    );
  }

  private handleHttpError(error: HttpErrorResponse, request: HttpRequest<unknown>, next: HttpHandler) {
    if (error.status === 401) {
      localStorage.clear();
      this.router.navigateByUrl('/', { skipLocationChange: true }).then();

      // if(request.url.includes('refresh-token')) {
      //   return this.authService.logout();
      // }
      // return this.handle401Error(request, next);
    }
    if (error.status === 404) {
      this.router.navigateByUrl('/404', { skipLocationChange: true });
    }

    if (error.status === 403) {
      this.router.navigateByUrl('/403', { skipLocationChange: true });
    }

    // if((error.status == 400 || error.status == 422) && !this.showSkipErrorModal(request)) {
    //   this.showErrorModal(error?.error?.message)
    // }

    return throwError(() => error);
  }

  // private handle401Error(req: HttpRequest<any>, next: HttpHandler) {
  //   if (!this.isRefreshing$.value && this.authService.token) {
  //     this.isRefreshing$.next(true);
  //     this.refreshTokenSubject = new BehaviorSubject<string | null>(null);
  //     return this.authService.refreshToken(this.authService.refresh_token).pipe(
  //       switchMap((user: { access_token: string }) => {
  //         this.isRefreshing$.next(false);
  //         this.refreshTokenSubject.next(user.access_token);
  //         return next.handle(this.addTokenHeader(req, user.access_token));
  //       }),
  //       catchError((error) => {
  //         this.authService.logout();
  //         return throwError(() => error);
  //       })
  //     );
  //   }
  //   return this.authService.token ? this.refreshTokenSubject.pipe(
  //     filter((token) => token !== null),
  //     take(1),
  //     switchMap((token) => next.handle(this.addTokenHeader(req, token!)))
  //   ) : throwError(() => new Error('No token available'))
  // }

  // private addTokenHeader(req: HttpRequest<any>, token: string) {
  //   return req.clone({
  //     headers: req.headers.set('Authorization', `Bearer ${token}`)
  //   });
  // }
  //
  // showErrorModal(message: string) {
  //   Swal.fire({
  //     title: message,
  //     icon: 'error',
  //     confirmButtonText: 'OK',
  //     reverseButtons: true,
  //     confirmButtonColor: '#007bff'
  //   })
  // }
  // private showSkipErrorModal(req: HttpRequest<any>): boolean {
  //   if (req.url.includes('/het-integration/household-consumer')) {
  //     return true;
  //   }
  //   return false;
  // }
}
