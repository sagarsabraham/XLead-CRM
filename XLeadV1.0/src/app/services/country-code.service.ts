import { HttpHeaders, HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError } from 'rxjs';

export interface Root {
  name: Name
  idd: Idd
}

export interface Name {
  common: string
}

export interface Idd {
  root: string
  suffixes: string[]
}

@Injectable({
  providedIn: 'root'
})
export class CountryCodeService {

  private url = "https://restcountries.com/v3.1/all?fields=name,idd";
    private httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
   
     constructor(private http: HttpClient) { }
   
    getCountryCodes(): Observable<Root[]> {
    const url = `${this.url}`;
    return this.http.get<Root[]>(url, this.httpOptions)
      .pipe(catchError(this.handleError));
    }

    private handleError(error: HttpErrorResponse) {
      if (error.error instanceof ErrorEvent) {
        console.error('An error occurred:', error.error.message);
      } else {
        console.error(`Backend returned code ${error.status}, body was: ${error.error}`);
      }
      return new Observable<Root[]>(observer => {
        observer.error('Something bad happened; please try again later.');
      });
    }
}
