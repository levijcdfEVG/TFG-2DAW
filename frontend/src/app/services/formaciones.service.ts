import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { User } from '../interfaces/user.interface';
import { map, catchError } from 'rxjs/operators';
import {environment} from "../../environments/environment.prod";

@Injectable({
    providedIn: 'root'
})
export class FormacionesService {

    private formationPath = environment.apiUrl+'?controlador=CFormaciones&accion=';

    constructor(private http: HttpClient) {}

    // Get a user list with or without params

    getFormationsByUserId(id: number): Observable<any> {
        return this.http.get('/api/formaciones');
    }

    // Handle HTTP errors
    private handleError(error: HttpErrorResponse) {
        let errorMessage = 'Ha ocurrido un error';

        if (error.error instanceof ErrorEvent) {
            // Client-side error
            errorMessage = `Error: ${error.error.message}`;
        } else {
            // Server-side error
            errorMessage = `Código de error: ${error.status}\nMensaje: ${error.message}`;
        }

        console.error(errorMessage);
        return throwError(() => errorMessage);
    }
}
