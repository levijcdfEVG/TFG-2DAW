import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, catchError, throwError } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { jwtDecode } from "jwt-decode";
import { CookieService } from "ngx-cookie-service";
import { Router } from "@angular/router";

declare const google: any;

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private authState: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  authState$: Observable<boolean> = this.authState.asObservable();
  private backendUrl = 'http://localhost:8000/index.php';

  constructor(
      private http: HttpClient,
      private cookieService: CookieService,
      private router: Router
  ) {}

  setAuthState(state: boolean) {
    this.authState.next(state);
  }

  getToken(): string {
    return this.cookieService.get('token');
  }

  isTokenExpired(token: string): boolean {
    const decodedToken: any = jwtDecode(token);
    const currentTime = Date.now() / 1000;
    return decodedToken.exp < currentTime;
  }

  isLoggedIn(): boolean {
    const token = this.getToken();
    return !!token && !this.isTokenExpired(token);
  }

  isAuthenticated(): boolean {
    return this.authState.value;
  }

  logout(): void {
    this.authState.next(false);
    this.cookieService.delete('token', '/');
    this.router.navigate(['/login']);
    google.accounts.id.disableAutoSelect();
  }

  checkBackend(googleToken: string) {
    const payload = { token: googleToken };
    const urlParams = '?controlador=cUsuario&accion=loginGoogle';
    const decodedToken: any = jwtDecode(googleToken);

    console.log('Token desencodificado:', decodedToken);
    return this.http.post<any>(this.backendUrl + urlParams, payload).pipe(
        catchError(error => {
          this.logout();
          console.error('Error en la solicitud:', error);
          return throwError(() => error);
        })
    );
  }
}
