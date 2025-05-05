import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable} from "rxjs";

declare const google: any;

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private authState:BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  authState$:Observable<any> = this.authState.asObservable();

  constructor() { }

  setAuthState(state: boolean) {
    this.authState.next(state);
  }

  isAuthenticated(): boolean {
    return this.authState.value;
  }

  logout() {
    this.authState.next(false);
    // Optionally, revoke the token
    google.accounts.id.disableAutoSelect();
    // Remove tokens from storage if stored
  }
}
