import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, catchError, throwError } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { jwtDecode } from "jwt-decode";
import { CookieService } from "ngx-cookie-service";
import { Router } from "@angular/router";
import { environment } from "../../environments/environment.prod";
import { SharedService } from './shared.service';

declare const google: any;

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private authState: BehaviorSubject<boolean>;
  authState$: Observable<boolean>;
  backendUrl: string = environment.apiUrl;

  constructor(
      private http: HttpClient,
      private cookieService: CookieService,
      private sharedService: SharedService,
      private router: Router
  ) {
    const token = this.getToken();
    const loggedIn = !!token && !this.isTokenExpired(token);
    this.authState = new BehaviorSubject<boolean>(loggedIn);
    this.authState$ = this.authState.asObservable();
  }

  /**
   * Actualiza el estado de autenticación del usuario.
   * @param state - Estado booleano que indica si el usuario está autenticado (true) o no (false).
   */
  setAuthState(state: boolean) {
    this.authState.next(state);
  }

  /**
   * Obtiene el token JWT almacenado en las cookies.
   * @returns El token JWT como string.
   */
  getToken(): string {
    return this.cookieService.get('token');
  }

decodeToken(): any | null {
  const token = this.getToken();
  if (!token) return null;

  const parts = token.split('.');
  if (parts.length !== 3 || !parts[1]) {
    console.error('Token mal formado');
    return null;
  }

  try {
    const decoded = atob(parts[1]); // Aquí ya garantizamos que parts[1] es string
    return JSON.parse(decoded);
  } catch (error) {
    console.error('Error al decodificar token:', error);
    return null;
  }
}

  /**
   * Verifica si el token JWT ha expirado.
   * @param token - Token JWT a verificar.
   * @returns `true` si el token ha expirado o es inválido, `false` si aún es válido.
   */
  isTokenExpired(token: string): boolean {
    try {
      const decodedToken: any = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      return decodedToken.exp < currentTime;
    } catch (e) {
      console.warn("Token inválido o corrupto:", e);
      return true;
    }
  }

  /**
   * Verifica si el usuario ha iniciado sesión basándose en el token JWT.
   * @returns `true` si el token existe y no ha expirado, `false` en caso contrario.
   */
  isLoggedIn(): boolean {
    const token = this.getToken();
    return !!token && !this.isTokenExpired(token);
  }

  /**
   * Retorna el estado actual de autenticación del usuario.
   * @returns `true` si el usuario está autenticado, `false` si no lo está.
   */
  isAuthenticated(): boolean {
    return this.authState.value;
  }

  /**
   * Cierra la sesión del usuario.
   * - Cambia el estado de autenticación a falso.
   * - Elimina el token de las cookies.
   * - Redirige al usuario a la página de login.
   * - Desactiva la selección automática de cuentas de Google.
   */
  logout(): void {
    this.authState.next(false);
    this.cookieService.delete('token', '/');
    this.sharedService.clearAll();
    this.router.navigate(['/login']);
    google.accounts.id.disableAutoSelect();
  }

  /**
   * Verifica si ya existe una cuenta asociada al token de Google.
   * Envía una solicitud al backend para intentar iniciar sesión con el token.
   * Si ocurre un error, cierra la sesión del usuario.
   * @param googleToken - Token proporcionado por la autenticación con Google.
   * @returns Observable con la respuesta del backend o error capturado.
   */
  checkExistingAccounts(googleToken: string) {
    const payload = { token: googleToken };
    const urlParams = '?controlador=cUsuario&accion=loginGoogle';

    console.log('Solicitud POST:', payload);

    return this.http.post<any>(this.backendUrl + urlParams, payload).pipe(
        catchError(error => {
          this.logout();
          console.error('Error en la solicitud:', error);
          return throwError(() => error);
        })
    );
  }
}
