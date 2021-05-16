import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Answer } from '../models/answer.model';

@Injectable()
export class AnswerService {
  private url = '/api/answer';
  constructor(public http: HttpClient) {}

  public getAnswerList(id: number): Observable<Answer[]> {
    return this.http.get<Answer[]>(`${this.url}/${id}`).pipe(
      catchError(() => {
        return of([]);
      })
    );
  }
}
