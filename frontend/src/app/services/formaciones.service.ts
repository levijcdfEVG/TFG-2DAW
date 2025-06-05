import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class FormacionesService {

    private formationPath = 'http://localhost:8000/index.php?controlador=CFormaciones&accion=';

    constructor(private http: HttpClient) {}

    // Get a user list with or without params

    getFormationsByUserId(userId: number): Observable<any> {
        console.log(userId);
        const params = new HttpParams().set('id', userId.toString());
        return this.http.get<any>(this.formationPath + 'getFormationByUserId', { params })
        .pipe(
            map(res => res.data),
            catchError(this.handleError)
        );
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
