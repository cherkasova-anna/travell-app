import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { State } from '../models/state.model';
import { catchError, map } from 'rxjs/operators';

@Injectable()
export class StateService {
  private url = '/api/state';
  constructor(public http: HttpClient) {}

  public getFirstState(): Observable<State> {
    return this.http.get<State>(`${this.url}/first`).pipe(
      catchError(() => {
        return of(null);
      })
    );
  }

  public getState(id: number): Observable<State> {
    return this.http.get<State>(`${this.url}/${id}`).pipe(
      catchError(() => {
        return of(null);
      })
    );
  }

  public getAllStates(): Observable<State[]> {
    return this.http.get<State[]>(`${this.url}`).pipe(
      map((res) => res.sort((prev, next) => prev.id - next.id)),
      catchError(() => {
        return of(null);
      })
    );
  }

  public deleteState(id: number): Observable<any> {
    return this.http.delete(`${this.url}/${id}`).pipe(
      catchError(() => {
        return of(null);
      })
    );
  }

  public addState(state: any): Observable<any> {
    return this.http.post(`${this.url}`, state).pipe(
      catchError(() => {
        return of(null);
      })
    );
  }

  public updateState(state: any): Observable<any> {
    return this.http.put(`${this.url}/${state.id}`, state).pipe(
      catchError(() => {
        return of(null);
      })
    );
  }
}
